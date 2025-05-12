import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LeadForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [errors, setErrors] = useState<{ email: string }>({ email: "" });
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = { email: "" };
        let isValid = true;

        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            navigate(`/chat/${encodeURIComponent(email)}`);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ py: 8, px: 6, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 1, fontWeight: "bold" }}>
                    Welcome to Our Sales Assistant
                </Typography>
                <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Please provide your information to start the conversation
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        margin="normal"
                        required
                    />

                    <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, borderRadius: 2 }}>
                        Start Conversation
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LeadForm;
