import { createFileRoute } from '@tanstack/react-router'
import ProfileDetailsPage from '../../_NavLayout.user/profile'
export const Route = createFileRoute('/_NavLayout/admin/profile/')({
  component: ProfileDetailsPage,
})

