import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    The page you are looking for doesn't exist or has been moved.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NotFound;