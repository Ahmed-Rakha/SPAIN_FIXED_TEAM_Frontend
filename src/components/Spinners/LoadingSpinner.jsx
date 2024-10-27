import { CSpinner } from '@coreui/react';
import { Box } from '@mui/material';
import '@coreui/coreui/dist/css/coreui.min.css';
export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CSpinner color="primary" variant="grow" />
      <CSpinner color="secondary" variant="grow" />
      <CSpinner color="success" variant="grow" />
      <CSpinner color="danger" variant="grow" />
      <CSpinner color="warning" variant="grow" />
      <CSpinner color="info" variant="grow" />
      <CSpinner color="light" variant="grow" />
      <CSpinner color="dark" variant="grow" />
    </Box>
  );
}
