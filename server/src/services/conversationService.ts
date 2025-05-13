import { ConversationState, LeadRelevance } from "../types";

const CALENDLY_LINK = "https://calendly.com/kanhasoft/demo";

// Score-weighted keyword categories
const SCORE_KEYWORDS = {
    NOT_RELEVANT: {
        keywords: ["student", "no budget", "personal project", "learning", "hobby", "non-profit", "charity", "educational"],
        score: -50,
    },
    WEAK_LEAD: {
        keywords: ["side project", "unsure about budget", "small team", "startup", "exploring options", "testing", "prototype"],
        score: 10,
    },
    HOT_LEAD: {
        keywords: ["scaling", "hiring developers", "growing team", "budget approved", "urgent", "immediate need", "expansion", "company scaling"],
        score: 30,
    },
    VERY_BIG_POTENTIAL: {
        keywords: ["enterprise", "large company", "1000+ employees", "fortune 500", "global presence", "multiple locations", "enterprise solution"],
        score: 40,
    },
};

const NO_BUDGET_KEYWORDS = [
    "no budget",
    "not sure",
    "don't know",
    "none",
    "no idea",
    "undecided",
    "unsure",
    "haven't decided",
    "later",
    "not sure about budget",
    "no money",
    "not budgeted",
    "free"
];

const calculateLeadScore = (message: string): number => {
    const messageLower = message.toLowerCase();
    let score = 0;

    Object.values(SCORE_KEYWORDS).forEach(({ keywords, score: keywordScore }) => {
        for (const keyword of keywords) {
            if (messageLower.includes(keyword)) {
                score += keywordScore;
            }
        }
    });

    return Math.max(0, Math.min(score, 100)); // Clamp to 0–100
};

const getRelevanceTagFromScore = (score: number): LeadRelevance => {
    if (score <= 0) return "Not relevant";
    if (score < 30) return "Weak lead";
    if (score < 70) return "Hot lead";
    return "Very big potential customer";
};

const parseBudget = (message: string): number | null => {
    const lowered = message.toLowerCase();

    if (NO_BUDGET_KEYWORDS.some(keyword => lowered.includes(keyword))) {
        return -1; // Special flag for no budget
    }

    const cleaned = lowered.replace(/[,₦$]/g, "");
    const match = cleaned.match(/(\d+)(k)?/);
    if (!match) return null;

    let amount = parseInt(match[1], 10);
    if (match[2] === "k") amount *= 1000;

    return amount;
};

const updateScoreFromBudget = (budget: number): number => {
    if (budget < 2000) return -10;
    if (budget < 10000) return 5;
    if (budget < 50000) return 15;
    return 30;
};

const updateScoreFromTimeline = (message: string): number => {
    const lower = message.toLowerCase();

    if (/(immediate|asap|urgent|right away)/.test(lower)) return 20;
    if (/(next month|within a month|few weeks)/.test(lower)) return 15;
    if (/(1[-–]?3 months|in 2 months|couple of months)/.test(lower)) return 10;
    if (/(3[-–]?6 months|in 4 months)/.test(lower)) return 5;
    if (/(6 months|next year|after a year)/.test(lower)) return -5;
    if (/(not sure|no rush|later|eventually)/.test(lower)) return -10;

    return 0;
};

