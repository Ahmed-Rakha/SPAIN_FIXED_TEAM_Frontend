export const Route = createFileRoute("/_NavLayout/admin/tables/")({
  component: UsersHandledCasesTable,
});

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner";
import { getHandledCasesByUsersApi } from "../../../services/getHandledCasesByUsersApi";
import { format } from "date-fns";
import { indigo } from "@mui/material/colors";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Grid2, styled, TextField, Select, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import MultiSelect from "../../../components/Admin/TablesSection/MultiSelect";
import UnauthenticatedFallback from "../../../components/fallbacks/UnauthenticatedFallback";
import NotFoundFallback from "../../../components/fallbacks/NotFoundFallback";
import ForbiddenFallback from "../../../components/fallbacks/ForbiddenFallback";
import NetworkErrorFallback from "../../../components/fallbacks/NetworkErrorFallback";
import NoDataFoundFallback from "../../../components/fallbacks/NoDataFoundFallback";
import { SentimentDissatisfied } from "@mui/icons-material";

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
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
  "& .MuiInputLabel-root": {
    color: "#fff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
}));
const columns = [
  { id: "idCase", label: "Id Caso", minWidth: 170 },
  {
    id: "deadlineDate",
    label: "Fecha Límite",
    minWidth: 170,
    align: "right",
    format: (value) => {
      if (!value) return "N/A"; // Handle invalid value
      const date = new Date(value);
      return isNaN(date) ? "Invalid Date" : format(date, "yyyy/MM/dd");
    },
  },
  {
    id: "receiptDate",
    label: "Fecha Recepción",
    minWidth: 170,
    align: "right",
    format: (value) => {
      if (!value) return "N/A"; // Handle invalid value
      const date = new Date(value);
      return isNaN(date) ? "Invalid Date" : format(date, "yyyy/MM/dd");
    },
  },
  {
    id: "createdAt",
    label: "Fecha Asignación",
    minWidth: 170,
    align: "right",
    format: (value) => {
      if (!value) return "N/A"; // Handle invalid value
      const date = new Date(value);
      return isNaN(date) ? "Invalid Date" : format(date, "yyyy/MM/dd");
    },
  },
  { id: "sede", label: "Sede", minWidth: 170, align: "center" },
  { id: "instance", label: "Instancia", minWidth: 170, align: "center" },
  { id: "installation", label: "Instalación", minWidth: 170, align: "center" },
  {
    id: "dateProgress",
    label: "Fecha Progreso",
    minWidth: 170,
    align: "right",
    format: (value) => {
      if (!value) return "N/A"; // Handle invalid value
      const date = new Date(value);
      return isNaN(date) ? "Invalid Date" : format(date, "yyyy/MM/dd");
    },
  },
  { id: "status", label: "Estado", minWidth: 170, align: "center" },

  { id: "comment", label: "Comentario", minWidth: 170, align: "center" },
  { id: "createdBy", label: "Creado por", minWidth: 170, align: "center" },
];

