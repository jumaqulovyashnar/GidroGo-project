import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import MainLayout from "../layout/MainLayout"
import { LoginPage } from "@/pages/authentication"
import { AuthGuard, RoleGuard } from "./guards"
import SuperAdminDashboardPage from "@/pages/SuperAdminDashboard/SuperAdminDashboardPage"
import {
  ManagerDashboardPage,
  ManagerOrdersPage,
  ManagerCouriersMapPage,
  ManagerXodimlarPage,
  ManagerOrderDetailPage,
  ManagerAllOrdersPage,
} from "@/pages/ManagerDashboard"
import BossDashboardPage from "@/pages/BossDashboard/BossDashboardPage"
import BossMoliyaPage from "@/pages/BossDashboard/BossMoliyaPage"
import BossSavdoPage from "@/pages/BossDashboard/BossSavdoPage"
import BossOsishPage from "@/pages/BossDashboard/BossOsishPage"
import BossFermaPage from "@/pages/BossDashboard/BossFermaPage"
import BossXodimlarPage from "@/pages/BossDashboard/BossXodimlarPage"
import FermalarPage from "@/pages/SuperAdminDashboard/FermalarPage"
import FermaDetailPage from "@/pages/SuperAdminDashboard/FermaDetailPage"
import FermaEgalariPage from "@/pages/SuperAdminDashboard/FermaEgalariPage"
import AuditLogPage from "@/pages/SuperAdminDashboard/AuditLogPage"
import StatistikaPage from "@/pages/SuperAdminDashboard/StatistikaPage"
import SozlamalarPage from "@/pages/SuperAdminDashboard/SozlamalarPage"
import TasdiqlashPage from "@/pages/SuperAdminDashboard/TasdiqlashPage"

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
              }, {
                path: '/super-admin/statistika',
                element: <StatistikaPage />,
              }, {
                path: '/super-admin/sozlamalar',
                element: <SozlamalarPage />,
              }, {
                path: '/super-admin/tasdiqlash',
                element: <TasdiqlashPage />,
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
              {
                path: "/manager/buyurtmalar",
                element: <ManagerOrdersPage />,
              },
              {
                path: "/manager/barcha-buyurtmalar",
                element: <ManagerAllOrdersPage />,
              },
              {
                path: "/manager/buyurtmalar/:id",
                element: <ManagerOrderDetailPage />,
              },
              {
                path: "/manager/dastavkachilar-xarita",
                element: <ManagerCouriersMapPage />,
              },
              {
                path: "/manager/xarita",
                element: <ManagerCouriersMapPage />,
              },
              {
                path: "/manager/xodimlar",
                element: <ManagerXodimlarPage />,
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
              {
                path: "/boss/moliya",
                element: <BossMoliyaPage />,
              },
              {
                path: "/boss/savdo",
                element: <BossSavdoPage />,
              },
              {
                path: "/boss/osish",
                element: <BossOsishPage />,
              },
              {
                path: "/boss/ferma",
                element: <BossFermaPage />,
              },
              {
                path: "/boss/xodimlar",
                element: <BossXodimlarPage />,
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