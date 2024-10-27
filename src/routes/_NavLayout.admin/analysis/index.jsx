import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
  TablePagination,
  styled,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner";
import UnauthenticatedFallback from "../../../components/Auth/UnAuthenticated";
import { blue, indigo } from "@mui/material/colors";
import { getHandledCasesByUsersApi } from "../../../services/getHandledCasesByUsersApi";
import NoDataFoundFallback from "../../../components/fallbacks/NoDataFoundFallback";
import { SentimentDissatisfied } from "@mui/icons-material";
import { generateSummaryArrayForHandledCasesByUsers } from "../../../utils/helper";

export const Route = createFileRoute("/_NavLayout/admin/analysis/")({
  component: Analysis,
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: "16px",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f7f7f7",
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#aaa",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputBase-input": {
    color: "#333",
    fontSize: "1.2rem",
  },
}));

export default function Analysis() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("idCase");
  const [filterText1, setFilterText1] = useState("");
  const [filterText2, setFilterText2] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Fetch data
  const {
    data: cases,
    isPending: isFetchingCases,
    isError,
    error,
  } = useQuery({
    queryKey: ["getCasesHandledByUsersApi"],
    queryFn: getHandledCasesByUsersApi,
  });

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <UnauthenticatedFallback message={error.message} />;
  }

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Generate summary array
  const summaryArray = generateSummaryArrayForHandledCasesByUsers(cases);

  // Filter and sort summaryArray based on two filter texts
  const filteredCases = summaryArray.filter((caseItem) => {
    const formattedDate = new Date(caseItem.dateProgress).toLocaleDateString();
    const matchesFilter1 = Object.values({
      ...caseItem,
      dateProgress: formattedDate,
    }).some((value) =>
      String(value).toLowerCase().includes(filterText1.toLowerCase())
    );
    const matchesFilter2 = Object.values({ ...caseItem }).some((value) =>
      String(value).toLowerCase().includes(filterText2.toLowerCase())
    );

    return (
      (filterText1 === "" || matchesFilter1) &&
      (filterText2 === "" || matchesFilter2)
    );
  });

  const sortedCases = filteredCases.sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy in a.statusCounts) {
      aValue = a.statusCounts[orderBy] || 0;
      bValue = b.statusCounts[orderBy] || 0;
    }

    if (orderBy === "dateProgress") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  const paginatedCases = sortedCases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate total cases handled
  const totalHandledCases = sortedCases.reduce((total, caseItem) => {
    return (
      total +
      Object.values(caseItem.statusCounts).reduce(
        (sum, count) => sum + count,
        0
      )
    );
  }, 0);

  return (
    <>
      {cases.length === 0 ? (
        <NoDataFoundFallback
          message="¡No se encontraron casos gestionados por usuarios!"
          icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
        />
      ) : (
        <Paper
          sx={{ height: "80%", maxHeight: "80%", overflow: "auto", mt: 5 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <StyledTextField
                variant="outlined"
                placeholder="Filtrar por valor 1..."
                onChange={(e) => setFilterText1(e.target.value)}
              />
              <StyledTextField
                variant="outlined"
                placeholder="Filtrar por valor 2..."
                onChange={(e) => setFilterText2(e.target.value)}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                padding: 2,
                fontWeight: "bold",
                backgroundColor: "#f0f4ff",
                borderRadius: "8px",
                margin: "16px 0",
                boxShadow: 1,
                color: blue[800],
                fontSize: ".9rem",
                marginRight: 3,
                
                "&:hover": {
                  backgroundColor: "#f0f4ff",
                  color: blue[800],
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                  textDecorationColor: blue[800],
                  textDecorationThickness: "2px",
                  textDecorationStyle: "solid",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.3s ease",
                  transform: "scale(1.02)",
                
                }
              }}
            >
              Total de casos gestionados: {totalHandledCases}
            </Typography>
          </Box>

          <TableContainer sx={{ height: 407, maxHeight: 407 }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: indigo[200] }}>
                  {[
                    "Id Caso",
                    "Tramitado",
                    "Preseleccion-Vois",
                    "Automation",
                    "Cif Bloqueado",
                    "PDT Sistema",
                    "Total",
                    "Fecha de Progreso",
                    "Nombre de Usuario",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ fontWeight: "bold", fontSize: ".76rem" }}
                    >
                      <TableSortLabel
                        active={orderBy === header}
                        direction={orderBy === header ? order : "asc"}
                        onClick={() => handleRequestSort(header)}
                      >
                        {header}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCases.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "red",
                      }}
                    >
                      Al parecer, no hay coincidencias para tu búsqueda !
                    </TableCell>
                  </TableRow>
                )}
                {paginatedCases.map((caseItem, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:hover": { backgroundColor: blue[50] } }}
                  >
                    <TableCell>{caseItem.idCase}</TableCell>
                    <TableCell>
                      {caseItem.statusCounts["tramitado"] || 0}
                    </TableCell>
                    <TableCell>
                      {caseItem.statusCounts["preselección-vois"] || 0}
                    </TableCell>
                    <TableCell>
                      {caseItem.statusCounts["automation"] || 0}
                    </TableCell>
                    <TableCell>
                      {caseItem.statusCounts["cif bloqueado"] || 0}
                    </TableCell>
                    <TableCell>
                      {caseItem.statusCounts["pdt sistema"] || 0}
                    </TableCell>
                    <TableCell>
                      {Object.values(caseItem.statusCounts).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(caseItem.dateProgress).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{caseItem.userName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 10, 25]}
            component="div"
            count={filteredCases.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
      )}
    </>
  );
}
