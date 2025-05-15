import { LeadController } from "../src/controllers/leadController";
import { Request, Response } from "express";
import Lead from "../src/models/Lead";
import { processWithGemini } from "../src/services/geminiService";
import { processUserMessage } from "../src/services/conversationService";

jest.mock("../src/models/Lead");
jest.mock("../src/services/geminiService");
jest.mock("../src/services/conversationService");

describe("LeadController - handleMessage", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                email: "test@email.com",
                message: "Hello",
            },
        };

        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        res = {
            json: jsonMock,
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new lead and return processed response", async () => {
        // @ts-ignore - mock Mongoose methods
        Lead.findOne.mockResolvedValue(null);

        const fakeSave = jest.fn().mockResolvedValue(true);

        // @ts-ignore
        Lead.mockImplementation(() => ({
            email: "test@email.com",
            relevanceTag: "Weak lead",
            score: 0,
            chatHistory: [],
            conversationState: {},
            save: fakeSave,
        }));

        (processWithGemini as jest.Mock).mockResolvedValue({
            updatedLead: {
                email: "test@email.com",
                companyName: "Test Co",
                relevanceTag: "Hot lead",
                score: 85,
            },
            updatedState: {
                hasAskedEmail: true,
                hasFinishedQualifying: true,
                hasOfferedCalendly: false,
            },
            response: "Thanks for your message!",
        });

        const controller = new LeadController();
        await controller.handleMessage(req as Request, res as Response);

        expect(processWithGemini).toHaveBeenCalled();
        expect(fakeSave).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({
            response: "Thanks for your message!",
            relevanceTag: "Hot lead",
        });
    });

    it("should return 400 for missing fields", async () => {
        req.body = { email: "" };

        const controller = new LeadController();
        await controller.handleMessage(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Missing required fields" });
    });

    it("should fallback to processUserMessage if Gemini fails", async () => {
        // @ts-ignore
        Lead.findOne.mockResolvedValue(null);

        const fakeSave = jest.fn().mockResolvedValue(true);

        // @ts-ignore
        Lead.mockImplementation(() => ({
            email: "test@email.com",
            relevanceTag: "Weak lead",
            score: 0,
            chatHistory: [],
            conversationState: {},
            save: fakeSave,
        }));

        (processWithGemini as jest.Mock).mockRejectedValue(new Error("Gemini failed"));
        (processUserMessage as jest.Mock).mockResolvedValue({
            updatedLead: {
                email: "test@email.com",
                companyName: "Test Co",
                relevanceTag: "Warm lead",
                score: 70,
            },
            updatedState: {
                hasFinishedQualifying: false,
                hasOfferedCalendly: false,
            },
            response: "Fallback response",
        });

        const controller = new LeadController();
        await controller.handleMessage(req as Request, res as Response);

        expect(processWithGemini).toHaveBeenCalled();
        expect(processUserMessage).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({
            response: "Fallback response",
            relevanceTag: "Warm lead",
        });
    });
});
