import { createFileRoute } from "@tanstack/react-router";
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/SideBar";
import { CssBaseline } from "@mui/material";
import ChartsOverviewDemo from "../../components/Overview";
export const Route = createFileRoute("/_NavLayout/admin/dashboard")({
  component: AdminDashboard,
});

export default function AdminDashboard() {
  return (
    <div>
      <CssBaseline />
      <DashboardHeader />
      <Sidebar />
      <main>
        <ChartsOverviewDemo />
      </main>
    </div>
  );
}
