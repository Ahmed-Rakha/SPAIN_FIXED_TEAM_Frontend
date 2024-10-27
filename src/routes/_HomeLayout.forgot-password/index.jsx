import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_HomeLayout/forgot-password/")({
  component: ForgotPassword,
});

import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgotPasswordApi } from "../../services/loginApi";
export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (email) => {
    mutate(email);
  };
  const { mutate, isPending, isError } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (message) => {
      reset();
      toast.success(message || "Correo enviado exitosamente", {
        onClose: () => {},
      });
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar correo", {
        onClose: () => {},
      });
    },
  });
  return (
    <Container maxWidth="sm" sx={{ mt: 14, flexGrow: 1 }}>
      <Box
        sx={{
          mb: 4,
          backgroundColor: "rgb(248 171 171 / 53%)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: "0.1rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          Restablecer Contraseña
        </Typography>
      </Box>
      <Typography variant="body1" align="center" sx={{ mb: 4, color: "#fff" }}>
        Ingrese su dirección de correo electrónico a continuación y le
        enviaremos un enlace para restablecer su contraseña.
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Correo Electrónico"
          variant="outlined"
          margin="normal"
          type="email"
          sx={{
            mb: 2,
            color: "#fff",
            "& .MuiInputLabel-root": {
              color: "#fff",
            },
            " & .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#fff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
              },
            },
          }}
          {...register("email", {
            required: {
              value: true,
              message: "Correo requerido",
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message:
                "Formato de correo no valido. Ejemplo: 6lUeh@example.com",
            },
          })}
        />
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "red", fontWeight: "bold" }}
        >
          {errors?.email?.message}
        </Typography>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "rgb(248 171 171 / 53%)",
            "&:hover": {
              backgroundColor: "rgb(248 171 171 / 70%)",
            },
          }}
        >
          Send Reset Link
        </Button>
      </Box>
    </Container>
  );
}
