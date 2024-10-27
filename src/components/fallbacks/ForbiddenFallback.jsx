import React from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock"; // Import the icon

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
  color: "red",
  textShadow: `
    2px 2px 0 rgba(0, 0, 0, 0.5),
    4px 4px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(0, 0, 0, 0.3),
    8px 8px 0 rgba(0, 0, 0, 0.2)
  `,
}));

const ForbiddenFallback = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <StyledContainer>
      {/* Icon above the text */}
      <LockIcon style={{ fontSize: "80px", color: "red" }} />
      <StyledText gutterBottom>
        No tiene permisos para acceder a esta sección
      </StyledText>
      <Typography variant="h6">
        Por favor vuelva a la página principal o conctate con el administrador
      </Typography>
      <StyledButton
        variant="contained"
        color="error"
        onClick={handleBack}
       
      >
        Volver
      </StyledButton>
    </StyledContainer>
  );
};

export default ForbiddenFallback;
