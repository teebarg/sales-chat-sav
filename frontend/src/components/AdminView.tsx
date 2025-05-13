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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    SelectChangeEvent,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../services/api";
import { Lead } from "../types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

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
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Filter states
    const [relevanceFilter, setRelevanceFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
                setFilteredLeads(data);
            } catch (err) {
                setError("Failed to fetch leads. Please try again later." + err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    useEffect(() => {
        let filtered = [...leads];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (lead) => lead.email.toLowerCase().includes(query) || (lead.companyName && lead.companyName.toLowerCase().includes(query))
            );
        }

        // Apply relevance filter
        if (relevanceFilter !== "all") {
            filtered = filtered.filter((lead) => lead.relevanceTag === relevanceFilter);
        }

        // Apply date range filter
        if (startDate) {
            filtered = filtered.filter((lead) => new Date(lead.createdAt) >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter((lead) => new Date(lead.createdAt) <= endDate);
        }

        setFilteredLeads(filtered);
    }, [leads, relevanceFilter, startDate, endDate, searchQuery]);

    const handleRelevanceChange = (event: SelectChangeEvent) => {
        setRelevanceFilter(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const clearFilters = () => {
        setRelevanceFilter("all");
        setStartDate(null);
        setEndDate(null);
        setSearchQuery("");
    };

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
        <Container>
            <Box sx={{ pt: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Lead Management
                </Typography>

                {/* Search and Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid sx={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search by Email or Company Name"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchQuery("")} edge="end">
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Relevance</InputLabel>
                                <Select value={relevanceFilter} label="Relevance" onChange={handleRelevanceChange}>
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="Very big potential customer">Very Big Potential</MenuItem>
                                    <MenuItem value="Hot lead">Hot Lead</MenuItem>
                                    <MenuItem value="Weak lead">Weak Lead</MenuItem>
                                    <MenuItem value="Not relevant">Not Relevant</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Button fullWidth variant="outlined" color="primary" onClick={clearFilters} startIcon={<ClearIcon />}>
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <TableContainer component={Paper} sx={{ maxHeight: "65vh", overflow: "auto" }}>
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
                            {filteredLeads.map((lead: Lead, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>{lead.companyName}</TableCell>
                                    <TableCell>
                                        <Chip label={lead.relevanceTag} color={getRelevanceColor(lead.relevanceTag)} size="small" />
                                    </TableCell>
                                    <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(lead.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell>{lead.chatHistory.length}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" onClick={() => navigate(`/chat/${encodeURIComponent(lead.email)}`)}>
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
