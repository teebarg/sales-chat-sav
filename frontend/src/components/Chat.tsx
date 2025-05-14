import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getLeadByEmail, sendMessage } from "../services/api";
import { Message as MessageType } from "../types";
import ChatInput from "./ChatInput";
import Message from "./Message";
import TypingIndicator from "./Typing";

const Chat: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const decodedEmail = email ? decodeURIComponent(email) : "";

    const [messages, setMessages] = useState<MessageType[]>([
        {
            role: "assistant",
            content:
                "Hi there! I'm your AI sales assistant for KanhaSoftware.\n\nThank you for your interest! Could you tell me more about your specific needs?",
            timestamp: new Date(),
        },
    ]);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await getLeadByEmail(decodedEmail);
                setMessages((prev) => [...prev, ...response.chatHistory]);
            } catch (error) {
                // console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();
    }, [decodedEmail]);

    const handleSend = async (message: string) => {
        const userMessage: MessageType = {
            role: "user",
            content: message,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await sendMessage(decodedEmail, message);
            const assistantMessage: MessageType = {
                role: "assistant",
                content: response.response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: MessageType = {
                role: "assistant",
                content: "Sorry, there was an error processing your message. Please try again." + error,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    mb: 2,
                    overflow: "auto",
                    backgroundColor: "background.paper",
                    margin: "auto",
                    borderRadius: 2,
                    maxWidth: { xs: "100%", lg: "50%" },
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: "1.5rem",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                        </svg>
                        <Typography variant="h6" component="h1" gutterBottom sx={{ mb: 0, fontWeight: "bold" }}>
                            KanhaSoft AI Sales Assistant
                        </Typography>
                    </Box>
                    <Typography variant="body2" component="p" gutterBottom align="left">
                        How can we help with your software development needs?
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "500px",
                        overflowY: "auto",
                        p: 2,
                    }}
                >
                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                    {loading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </Box>
                <Box sx={{ borderTop: "1px solid #ccc", p: 2 }}>
                    <ChatInput onSubmit={handleSend} isDisabled={loading} loading={loading} />
                </Box>
            </Paper>
        </Box>
    );
};

export default Chat;
