import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  MenuItem,
} from '@mui/material';
import { Menu, AccountCircle } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import BasicMenu from '../components/HeaderDropDownMenu';
const greyBgColor = grey[900];

export default function DashboardHeader() {
  function onMenuClick() {
    console.log('Menu clicked');
  }
  return (
    <AppBar position="fixed" sx={{ backgroundColor: greyBgColor }}>
      <Toolbar>
        {/* Menu Icon for mobile view */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Spain Fixed Team
        </Typography>

        {/* Dropdown Menu */}
        <BasicMenu />
      </Toolbar>
    </AppBar>
  );
}
