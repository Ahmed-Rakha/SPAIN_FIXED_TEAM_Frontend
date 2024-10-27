import { createFileRoute } from '@tanstack/react-router'
import DashboardHeader from '../../components/DashboardHeader'
import Sidebar from '../../components/Sidebar'
import { CssBaseline } from '@mui/material'
import ChartsOverviewDemo from '../../components/User/Overview'

export const Route = createFileRoute('/_NavLayout/user/dashboard')({
  component: UserDashboardLayout,
})

export default function UserDashboardLayout() {
  return (
    <div>
      <CssBaseline />
      <DashboardHeader />
      <Sidebar />
      <main>
        {/* Main content goes here */}
        <ChartsOverviewDemo />
      </main>
    </div>
  )
}
