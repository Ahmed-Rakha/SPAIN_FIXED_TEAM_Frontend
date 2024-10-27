import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function UserDialog({ open, onClose, onSubmit, isEditing = false }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar Usuario' : 'Añadir Usuario'}</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          {/* Form Fields */}
          <TextField label="Nombre" fullWidth margin="dense" required />
          {/* Add other fields similarly */}
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Actualizar' : 'Añadir'}</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
