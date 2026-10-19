import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"

/**
 * GuestGuard - Faqat autentifikatsiyadan o'tmagan (mehmon) foydalanuvchilar uchun.
 * Agar foydalanuvchi tizimga kirgan bo'lsa, uni avtomatik o'zining rol dashboardiga yo'naltiradi.
 */
export const GuestGuard = () => {
  const { isAuthenticated, isInitializing, user } = useAuth()

  if (isInitializing) {
    return null
  }

  if (isAuthenticated && user?.role) {
    const role = user.role.toUpperCase()
    if (role === "SUPER_ADMIN" || role === "ROLE_SUPER_ADMIN") {
      return <Navigate to="/super-admin" replace />
    }
    if (role === "BOSS" || role === "ROLE_BOSS" || role === "FERMA_RAHBARI") {
      return <Navigate to="/boss" replace />
    }
    if (role === "MANAGER" || role === "ROLE_MANAGER") {
      return <Navigate to="/manager" replace />
    }
  }

  return <Outlet />
}

export default GuestGuard
