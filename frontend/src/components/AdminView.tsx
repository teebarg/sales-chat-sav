import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Container,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../services/api";
import { Lead } from "../types";

const getRelevanceColor = (relevanceTag: Lead["relevanceTag"]) => {
    switch (relevanceTag) {
        case "Very big potential customer":
            return "success";
        case "Hot lead":
            return "warning";
        case "Weak lead":
            return "info";
        case "Not relevant":
            return "error";
        default:
            return "default";
    }
};

const AdminView: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (err) {
                setError("Failed to fetch leads. Please try again later." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Lead Management
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Relevance</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell>Messages</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.email}>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>{lead.companyName}</TableCell>
                                    <TableCell>
                                        <Chip label={lead.relevanceTag} color={getRelevanceColor(lead.relevanceTag)} size="small" />
                                    </TableCell>
                                    <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(lead.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell>{lead.chatHistory.length}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/chat/${encodeURIComponent(lead.email)}`)}
                                        >
                                            View Chat
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default AdminView;
