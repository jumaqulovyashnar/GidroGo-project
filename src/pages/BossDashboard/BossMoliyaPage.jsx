import { useState } from "react"
import { Select } from "@mantine/core"
import { Banknote, Calendar, ChevronDown, Receipt, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import SyncingChart from "@/components/charts/SyncingChart"

const dateOptions = [
  { value: "today", label: "Bugun" },
  { value: "yesterday", label: "Kecha" },
  { value: "this_week", label: "Shu hafta" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

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

export function BossMoliyaPage() {
  const [date, setDate] = useState("today")

  return (
    <div className="space-y-6 pb-8">
      {/* Sarlavha va filtr */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Moliya tahlili
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kirim, chiqim va sof foyda hisobotlari
          </p>
        </div>

        <div className="shrink-0">
          <Select
            value={date}
            onChange={(val) => setDate(val || "today")}
            data={dateOptions}
            allowDeselect={false}
            leftSection={<Calendar className="size-4 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-full sm:w-40",
              input:
                "!h-10 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500 shadow-xs",
            }}
          />
        </div>
      </div>

      {/* 3 ta moliyaviy karta */}
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

      {/* Asosiy Katta Chart - Moliyaviy Holat */}
      <SyncingChart />
    </div>
  )
}

export default BossMoliyaPage
