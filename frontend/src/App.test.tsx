import { render, screen } from "@testing-library/react";
import {  MemoryRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock the child components
jest.mock("./components/LeadForm", () => () => <div data-testid="lead-form">Lead Form Component</div>);
jest.mock("./components/Chat", () => () => <div data-testid="chat">Chat Component</div>);
jest.mock("./pages/NotFound", () => () => <div data-testid="not-found">Not Found Component</div>);
jest.mock("./pages/AdminView", () => () => <div data-testid="admin-view">Admin View Component</div>);

// Mock theme for consistent testing
const theme = createTheme();

describe("App Component", () => {
    test("renders without crashing", () => {
        render(<App />);
        expect(screen.getByText("AI Sales Assistant")).toBeInTheDocument();
    });

    test("renders the LeadForm component on the home route", () => {
        render(<App />);
        expect(screen.getByTestId("lead-form")).toBeInTheDocument();
    });

    test("renders the AdminView component on the admin route", () => {
        render(
            <MemoryRouter initialEntries={["/admin"]}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId("admin-view")).toBeInTheDocument();
    });

    test("renders the NotFound component for unknown routes", () => {
        render(
            <MemoryRouter initialEntries={["/unknown-route"]}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });

    test("renders the Chat component with email parameter", () => {
        render(
            <MemoryRouter initialEntries={["/chat/test@example.com"]}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </MemoryRouter>
        );
        expect(screen.getByTestId("chat")).toBeInTheDocument();
    });
});
