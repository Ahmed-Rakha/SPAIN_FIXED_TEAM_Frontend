import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import backgroundDashborad from '../assets/background-dashboard.avif'
export const Route = createFileRoute('/_ HomeLayout')({
  component: HomeLayout,
})

export default function HomeLayout() {
  return (
    <Box  sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
  
        backgroundImage: `url(${backgroundDashborad})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
         <CssBaseline />
    <AppBar position="static" sx={{ backgroundColor: "#1f2235" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: "#fff",
            fontFamily: "Cairo",
            fontWeight: "bold",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        >
          Order Entry Team
        </Typography>
      </Toolbar>
    </AppBar>
        <Outlet />
        <footer
        style={{
          padding: "20px",
          backgroundColor: "#1f2235",
          color: "#fff",
        }}
      >
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Powered by RA. All rights reserved.
        </Typography>
      </footer>
    </Box>
  )
}