import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  Settings,
  ExitToApp,
  TableBar,
  TableChartOutlined,
  TableChart,
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { Link } from '@tanstack/react-router';

const sidebarWidth = 240;
const greyBgColor = grey[900];

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          position: 'fixed',
          top: 64,
          height: 'calc(100vh - 64px)',
          backgroundColor: greyBgColor,
          color: 'white',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon sx={{ color: 'white' }}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ color: 'white' }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ color: 'white' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ color: 'white' }}>
            <TableChartOutlined />
          </ListItemIcon>
          <Link
            to="/user/workspace/"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            <ListItemText primary="Tables" />
          </Link>
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ color: 'white' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
