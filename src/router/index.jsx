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
import FermaDetailPage from "@/pages/SuperAdminDashboard/FermaDetailPage"
import FermaEgalariPage from "@/pages/SuperAdminDashboard/FermaEgalariPage"
import AuditLogPage from "@/pages/SuperAdminDashboard/AuditLogPage"
import StatistikaPage from "@/pages/SuperAdminDashboard/StatistikaPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // auth section uchun route
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
              },
              {
                // ferma detail sahifasi
                path: "/super-admin/fermalar/:id",
                element: <FermaDetailPage />,
              }, {
                path: "/super-admin/fermaEgalari",
                element: <FermaEgalariPage />,
              }, {
                path: '/super-admin/auditlog',
                element: <AuditLogPage />,
              },{
                path:'/super-admin/statistika',
                element:<StatistikaPage/>,
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