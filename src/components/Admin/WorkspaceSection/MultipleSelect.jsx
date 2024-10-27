import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Grid2, FormControl } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import getAllUsersApi from '../../../services/getAllUsersApi';
import LoadingSpinner from '../../Spinners/LoadingSpinner';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  const {
    data: users,
    isPending: isFetchingUsers,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsersApi,
  });

  if (isFetchingUsers) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Could not fetch users</div>;
  }

  return (
    <Grid2 size={{ xs: 12, md: 12 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">Asignar a</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Asignar a" />}
          renderValue={(selected) => (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                maxHeight: '60px',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.grey[200],
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {users.map((user) => (
            <MenuItem
              key={user._id}
              value={`${user.email}`}
              style={{
                backgroundColor: personName.includes(user.email)
                  ? theme.palette.primary.main
                  : 'transparent',
                color: personName.includes(user.email) ? '#fff' : 'inherit',
                margin: '0 4px 4px 0',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid2>
  );
}
