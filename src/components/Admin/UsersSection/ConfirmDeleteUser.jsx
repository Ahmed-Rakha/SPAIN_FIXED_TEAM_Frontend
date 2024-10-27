import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, user }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{user?.firstName} {user?.lastName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
