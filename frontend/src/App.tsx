import { ThemeProvider, createTheme, CssBaseline, Container, Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LeadForm from "./components/LeadForm";
import Chat from "./components/Chat";
import AdminView from "./components/AdminView";
import NotFound from "./components/NotFound";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
        background: {
            default: "#f5f5f5",
        },
    },
    typography: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
});

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = location.pathname === "/admin";
    const isNotFound = location.pathname === "/404";

    if (isNotFound) return null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
                    AI Sales Assistant
                </Typography>
                {!isAdmin ? (
                    <Button color="inherit" onClick={() => navigate("/admin")}>
                        Admin View
                    </Button>
                ) : (
                    <Button color="inherit" onClick={() => navigate("/")}>
                        Back to Chat
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Box sx={{ flexGrow: 1, height: "100vh", overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Navigation />
                    <Container maxWidth="lg" sx={{flex: 1 }}>
                        <Box sx={{py: 4 }}>
                            <Routes>
                                <Route path="/" element={<LeadForm />} />
                                <Route path="/chat/:email" element={<Chat />} />
                                <Route path="/admin" element={<AdminView />} />
                                <Route path="/404" element={<NotFound />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Box>
                    </Container>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
