import {
  AppBar,
  TextField,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  CssBaseline,
  styled,
  InputAdornment,
  IconButton,
  FormLabel,
} from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";
import backgroundDashborad from "../assets/background-dashboard.avif";
import { useForm } from "react-hook-form";
import loginApi from "../services/loginApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
export const Route = createFileRoute("/")({
  component: AdminDashboard,
});
const TextFieldStyled = styled(TextField)(({ theme }) => ({
  border: "1px solid #aaa",
  backgroundColor: "#1f2235",
  borderRadius: "4px", // Adjusted for better compatibility
  color: "#fff",

  // Placeholder styles
  "& .MuiInputBase-input::placeholder": {
    color: "#fff", // Placeholder color
  },

  // Input styles
  "& .MuiInputBase-input": {
    color: "#fff",
    fontFamily: "Cairo",
    fontWeight: "bold",
    fontSize: "1.3rem",
  },

  // Label styles
  "& .MuiInputLabel-root": {
    color: "#fff",
    fontFamily: "Cairo",
    fontWeight: "bold",
    fontSize: "1.3rem",
  },

  // Focus styles
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#333", // Color of the border when focused
  },

  // Border color when not focused
  "& .MuiOutlinedInput-root fieldset": {
    borderColor: "#aaa",
  },
  "& .MuiFormHelperText-root": {
    color: "red", // Change this to your desired color for helper text
  },
}));

export default function AdminDashboard() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    mutate(data);
  };

  const { mutate, isPending: isLoggingIn } = useMutation({
    mutationFn: loginApi,
    onSuccess: (role) => {
      toast.success("Login exitoso");
      console.log("Navigating to /user"); // Debug log

      setTimeout(() => {
        role === "admin"
          ? navigate({ to: "/admin/dashboard" })
          : navigate({ to: "/user/dashboard" });
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Error al iniciar sesión");
    },
  });
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",

        backgroundImage: `url(${backgroundDashborad})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "#1f2235" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: "#fff",
              fontFamily: "Cairo",
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            Order Entry Team
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs" sx={{ mt: 8, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            // backgroundColor: "transparent",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: "#fff",
              mb: 2,
              fontFamily: "cursive",
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            Inicia sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <FormLabel sx={{ color: "#fff" , marginBottom: ".38rem" }}>Correo Electrónico</FormLabel>
            <TextFieldStyled
             placeholder="Correo Electrónico"
              fullWidth
              id="email"
              autoComplete="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Correo obligatorio",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo inválido",
                },
              })}
            />
            {}
            <Typography
              variant="body2"
              mt={1}
              sx={{
                color: "red",
                fontFamily: "Cairo",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {errors.email ? errors.email.message : ""}
            </Typography>

            <FormLabel sx={{ color: "#fff" , marginBottom: ".38rem", marginTop: "1rem" }}>Contraseña</FormLabel>
            <TextFieldStyled
              placeholder="Contraseña"
              fullWidth
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Contraseña obligatoria",
                },
              })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        " .MuiIconButton-root": {
                          color: "red",
                        },
                      }}
                    >
                      <IconButton
                        onClick={handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography
              variant="body2"
              mt={1}
              sx={{
                color: "red",
                fontFamily: "Cairo",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {errors.password ? errors.password.message : ""}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color= "success"
              disabled={isLoggingIn}
              sx={{
                mt: 3,
                mb: 2,
                fontFamily: "Cairo",
                fontWeight: "bold",
                fontSize: "1rem",
                ":disabled": {
                  backgroundColor: "#ccc",
                  color: "#333",
                  cursor: "not-allowed",
                }
              }}
            >
              {isLoggingIn ? (
                <>
                  <CircularProgress sx={{ mr: 1 }} />
                  {"Iniciando sesión..."}{" "}
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Box>
          <Typography
          variant="body2"
          component={Link}
          to={"/forgot-password"}
          sx={{
            color: "#fff",
            fontFamily: "Cairo",
            fontWeight: "bold",
            fontSize: "1rem",
            textAlign: "center",
            mt: 2,
            textUnderlineOffset: "4px",
            ":hover": {
              cursor: "pointer",
              color: "lightblue",
            }
          }}
        >
          ¿Olvidaste tu contraseña?
        </Typography>
        </Box>
      </Container>
      <footer
        style={{
          padding: "20px",
          backgroundColor: "#1f2235",
          color: "#fff",
        }}
      >
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Powered by RA. All rights reserved.
        </Typography>
      </footer>
   
    </Box>
  );
}
