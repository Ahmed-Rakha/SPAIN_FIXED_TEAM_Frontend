import { Box, CssBaseline } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import CustomLayout from '../layouts/customLayout';

export const Route = createFileRoute('/_NavLayout')({
  component: NavLayout,
});

export default function NavLayout() {
  return (
    <>
      <Box sx={{ display: 'flex', }}>
        <CssBaseline />
        <CustomLayout>
          <Outlet />
        </CustomLayout>
      </Box>
    </>
  );
}
