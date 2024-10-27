import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  AddBox,
  Cancel,
  Save,
  Settings,
  PersonOff,
  People,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  PersonAddAlt,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getAllUsersApi from "../../../services/getAllUsersApi";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import addUserApi from "../../../services/addUserApi";
import "react-toastify/dist/ReactToastify.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import editUserApi from "../../../services/editUserApi";
import deleteUserApi from "../../../services/deleteUserApi";
import { cyan, grey } from "@mui/material/colors";
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner";
import { validationSchema } from "../../../validations/profileDetails.vm";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import NotFoundFallback from "../../../components/fallbacks/NotFoundFallback";
import NoDataFoundFallback from "../../../components/fallbacks/NoDataFoundFallback";
export const Route = createFileRoute("/_NavLayout/admin/users/")({
  component: UserManagementPage,
});

//
const dialogVariants = {
  hidden: { opacity: 0, y: "-20%" },
  visible: { opacity: 1, y: "0%" },
  exit: { opacity: 0, y: "-20%" },
};
export default function UserManagementPage() {
  const [open, setOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletedUser, setDeletedUser] = useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [showInitialPassword, setShowInitialPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type) => {
    if (type === "initial") {
      setShowInitialPassword(!showInitialPassword);
    } else if (type === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  const queryClient = useQueryClient();

  const {
    data: myUsers,
    isPending: isFetchingUsers,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersApi,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setOpen(true);
    reset(user);
  };

  const handleDelete = (user) => {
    setDeletedUser(user);
    setConfirmDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    deleteUserMutate(deletedUser._id);
    setConfirmDeleteDialogOpen(false);
  };

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: addUserApi,
    onSuccess: () => {
      toast.success("Usuario agregado exitosamente");
      queryClient.invalidateQueries(["users"]);
      setTimeout(() => {
        handleClose(false);
        reset();
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: editUserMutate, isPending: isUpdating } = useMutation({
    mutationFn: editUserApi,
    onSuccess: () => {
      toast.success("Datos del usuario actualizados exitosamente");
      queryClient.invalidateQueries(["users"]);
      setTimeout(() => {
        handleClose(false);
        reset();
        setEditingUserId(null);
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteUserMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success("Usuario eliminado exitosamente", {
        onClose: () => {
          setDeletedUser(null);
          queryClient.invalidateQueries(["users"]);
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    if (editingUserId) {
      editUserMutate({ ...data, _id: editingUserId });
    } else {
      mutate(data);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUserId(null);
    reset();
  };
  const handleOpen = () => {
    setOpen(true);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      phoneNumber: "",
    });
  };
  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialogOpen(false);
  };

  if (isFetchingUsers) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <NotFoundFallback />;
  }

  return (
    <>
      {myUsers.length === 0 ? (
        <NoDataFoundFallback
          message="¡No hay usuarios registrados actualmente! "
          icon={<PersonOff sx={{ fontSize: 60, color: "#ccc" }} />}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "#13162d",
              p: 3,
              mt: 0,
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "white", mb: 2, fontFamily: "Poppins" }}
            >
              <Settings /> Gestión de usuarios
            </Typography>
            <motion.div
              style={{ width: "max-content" }}
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 8px 15px rgba(0, 150, 0, 0.4)",
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <Button
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  mr: "auto",
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                }}
                variant="contained"
                startIcon={<AddBox />}
                color="success"
                onClick={handleOpen}
              >
                Añadir usuario
              </Button>
            </motion.div>
            {myUsers?.length > 0 ? (
              <>
                <Typography
                  variant="h6"
                  my={2.3}
                  sx={{
                    color: "#fff",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <People sx={{ fontSize: "1.5rem", color: "#fff" }} />
                  Lista de usuarios:
                </Typography>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TableContainer
                    sx={{
                      height: 440,
                      maxHeight: 440,
                      overflow: "auto",

                      webkitOverflowScrolling: "touch",

                      "&::-webkit-scrollbar": {
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#ddd",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "50%",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover::-webkit-scrollbar-thumb": {
                        backgroundColor: "#9c27b0",
                      },
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "#cfc7f3",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                            }}
                          >
                            Nombre
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                            }}
                          >
                            Apellido
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                            }}
                          >
                            Correo Electrónico
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                            }}
                          >
                            Número de teléfono
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                            }}
                          >
                            Role
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                              fontSize: "1.1rem",
                              textAlign: "center",
                            }}
                          >
                            Gestión
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myUsers.map((user) => (
                          <TableRow
                            key={user._id}
                            sx={{
                              bgcolor: "#fff",
                              "&:hover": { backgroundColor: cyan[50] },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                fontFamily: "Poppins",
                                color: grey[500],
                              }}
                            >
                              {user.firstName}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                fontFamily: "Poppins",
                                color: grey[500],
                              }}
                            >
                              {user.lastName}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                fontFamily: "Poppins",
                                color: grey[500],
                              }}
                            >
                              {user.email}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                fontFamily: "Poppins",
                                color: grey[500],
                              }}
                            >
                              {user.phoneNumber}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                fontFamily: "Poppins",
                                color: grey[500],
                              }}
                            >
                              {user.role}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                variant="contained"
                                onClick={() => handleEdit(user)}
                                startIcon={<Edit />}
                                sx={{
                                  mr: 1,
                                  fontFamily: "Poppins",
                                  fontWeight: "bold",
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                sx={{
                                  fontFamily: "Poppins",
                                  fontWeight: "bold",
                                }}
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(user)}
                                startIcon={<Delete />}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </motion.div>
              </>
            ) : (
              <NoDataFoundFallback
                message="¡No hay usuarios registrados actualmente! "
                icon={<PersonOff sx={{ fontSize: 60, color: "#ccc" }} />}
              />
            )}
            {/* Dialog for adding/editing users */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                  height: 677,
                  overflow: "auto",
                }}
              >
                <DialogTitle
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {editingUserId ? "Editar Usuario" : "Añadir Usuario"}
                </DialogTitle>
                <DialogContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      margin="dense"
                      label="Nombre"
                      fullWidth
                      variant="outlined"
                      error={!!errors.firstName}
                      helperText={
                        errors.firstName ? errors.firstName.message : ""
                      }
                      {...register("firstName")}
                    />
                    <TextField
                      margin="dense"
                      label="Apellido"
                      fullWidth
                      variant="outlined"
                      error={!!errors.lastName}
                      helperText={
                        errors.lastName ? errors.lastName.message : ""
                      }
                      {...register("lastName")}
                    />
                    <TextField
                      margin="dense"
                      label="Correo Electrónico"
                      fullWidth
                      variant="outlined"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ""}
                      {...register("email")}
                    />
                    <TextField
                      margin="dense"
                      label="Número de Teléfono"
                      fullWidth
                      variant="outlined"
                      error={!!errors.phoneNumber}
                      helperText={
                        errors.phoneNumber ? errors.phoneNumber.message : ""
                      }
                      {...register("phoneNumber")}
                    />
                    <TextField
                      margin="dense"
                      label="Role"
                      fullWidth
                      variant="outlined"
                      error={!!errors.role}
                      helperText={errors.role ? errors.role.message : ""}
                      {...register("role")}
                    />
                    {!editingUserId && (
                      <>
                        <TextField
                          margin="dense"
                          label="Password"
                          fullWidth
                          variant="outlined"
                          type={showInitialPassword ? "text" : "password"}
                          error={!!errors.password}
                          helperText={
                            errors.password ? errors.password.message : ""
                          }
                          {...register("password")}
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
                                    onClick={() =>
                                      handleClickShowPassword("initial")
                                    }
                                    edge="end"
                                  >
                                    {showInitialPassword ? (
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
                        <TextField
                          margin="dense"
                          label="Confirmar Password"
                          fullWidth
                          variant="outlined"
                          type={showConfirmPassword ? "text" : "password"}
                          error={!!errors.confirmPassword}
                          helperText={
                            errors.confirmPassword
                              ? errors.confirmPassword.message
                              : ""
                          }
                          {...register("confirmPassword")}
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
                                    onClick={() =>
                                      handleClickShowPassword("confirm")
                                    }
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
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
                      </>
                    )}

                    <TextField
                      margin="dense"
                      fullWidth
                      variant="outlined"
                      hidden
                      {...register("isEditing")}
                      defaultValue={editingUserId ? true : false}
                    />
                    <DialogActions>
                      <Button
                        variant="contained"
                        onClick={handleClose}
                        color="error"
                        startIcon={<Cancel />}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={
                          editingUserId && Object.keys(dirtyFields).length === 0
                        }
                        startIcon={<PersonAddAlt />}
                      >
                        {editingUserId ? "Actualizar" : "Añadir"}
                      </Button>
                      {(isCreating || isUpdating) && (
                        <CircularProgress size={24} color="success" />
                      )}
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
            {/* Dialog for confirmation deletion */}
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
                  ¿Estás seguro de que deseas eliminar al usuario{" "}
                  <strong>
                    {deletedUser?.firstName} {deletedUser?.lastName}
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
            {/* <ToastContainer position="top-center" autoClose={2000}/> */}
          </Box>
        </motion.div>
      )}
    </>
  );
}
