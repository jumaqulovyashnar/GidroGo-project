import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"

export const AuthGuard = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  // Session tekshirilayotgan paytda bo'sh turadi yoki loader
  if (isInitializing) {
    return null
  }

  // Agar login qilmagan bo'lsa, login sahifasiga qaytaramiz
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AuthGuard
