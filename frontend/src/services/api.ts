import axios from "axios";
import { ChatResponse } from "../types";

// Get the API URL from environment variables or use default
const getApiUrl = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
        console.warn("REACT_APP_API_URL is not set in environment variables. Using default URL.");
        return "http://localhost:8000/api";
    }
    return apiUrl;
};

const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

export const sendMessage = async (email: string, message: string): Promise<ChatResponse> => {
    try {
        const response = await api.post<ChatResponse>("/chat", {
            email,
            message,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLeads = async () => {
    try {
        const response = await api.get("/leads");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLeadByEmail = async (email: string) => {
    try {
        const response = await api.get(`/leads/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getChatHistory = async (email: string) => {
    try {
        const response = await api.get(`/leads/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
