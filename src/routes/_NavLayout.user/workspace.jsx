import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AddDataModal from "../../components/AddDataModal";

export const Route = createFileRoute("/_NavLayout/user/workspace")({
  component: WorkspaceLayout,
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
import { useQuery } from "@tanstack/react-query";
import getAllCasesApi from "../../services/getAllCasesApi";
import LoadingSpinner from "../../components/Spinners/LoadingSpinner";
import { Button } from "@mui/material";
import { blue, indigo } from "@mui/material/colors";
import { format } from "date-fns";
import UnauthenticatedFallback from "../../components/Auth/UnAuthenticated";
import NoDataFoundFallback from "../../components/fallbacks/NoDataFoundFallback";
import { SentimentDissatisfied } from "@mui/icons-material";

const columns = [
  {
    id: "idCase",
    label: "Id Caso",
    minWidth: 170,
  },

  {
    id: "deadlineDate",
    label: "Fecha Límite",
    minWidth: 170,
    align: "right",
    format: (value) => format(value, "yyyy/MM/dd"),
  },
  {
    id: "receiptDate",
    label: "Fecha Recipción",
    minWidth: 170,
    align: "right",
    format: (value) => format(value, "yyyy/MM/dd"),
  },
  {
    id: "createdAt",
    label: "Fecha Asignación",
    minWidth: 170,
    align: "right",
    format: (value) => format(value, "yyyy/MM/dd"),
  },
  { id: "actions", label: "Acciones", minWidth: 170, align: "center" },
];

// Sorting Logic
function descendingComparator(a, b, orderBy) {
  const dateA = new Date(a[orderBy]);
  const dateB = new Date(b[orderBy]);

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function WorkspaceLayout() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idCase");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState(null);
  console.log("editRow", editRow);

  const {
    data: rows,
    isPending: isFetchingCases,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllCases"],
    queryFn: getAllCasesApi,
  });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (row) => {
    setOpen(true);
    setEditRow(row);
  };
  function handleClose() {
    setOpen(false);
  }

  const handleDelete = (id) => {
    console.log(`Delete case with ID: ${id}`);
    // Implement delete functionality
  };

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <UnauthenticatedFallback message={error.message} />;
  }

  return (
    <>
      {rows.length === 0 ? (
        <NoDataFoundFallback
          message="¡No se encontraron casos asignados!"
          icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
        />
      ) : (
        <Paper sx={{ height: "80%", maxHeight: "80%", mt: 5 }}>
          <TableContainer sx={{ height: 500, maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      sx={{
                        bgcolor: indigo[100],
                        fontWeight: "bold",
                        color: "#333",
                        fontSize: 14,
                      }}
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
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
                {rows
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={row.idCase}
                      sx={{
                        "&:hover": {
                          backgroundColor: blue[50],
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <AddDataModal idCaso={row.idCase} />
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
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
            count={rows.length}
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
