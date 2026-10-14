import { lazy, Suspense } from "react"
import { useAuth } from "@/provider/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from "@/shared/ui"
import { Building2, Users, ShoppingCart, Truck, CheckCircle2, RefreshCw } from "lucide-react"
import { useSuperAdminDashboard, useRegionalStatistics } from "@/shared/hooks"

const BrushAnalyticsChart = lazy(() =>
  import("@/widgets/charts").then((m) => ({ default: m.BrushAnalyticsChart }))
)
const SalesTeamDonutChart = lazy(() =>
  import("@/widgets/charts").then((m) => ({ default: m.SalesTeamDonutChart }))
)

export function SuperAdminDashboardPage() {
  const { user: _user } = useAuth()
  const { data, isPending, isFetching, refetch } = useSuperAdminDashboard()
  const { data: regData } = useRegionalStatistics()
  
  const dashboard = data?.data || data || {}
  const regionalStats = regData?.data || regData || {}

  const metrics = [
    {
      title: "Jami fermalar",
      value: dashboard.totalFarms !== undefined ? dashboard.totalFarms : "—",
      subText: `${dashboard.activeFarms ?? 0} faol / ${dashboard.blockedFarms ?? 0} bloklangan`,
      icon: Building2,
    },
    {
      title: "Faol fermalar",
      value: dashboard.activeFarms !== undefined ? dashboard.activeFarms : "—",
      subText: "Faoliyat yuritayotgan",
      icon: CheckCircle2,
    },
    {
      title: "Jami mijozlar",
      value: dashboard.totalClients !== undefined ? Number(dashboard.totalClients).toLocaleString("uz-UZ") : "—",
      subText: "Ro'yxatdan o'tgan iste'molchilar",
      icon: Users,
    },
    {
      title: "Jami buyurtmalar",
      value: dashboard.totalOrders !== undefined ? Number(dashboard.totalOrders).toLocaleString("uz-UZ") : "—",
      subText: "Umumiy buyurtmalar soni",
      icon: ShoppingCart,
    },
    {
      title: "Jami kuryerlar",
      value: dashboard.totalCouriers !== undefined ? dashboard.totalCouriers : "—",
      subText: "Yetkazib beruvchilar",
      icon: Truck,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Dashboard Sarlavhasi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Boshqaruv Paneli
          </h1>
          <p className="text-sm font-normal text-neutral-700 mt-1">
            Tizimning umumiy operatsion ko'rsatkichlari va faollik hisoboti.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 text-slate-500 transition-transform ${isFetching ? "animate-spin" : ""}`} />
          <span>Yangilash</span>
        </Button>
      </div>

      {/* 5 ta ko'rsatkich kartasi (Skeleton yoki Haqiqiy data - Layout Shift bo'lmasligi uchun bir xil o'lchamda) */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-slate-200 bg-white rounded-2xl p-4 animate-pulse min-h-27.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-1 min-h-12">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="size-9 rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
              </div>
              <div className="pt-2">
                <div className="h-7 w-20 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {metrics.map((item, index) => {
            const Icon = item.icon

            return (
              <Card
                key={index}
                className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl p-4 min-h-27.5"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 min-h-12 p-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-neutral-900 leading-snug">
                    {item.title}
                  </CardTitle>
                  <div className="size-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="size-4.5 text-blue-600" strokeWidth={1.75} />
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-3">
                  <div className="text-2xl xl:text-3xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </div>
                  <p className="text-[11px] font-normal text-slate-500 mt-1 truncate">
                    {item.subText}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Asosiy grafiklar maydoni */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border border-slate-200 bg-white shadow-xs rounded-2xl">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Kunlik Buyurtmalar va Daromad
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Sotuvlar va daromad dinamikasi hisoboti
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-2 min-h-91.25">
            <Suspense
              fallback={
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Spinner size="md" />
                  <span className="text-xs">Grafik yuklanmoqda...</span>
                </div>
              }
            >
              <BrushAnalyticsChart dashboard={dashboard} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">
              Fermalar Taqsimoti
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {regionalStats?.regions?.length > 0 ? "Hududlar bo'yicha fermalar ulushi" : "Faol va bloklangan fermalar nisbati"}
            </p>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex items-center justify-center min-h-91.25">
            <Suspense
              fallback={
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Spinner size="md" />
                  <span className="text-xs">Grafik yuklanmoqda...</span>
                </div>
              }
            >
              <SalesTeamDonutChart dashboard={dashboard} regionalStats={regionalStats} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default SuperAdminDashboardPage
