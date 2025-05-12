import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
    onSubmit: (message: string) => void;
    isDisabled?: boolean;
    loading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isDisabled, loading }) => {
    const [input, setInput] = useState<string>("");

    const handleSend = async () => {
        if (!input.trim()) return;

        if (input.trim() && !isDisabled) {
            onSubmit(input.trim());
            setInput("");
            return;
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isDisabled}
                sx={{ backgroundColor: "background.paper" }}
            />
            <Button
                color="primary"
                variant="contained"
                endIcon={<SendIcon />}
                loading={loading}
                onClick={handleSend}
                disabled={isDisabled || !input.trim()}
                sx={{ minWidth: "100px" }}
            >
                Send
            </Button>
        </Box>
    );
};

export default ChatInput;
