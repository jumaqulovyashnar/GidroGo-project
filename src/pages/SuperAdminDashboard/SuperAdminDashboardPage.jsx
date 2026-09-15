import { useAuth } from "@/provider/AuthProvider"
import {Card,CardHeader,CardTitle,CardContent,} from "@/components/ui/card"
import {
  Building2,
  Users,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const metrics = [
  {
    title: "Jami fermalar",
    value: "24",
    change: "+12.5%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: Building2,
  },
  {
    title: "Jami mijozlar",
    value: "48,620",
    change: "+8.2%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: Users,
  },
  {
    title: "Jami buyurtmalar",
    value: "14,850",
    change: "+18.4%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: ShoppingCart,
  },
  {
    title: "Yakunlangan buyurtmalar",
    value: "14,280",
    change: "+12.1%",
    trend: "up",
    period: "o'tgan oyga nisbatan",
    icon: CheckCircle2,
  },
  {
    title: "Bekor qilingan buyurtmalar",
    value: "58",
    change: "-2.4%",
    trend: "down",
    period: "o'tgan oyga nisbatan",
    icon: XCircle,
  },
]

export function SuperAdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Dashboard Sarlavhasi (100% toza ranglar, opacity siz) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Boshqaruv Paneli
          </h1>
          <p className="text-sm font-normal text-neutral-700 mt-1">
            Xush kelibsiz, <span className="text-black font-medium">{user?.name || "Yashnarbek Jumaqulov"}</span>. Tizimning umumiy ko'rsatkichlari va faollik hisoboti.
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
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="size-3.5" strokeWidth={1.75} />
                    ) : (
                      <TrendingDown className="size-3.5" strokeWidth={1.75} />
                    )}
                    {item.change}
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

      {/* Asosiy kontent maydoni */}
      <Card className="border border-slate-200 bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">
            Asosiy boshqaruv va hisobotlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-neutral-600 text-sm font-normal bg-slate-50">
            Ushbu qismda grafiklar (Charts), jadval va asosiy boshqaruv modullari joylashadi.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuperAdminDashboardPage