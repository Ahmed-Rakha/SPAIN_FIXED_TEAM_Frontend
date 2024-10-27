import {
  Button,
  Divider,
  Grid2,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { changePassword } from "../../services/getProfileDetails";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
export default function ChangePassword({ refetch }) {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showActualPassword, setShowActualPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleClickShowPassword = (passwordType) => {
    if (passwordType === "actual") {
      setShowActualPassword(!showActualPassword);
    } else if (passwordType === "new") {
      setShowNewPassword(!showNewPassword);
    }
  };

  function handlePasswordModal(action) {
    if (action === "open") {
      setPasswordModalOpen(true);
    }
    if (action === "close") {
      setPasswordModalOpen(false);
      reset();
    }
  }
  const { register, handleSubmit, reset, watch } = useForm({});
  const { mutate: changePasswordMutate, isPending: isUpdating } = useMutation({
    mutationFn: changePassword,
    onSuccess: (message) => {
      toast.success(message || "¡Contraseña cambiada exitosamente!", {
        toastId: `¡Contraseña cambiada exitosamente! 1`,
        onClose: () => {
          reset();
          refetch();
          setPasswordModalOpen(false);
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (data) => {
    changePasswordMutate(data);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Contraseña
      </Typography>
      <Typography variant="body1">
        Cambia la contraseña de tu cuenta.
      </Typography>
      <Divider color="white" sx={{ my: 2 }} />
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={() => handlePasswordModal("open")}
        sx={{ mb: 2 }}
      >
        Cambiar Contraseña
      </Button>
      {passwordModalOpen && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contraseña Actual"
                variant="filled"
                color="white"
                fullWidth
                sx={{
                  borderRadius: "11px",
                  border: "1px solid gray",
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                }}
                {...register("oldPassword")}
                type={showActualPassword ? "text" : "password"}
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
                          onClick={() => handleClickShowPassword("actual")}
                          edge="end"
                        >
                          {showActualPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nueva Contraseña"
                variant="filled"
                color="white"
                fullWidth
                type={showNewPassword ? "text" : "password"}
                sx={{
                  borderRadius: "11px",
                  border: "1px solid gray", 
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                }}
                {...register("newPassword")}
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
                          onClick={() => handleClickShowPassword("new")}
                          edge="end"
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Button
                disabled={
                  isUpdating || !watch("oldPassword") || !watch("newPassword")
                }
                type="submit"
                variant="contained"
                fullWidth
                color="success"
                sx={{
                  mb: 2,
                  ":disabled": {
                    backgroundColor: "gray",
                  },
                }}
              >
                Guardar
              </Button>
              {isUpdating && <LinearProgress sx={{ mt: 1 }} />}
            </Grid2>
          </Grid2>
        </form>
      )}
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() => handlePasswordModal("close")}
      >
        Cancelar
      </Button>
    </>
  );
}
