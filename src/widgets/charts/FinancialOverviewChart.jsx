import { useState } from "react"
import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { Select } from "@mantine/core"
import { ChevronDown } from "lucide-react"

const rangeOptions = [
  { value: "7days", label: "Oxirgi 7 kun" },
  { value: "30days", label: "Oxirgi 30 kun" },
  { value: "this_month", label: "Shu oy" },
]

export function FinancialOverviewChart() {
  const [range, setRange] = useState("7days")

  const series = [
    {
      name: "Tushum",
      data: [12.2, 13.5, 14.8, 13.2, 16.5, 18.2, 17.0],
    },
    {
      name: "Xarajat",
      data: [4.1, 4.5, 4.8, 4.2, 5.1, 5.5, 4.9],
    },
    {
      name: "Sof foyda",
      data: [8.1, 9.0, 10.0, 9.0, 11.4, 12.7, 12.1],
    },
  ]

  // Premium moliya ranglar palitrasi (Zumrad, Nafis Qizil, Chuqur Ko'k)
  const colors = ["#059669", "#E11D48", "#2563EB"]

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
      categories: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px", fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: 20,
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
        {/* Asosiy Spline Line Chart */}
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="line" height={280} />
        </div>

        {/* Pastki 3 ta Premium ko'rsatkich kartasi (Toza oq fon, chap hoshiyada nafis urg'u chizig'i) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200/90 border-l-4 border-l-emerald-500 shadow-2xs hover:border-slate-300 transition-all">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Haftalik tushum
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              82.4 mln so'm
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200/90 border-l-4 border-l-rose-500 shadow-2xs hover:border-slate-300 transition-all">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Haftalik xarajat
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              31.8 mln so'm
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200/90 border-l-4 border-l-blue-600 shadow-2xs hover:border-slate-300 transition-all">
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Haftalik sof foyda
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              50.6 mln so'm
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FinancialOverviewChart
