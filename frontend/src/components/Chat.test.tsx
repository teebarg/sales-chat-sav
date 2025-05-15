import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import * as api from "../services/api";

// Mock the API module
jest.mock("../services/api", () => ({
    getLeadByEmail: jest.fn(),
    sendMessage: jest.fn(),
}));

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("Chat component", () => {
    const mockChatHistory = [
        {
            role: "assistant",
            content: "How may i help you?",
            timestamp: new Date().toISOString(),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders initial message and fetched chat history", async () => {
        (api.getLeadByEmail as jest.Mock).mockResolvedValueOnce({ chatHistory: mockChatHistory });

        render(
            <MemoryRouter initialEntries={["/chat/test%40example.com"]}>
                <Routes>
                    <Route path="/chat/:email" element={<Chat />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText((content) => content.includes("How may i help you?"))).toBeInTheDocument();
        });

        expect(screen.getByRole('heading', { name: /AI sales assistant/i })).toBeInTheDocument();
        expect(screen.getByText(/Could you tell me more about your specific needs/i)).toBeInTheDocument();
    });

    it("sends a message and receives bot response", async () => {
        (api.getLeadByEmail as jest.Mock).mockResolvedValueOnce({ chatHistory: [] });
        (api.sendMessage as jest.Mock).mockResolvedValueOnce({ response: "Thanks for reaching out!" });

        render(
            <MemoryRouter initialEntries={["/chat/test%40example.com"]}>
                <Routes>
                    <Route path="/chat/:email" element={<Chat />} />
                </Routes>
            </MemoryRouter>
        );

        // Simulate user typing and sending a message
        const input = screen.getByPlaceholderText(/type your message/i);
        const sendButton = screen.getByRole("button", { name: /send/i });

        fireEvent.change(input, { target: { value: "Hello!" } });
        fireEvent.click(sendButton);

        // User message should appear
        await waitFor(() => {
            expect(screen.getByText("Hello!")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Thanks for reaching out!")).toBeInTheDocument();
        });
    });
});
