import React from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff"; // Import the icon

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  textAlign: "center",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(6),
}));

const StyledText = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: "bold",
  color: "orange",
  textShadow: `
    2px 2px 0 rgba(0, 0, 0, 0.5),
    4px 4px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(0, 0, 0, 0.3),
    8px 8px 0 rgba(0, 0, 0, 0.2)
  `,
}));

const NotFoundFallback = () => {
  const handleHome = () => {
    window.location.href = "/"; // Redirect to home
  };

  return (
    <StyledContainer>
      <SearchOffIcon style={{ fontSize: "80px", color: "orange" }} />
      <StyledText gutterBottom>
        Página no encontrada
      </StyledText>
      <Typography variant="h6">
        La página que busca no existe. Por favor, vuelva a la página principal.
      </Typography>
      <StyledButton variant="contained" color="warning" onClick={handleHome}>
        Ir a Inicio
      </StyledButton>
    </StyledContainer>
  );
};

export default NotFoundFallback;
