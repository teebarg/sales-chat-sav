import React from "react";
import { Box, Typography, Paper, Link, Avatar } from "@mui/material";
import { Message as MessageType } from "../types";

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.role === "user";

    const formatMessage = (content: string) => {
        // Regular expression to match Calendly URLs
        const calendlyRegex = /(https:\/\/calendly\.com\/[^\s]+)/g;

        // Split the content by Calendly URLs
        const parts = content.split(calendlyRegex);

        // Map through parts and wrap URLs in Link components
        return parts.map((part, index) => {
            if (part.match(calendlyRegex)) {
                return (
                    <Link
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: isUser ? "white" : "primary.main",
                            textDecoration: "underline",
                            fontWeight: "bold",
                            "&:hover": {
                                color: isUser ? "rgba(255, 255, 255, 0.8)" : "primary.dark",
                            },
                        }}
                    >
                        {part}
                    </Link>
                );
            }
            return part;
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 2,
                gap: 1,
            }}
        >
            {!isUser && <Avatar alt="Bot" src="/chatbot.webp" sx={{ width: 45, height: 45 }} />}
            <Paper
                elevation={1}
                sx={{
                    px: 2,
                    py: 1,
                    maxWidth: "70%",
                    backgroundColor: isUser ? "primary.light" : "grey.100",
                    color: isUser ? "white" : "text.primary",
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14,
                    borderBottomLeftRadius: !isUser ? 0 : 14,
                    borderBottomRightRadius: isUser ? 0 : 14,
                }}
            >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {formatMessage(message.content)}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 1,
                        color: isUser ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                    }}
                >
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}
                </Typography>
            </Paper>
            {isUser && <Avatar alt="User" sx={{ width: 45, height: 45 }} />}
        </Box>
    );
};

export default Message;