export default function UsersHandledCasesTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idCase");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filteredColumns, setFilterColumns] = React.useState(columns);
  const [filters, setFilters] = React.useState({
    idCase: "",
    status: "",
    createdBy: "",
    startDate: "",
    endDate: "",
  });
  const [outOfDeadline, setOutOfDeadline] = React.useState(false);
  const {
    register: registerFilter,
    handleSubmit: handleFilterSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { startDate: "", endDate: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const {
    control: controlProjection,
    handleSubmit: handleProjectionSubmit,
    watch,
    reset: resetProjection,
  } = useForm();

  const onSubmitFilters = (data) => {
    setFilters(data);
  };

  const onSubmitProjection = (data) => {
    const filterOriginalColumns = columns.filter((column) =>
      data.selectedHeaders.includes(column.id)
    );
    setFilterColumns(filterOriginalColumns);
   
  };
  const handleResetFilteredColumns = () => {
    resetProjection({ selectedHeaders: [] });
    setFilterColumns(columns);
   
  };
  const {
    data: cases,
    isPending: isFetchingCases,
    isError,
    error,
  } = useQuery({
    queryKey: ["getHandledCases"],
    queryFn: getHandledCasesByUsersApi,
  });

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  if (isError) {
    switch (error.errorType) {
      case 404:
        return <NotFoundFallback message={error.message} />;
      case 401:
        return <UnauthenticatedFallback message={error.message} />;
      case 403:
        return <ForbiddenFallback message={error.message} />;
      case "network":
        return <NetworkErrorFallback message={error.message} />;
      default:
        return <div>Error desconocido.</div>;
    }
  }
  if (cases.length === 0) {
    return (
      <NoDataFoundFallback
        message="¡No se encontraron casos gestionados por usuarios.!"
        icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
      />
    );
  }
  // Flatten the data
  const flattenedRows = cases.flatMap((caseItem) => {
    if (caseItem.userCases.length === 0) {
      return [
        {
          idCase: caseItem.idCase,
          deadlineDate: caseItem.deadlineDate,
          receiptDate: caseItem.receiptDate,
          createdAt: caseItem.createdAt,
          sede: "N/A",
          instance: "N/A",
          installation: "N/A",
          dateProgress: "N/A",
          status: "N/A",
          comment: "N/A",
          createdBy: "N/A",
        },
      ];
    }

    return caseItem.userCases.map((userCase) => ({
      idCase: caseItem.idCase,
      deadlineDate: caseItem.deadlineDate.split("T")[0],
      receiptDate: caseItem.receiptDate.split("T")[0],
      createdAt: caseItem.createdAt.split("T")[0],
      sede: userCase.sede || "N/A",
      instance: userCase.instance || "N/A",
      installation: userCase.installation || "N/A",
      dateProgress: userCase.dateProgress.split("T")[0] || "N/A",
      status: userCase.status || "N/A",
      comment: userCase.comment || "N/A",
      createdBy: userCase.createdBy || "N/A",
    }));
  });
  const filteredRows = flattenedRows.filter((row) => {
    const matchesIdCase = row.idCase.toString().includes(filters.idCase); // Update this line
    const matchesStatus = row.status
      .toLowerCase()
      .includes(filters.status.toLowerCase());
    const matchesCreatedBy = row.createdBy
      .toLowerCase()
      .includes(filters.createdBy.toLowerCase().trim());

    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const rowDate = new Date(row.dateProgress);
    const deadlineDate = new Date(row.deadlineDate);

    const matchesStartDate = startDate ? rowDate >= startDate : true;
    const matchesEndDate = endDate ? rowDate <= endDate : true;
    const matchesOutOfDeadlineDate = outOfDeadline
      ? rowDate >= deadlineDate
      : true;

    return (
      matchesIdCase &&
      matchesStatus &&
      matchesCreatedBy &&
      matchesStartDate &&
      matchesEndDate &&
      matchesOutOfDeadlineDate
    );
  });

  function hanldeOutOfDeadline() {
    setOutOfDeadline(true);
  }
  const compareValues = (a, b, isDesc) =>
    a < b ? (isDesc ? 1 : -1) : a > b ? (isDesc ? -1 : 1) : 0;

  flattenedRows.sort((a, b) =>
    compareValues(a[orderBy], b[orderBy], order === "desc")
  );
  return (
    <>
      {cases.length === 0 ? (
        <NoDataFoundFallback
          message="¡No se encontraron casos gestionados por usuarios.!"
          icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
        />
      ) : (
        <>
          <form onSubmit={handleFilterSubmit(onSubmitFilters)}>
            <Grid2 container spacing={3} sx={{ marginBottom: 3, marginTop: 2 }}>
              <Grid2 size={{ xs: 2 }}>
                <TextFieldStyled
                  label="Id Caso"
                  name="idCase"
                  fullWidth
                  {...registerFilter("idCase")}
                />
              </Grid2>
              <Grid2 size={{ xs: 2 }}>
                <Select
                  label="Estado"
                  name="status"
                  defaultValue={""}
                  fullWidth
                  {...registerFilter("status")}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#fff", // Change the icon color to white
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "& .MuiSelect-select": {
                      color: "#fff", 
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione un estado</em>
                  </MenuItem>
                  <MenuItem value="CIF Bloqueado">CIF Bloqueado</MenuItem>
                  <MenuItem value="Tramitado">Tramitado</MenuItem>
                  <MenuItem value="Pdt sistema">Pdt sistema</MenuItem>
                  <MenuItem value="Automation">Automation</MenuItem>
                  <MenuItem value="Preselección-Vois">
                    Preselección-Vois
                  </MenuItem>
                </Select>
              </Grid2>
              <Grid2 size={{ xs: 2 }}>
                <TextFieldStyled
                  label="Creado por"
                  name="createdBy"
                  fullWidth
                  {...registerFilter("createdBy")}
                />
              </Grid2>
              <Grid2 size={{ xs: 2 }}>
                <TextFieldStyled
                  label="Fecha Inicio"
                  name="startDate"
                  type="date"
                  fullWidth
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },
                  }}
                  {...registerFilter("startDate")}
                />
              </Grid2>
              <Grid2 size={{ xs: 2 }}>
                <TextFieldStyled
                  label="Fecha Fin"
                  name="endDate"
                  type="date"
                  fullWidth
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },
                  }}
                  {...registerFilter("endDate")}
                />
              </Grid2>
              <Grid2
                size={{ xs: 2 }}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Filtrar
                </Button>
              </Grid2>
              <Grid2
                size={{ xs: 2 }}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  onClick={hanldeOutOfDeadline}
                  variant="contained"
                  color="error"
                >
                  FUERA DE PLAZO
                </Button>
              </Grid2>
            </Grid2>
          </form>
          {/* add projections */}
          <MultiSelect
            control={controlProjection}
            handleSubmit={handleProjectionSubmit}
            onSubmit={onSubmitProjection}
            onWatch={watch}
            handleReset={handleResetFilteredColumns}
          />
          {/* end projections */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {filteredColumns.map((column) => (
                      <TableCell
                        sx={{
                          bgcolor: indigo[100],
                          fontWeight: "bold",
                          fontSize: ".8rem",
                        }}
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        sortDirection={orderBy === column.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => {
                            const isAsc =
                              orderBy === column.id && order === "asc";
                            setOrder(isAsc ? "desc" : "asc");
                            setOrderBy(column.id);
                          }}
                        >
                          {column.label}
                          {orderBy === column.id ? (
                            <span style={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .sort((a, b) => {
                      const isDesc = order === "desc";
                      if (a[orderBy] < b[orderBy]) {
                        return isDesc ? 1 : -1;
                      }
                      if (a[orderBy] > b[orderBy]) {
                        return isDesc ? -1 : 1;
                      }
                      return 0;
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {filteredColumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{ color: "#9e9e9e", fontWeight: "bold" }}
                            >
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={flattenedRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0 16px",
                bgcolor: indigo[100],
                color: "#000",
                fontFamily: "Poppins",
                fontWeight: "bold",

                "& .MuiTablePagination-select": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 8px",
                },
                "& .MuiTablePagination-displayedRows": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 8px",
                },
                "& .MuiTablePagination-selectIcon": {
                  marginLeft: "8px",
                },
                "& .MuiTablePagination-actions": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "auto",
                },
                "& .css-pdct74-MuiTablePagination-selectLabel": {
                  display: "flex",
                  alignItems: "center",
                  margin: "0 8px",
                },
              }}
            />
          </Paper>
        </>
      )}
    </>
  );
}
