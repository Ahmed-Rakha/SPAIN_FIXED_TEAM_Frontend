import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Grid,
  Button,
  Typography,
  styled,
  Grid2,
  FormControl,
} from '@mui/material';
import MultipleSelect from '../Admin/WorkspaceSection/MultipleSelect';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import addCaseByAdminApi from '../../services/addCaseByAdminApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddBox, Cancel } from '@mui/icons-material';

// Styled components for better design
const StyledDialogTitle = styled(DialogTitle)({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  backgroundColor: '#1976d2',
  color: '#fff',
  padding: '16px 24px',
  borderBottom: '2px solid #e0e0e0',
});

const StyledButton = styled(Button)({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  //   textTransform: 'none',
  marginTop: '16px',
});

export default function AddCaseByAdminModal({ open, handleClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
  };
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: addCaseByAdminApi,
    onSuccess: () => {
      console.log('Caso agregado exitosamente');
      toast.success('Caso agregado exitosamente');
      queryClient.invalidateQueries(['getAllCases']);
      setTimeout(() => {
        handleClose();
        reset();
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledDialogTitle>AÑADIR CASO</StyledDialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <form style={{ marginTop: 10 }} onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                label="Id Caso"
                variant="outlined"
                fullWidth
                error={!!errors.idCase}
                helperText={errors.idCase ? errors.idCase.message : ''}
                {...register('idCase', {
                  required: {
                    value: true,
                    message: 'Este campo es requerido',
                  },
                })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                label="Fecha Límite"
                variant="outlined"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
                error={!!errors.deadlineDate}
                helperText={
                  errors.deadlineDate ? errors.deadlineDate.message : ''
                }
                {...register('deadlineDate', {
                  required: {
                    value: true,
                    message: 'Este campo es requerido',
                  },
                })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                label="Fecha Recepción"
                variant="outlined"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
                error={!!errors.receiptDate}
                helperText={
                  errors.receiptDate ? errors.receiptDate.message : ''
                }
                {...register('receiptDate', {
                  required: {
                    value: true,
                    message: 'Este campo es requerido',
                  },
                })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <MultipleSelect />
            </Grid2>
          </Grid2>

          {/* Button Container */}
          <Grid2 container spacing={2} style={{ marginTop: '16px' }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
              <StyledButton
                onClick={handleClose}
                variant="contained"
                color="error"
                fullWidth
                startIcon={<Cancel />}
              >
                Cancelar
              </StyledButton>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <StyledButton
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                startIcon={<AddBox />}
              >
                Añadir
              </StyledButton>
            </Grid2>
           
          </Grid2>
        </form>
      </DialogContent>
      {/* TOAST */}
      <ToastContainer position="top-right" />
    </Dialog>
  );
}
