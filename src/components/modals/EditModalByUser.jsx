import * as React from "react";

import { AddBox, Edit } from "@mui/icons-material";

import {
  Button,
  TextField,
  Grid2,
  Dialog,
  DialogContent,
  styled,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { editStatusCASE } from "../../services/addCaseDetailsByUser";
// Styled components for better design
const StyledDialogTitle = styled(DialogTitle)({
  fontFamily: "Poppins",
  fontWeight: "bold",
  textTransform: "uppercase",
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "16px 24px",
  borderBottom: "2px solid #e0e0e0",
});

const StyledButton = styled(Button)({
  fontFamily: "Poppins",
  fontWeight: "bold",
  //   textTransform: 'none',
  marginTop: "16px",
});
const estados = [
  "Tramitado",
  "Pdt sistema",
  "Preselección-Vois",
  "Automation",
  "CIF Bloqueado",
];

export default function EditModalByUser({ targetCase }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const handleOpen = () => {
    setOpen(true);
    reset({
      ...targetCase,
      dateProgress: new Date(targetCase.dateProgress)
        .toISOString()
        .split("T")[0],
    });
  };
  console.log(targetCase);

  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({});
  const currentStatus = watch("status", targetCase.status);

  const {
    mutate: editCaseStatusMutate,
    data,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: editStatusCASE,
    onSuccess: () => {
      toast.success("Caso editado exitosamente");
      queryClient.invalidateQueries(["getCasesHandledByUser"]);

      setTimeout(() => {
        handleClose();
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (data) => {
    const { idCase, sede, instance, installation, status } = data;
    const query = {
      idCase,
      sede,
      instance,
      installation,
    };
    const modifiedData = {
      status,
    };
    console.log("modifiedData", modifiedData);
    editCaseStatusMutate({ query, modifiedData });
  };
  const formFields = [
    { name: "idCase", label: "Id Caso" },
    { name: "sede", label: "Sede" },
    { name: "instance", label: "Instancia" },
    { name: "installation", label: "Instalación" },
    { name: "dateProgress", label: "Fecha Avance" },
    {
      name: "status",
      label: "Estado",
      options: [
        "Tramitado",
        "Pdt sistema",
        "Preselección-Vois",
        "Automation",
        "CIF Bloqueado",
      ],
    },
    { name: "comment", label: "Motivo" },
  ];

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="success"
        sx={{ m: 1 }}
        size="small"
        startIcon={<Edit />}
      >
        Editar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <StyledDialogTitle>Editar AVANCE DIARIO</StyledDialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <form style={{ marginTop: 10 }} onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              {formFields.map((field) =>
                field.name !== "status" && field.name !== "dateProgress" ? (
                  <Grid2 key={field.name} size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={field.label}
                      variant="outlined"
                      fullWidth
                      disabled={
                        field.name === "idCase" ||
                        field.name === "comment" ||
                        field.name === "dateProgress" ||
                        field.name === "sede" ||
                        field.name === "installation" ||
                        field.name === "instance"
                          ? true
                          : false
                      }
                      error={!!errors[field.name]}
                      helperText={
                        errors[field.name] ? errors[field.name].message : ""
                      }
                      {...register(field.name, {
                        required: {
                          value: true,
                          message: "Este campo es requerido",
                        },
                      })}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          cursor: "not-allowed",
                        },
                      }}
                    />
                  </Grid2>
                ) : field.name === "dateProgress" ? (
                  <Grid2 size={{ xs: 12, md: 6 }} key={field.name}>
                    <TextField
                      label="Fecha Avance"
                      variant="outlined"
                      type="date"
                      disabled
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                        htmlInput: {
                          min: new Date().toISOString().split("T")[0],
                        },
                      }}
                      fullWidth
                      error={!!errors.dateProgress}
                      helperText={
                        errors.dateProgress ? errors.dateProgress.message : ""
                      }
                      {...register("dateProgress", {
                        required: {
                          value: true,
                          message: "Este campo es requerido",
                        },
                      })}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          cursor: "not-allowed",
                        },
                      }}
                    />
                  </Grid2>
                ) : (
                  <Grid2 size={{ xs: 12, md: 6 }} key={field.name}>
                    <FormControl fullWidth error={!!errors[field.name]}>
                      <InputLabel id="status-label">{field.label}</InputLabel>
                      <Select
                        labelId="status-label"
                        label={field.label}
                        {...register(field.name, {
                          required: {
                            value: true,
                            message: "Este campo es requerido",
                          },
                        })}
                        value={currentStatus || targetCase.status}
                      >
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <span style={{ color: "red" }}>
                          {errors.status.message}
                        </span>
                      )}
                    </FormControl>
                  </Grid2>
                )
              )}
            </Grid2>
            {/* Button Container */}
            <Grid2 container spacing={2} style={{ marginTop: "16px" }}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Editar
                </StyledButton>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <StyledButton
                  onClick={handleClose}
                  variant="contained"
                  color="error"
                  fullWidth
                >
                  Cancelar
                </StyledButton>
              </Grid2>
            </Grid2>
          </form>
        </DialogContent>
        {/* TOAST */}
        <ToastContainer position="top-right" />
      </Dialog>
    </div>
  );
}
