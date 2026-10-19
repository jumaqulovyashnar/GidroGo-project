import { Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import MainLayout from "../layout/MainLayout"
import { AuthGuard, RoleGuard, GuestGuard } from "./guards"
import { RouteError, PageLoading } from "@/shared/ui"
import { lazyWithRetry } from "@/shared/lib"
import LoginPage from "@/pages/authentication/LoginPage"

const withSuspense = (Component, message) => (
  <Suspense fallback={<PageLoading message={message} />}>
    <Component />
  </Suspense>
)
// Super Admin
const SuperAdminDashboardPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/SuperAdminDashboardPage"))
const FermalarPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/FermalarPage"))
const FermaDetailPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/FermaDetailPage"))
const FermaEgalariPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/FermaEgalariPage"))
const AuditLogPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/AuditLogPage"))
const StatistikaPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/StatistikaPage"))
const SozlamalarPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/SozlamalarPage"))
const TasdiqlashPage = lazyWithRetry(() => import("@/pages/SuperAdminDashboard/TasdiqlashPage"))

// Manager
const ManagerDashboardPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerDashboardPage"))
const ManagerOrdersPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerOrdersPage"))
const ManagerAllOrdersPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerAllOrdersPage"))
const ManagerOrderDetailPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerOrderDetailPage"))
const ManagerCouriersMapPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerCouriersMapPage"))
const ManagerXodimlarPage = lazyWithRetry(() => import("@/pages/ManagerDashboard/ManagerXodimlarPage"))

// Boss
const BossDashboardPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossDashboardPage"))
const BossMoliyaPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossMoliyaPage"))
const BossSavdoPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossSavdoPage"))
const BossOsishPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossOsishPage"))
const BossFermaPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossFermaPage"))
const BossXodimlarPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossXodimlarPage"))
const BossXodimDetailPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossXodimDetailPage"))
const BossCouriersMapPage = lazyWithRetry(() => import("@/pages/BossDashboard/BossCouriersMapPage"))

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteError />,
    element: <Navigate to="/login" replace />,
  },
  // auth section uchun route (faqat mehmonlar uchun)
  {
    element: <GuestGuard />,
    errorElement: <RouteError />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  // Himoyalangan boshqaruv paneli (MainLayout: DoubleNavbar + Header + Outlet)
  {
    element: <AuthGuard />,
    errorElement: <RouteError />,
    children: [
      {
        element: <MainLayout />,
        errorElement: <RouteError />,
        children: [
          // Super Admin
          {
            element: <RoleGuard allowedRoles={["SUPER_ADMIN"]} />,
            children: [
              {
                path: "/super-admin",
                element: withSuspense(SuperAdminDashboardPage),
              },
              {
                path: "/super-admin/fermalar",
                element: withSuspense(FermalarPage),
              },
              {
                path: "/super-admin/fermalar/:id",
                element: withSuspense(FermaDetailPage),
              },
              {
                path: "/super-admin/fermaEgalari",
                element: withSuspense(FermaEgalariPage),
              },
              {
                path: "/super-admin/auditlog",
                element: withSuspense(AuditLogPage),
              },
              {
                path: "/super-admin/statistika",
                element: withSuspense(StatistikaPage),
              },
              {
                path: "/super-admin/sozlamalar",
                element: withSuspense(SozlamalarPage),
              },
              {
                path: "/super-admin/tasdiqlash",
                element: withSuspense(TasdiqlashPage),
              },
            ],
          },
          // Manager
          {
            element: <RoleGuard allowedRoles={["MANAGER"]} />,
            children: [
              {
                path: "/manager",
                element: withSuspense(ManagerDashboardPage),
              },
              {
                path: "/manager/buyurtmalar",
                element: withSuspense(ManagerOrdersPage),
              },
              {
                path: "/manager/barcha-buyurtmalar",
                element: withSuspense(ManagerAllOrdersPage),
              },
              {
                path: "/manager/buyurtmalar/:id",
                element: withSuspense(ManagerOrderDetailPage),
              },
              {
                path: "/manager/dastavkachilar-xarita",
                element: withSuspense(ManagerCouriersMapPage),
              },
              {
                path: "/manager/xarita",
                element: withSuspense(ManagerCouriersMapPage),
              },
              {
                path: "/manager/xodimlar",
                element: withSuspense(ManagerXodimlarPage),
              },
            ],
          },
          // Boss
          {
            element: <RoleGuard allowedRoles={["BOSS"]} />,
            children: [
              {
                path: "/boss",
                element: withSuspense(BossDashboardPage),
              },
              {
                path: "/boss/moliya",
                element: withSuspense(BossMoliyaPage),
              },
              {
                path: "/boss/savdo",
                element: withSuspense(BossSavdoPage),
              },
              {
                path: "/boss/osish",
                element: withSuspense(BossOsishPage),
              },
              {
                path: "/boss/ferma",
                element: withSuspense(BossFermaPage),
              },
              {
                path: "/boss/xodimlar",
                element: withSuspense(BossXodimlarPage),
              },
              {
                path: "/boss/xodimlar/:id",
                element: withSuspense(BossXodimDetailPage),
              },
              {
                path: "/boss/xarita",
                element: withSuspense(BossCouriersMapPage),
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