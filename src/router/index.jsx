import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import MainLayout from "../layout/MainLayout"
import { AuthGuard, RoleGuard } from "./guards"
import { Spinner, RouteError } from "@/shared/ui"

const PageFallback = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <Spinner size="lg" className="text-blue-600" />
  </div>
)

const withSuspense = (Component) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
)

// Auth
const LoginPage = lazy(() => import("@/pages/authentication/LoginPage"))

// Super Admin
const SuperAdminDashboardPage = lazy(() => import("@/pages/SuperAdminDashboard/SuperAdminDashboardPage"))
const FermalarPage = lazy(() => import("@/pages/SuperAdminDashboard/FermalarPage"))
const FermaDetailPage = lazy(() => import("@/pages/SuperAdminDashboard/FermaDetailPage"))
const FermaEgalariPage = lazy(() => import("@/pages/SuperAdminDashboard/FermaEgalariPage"))
const AuditLogPage = lazy(() => import("@/pages/SuperAdminDashboard/AuditLogPage"))
const StatistikaPage = lazy(() => import("@/pages/SuperAdminDashboard/StatistikaPage"))
const SozlamalarPage = lazy(() => import("@/pages/SuperAdminDashboard/SozlamalarPage"))
const TasdiqlashPage = lazy(() => import("@/pages/SuperAdminDashboard/TasdiqlashPage"))

// Manager
const ManagerDashboardPage = lazy(() => import("@/pages/ManagerDashboard/ManagerDashboardPage"))
const ManagerOrdersPage = lazy(() => import("@/pages/ManagerDashboard/ManagerOrdersPage"))
const ManagerAllOrdersPage = lazy(() => import("@/pages/ManagerDashboard/ManagerAllOrdersPage"))
const ManagerOrderDetailPage = lazy(() => import("@/pages/ManagerDashboard/ManagerOrderDetailPage"))
const ManagerCouriersMapPage = lazy(() => import("@/pages/ManagerDashboard/ManagerCouriersMapPage"))
const ManagerXodimlarPage = lazy(() => import("@/pages/ManagerDashboard/ManagerXodimlarPage"))

// Boss
const BossDashboardPage = lazy(() => import("@/pages/BossDashboard/BossDashboardPage"))
const BossMoliyaPage = lazy(() => import("@/pages/BossDashboard/BossMoliyaPage"))
const BossSavdoPage = lazy(() => import("@/pages/BossDashboard/BossSavdoPage"))
const BossOsishPage = lazy(() => import("@/pages/BossDashboard/BossOsishPage"))
const BossFermaPage = lazy(() => import("@/pages/BossDashboard/BossFermaPage"))
const BossXodimlarPage = lazy(() => import("@/pages/BossDashboard/BossXodimlarPage"))
const BossXodimDetailPage = lazy(() => import("@/pages/BossDashboard/BossXodimDetailPage"))

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteError />,
    element: <Navigate to="/login" replace />,
  },
  // auth section uchun route
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/login",
        element: withSuspense(LoginPage),
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