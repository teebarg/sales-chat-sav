import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the API module
jest.mock("./services/api", () => ({
    getLeadByEmail: jest.fn(),
    sendMessage: jest.fn(),
}));

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

jest.mock("./pages/AdminView", () => () => <div data-testid="admin-view">Admin View Component</div>);

describe("App Component", () => {
    test("our app renders", () => {
        render(<App />);
        expect(screen.getByText("AI Sales Assistant")).toBeInTheDocument();
    });

    test("user sees lead form on landing page", () => {
        window.history.pushState({}, "", "/"); // simulate "/"
        render(<App />);
        expect(screen.getByText(/Start Conversation/i)).toBeInTheDocument();
    });

    test("user can go to admin page", () => {
        window.history.pushState({}, "", "/admin");
        render(<App />);
        expect(screen.getByTestId("admin-view")).toBeInTheDocument();
    });

    test("page not found renders appropriately", () => {
        window.history.pushState({}, "", "/unknown");
        render(<App />);
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });

    test("renders Chat with email parameter", async () => {
        window.history.pushState({}, "", "/chat/test@email.com");
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/How can we help with your software development needs?/i)).toBeInTheDocument();
        });
    });
});
