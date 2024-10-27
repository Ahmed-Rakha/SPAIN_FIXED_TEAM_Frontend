import { Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";

const FallbackContainer = styled(Container)(({ theme }) => ({
  alignItems: "center",
  height: "80vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  textAlign: "center",
  padding: theme.spacing(4),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.error.main,
  fontSize: "3rem",
  marginTop: theme.spacing(12),
  textShadow: `
    2px 2px 0 rgba(0, 0, 0, 0.5),
    4px 4px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(0, 0, 0, 0.3),
    8px 8px 0 rgba(0, 0, 0, 0.2)
  `,
}));

const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  fontSize: "1.2rem",
  fontWeight: 600,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
}));

const UnauthenticatedFallback = ({ message }) => {
  return (
    <FallbackContainer>
      <Title>Acceso denegado</Title>
      <Message>
        {message || "Debe iniciar sesión para acceder a esta sección."}
      </Message>
      <ActionButton variant="outlined" color="secondary">
        Iniciar Sesión
      </ActionButton>
    </FallbackContainer>
  );
};

export default UnauthenticatedFallback;
UnauthenticatedFallback.propTypes = {
  message: PropTypes.string,
};