export const processUserMessage = (
    message: string,
    lead: any,
    conversationState: ConversationState
): { response: string; updatedLead: any; updatedState: ConversationState } => {
    const updatedLead = {
        email: lead.email,
        companyName: lead.companyName,
        relevanceTag: lead.relevanceTag,
        score: lead.score ?? 0,
    };

    const updatedState = { ...conversationState };
    let response = "";

    // Try to extract email if not available
    if (!updatedLead.email) {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const emailMatch = message.match(emailRegex);
        if (emailMatch) updatedLead.email = emailMatch[0];
    }

    // Try to extract company name
    if (!updatedLead.companyName && !updatedState.hasAskedCompany) {
        const companyRegex = /(?:at|for|with|from)\s+([A-Z][A-Za-z0-9\s&]+)(?:\.|,|\s|$)/;
        const companyMatch = message.match(companyRegex);
        if (companyMatch && companyMatch[1]) {
            updatedLead.companyName = companyMatch[1].trim();
        }
    }

    if (!updatedState.hasAskedEmail) {
        updatedState.hasAskedEmail = true;

        if (updatedLead.email) {
            if (!updatedLead.companyName) {
                updatedState.hasAskedCompany = true;
                response = `Thanks for sharing your email ${updatedLead.email}! What company are you with?`;
            } else {
                updatedState.hasAskedCompany = true;
                updatedState.hasAskedBudget = true;
                response = `Thanks for sharing your email and that you're with ${updatedLead.companyName}! What's your budget range for this project?`;
            }
        } else {
            response = "Hi there! Could you please share your email address so we can stay in touch?";
        }

        return { response, updatedLead, updatedState };
    }

    if (!updatedLead.email && updatedState.hasAskedEmail) {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const emailMatch = message.match(emailRegex);
        if (emailMatch) {
            updatedLead.email = emailMatch[0];
            if (!updatedState.hasAskedCompany) {
                updatedState.hasAskedCompany = true;
                response = `Thanks! What company are you with?`;
            }
        } else {
            response = "I didn't catch your email. Could you please share it so we can follow up?";
        }

        return { response, updatedLead, updatedState };
    }

    if (!updatedLead.companyName && updatedState.hasAskedCompany) {
        if (message.length > 1 && message.length < 100) {
            updatedLead.companyName = message;
            updatedState.hasAskedBudget = true;
            response = `Thanks for letting me know you're with ${updatedLead.companyName}! What's your budget range for this project?`;
        } else {
            response = "Could you please share the name of your company or organization?";
        }

        return { response, updatedLead, updatedState };
    }

    if (!updatedState.hasAskedBudget) {
        updatedState.hasAskedBudget = true;
        response = "What's your approximate budget for this project?";
        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasAskedBudget && !updatedState.hasAskedTeamSize) {
        const budget = parseBudget(message);

        if (budget === -1) {
            // They said "no budget" or something like that
            updatedLead.score -= 10;
            updatedLead.relevanceTag = getRelevanceTagFromScore(updatedLead.score);
            updatedState.hasAskedTeamSize = true;
            response = "Thanks for letting me know. How many people are on your development team currently?";
        } else if (budget !== null) {
            updatedLead.score += updateScoreFromBudget(budget);
            updatedLead.relevanceTag = getRelevanceTagFromScore(updatedLead.score);
            updatedState.hasAskedTeamSize = true;
            response = "Thanks for sharing your budget! How many people are on your development team currently?";
        } else {
            updatedState.hasAskedBudget = true;
            response = "Thanks! Just to clarify, what's your approximate budget for this project?";
        }
        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasAskedTeamSize && !updatedState.hasAskedTimeline) {
        const size = parseInt(message.replace(/\D/g, ""), 10);
        if (!isNaN(size)) {
            if (size >= 500) updatedLead.score += 30;
            else if (size >= 50) updatedLead.score += 15;
            else if (size >= 10) updatedLead.score += 5;
        }

        updatedLead.relevanceTag = getRelevanceTagFromScore(updatedLead.score);
        updatedState.hasAskedTimeline = true;
        response = "What's your timeline for this project?";
        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasAskedTimeline && !updatedState.hasFinishedQualifying) {
        updatedState.hasFinishedQualifying = true;

        const timelineScore = updateScoreFromTimeline(message);
        updatedLead.score += timelineScore;
        updatedLead.relevanceTag = getRelevanceTagFromScore(updatedLead.score);

        response = "Is there anything else you'd like us to know about your project or company?"

        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasFinishedQualifying) {
        const score = calculateLeadScore(message);
        updatedLead.score += score;
        updatedLead.relevanceTag = getRelevanceTagFromScore(updatedLead.score);

        if (["Hot lead", "Very big potential customer"].includes(updatedLead.relevanceTag)) {
            if (!updatedState.hasOfferedCalendly) {
                updatedState.hasOfferedCalendly = true;
                response = `Great! Based on what you've shared, our team might be a perfect fit. I'd love to book a quick demo with a solutions architect.\n\nYou can book here: ${CALENDLY_LINK}\n\nAnything you'd like us to prepare for the demo?`;
            } else {
                response = "Is there anything else you'd like to know about our services before the meeting?";
            }
        } else if (updatedLead.relevanceTag === "Weak lead") {
            response =
                "Thanks again for your interest, we will get back to you when we have more information. We look forward to working with you in the future!";
        } else {
            response = "Thanks for the info. We typically work with businesses with established budgets, but I’d be happy to point you to learning resources if you’d like!";
        }

        return { response, updatedLead, updatedState };
    }

    response = "Thanks for reaching out! How can I help with your project today?";
    return { response, updatedLead, updatedState };
};
