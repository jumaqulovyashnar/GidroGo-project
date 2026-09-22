import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"

export const AuthGuard = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AuthGuard
