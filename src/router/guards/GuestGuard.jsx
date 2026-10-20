import { Navigate, Outlet } from "react-router-dom"
import { useAuth, getHomePath } from "@/provider/AuthProvider"

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
    return <Navigate to={getHomePath(user.role)} replace />
  }

  return <Outlet />
}

export default GuestGuard
