import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
                <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: "bold" }}>
                    404
                </Typography>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: "semi-bold" }}>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    The page you are looking for doesn't exist or has been moved.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" size="large" onClick={() => navigate("/")}>
                        Go Home
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NotFound;
