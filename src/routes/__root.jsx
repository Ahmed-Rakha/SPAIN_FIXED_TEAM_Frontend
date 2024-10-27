import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Box, CssBaseline } from '@mui/material';

import CustomLayout from '../layouts/customLayout';

export const Route = createRootRoute({
  component: () => (
    <>
      {/* <Box sx={{ display: 'flex' }}> */}
      {/* <CssBaseline />
      <CustomLayout> */}
      <Outlet />
      {/* </CustomLayout> */}
      {/* </Box> */}
    </>
  ),
});
