import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
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
  Button,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getHandledCasesByUsers from "../../services/getHandledCasesByUsers";
import LoadingSpinner from "../../components/Spinners/LoadingSpinner";
import UnauthenticatedFallback from "../../components/Auth/UnAuthenticated";
import { blue, green, grey, indigo, red } from "@mui/material/colors";
import EditModalByUser from "../../components/modals/EditModalByUser";
import AddDataModal from "../../components/AddDataModal";
import { set } from "react-hook-form";
import { SentimentDissatisfied } from "@mui/icons-material";
import NoDataFoundFallback from "../../components/fallbacks/NoDataFoundFallback";
export const Route = createFileRoute("/_NavLayout/user/handled-cases")({
  component: HandledCasesByUser,
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
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    boxShadow: theme.shadows[3],
    fontSize: "0.875rem",
  },
}));
export default function HandledCasesByUser() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("idCase");
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  // call api to get all cases
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
  console.log("getCasesHandledByUser", cases);

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

  const filteredCases = cases.filter((caseItem) =>
    Object.values(caseItem).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedCases = filteredCases.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedCases = sortedCases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {cases.length === 0 ? (
        <NoDataFoundFallback
          message="¡No se encontraron casos gestionados!"
          icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
        />
      ) : (
        <Paper sx={{ height: "80%", maxHeight: "80%", mt: 5 }}>
          <StyledTextField
            variant="outlined"
            placeholder="Filtrar..."
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              margin: "16px",
              border: "1px solid #ccc",
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              color: "#333",
              fontSize: "1.8rem",
            }}
          />
          <TableContainer sx={{ height: 404, maxHeight: 404 }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: indigo[200] }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === "idCase"}
                      direction={orderBy === "idCase" ? order : "asc"}
                      onClick={() => handleRequestSort("idCase")}
                    >
                      ID Caso
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === "sede"}
                      direction={orderBy === "sede" ? order : "asc"}
                      onClick={() => handleRequestSort("sede")}
                    >
                      Sede
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === "instance"}
                      direction={orderBy === "instance" ? order : "asc"}
                      onClick={() => handleRequestSort("instance")}
                    >
                      Instancia
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === "installation"}
                      direction={orderBy === "installation" ? order : "asc"}
                      onClick={() => handleRequestSort("installation")}
                    >
                      Installación
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === "dateProgress"}
                      direction={orderBy === "dateProgress" ? order : "asc"}
                      onClick={() => handleRequestSort("dateProgress")}
                    >
                      Fecha Progreso
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Motivo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Gestionado Por
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCases.map((caseItem) => (
                  <TableRow
                    key={caseItem._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: blue[50],
                      },
                    }}
                  >
                    <TableCell>{caseItem.idCase}</TableCell>
                    <TableCell>{caseItem.sede}</TableCell>
                    <TableCell>{caseItem.instance}</TableCell>
                    <TableCell>{caseItem.installation}</TableCell>
                    <TableCell>
                      {new Date(caseItem.dateProgress).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>{caseItem.status}</TableCell> */}
                    <TableCell>
                      <CustomTooltip
                        title={
                          <div>
                            <strong style={{ color: green[500] }}>
                              Current:
                            </strong>
                            <span style={{ color: grey[500] }}>
                              {" "}
                              {caseItem.status || "N/A"}
                            </span>
                            <br />
                            <strong style={{ color: red[500] }}>
                              Previous:
                            </strong>
                            <span style={{ color: grey[500] }}>
                              {" "}
                              {caseItem.previousStatus || "N/A"}
                            </span>
                            <br />
                            <strong style={{ color: indigo[500] }}>
                              Modified on:
                            </strong>
                            {caseItem.lastModified ? (
                              <span style={{ color: grey[500] }}>
                                {" "}
                                {new Date(
                                  caseItem.lastModified
                                ).toLocaleString()}
                              </span>
                            ) : (
                              <span style={{ color: grey[500] }}> N/A</span>
                            )}
                          </div>
                        }
                        arrow
                        placement="top"
                      >
                        <span>{caseItem.status}</span>
                      </CustomTooltip>
                    </TableCell>
                    <TableCell>{caseItem.comment}</TableCell>
                    <TableCell>{caseItem.createdBy}</TableCell>
                    <TableCell>
                      <EditModalByUser targetCase={caseItem} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 10, 25]}
            component="div"
            count={sortedCases.length}
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
