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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getHandledCasesByUsers from "../../services/getHandledCasesByUsers";
import LoadingSpinner from "../../components/Spinners/LoadingSpinner";
import UnauthenticatedFallback from "../../components/Auth/UnAuthenticated";
import { blue, indigo } from "@mui/material/colors";

export const Route = createFileRoute("/_NavLayout/user/analysis")({
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
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Fetch data
  const {
    data: cases,
    isPending: isFetchingCases,
    isError,
    error,
  } = useQuery({
    queryKey: ["getCasesHandledByUser"],
    queryFn: getHandledCasesByUsers,
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

  const summaryByDateAndCase = {};
  cases.forEach((caseItem) => {
    const { dateProgress, idCase, status } = caseItem;
    const normalizedStatus = status.toLowerCase();

    if (!summaryByDateAndCase[dateProgress]) {
      summaryByDateAndCase[dateProgress] = {};
    }

    if (!summaryByDateAndCase[dateProgress][idCase]) {
      summaryByDateAndCase[dateProgress][idCase] = {};
    }

    summaryByDateAndCase[dateProgress][idCase][normalizedStatus] =
      (summaryByDateAndCase[dateProgress][idCase][normalizedStatus] || 0) + 1;
  });

  const summaryArray = Object.entries(summaryByDateAndCase).flatMap(
    ([date, cases]) =>
      Object.entries(cases).map(([idCase, statusCounts]) => ({
        dateProgress: date,
        idCase,
        statusCounts,
      }))
  );
console.log('summaryArray', summaryArray);

  // Filter and sort summaryArray
  const filteredCases = summaryArray.filter((caseItem) => {
    const formattedDate = new Date(caseItem.dateProgress).toLocaleDateString(); // Convert to string
    return Object.values({ ...caseItem, dateProgress: formattedDate }).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const sortedCases = filteredCases.sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
  
    // Handle nested data for `statusCounts`
    if (orderBy in a.statusCounts) {
      aValue = a.statusCounts[orderBy] || 0;
      bValue = b.statusCounts[orderBy] || 0;
    }
  
    // Convert dateProgress to Date objects if sorting by dates
    if (orderBy === "dateProgress") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
  
    // Sorting logic for strings, numbers, and dates
    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0; // Default case when values are not comparable
    }
  });
  

  const paginatedCases = sortedCases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
console.log(summaryArray);
console.log('paginatedCases', paginatedCases);

  return (
    <Paper sx={{ height: "80%", maxHeight: "80%", overflow: "auto", mt: 5 }}>
      <StyledTextField
        variant="outlined"
        placeholder="Filtrar..."
        onChange={(e) => setFilterText(e.target.value)}
      />
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
                'Total',
                "Fecha de Progreso",
              ].map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold", fontSize: ".9rem", }}>
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
                  colSpan={7}
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
                <TableCell>{caseItem.statusCounts["tramitado"] || 0}</TableCell>
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
                <TableCell>{Object.values(caseItem.statusCounts).reduce((a, b) => a + b, 0)}</TableCell>
                <TableCell>
                  {new Date(caseItem.dateProgress).toLocaleDateString()}
                </TableCell>
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
  );
}
