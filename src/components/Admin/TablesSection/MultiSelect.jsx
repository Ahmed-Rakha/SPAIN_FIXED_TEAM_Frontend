import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Button,
  Grid2,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";
const StyledSelect = styled(Select)(({ theme }) => ({}));

const headers = [
  { key: "idCase", label: "ID Caso" },
  { key: "deadlineDate", label: "Fecha Límite" },
  { key: "receiptDate", label: "Fecha de Recepción" },
  { key: "createdAt", label: "Creado En" },
  { key: "sede", label: "Sede" },
  { key: "instance", label: "Instancia" },
  { key: "installation", label: "Instalación" },
  { key: "dateProgress", label: "Fecha de Progreso" },
  { key: "status", label: "Estado" },
  { key: "comment", label: "Comentario" },
  { key: "createdBy", label: "Creado Por" },
];

export default function MultiSelect({
  control,
  handleSubmit,
  onSubmit,
  onWatch,
  handleReset,
}) {
  const isAnySelected = onWatch().selectedHeaders?.length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid2 container spacing={3} mb={3}>
        <Grid2 size={{ xs: 9 }}>
          <Box className="card flex justify-content-center">
            <FormControl fullWidth>
              <InputLabel
                id="multiple-select-label"
                sx={{
                  color: grey[600],
                  "&.Mui-focused": {
                    color: "#fff",
                    border: "1px solid #fff",
                    backgroundColor: "#1976d2",
                    borderRadius: "8px",
                    boxShadow: "0 0 0 1px #1976d2",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    padding: "4px 6px",
                  },
                }}
              >
                Seleccionar Encabezados
              </InputLabel>
              <Controller
                name="selectedHeaders"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <StyledSelect
                    labelId="multiple-select-label"
                    multiple
                    renderValue={(selected) => {
                      const selectedLabels = selected
                        .map(
                          (key) =>
                            headers.find((header) => header.key === key)?.label
                        )
                        .filter(Boolean);
                      if (selectedLabels.length === 0) return "";
                      if (selectedLabels.length <= 10)
                        return selectedLabels.join(", ");
                      return `${selectedLabels.slice(0, 10).join(", ")} and ${selectedLabels.length - 10} more selected`;
                    }}
                    {...field}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                  >
                    {headers.map((header) => (
                      <MenuItem key={header.key} value={header.key}>
                        {header.label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
              />
            </FormControl>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 1 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              height: "100%",
              ":disabled": {
                bgcolor: "grey",
                color: "#fff",
                fontWeight: "bold",
                cursor: "not-allowed",
              },
            }}
            disabled={!isAnySelected}
          >
            Submit
          </Button>
        </Grid2>
        <Grid2 xs={1}>
          <Button
            type="button"
            color="error"
            variant="outlined"
            onClick={handleReset}
            sx={{
              height: "100%",
              ":disabled": {
                bgcolor: "grey",
                color: "#fff",
                fontWeight: "bold",
                cursor: "not-allowed",
              },
            }}
            disabled={!isAnySelected}
          >
            Reset
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}
