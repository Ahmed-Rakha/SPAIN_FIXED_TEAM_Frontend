import { AddBox } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AddCaseByAdminModal from "../../../components/modals/AddCaseByAdminModal";
import AddedCasesTable from "../../../components/Admin/WorkspaceSection/AddedCasesTable";
import { AnimatePresence, motion } from "framer-motion";
export const Route = createFileRoute("/_NavLayout/admin/workspace/")({
  component: Workspace,
});

export default function Workspace() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return (
    <Box>
      <motion.div
        style={{ width: "max-content" }}
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 8px 15px rgba(0, 150, 0, 0.4)",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <Button
          onClick={handleOpen}
          sx={{
            my: 6,
            display: "flex",
            alignItems: "center",
            mr: "auto",
            fontFamily: "Poppins",
            fontWeight: "bold",
          }}
          variant="contained"
          startIcon={<AddBox />}
          color="success"
        >
          Añadir Caso
        </Button>
      </motion.div>
      {/* table here */}
      <AddedCasesTable />
      {/* add modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <AddCaseByAdminModal open={open} handleClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
