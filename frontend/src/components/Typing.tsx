import { Box } from "@mui/material";

const TypingIndicator: React.FC = () => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2, mb: 2 }}>
            <Box
                sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    animation: "typing 1s infinite ease-in-out",
                    "&:nth-of-type(2)": {
                        animationDelay: "0.2s",
                    },
                    "&:nth-of-type(3)": {
                        animationDelay: "0.4s",
                    },
                    "@keyframes typing": {
                        "0%, 100%": {
                            transform: "translateY(0)",
                            opacity: 0.4,
                        },
                        "50%": {
                            transform: "translateY(-5px)",
                            opacity: 1,
                        },
                    },
                }}
            />
            <Box
                sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    animation: "typing 1s infinite ease-in-out",
                }}
            />
            <Box
                sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    animation: "typing 1s infinite ease-in-out",
                }}
            />
        </Box>
    );
};

export default TypingIndicator;
