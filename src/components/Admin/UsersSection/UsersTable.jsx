import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UserRow from '../../../components/Admin/UsersSection/UserRow';

export default function UserTable({ myUsers, onEdit, onDelete }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Correo Electrónico</TableCell>
            <TableCell>Número de Teléfono</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Gestión</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {myUsers.map((user) => (
            <UserRow key={user._id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
