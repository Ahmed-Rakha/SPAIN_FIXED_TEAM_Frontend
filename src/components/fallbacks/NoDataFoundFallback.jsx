import { PersonOff } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
export default function NoDataFoundFallback({ message, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10%",
      }}
    >
      {icon}
      <Typography
        variant="h5"
        align="center"
        sx={{
          mt: 2,
          color: "#fff",
          fontFamily: "Poppins",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          letterSpacing: "1px",
          fontSize: "2rem",
        }}
      >
        {message}
      </Typography>
    </motion.div>
  );
}
