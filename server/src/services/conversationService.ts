import { ILead } from "../models/Lead";
import { ConversationState, Lead, LeadRelevance } from "../types";

const CALENDLY_LINK = "https://calendly.com/kanhasoft/demo";

const NOT_RELEVANT_KEYWORDS = ["student", "no budget", "personal project", "learning", "hobby", "non-profit", "charity", "educational"];

const WEAK_LEAD_KEYWORDS = ["side project", "unsure about budget", "small team", "startup", "exploring options", "testing", "prototype"];

const HOT_LEAD_KEYWORDS = ["scaling", "hiring developers", "growing team", "budget approved", "urgent", "immediate need", "expansion", "company scaling"];

const VERY_BIG_POTENTIAL_KEYWORDS = [
    "enterprise",
    "large company",
    "1000+ employees",
    "fortune 500",
    "global presence",
    "multiple locations",
    "enterprise solution",
];

export const processUserMessage = (
    message: string,
    lead: any,
    conversationState: ConversationState
): { response: string; updatedLead: any; updatedState: ConversationState } => {
    // Clone the objects to avoid mutation
    const updatedLead = { email: lead.email, companyName: lead.companyName, relevanceTag: lead.relevanceTag };
    const updatedState = { ...conversationState };

    let response = "";

    const messageLower = message.toLowerCase();

    // Try to extract email if we haven't got it yet
    if (!updatedLead.email) {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const emailMatch = message.match(emailRegex);

        if (emailMatch) {
            updatedLead.email = emailMatch[0];
        }
    }

    // Try to extract company name from message if we haven't got it
    if (!updatedLead.companyName && !updatedState.hasAskedCompany) {
        // Look for "at [Company]" or "for [Company]" patterns
        const companyRegex = /(?:at|for|with|from)\s+([A-Z][A-Za-z0-9\s&]+)(?:\.|,|\s|$)/;
        const companyMatch = message.match(companyRegex);

        if (companyMatch && companyMatch[1] && companyMatch[1].length > 1) {
            updatedLead.companyName = companyMatch[1].trim();
        }
    }

    // Handle conversation flow based on state
    if (!updatedState.hasAskedEmail) {
        if (updatedLead.email) {
            // We already extracted email from their message
            updatedState.hasAskedEmail = true;

            if (!updatedLead.companyName) {
                updatedState.hasAskedCompany = true;
                response = `Thanks for sharing your email ${updatedLead.email}! What company are you with?`;
            } else {
                updatedState.hasAskedCompany = true;
                updatedState.hasAskedBudget = true;
                response = `Thanks for sharing your email and that you're with ${updatedLead.companyName}! What's your budget range for this project?`;
            }
        } else {
            updatedState.hasAskedEmail = true;
            response =
                "Hi there! I'd be happy to discuss how our software development services can help you. To start, could you please share your email address so we can stay in touch?";
        }

        return { response, updatedLead, updatedState };
    }

    if (!updatedLead.email && updatedState.hasAskedEmail) {
        // Check for email in this message again
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const emailMatch = message.match(emailRegex);

        if (emailMatch) {
            updatedLead.email = emailMatch[0];

            if (!updatedState.hasAskedCompany) {
                updatedState.hasAskedCompany = true;
                response = `Thanks for sharing your email ${updatedLead.email}! What company are you with?`;
            }
        } else {
            response = "I didn't catch your email address. We need this to follow up with you. Could you please share it?";
        }

        return { response, updatedLead, updatedState };
    }

    if (!updatedLead.companyName && updatedState.hasAskedCompany) {
        // If we asked for company and don't have it yet, assume this message contains it
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
        // Process budget information for lead relevance
        if (NOT_RELEVANT_KEYWORDS.some((keyword) => messageLower.includes(keyword))) {
            updatedLead.relevanceTag = "Not relevant";
        } else if (WEAK_LEAD_KEYWORDS.some((keyword) => messageLower.includes(keyword))) {
            updatedLead.relevanceTag = "Weak lead";
        } else if (HOT_LEAD_KEYWORDS.some((keyword) => messageLower.includes(keyword))) {
            updatedLead.relevanceTag = "Hot lead";
        } else if (VERY_BIG_POTENTIAL_KEYWORDS.some((keyword) => messageLower.includes(keyword))) {
            updatedLead.relevanceTag = "Very big potential customer";
        } else {
            updatedLead.relevanceTag = "Weak lead";
        }

        updatedState.hasAskedTeamSize = true;
        response = "How many people are on your development team currently?";
        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasAskedTeamSize && !updatedState.hasAskedTimeline) {
        // Process team size for lead relevance
        if (
            VERY_BIG_POTENTIAL_KEYWORDS.some((keyword) => messageLower.includes(keyword)) ||
            parseInt(message) > 500
        ) {
            updatedLead.relevanceTag = "Very big potential customer";
        } else if (
            HOT_LEAD_KEYWORDS.some((keyword) => messageLower.includes(keyword)) ||
            !messageLower.includes("just me")
        ) {
            updatedLead.relevanceTag = "Hot lead";
        } else {
            updatedLead.relevanceTag = "Weak lead";
        }

        updatedState.hasAskedTimeline = true;
        response = "What's your timeline for this project?";
        return { response, updatedLead, updatedState };
    }

    if (updatedState.hasAskedTimeline && !updatedState.hasFinishedQualifying) {
        // Make final determination if we haven't already
        if (!updatedLead.relevanceTag) {
            // Default to weak lead if nothing triggered our rules
            updatedLead.relevanceTag = "Weak lead";
        }

        updatedState.hasFinishedQualifying = true;

        // Different responses based on lead relevance
        if (updatedLead.relevanceTag === "Not relevant") {
            response =
                "Thank you for sharing those details. While we typically work with businesses with established budgets, I'd be happy to point you to some resources that might help with your learning or side project. Would that be helpful?";
        } else if (updatedLead.relevanceTag === "Weak lead") {
            response =
                "Thanks for sharing your project details. We do work with projects of various sizes. Could you tell me a bit more about your specific requirements so I can see if we might be a good fit?";
        } else {
            // For Hot lead or Very big potential customer, offer Calendly
            updatedState.hasOfferedCalendly = true;
            response =
                `Great! Based on what you've shared, I think our team would be a perfect fit for your project. I'd like to schedule a demo with one of our solution architects to discuss how we can help you achieve your goals.\n\nYou can book a time directly here: ${CALENDLY_LINK}\n\nIs there anything specific you'd like us to prepare for the demo?`;
        }

        return { response, updatedLead, updatedState };
    }

    // General conversation after qualification
    if (updatedState.hasFinishedQualifying) {
        if (updatedLead.relevanceTag === "Hot lead" || updatedLead.relevanceTag === "Very big potential customer") {
            if (!updatedState.hasOfferedCalendly) {
                updatedState.hasOfferedCalendly = true;
                response =
                    `I think the best next step would be to schedule a demo with one of our solution architects who can provide more detailed information about our services and how we can help with your specific needs.\n\nYou can book a time here: ${CALENDLY_LINK}`;
            } else {
                response = "Is there anything specific about our development services you'd like to know more about before our meeting?";
            }
        } else if (updatedLead.relevanceTag === "Weak lead") {
            response =
                "We appreciate your interest! While your current needs might be at an early stage, we'd be happy to keep in touch as your project develops. Is there any specific information about our services that would be helpful for you right now?";
        } else {
            response =
                "Thank you for your interest. While we might not be the right fit for your current situation, please feel free to reach out in the future if your needs change.";
        }

        return { response, updatedLead, updatedState };
    }

    // Fallback response
    response = "I appreciate your message. Is there anything specific about our software development services you will like to know?";
    return { response, updatedLead, updatedState };
};
