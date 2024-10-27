import React from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import SignalCellularConnectedNoInternet4BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet4Bar"; // Import the icon

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
  color: "purple",
  textShadow: `
    2px 2px 0 rgba(0, 0, 0, 0.5),
    4px 4px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(0, 0, 0, 0.3),
    8px 8px 0 rgba(0, 0, 0, 0.2)
  `,
}));

const NetworkErrorFallback = () => {
  const handleRetry = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <StyledContainer>
      <SignalCellularConnectedNoInternet4BarIcon style={{ fontSize: "80px", color: "purple" }} />
      <StyledText gutterBottom>
        Error de Conexión
      </StyledText>
      <Typography variant="h6">
        No se pudo conectar a la red. Verifique su conexión a Internet y vuelva a intentarlo.
      </Typography>
      <StyledButton variant="contained" color="secondary" onClick={handleRetry}>
        Reintentar
      </StyledButton>
    </StyledContainer>
  );
};

export default NetworkErrorFallback;
