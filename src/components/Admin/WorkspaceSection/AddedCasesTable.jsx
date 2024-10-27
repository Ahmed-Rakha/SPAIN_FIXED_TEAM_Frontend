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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getAllCasesApi from "../../../services/getAllCasesApi";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { cyan, indigo } from "@mui/material/colors";
import { format } from "date-fns";
import EditCaseModalByAdmin from "../../modals/EditCaseModalByAdmin";
import deleteCaseByAdmin from "../../../services/deleteCaseByAdmin";
import { toast } from "react-toastify";
import NoDataFoundFallback from "../../fallbacks/NoDataFoundFallback";
import { Cancel, Delete, Edit, SentimentDissatisfied } from "@mui/icons-material";
import UnauthenticatedFallback from "../../fallbacks/UnauthenticatedFallback";
import { motion } from "framer-motion";
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
    align: "center",
    format: (value) => format(value, "yyyy/MM/dd"),
  },
  {
    id: "receiptDate",
    label: "Fecha Recipción",
    minWidth: 170,
    align: "center",
    format: (value) => format(value, "yyyy/MM/dd"),
  },
  {
    id: "createdAt",
    label: "Fecha Asignación",
    minWidth: 170,
    align: "center",
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
// Variants for animation
const dialogVariants = {
  hidden: { opacity: 0, y: "-20%" },
  visible: { opacity: 1, y: "0%" },
  exit: { opacity: 0, y: "-20%" },
};
export default function AddedCasesTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idCase");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = React.useState(false);
const [caseIdToDelete, setCaseIdToDelete] = React.useState({});

  const queryClient = useQueryClient();
  const {
    data: rows,
    isPending: isFetchingCases,
    isError,
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
    // console.log(`Edit case with ID: ${row}`);
    // Implement edit functionality
  };
  function handleClose() {
    setOpen(false);
  }
  const { mutate: deleteCase, isPending: isDeleting } = useMutation({
    mutationFn: deleteCaseByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllCases"] });
      toast.success("Caso eliminado exitosamente");
    },
  });
  const handleDelete = (id, idCaseGrande) => {
    setCaseIdToDelete({id, idCaseGrande});
    setConfirmDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    
    deleteCase(caseIdToDelete.id);
    setConfirmDeleteDialogOpen(false);
  };
  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialogOpen(false);
  };

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <UnauthenticatedFallback />;
  }
  return (
    <>
      {rows.length === 0 ? (
        <NoDataFoundFallback
          message="¡No hay casos agregados!"
          icon={<SentimentDissatisfied sx={{ fontSize: 70, color: "#ccc" }} />}
        />
      ) : (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        transition={{ duration: 0.3 }} 
      >
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      sx={{
                        bgcolor: indigo[100],
                        fontWeight: "bold",
                        fontSize: "1rem",
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
                      component={motion.tr}
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 20 }} 
                      transition={{ duration: 0.3 }} 
                      role="checkbox"
                      tabIndex={-1}
                      key={row.idCase}
                      sx={{
                        "&:hover": {
                          backgroundColor: cyan[50],
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant="contained"
                                onClick={() => handleEdit(row)}
                                startIcon={<Edit />}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(row._id, row.idCase)}
                                style={{ marginLeft: "8px" }} 
                                startIcon={<Delete />}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          );
                        }
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
          {/* AddCaseByAdminModal */}
          <EditCaseModalByAdmin
            open={open}
            handleClose={handleClose}
            targetCase={editRow}
          />
        </Paper>
        </motion.div>
      )}
       <Dialog
          open={confirmDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          TransitionComponent={motion.div}
          TransitionProps={{
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants: dialogVariants,
            transition: { type: "spring", stiffness: 200, damping: 20 },
          }}
        >
          <DialogTitle
            component={motion.div}
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Confirmar eliminación
          </DialogTitle>
          <DialogContent
            component={motion.div}
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Typography>
              ¿Estás seguro de que deseas eliminar al caso grande{" "}
              <strong>
                {caseIdToDelete?.idCaseGrande}
              </strong>
              ?
            </Typography>
            <Typography
              sx={{
                mt: 2,
                fontSize: "0.8rem",
                color: "red",
                fontWeight: "bold",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Esta operación no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleCloseDeleteDialog}
              color="secondary"
              startIcon={<Cancel />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={onConfirmDelete}
              color="error"
              disabled={isDeleting}
              startIcon={<Delete />}
            >
              Eliminar
            </Button>
            {isDeleting && <CircularProgress size={24} color="error" />}
          </DialogActions>
        </Dialog>
    </>
  );
}
