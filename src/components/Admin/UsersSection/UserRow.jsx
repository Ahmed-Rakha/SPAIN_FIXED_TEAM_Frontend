import { TableCell, TableRow, Button } from '@mui/material';

export default function UserRow({ user, onEdit, onDelete }) {
  return (
    <TableRow key={user._id}>
      <TableCell>{user.firstName}</TableCell>
      <TableCell>{user.lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Button onClick={() => onEdit(user)}>Editar</Button>
        <Button onClick={() => onDelete(user)}>Eliminar</Button>
      </TableCell>
    </TableRow>
  );
}
