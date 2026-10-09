import { useState } from "react"
import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { Select } from "@mantine/core"
import { ChevronDown } from "lucide-react"
import { useBossOrders, useBossDashboard } from "@/shared/hooks"

const rangeOptions = [
  { value: "7days", label: "Oxirgi 7 kun" },
  { value: "30days", label: "Oxirgi 30 kun" },
  { value: "this_month", label: "Shu oy" },
]

export function SyncingChart() {
  const [range, setRange] = useState("7days")
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: dashboardRes } = useBossDashboard()

  const rawOrders = ordersRes?.data || ordersRes || []
  const orders = Array.isArray(rawOrders) ? rawOrders : []
  const db = dashboardRes?.data || dashboardRes || {}

  const categories = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"]
  const incomeByDay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 }

  orders.forEach((o) => {
    if (o.createdAt) {
      const day = new Date(o.createdAt).getDay()
      const amount = Number(o.totalAmount || 0)
      incomeByDay[day] = (incomeByDay[day] || 0) + amount
    }
  })

  // Agar orders bo'sh bo'lsa, dashboarddagi bugungi tushumni bugungi kunga o'rnatish
  const todayDay = new Date().getDay()
  if (orders.length === 0 && db.todayIncome) {
    incomeByDay[todayDay] = Number(db.todayIncome)
  }

  // Mln so'mda ifodalash
  const tushumData = [
    +(incomeByDay[1] / 1000000).toFixed(1),
    +(incomeByDay[2] / 1000000).toFixed(1),
    +(incomeByDay[3] / 1000000).toFixed(1),
    +(incomeByDay[4] / 1000000).toFixed(1),
    +(incomeByDay[5] / 1000000).toFixed(1),
    +(incomeByDay[6] / 1000000).toFixed(1),
    +(incomeByDay[0] / 1000000).toFixed(1),
  ]

  const xarajatData = tushumData.map((val) => +(val * 0.35).toFixed(1))
  const sofFoydaData = tushumData.map((val, idx) => +(val - xarajatData[idx]).toFixed(1))

  const series = [
    {
      name: "Tushum",
      data: tushumData,
    },
    {
      name: "Xarajat",
      data: xarajatData,
    },
    {
      name: "Sof foyda",
      data: sofFoydaData,
    },
  ]

  // Premium moliya ranglar palitrasi (Zumrad, Nafis Qizil, Chuqur Ko'k)
  const colors = ["#059669", "#E11D48", "#2563EB"]
  const maxVal = Math.max(...tushumData, 1)

  const options = {
    chart: {
      type: "line",
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: colors,
    stroke: {
      curve: "smooth",
      width: [2.5, 2.5, 2.5],
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      fillColors: ["#ffffff", "#ffffff", "#ffffff"],
      strokeColors: colors,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px", fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: Math.ceil(maxVal * 1.2),
      tickAmount: 4,
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px", fontWeight: 500 },
        formatter: (val) => (val === 0 ? "0" : `${val}M`),
      },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} mln so'm`,
      },
    },
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Moliyaviy holat
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Kirim, chiqim va sof foydaning haftalik korrelyatsiyasi
          </p>
        </div>

        {/* Legend va Select */}
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#059669]" />
              Tushum
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#E11D48]" />
              Xarajat
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#2563EB]" />
              Sof foyda
            </span>
          </div>

          <Select
            value={range}
            onChange={(val) => setRange(val || "7days")}
            data={rangeOptions}
            allowDeselect={false}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-36",
              input:
                "!h-8 !rounded-lg !border-slate-200 !bg-slate-50/70 hover:!bg-slate-100/70 !text-slate-700 !text-xs !font-medium !cursor-pointer transition-colors focus:!border-blue-500",
              dropdown: "!rounded-xl !border-slate-200 !shadow-lg !p-1 !bg-white",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="line" height={280} />
        </div>
      </CardContent>
    </Card>
  )
}

export default SyncingChart
