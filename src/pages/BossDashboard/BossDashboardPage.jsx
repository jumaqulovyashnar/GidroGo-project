import { useState } from "react"
import { Select } from "@mantine/core"
import { Banknote, Calendar, ChevronDown, Droplet, Receipt, ShoppingBag, TrendingDown, TrendingUp, Truck, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { SyncingChart, OrdersWeeklyChart, WaterSalesVolumeChart, BusinessMetricsSummary, CouriersPerformanceCard } from "@/widgets"

const dateOptions = [
  { value: "today", label: "Bugun" },
  { value: "yesterday", label: "Kecha" },
  { value: "this_week", label: "Shu hafta" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

// 1. Asosiy moliyaviy ko'rsatkichlar (3 ta)
const financialMetrics = [
  {
    id: 1,
    title: "Bugungi tushum",
    value: "12 850 000",
    unit: "so'm",
    icon: Banknote,
    change: "+18.4%",
    comparisonText: "kechagiga nisbatan",
    isPositive: true,
  },
  {
    id: 2,
    title: "Bugungi xarajat",
    value: "4 250 000",
    unit: "so'm",
    icon: Receipt,
    change: "+5.2%",
    comparisonText: "kechagiga nisbatan",
    isPositive: false,
  },
  {
    id: 3,
    title: "Bugungi sof foyda",
    value: "8 600 000",
    unit: "so'm",
    icon: TrendingUp,
    change: "+21.3%",
    comparisonText: "kechagiga nisbatan",
    isPositive: true,
  },
]

// 2. Operatsion ko'rsatkichlar (4 ta)
const operationalMetrics = [
  {
    id: 4,
    title: "Kunlik buyurtmalar",
    value: "150",
    unit: "ta",
    icon: ShoppingBag,
    subtext: "132 ta yetkazildi • 18 ta jarayonda",
  },
  {
    id: 5,
    title: "Sotilgan toza suv",
    value: "18 500",
    unit: "L",
    icon: Droplet,
    change: "+12.8%",
    comparisonText: "kechagiga nisbatan",
    isPositive: true,
  },
  {
    id: 6,
    title: "Faol mijozlar",
    value: "1 248",
    unit: "ta",
    icon: Users,
    change: "+7.4%",
    comparisonText: "shu oyga nisbatan",
    isPositive: true,
  },
  {
    id: 7,
    title: "Yetkazib beruvchilar",
    value: "8 / 10",
    unit: "faol",
    icon: Truck,
    subtext: "8 tasi yo'lda • 2 tasi navbatda",
  },
]

const BossDashboardPage = () => {
  const [date, setDate] = useState("today")

  return (
    <div className="space-y-6 pb-8">
      {/* Sarlavha va "Bugun" selekti (flex justify-between) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ferma Egasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fermangizning joriy holati, ko'rsatkichlari va tahlillari.
          </p>
        </div>

        {/* O'ng tomondagi "Bugun" selekti */}
        <div className="shrink-0">
          <Select
            value={date}
            onChange={(val) => setDate(val || "today")}
            data={dateOptions}
            allowDeselect={false}
            maxDropdownHeight={450}
            leftSection={<Calendar className="size-4 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-full sm:w-40",
              input:
                "!h-10 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500 shadow-xs",
              dropdown:
                "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
            }}
          />
        </div>
      </div>

      {/* 1-Qism: Asosiy Moliyaviy Kartochkalar (3 ta ustun) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                  {item.title}
                </CardTitle>
                <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Icon className="size-4.5 text-blue-600" strokeWidth={1.75} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {item.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      item.isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {item.isPositive ? (
                      <TrendingUp className="size-3.5" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="size-3.5" strokeWidth={2} />
                    )}
                    {item.change}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.comparisonText}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 2-Qism: Operatsion Ko'rsatkichlar Kartochkalari (4 ta ustun) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {operationalMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                  {item.title}
                </CardTitle>
                <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Icon className="size-4.5 text-blue-600" strokeWidth={1.75} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-sm font-medium text-slate-500">
                      {item.unit}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 text-xs text-slate-500">
                  {item.change ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600">
                        <TrendingUp className="size-3.5" strokeWidth={2} />
                        {item.change}
                      </span>
                      <span className="text-slate-400">
                        {item.comparisonText}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3-Qism: Asosiy Katta Chart - Moliyaviy Holat (SyncingChart) */}
      <SyncingChart />

      {/* 4-Qism: 2 ta grafik (Buyurtmalar haftalik dinamikasi + Suv savdosi idish turlari) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersWeeklyChart />
        <WaterSalesVolumeChart />
      </div>

      {/* 5-Qism: Biznes ko'rsatkichlari xulosasi */}
      <BusinessMetricsSummary />

      {/* 6-Qism: Dastavkachilar faoliyati (Card ichida Table) */}
      <CouriersPerformanceCard />
    </div>
  )
}

export default BossDashboardPage;
