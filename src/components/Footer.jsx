import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1f2235',
        padding: '16px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: `calc(100% - 240px)`,
        ml: `240px`,
      }}
    >
      <Typography variant="body2" sx={{ color: '#fff', fontFamily: 'Poppins', fontWeight: 'bold' }}>
        © {new Date().getFullYear()} Ra. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
