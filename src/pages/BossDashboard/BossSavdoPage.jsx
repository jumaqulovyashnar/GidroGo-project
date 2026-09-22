import { useState } from "react"
import { Select } from "@mantine/core"
import { Calendar, ChevronDown, Droplet, ShoppingBag, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { OrdersWeeklyChart } from "@/components/charts/OrdersWeeklyChart"
import { WaterSalesVolumeChart } from "@/components/charts/WaterSalesVolumeChart"

const dateOptions = [
  { value: "today", label: "Bugun" },
  { value: "yesterday", label: "Kecha" },
  { value: "this_week", label: "Shu hafta" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

export function BossSavdoPage() {
  const [date, setDate] = useState("today")

  return (
    <div className="space-y-6 pb-8">
      {/* Sarlavha va filtr */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Savdo va Buyurtmalar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Haftalik yetkazilgan suv va mahsulotlar taqsimoti
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

      {/* 2 ta savdo ko'rsatkichi kartasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Kunlik buyurtmalar
            </CardTitle>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <ShoppingBag className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                150
              </span>
              <span className="text-sm font-medium text-slate-500">ta</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              132 ta yetkazildi • 18 ta jarayonda
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Sotilgan toza suv
            </CardTitle>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Droplet className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                18 500
              </span>
              <span className="text-sm font-medium text-slate-500">L</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="size-3.5" strokeWidth={2} />
                +12.8%
              </span>
              <span className="text-xs text-slate-400">kechagiga nisbatan</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2 ta grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersWeeklyChart />
        <WaterSalesVolumeChart />
      </div>
    </div>
  )
}

export default BossSavdoPage
