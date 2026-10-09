import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { TrendingUp, Users, ShoppingBag, Banknote } from "lucide-react"
import { useBossDashboard } from "@/shared/hooks"

export function BusinessMetricsSummary() {
  const { data: dashboardRes } = useBossDashboard()
  const db = dashboardRes?.data || dashboardRes || {}

  const formatNumber = (num, fallback = 0) => {
    const val = num !== undefined && num !== null ? num : fallback
    return Number(val).toLocaleString("ru-RU")
  }

  const metrics = [
    {
      id: "tushum",
      label: "OYLIK TUSHUM",
      value: `${formatNumber(db.monthIncome ?? db.todayIncome, 0)} so'm`,
      subtext: "Joriy tushum",
      icon: Banknote,
    },
    {
      id: "buyurtmalar",
      label: "BUYURTMALAR",
      value: `${formatNumber(db.totalOrders ?? db.todayOrders, 0)} ta`,
      subtext: `${db.todayOrders ?? 0} ta bugun`,
      icon: ShoppingBag,
    },
    {
      id: "mijozlar",
      label: "MIJOZLAR BAZASI",
      value: `${formatNumber(db.totalClients, 0)} ta`,
      subtext: "Faol mijozlar",
      icon: Users,
    },
    {
      id: "foyda",
      label: "SOF FOYDA",
      value: `${formatNumber(db.monthProfit ?? db.todayProfit, 0)} so'm`,
      subtext: "Joriy marja",
      icon: TrendingUp,
    },
  ]

  return (
    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Biznes ko'rsatkichlari
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ferma bo'yicha umumiy jamlangan real ko'rsatkichlar
          </p>
        </div>

        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full shrink-0">
          Real tahlil
        </span>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#F8FAFF] border border-blue-100/80 hover:border-blue-200 hover:bg-[#F3F7FF] shadow-2xs flex flex-col justify-between transition-all duration-200 min-h-32.5"
              >
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                  {item.label}
                </span>

                <div className="text-xl sm:text-2xl font-bold tracking-tight my-2.5 text-slate-900 truncate" title={item.value}>
                  {item.value}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <Icon className="size-3.5" strokeWidth={2.5} />
                  <span>{item.subtext}</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs sm:text-sm text-slate-500 mt-5 leading-relaxed font-normal">
          Barcha ko'rsatkichlar fermaning markaziy boshqaruv ma'lumotlar bazasidan real vaqt rejimida yangilanadi.
        </p>
      </CardContent>
    </Card>
  )
}

export default BusinessMetricsSummary
