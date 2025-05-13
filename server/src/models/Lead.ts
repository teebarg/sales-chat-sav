import mongoose, { Document, Schema } from "mongoose";
import { ConversationState } from "../types";

export interface ILead extends Document {
    email: string;
    companyName: string;
    relevanceTag: "Not relevant" | "Weak lead" | "Hot lead" | "Very big potential customer";
    score: number;
    chatHistory: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }>;
    conversationState: ConversationState;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        companyName: {
            type: String,
            required: false,
            trim: true,
        },
        relevanceTag: {
            type: String,
            enum: ["Not relevant", "Weak lead", "Hot lead", "Very big potential customer"],
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        chatHistory: [
            {
                role: {
                    type: String,
                    enum: ["user", "assistant"],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        conversationState: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
