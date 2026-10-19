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

function StatCardProgressRing({ percentage = 0, color = "#2563EB", children }) {
  const size = 52
  const strokeWidth = 3.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const strokeDashoffset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center shrink-0 w-13 h-13">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Boshlang'ich holatda kulrang (gray) doira */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* To'lgan sari o'z rangiga to'ladigan progress aylanasi */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export function SuperAdminDashboardPage() {
  const { user: _user } = useAuth()
  const { data, isPending, isFetching, refetch } = useSuperAdminDashboard()
  const { data: regData } = useRegionalStatistics()
  
  const dashboard = data?.data || data || {}
  const regionalStats = regData?.data || regData || {}

  const totalFarms = Number(dashboard.totalFarms ?? 0)
  const activeFarms = Number(dashboard.activeFarms ?? 0)
  const totalClients = Number(dashboard.totalClients ?? 0)
  const totalOrders = Number(dashboard.totalOrders ?? 0)
  const totalCouriers = Number(dashboard.totalCouriers ?? 0)

  const farmActivePercent = totalFarms > 0 ? Math.min(100, Math.round((activeFarms / totalFarms) * 100)) : 0
  const clientsPercent = totalClients > 0 ? Math.min(100, Math.round((totalClients / Math.max(totalClients, 50)) * 100)) : 0
  const ordersPercent = totalOrders > 0 ? Math.min(100, Math.round((totalOrders / Math.max(totalOrders, 100)) * 100)) : 0
  const couriersPercent = totalCouriers > 0 ? Math.min(100, Math.round((totalCouriers / Math.max(totalCouriers, 20)) * 100)) : 0

  const metrics = [
    {
      title: "Jami fermalar",
      value: dashboard.totalFarms !== undefined ? dashboard.totalFarms : "—",
      subText: `${dashboard.activeFarms ?? 0} faol / ${dashboard.blockedFarms ?? 0} bloklangan`,
      icon: Building2,
      percentage: farmActivePercent,
      color: "#2563EB",
      bgColor: "bg-blue-50/80",
      textColor: "text-blue-600",
      badge: `${farmActivePercent}% faol`,
    },
    {
      title: "Faol fermalar",
      value: dashboard.activeFarms !== undefined ? dashboard.activeFarms : "—",
      subText: "Faoliyat yuritayotgan",
      icon: CheckCircle2,
      percentage: farmActivePercent,
      color: "#10B981",
      bgColor: "bg-emerald-50/80",
      textColor: "text-emerald-600",
      badge: `${activeFarms} ta`,
    },
    {
      title: "Jami mijozlar",
      value: dashboard.totalClients !== undefined ? Number(dashboard.totalClients).toLocaleString("uz-UZ") : "—",
      subText: "Ro'yxatdan o'tgan iste'molchilar",
      icon: Users,
      percentage: clientsPercent,
      color: "#8B5CF6",
      bgColor: "bg-purple-50/80",
      textColor: "text-purple-600",
      badge: `${clientsPercent}%`,
    },
    {
      title: "Jami buyurtmalar",
      value: dashboard.totalOrders !== undefined ? Number(dashboard.totalOrders).toLocaleString("uz-UZ") : "—",
      subText: "Umumiy buyurtmalar soni",
      icon: ShoppingCart,
      percentage: ordersPercent,
      color: "#F59E0B",
      bgColor: "bg-amber-50/80",
      textColor: "text-amber-600",
      badge: `${ordersPercent}%`,
    },
    {
      title: "Jami kuryerlar",
      value: dashboard.totalCouriers !== undefined ? dashboard.totalCouriers : "—",
      subText: "Yetkazib beruvchilar",
      icon: Truck,
      percentage: couriersPercent,
      color: "#06B6D4",
      bgColor: "bg-cyan-50/80",
      textColor: "text-cyan-600",
      badge: `${totalCouriers} ta`,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Dashboard Sarlavhasi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Boshqaruv Paneli
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
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

      {/* 5 ta ko'rsatkich kartasi (Skeleton yoki Haqiqiy data) */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-slate-200/80 bg-white rounded-2xl p-5 sm:p-6 animate-pulse min-h-34 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-1 min-h-12">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="w-13 h-13 rounded-full bg-slate-100 border border-slate-200/80 shrink-0" />
              </div>
              <div className="pt-2">
                <div className="h-7 w-20 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
          {metrics.map((item, index) => {
            const Icon = item.icon

            return (
              <Card
                key={index}
                className="border border-slate-200/90 bg-white hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 rounded-2xl p-5 sm:p-5.5 min-h-34 flex flex-col justify-between group"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
                  <div className="space-y-1 pr-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {item.title}
                    </CardTitle>
                    <div className="text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors">
                      {item.value}
                    </div>
                  </div>

                  <StatCardProgressRing percentage={item.percentage} color={item.color}>
                    <div className={`w-9.5 h-9.5 rounded-full ${item.bgColor} ${item.textColor} flex items-center justify-center shadow-2xs`}>
                      <Icon className="size-4.5" strokeWidth={2} />
                    </div>
                  </StatCardProgressRing>
                </CardHeader>

                <CardContent className="p-0 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-500 truncate" title={item.subText}>
                    {item.subText}
                  </p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-slate-600 bg-slate-100 shrink-0 ml-2">
                    {item.badge}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Asosiy grafiklar maydoni */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-5 sm:p-6">
          <CardHeader className="p-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Kunlik Buyurtmalar va Daromad
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Sotuvlar va daromad dinamikasi hisoboti
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2 min-h-91.25">
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

        <Card className="lg:col-span-4 border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Fermalar Taqsimoti
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {regionalStats?.regions?.length > 0 ? "Hududlar bo'yicha fermalar ulushi" : "Faol va bloklangan fermalar nisbati"}
            </p>
          </CardHeader>
          <CardContent className="p-0 pt-4 flex-1 flex items-center justify-center min-h-91.25">
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
