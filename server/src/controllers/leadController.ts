import { Request, Response } from "express";
import Lead, { ILead } from "../models/Lead";
import { processUserMessage } from "../services/conversationService";

export class LeadController {
    public async handleMessage(req: Request, res: Response): Promise<void> {
        try {
            const { email, message } = req.body;

            if (!email || !message) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            // Find existing lead or create new one
            let lead = await Lead.findOne({ email });

            if (!lead) {
                lead = new Lead({
                    email,
                    relevanceTag: "Weak lead",
                    score: 0,
                    chatHistory: [],
                    conversationState: {
                        hasAskedEmail: false,
                        hasAskedCompany: false,
                        hasAskedBudget: false,
                        hasAskedTeamSize: false,
                        hasAskedTimeline: false,
                        hasFinishedQualifying: false,
                        hasOfferedCalendly: false,
                    },
                });
            }

            // Add user message to chat history
            lead.chatHistory.push({
                role: "user",
                content: message,
                timestamp: new Date(),
            });

          const result = processUserMessage(message, lead, lead.conversationState);

            lead.conversationState = result.updatedState;

            lead.relevanceTag = result.updatedLead.relevanceTag;

            lead.companyName = result.updatedLead.companyName;

            lead.score = result.updatedLead.score;

            // Add AI response to chat history
            lead.chatHistory.push({
                role: "assistant",
                content: result.response,
                timestamp: new Date(),
            });

            // Save lead
            await lead.save();

            res.json({
                response: result.response,
                relevanceTag: result.updatedLead.relevanceTag,
            });
        } catch (error) {
            console.error("Error handling message:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    public async getLeads(req: Request, res: Response): Promise<void> {
        try {
            const leads = await Lead.find().select("-__v").sort({ createdAt: -1 });

            res.json(leads);
        } catch (error) {
            console.error("Error fetching leads:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    public async getLeadByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const lead = await Lead.findOne({ email }).select("-__v");

            if (!lead) {
                res.status(404).json({ error: "Lead not found" });
                return;
            }

            res.json(lead);
        } catch (error) {
            console.error("Error fetching lead:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
