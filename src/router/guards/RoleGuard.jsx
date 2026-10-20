import { Navigate, Outlet } from "react-router-dom"
import { useAuth, getHomePath } from "@/provider/AuthProvider"

export const RoleGuard = ({ allowedRoles = [] }) => {
  const { user, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }
  
  // Agar rol ruxsat etilganlar ro'yxatida bo'lmasa, roliga mos sahifaga yo'naltirish
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomePath(user?.role)} replace />
  }

  return <Outlet />
}

export default RoleGuard
