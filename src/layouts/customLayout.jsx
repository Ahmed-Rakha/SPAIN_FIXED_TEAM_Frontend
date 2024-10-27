import * as React from "react";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
  Toolbar,
  AppBar,
  InputBase,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

import {
  Settings,
  Dashboard,
  Widgets,
  Person,
  Work,
  TableChart,
  Group,
  Assessment,
  Logout,
  ArrowBack,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import Footer from "../components/Footer";
import { logout } from "../services/logout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getProfileDetails } from "../services/getProfileDetails";
import LoadingSpinner from "../components/Spinners/LoadingSpinner";
import { toast } from "react-toastify";

//  declare variables
const drawerWidth = 240;
const iconMap = {
  Dashboard: <Dashboard />,
  Analysis: <Assessment />,
  Profile: <Person />,
  Workspace: <Work />,
  Tables: <TableChart />,
  Users: <Group />,
  "Handled-Cases": <Widgets />,
  Logout: <Logout />,
};
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export default function CustomLayout({ children }) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/")[2];
  const {
    data: user,
    isPending: isFetchingUser,
  } = useQuery({
    queryKey: ["profileDetails"],
    queryFn: getProfileDetails,
  });
  console.log(user);
const handleProfileClick = () => {
  if (role === "admin") {
    navigate({ to: "/admin/profile" });
  } else {
    navigate({ to: "/user/profile" });
  }
  setSettingsOpen(false);

}
  // Toggle settings dropdown
  const handleSettingsToggle = () => {
    setSettingsOpen((prev) => !prev);
  };
  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente", {
        onClose: () => {
          window.location.href = "/";
          setSettingsOpen(false);
        },
      });
      localStorage.removeItem("role");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
if (!isFetchingUser) {
  console.log(user.picture);}

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#1f2235",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <List>
          {(role === "admin"
            ? [
                "Dashboard",
                "Analysis",
                "Profile",
                "Workspace",
                "Tables",
                "Users",
                "Logout",
              ]
            : [
                "Dashboard",
                "Analysis",
                "Profile",
                "Workspace",
                "Handled-Cases",
                "Logout",
              ]
          ).map((text, index) => (
            <ListItem
              key={text}
              component={text === "Logout" ? "div" : Link}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
              to={
                text === "Logout"
                  ? "#"
                  : role === "admin"
                    ? `/admin/${text.toLowerCase()}`
                    : `/user/${text.toLowerCase()}`
              }
              onClick={text === "Logout" ? handleLogout : undefined}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                {iconMap[text]}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ ml: -1.8 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#1f2235",
          paddingBlock: "5px",

          
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              textTransform: "uppercase",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {currentPath}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isFetchingUser ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{
                  textTransform: "uppercase",
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  background: "linear-gradient(90deg, #4a90e2, #d97a35)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  fontSize: "1.5rem",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #d97a35, #4a90e2)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                Bienvenid@ {user?.firstName + " " + user?.lastName}
              </Typography>
            </motion.div>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={handleSettingsToggle}>
              <Settings />
            </IconButton>
            {!isFetchingUser && (
               <Avatar
               alt="Profile"
               src={`${API_URL}/${user?.picture ?? "/static/images/avatar/1.jpg"}`}
             />
            )}
           
            {/* Animated Dropdown Menu */}
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute", top: "100%", right: 0, zIndex: 1000 }}
              >
                <Paper sx={{ mt: 1, p: 1, width: 150, bgcolor: "#2b2d42", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                  <List>
                  <ListItem  onClick={handleProfileClick} sx={{ color: "white", cursor: "pointer", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                      <ListItemIcon sx={{ color: "white" }}><Person /></ListItemIcon>
                      <ListItemText primary="Profile" sx={{ ml: -1.4 }}/>
                    </ListItem>
                    <ListItem  onClick={handleLogout} sx={{ color: "white", cursor: "pointer", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                      <ListItemIcon sx={{ color: "white" }}><Logout /></ListItemIcon>
                      <ListItemText primary="Logout" sx={{ ml: -1.4 }}/>
                    </ListItem>
                    {/* Add more ListItems here as needed */}
                  </List>
                </Paper>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box
        component="main"
        position="fixed"
        top={64}
        bottom={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#13162d",
          px: 3,
          pt: 3,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          bottom: 50,
          left: 30,
          zIndex: 9999,
        }}
      >
        <IconButton
          color="error"
          onClick={handleBack}
          disabled={window.history.length <= 1}
          sx={{
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
            ":disabled": {
              color: "rgba(255, 255, 255, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              cursor: "not-allowed",
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </motion.div>
    </Box>
  );
}
