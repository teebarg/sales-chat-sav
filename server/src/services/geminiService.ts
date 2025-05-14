import { ConversationState } from "../types";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ILead } from "../models/Lead";

// Load environment variables
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function extractJsonFromGeminiResponse(responseText: string | undefined) {
    if (!responseText) {
        return null;
    }
    // Match content between ```json and ``` markers
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = responseText.match(jsonRegex);

    if (match && match[1]) {
        try {
            // Parse the extracted JSON text
            return JSON.parse(match[1]);
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            return null;
        }
    } else {
        console.error("No JSON found in the response");
        return null;
    }
}

export async function processWithGemini(
    message: string,
    lead: ILead,
): Promise<{ response: string; updatedLead: ILead; updatedState: ConversationState }> {

    const prompt = `
    You are a helpful AI assistant helping qualify sales leads through conversation.

Here is the full chat history:
${lead.chatHistory.map((entry: any) => `${entry.role.toUpperCase()}: ${entry.content}`).join("\n")}

Here is the latest user message:
"${message}"

Here is the current lead info:
${JSON.stringify({
    email: lead.email ?? null,
    companyName: lead.companyName ?? null,
    relevanceTag: lead.relevanceTag,
    score: lead.score ?? 0,
    conversationState: lead.conversationState,
})}

Your task:
1. Determine what new information was given in the latest message based on history.
2. Extract or update the following from the message:
   - email
   - companyName
   - budget (estimate in USD if mentioned)
   - team size
   - project timeline
3. Infer the lead's relevance using: ["Not relevant", "Weak lead", "Hot lead", "Very big potential customer"]
4. Update the conversationState booleans accordingly.
5. Respond naturally in a way that moves the qualification forward.


### Scoring Rules:
1. Do NOT ask about project scope or details.

2. Use the following to add points to the score based on budget:
- Budget < 2000 → +(-10)
- Budget < 10,000 → +5
- Budget < 50,000 → +15
- Budget >= 50,000 → +30

2. Use the following to adjust the score based on team size:
- Less than 3 → +0
- 3 to 9 → +5
- 10 to 49 → +10
- 50 to 199 → +20
- 200 or more → +30

3. Use the customer's desired start time to assign urgency points:
- Wants to start immediately / now / ASAP → +20 points
- In 1–2 weeks → +15 points
- In about a month → +10 points
- In 2–3 months (next quarter) → +5 points
- Vague, long-term, or unspecified → +0 points

4. Score modifiers from message keywords (case-insensitive):
- NOT_RELEVANT (score: -50): ["student", "no budget", "personal project", "learning", "hobby", "non-profit", "charity", "educational"]
- WEAK_LEAD (score: +10): ["side project", "unsure about budget", "small team", "startup", "exploring options", "testing", "prototype"]
- HOT_LEAD (score: +30): ["scaling", "hiring developers", "growing team", "budget approved", "urgent", "immediate need", "expansion", "company scaling"]
- VERY_BIG_POTENTIAL (score: +40): ["enterprise", "large company", "1000+ employees", "fortune 500", "global presence", "multiple locations", "enterprise solution"]

Use keywords from both the latest message and prior messages in chat history.

5. Relevance Tag:
   - Based on score and keywords, classify the lead as one of:
     - "Not relevant" < 0
     - "Weak lead" < 30
     - "Hot lead" < 70
     - "Very big potential customer" >= 70

6. Calendly Behavior:
- If the total score is greater than 70 **AND** "hasOfferedCalendly" is false, suggest the user book a call using this link: https://calendly.com/kanhasoft/demo
- Once the Calendly link is suggested, set "hasOfferedCalendly" to true
- If "hasOfferedCalendly" is true, do **not** suggest the Calendly link again
- If "hasOfferedCalendly" is true and the user seems satisfied (e.g. says "thanks", "we're done", or "that's all"), you can naturally **conclude the conversation politely**


### Final Responses Based on Lead Score:
- If the lead is NOT RELEVANT (score < 1), respond with: "Thanks for the info. We typically work with businesses with established budgets, but I’d be happy to point you to learning resources if you’d like!"
- If the lead is a WEAK LEAD (score between 1 and 40), respond with: "Thanks for the details! We’ve got what we need for now — we’ll reach out if there’s a fit."
- Do NOT offer the Calendly link to leads with score below 70.


Respond ONLY in this JSON format:
{
  "updatedLead": {
    "email": string | null,
    "companyName": string | null,
    "score": number,
    "relevanceTag": "Not relevant" | "Weak lead" | "Hot lead" | "Very big potential customer"
  },
  "updatedState": {
    "hasAskedEmail": boolean,
    "hasAskedCompany": boolean,
    "hasAskedBudget": boolean,
    "hasAskedTeamSize": boolean,
    "hasAskedTimeline": boolean,
    "hasFinishedQualifying": boolean,
    "hasOfferedCalendly": boolean
  },
  "response": string // your natural, friendly AI message
}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: prompt,
        });
        const json = extractJsonFromGeminiResponse(response.text);
        if (json) {
            return json;
        }
        throw new Error("Failed to extract JSON from Gemini response");
    } catch (error) {
        console.error("Failed to extract JSON from Gemini response:", error);
        throw new Error("Failed to process lead with Gemini");
    }
}
