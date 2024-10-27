import {
  Button,
  FormLabel,
  Grid2,
  LinearProgress,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  updateProfile,
} from "../../services/getProfileDetails";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { validationSchema } from "../../validations/profileDetails.vm";

const TextFieldStyled = styled(TextField)({
  borderRadius: "8px",
  backgroundColor: "#f7f7f7",
  color: "#333",
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "border-color 0.3s, box-shadow 0.3s",
  "& .MuiInputBase-input": {
    color: "#333",
    padding: "12px 14px",
    borderRadius: "8px",
  },
  "& .MuiInputLabel-root": {
    color: "#999",
    fontWeight: 500,
  },
  "& .MuiInputBase-input:focus": {
    borderColor: "#007bff",
    boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#666",
    cursor: "not-allowed",
    backgroundColor: "#e9ecef",
  },
  "&:hover": {
    borderColor: "#007bff",
  },
});

export default function ProfileData({ userData }) {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
 
  const {
    register: registerProfileDetails,
    formState: { errors, dirtyFields },
    handleSubmit: handleSubmitProfileDetails,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { mutate: updateProfileDetailsMutate, isPending: isUpdating } =
    useMutation({
      mutationFn: updateProfile,
      onSuccess: () => {
        toast.success("¡Perfil actualizado exitosamente!", {
          toastId: `profileUpdated 1`,
          onClose: () => {
            queryClient.invalidateQueries(["profileDetails"]);
          },
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSubmit = (data) => {
    updateProfileDetailsMutate(data);
  
  };

  function handleEditProfile() {
    setEditMode((prevState) => !prevState);
  }
  function handleCancelEdit () {
    setEditMode(false);
  }
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
      });
    }
  }, [userData, reset]);

  const profileDetails = [
    {
      formLabel: "Nombre",
      defaultValue: userData.firstName,
      registerName: "firstName",
    },
    {
      formLabel: "Apellido",
      defaultValue: userData.lastName,
      registerName: "lastName",
    },
    {
      formLabel: "Correo",
      defaultValue: userData.email,
      registerName: "email",
    },
    {
      formLabel: "Teléfono Movil",
      defaultValue: userData.phoneNumber,
      registerName: "phoneNumber",
    },
    {
      formLabel: "Role",
      defaultValue: userData.role,
      registerName: "role",
    },
  ];
  return (
    <form onSubmit={handleSubmitProfileDetails(onSubmit)}>
      <Grid2 container spacing={2}>
        {profileDetails.map((profileDetail) => (
          <Grid2 size={{ xs: 12, sm: 6 }} key={profileDetail.registerName}>
            <FormLabel sx={{ color: "#749be9", mb: 1 }}>
              {profileDetail.formLabel}
            </FormLabel>
            <TextFieldStyled
              color="white"
              fullWidth
              {...registerProfileDetails(profileDetail.registerName)}
              defaultValue={profileDetail.defaultValue}
              disabled={!editMode || profileDetail.registerName === "role"}
            />
            <Typography variant="body2" sx={{ mt: 1, color: "red" }}>
              {errors[profileDetail.registerName]
                ? errors[profileDetail.registerName].message
                : ""}
            </Typography>
            {isUpdating && dirtyFields[profileDetail.registerName] && (
              <LinearProgress sx={{ mt: 1 }} />
            )}
          </Grid2>
        ))}

        <Grid2 size={{ xs: 12 }}>
          <Button
            type={!editMode ? "submit" : "button"}
            variant="contained"
            color="success"
            fullWidth
            onClick={handleEditProfile}
            disabled={editMode && Object.keys(dirtyFields).length === 0}
            sx={{
            ':disabled': {
              backgroundColor: "grey",
              cursor: "not-allowed",
            }
            }}
          >
            {editMode ? "Guardar" : "Editar"}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="error"
            fullWidth
            
            onClick={handleCancelEdit}
            sx={{
              mt: 2,
            ':disabled': {
              backgroundColor: "grey",
              cursor: "not-allowed",
            }
            }}
          >
            Cancelar
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}
