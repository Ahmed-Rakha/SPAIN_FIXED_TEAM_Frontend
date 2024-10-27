import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import getAllCasesApi from '../../services/getAllCasesApi';
import LoadingSpinner from '../Spinners/LoadingSpinner';
import { Button } from '@mui/material';
import { indigo } from '@mui/material/colors';
import AddCaseByAdminModal from '../modals/AddCaseByAdminModal';
import { format } from 'date-fns';
import EditCaseModalByAdmin from '../modals/EditCaseModalByAdmin';

const columns = [
  {
    id: 'idCase',
    label: 'Id Caso',
    minWidth: 170,
  },

  {
    id: 'deadlineDate',
    label: 'Fecha Límite',
    minWidth: 170,
    align: 'right',
    format: (value) => format(value, 'yyyy/MM/dd'),
  },
  {
    id: 'receiptDate',
    label: 'Fecha Recipción',
    minWidth: 170,
    align: 'right',
    format: (value) => format(value, 'yyyy/MM/dd'),
  },
  {
    id: 'createdAt',
    label: 'Fecha Asignación',
    minWidth: 170,
    align: 'right',
    format: (value) => format(value, 'yyyy/MM/dd'),
  },
  { id: 'actions', label: 'Acciones', minWidth: 170, align: 'center' },
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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function AddedCasesTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('idCase');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState(null);
  console.log('editRow', editRow);

  const { data: rows, isPending: isFetchingCases } = useQuery({
    queryKey: ['getAllCases'],
    queryFn: getAllCasesApi,
  });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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

  const handleDelete = (id) => {
    console.log(`Delete case with ID: ${id}`);
    // Implement delete functionality
  };

  if (isFetchingCases) {
    return <LoadingSpinner />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{ bgcolor: indigo[100] }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                    {orderBy === column.id ? (
                      <span style={visuallyHidden}>
                        {order === 'desc'
                          ? 'sorted descending'
                          : 'sorted ascending'}
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.idCase}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            variant="outlined"
                            onClick={() => handleEdit(row)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(row.idCase)}
                            style={{ marginLeft: '8px' }} // Add some margin
                          >
                            Eliminar
                          </Button>
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 16px',
          bgcolor: indigo[100],
          color: '#000',
          fontFamily: 'Poppins',
          fontWeight: 'bold',

          '& .MuiTablePagination-select': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px',
          },
          '& .MuiTablePagination-displayedRows': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px',
          },
          '& .MuiTablePagination-selectIcon': {
            marginLeft: '8px',
          },
          '& .MuiTablePagination-actions': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
          },
          '& .css-pdct74-MuiTablePagination-selectLabel': {
            display: 'flex',
            alignItems: 'center',
            margin: '0 8px',
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
  );
}
