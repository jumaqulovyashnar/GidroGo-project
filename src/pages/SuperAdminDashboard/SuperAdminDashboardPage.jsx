import { useAuth } from "@/provider/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { Building2, Users, ShoppingCart, CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react"
import { BrushAnalyticsChart, SalesTeamDonutChart } from "@/widgets"

const metrics = [
  {
    title: "Jami fermalar",
    value: "24",
    change: "12.5%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: Building2,
  },
  {
    title: "Jami mijozlar",
    value: "48,620",
    change: "8.2%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: Users,
  },
  {
    title: "Jami buyurtmalar",
    value: "14,850",
    change: "18.4%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: ShoppingCart,
  },
  {
    title: "Yakunlangan buyurtmalar",
    value: "14,280",
    change: "12.1%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: CheckCircle2,
  },
  {
    title: "Bekor qilingan buyurtmalar",
    value: "58",
    change: "2.4%",
    trend: "down",
    period: "o'tgan oyga nisbatan",
    icon: XCircle,
  },
]

export function SuperAdminDashboardPage() {
  const { user: _user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Dashboard Sarlavhasi (100% toza ranglar, opacity siz) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Boshqaruv Paneli
          </h1>
          <p className="text-sm font-normal text-neutral-700 mt-1">
            Tizimning umumiy ko'rsatkichlari va faollik hisoboti.
          </p>
        </div>
      </div>

      {/* 5 ta ko'rsatkich kartasi (Opacity siz toza ranglar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((item, index) => {
          const Icon = item.icon
          const isPositive = item.trend === "up"

          return (
            <Card
              key={index}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200"
            >
              {/* Card Header: Toza sarlavha va Yumaloq Blue-500 Ikonka */}
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 min-h-12.5">
                <CardTitle className="text-xs sm:text-sm font-medium text-neutral-900 leading-snug">
                  {item.title}
                </CardTitle>
                <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Icon className="size-4.5 text-blue-500" strokeWidth={1.75} />
                </div>
              </CardHeader>
              {/* Card Content: Aniq qora raqam va foiz ko'rsatkichi */}
              <CardContent>
                <div className="text-2xl xl:text-3xl font-medium tracking-tight text-black">
                  {item.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${ isPositive ? "text-emerald-600" : "text-rose-600"}`} >
                    {isPositive ? (
                      <TrendingUp className="size-3.5" strokeWidth={1.75} />
                    ) : (
                      <TrendingDown className="size-3.5" strokeWidth={1.75} />
                    )}
                    {item.change},
                  </span>
                  <span className="text-[11px] font-normal text-neutral-600 truncate">
                    {item.period}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Asosiy grafiklar maydoni (Brush Chart + Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chap qism: Katta Brush Area/Line Chart (Orders & Revenue) */}
        <Card className="lg:col-span-8 border border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-medium text-black">
                  Kunlik Buyurtmalar va Daromad.
                </CardTitle>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Sotuvlar va daromad dinamikasi hisoboti
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <BrushAnalyticsChart />
          </CardContent>
        </Card>

        {/* O'ng qism: Donut Chart (Sales Team Ulushi) */}
        <Card className="lg:col-span-4 border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-black">
              Sotuvchilar bo'yicha ulush
            </CardTitle>
            <p className="text-xs text-neutral-600 mt-0.5">
              Jamoa a'zolarining buyurtmalardagi taqsimoti
            </p>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex items-center justify-center">
            <SalesTeamDonutChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage;
