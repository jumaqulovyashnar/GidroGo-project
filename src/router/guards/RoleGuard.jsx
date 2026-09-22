import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"

export const RoleGuard = ({ allowedRoles = [] }) => {
  const { user, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }
  
  // Agar rol ruxsat etilganlar ro'yxatida bo'lmasa:

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {

    // Roliga mos asosiy sahifaga yo'naltirish
    if (user?.role === "SUPER_ADMIN") return <Navigate to="/super-admin" replace />
    if (user?.role === "MANAGER") return <Navigate to="/manager" replace />
    if (user?.role === "BOSS") return <Navigate to="/boss" replace />
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RoleGuard
