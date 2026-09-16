import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import MainLayout from "../layout/MainLayout"
import { LoginPage } from "@/pages/authentication"
import AuthGuard from "@/pages/authentication/guards/AuthGuard"
import RoleGuard from "@/pages/authentication/guards/RoleGuard"
import SuperAdminDashboardPage from "@/pages/SuperAdminDashboard/SuperAdminDashboardPage"
import ManagerDashboardPage from "@/pages/ManagerDashboard/ManagerDashboardPage"
import BossDashboardPage from "@/pages/BossDashboard/BossDashboardPage"
import FermalarPage from "@/pages/SuperAdminDashboard/FermalarPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // Ochiq marshrutlar (Login)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  // Himoyalangan boshqaruv paneli (MainLayout: DoubleNavbar + Header + Outlet)
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Super Admin
          {
            element: <RoleGuard allowedRoles={["SUPER_ADMIN"]} />,
            children: [
              {
                path: "/super-admin",
                element: <SuperAdminDashboardPage />,
              }, {
                // fermalar uchun route qoshildi. 
                path: "/super-admin/fermalar",
                element: <FermalarPage />,
              }
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
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])

export default router