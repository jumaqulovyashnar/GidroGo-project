import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import { LoginPage } from "@/pages/authentication"
import AuthGuard from "@/pages/authentication/guards/AuthGuard"
import RoleGuard from "@/pages/authentication/guards/RoleGuard"
import SuperAdminDashboardPage from "@/pages/SuperAdminDashboard/SuperAdminDashboardPage"
import ManagerDashboardPage from "@/pages/ManagerDashboard/ManagerDashboardPage"
import BossDashboardPage from "@/pages/BossDashboard/BossDashboardPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // Ochiq marshrutlar (Public / Auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  // Himoyalangan marshrutlar (Protected / Guards)
  {
    element: <AuthGuard />,
    children: [
      // Super Admin
      {
        element: <RoleGuard allowedRoles={["SUPER_ADMIN"]} />,
        children: [
          {
            path: "/super-admin",
            element: <SuperAdminDashboardPage />,
          },
        ],
      },
      // Manager
      {
        element: <RoleGuard allowedRoles={["MANAGER"]} />,
        children: [
          {
            path: "/manager",
            element: <ManagerDashboardPage />,
          },
        ],
      },
      // Boss
      {
        element: <RoleGuard allowedRoles={["BOSS"]} />,
        children: [
          {
            path: "/boss",
            element: <BossDashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])

export default router