import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { TrendingUp } from "lucide-react"

export function FinanceDynamicChart() {
  const categories = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul (Kutilmoqda)",
  ]

  const series = [
    {
      name: "Jami Tushum",
      type: "column",
      data: [185, 205, 222, 238, 252, 274, 285],
    },
    {
      name: "Operatsion Xarajat",
      type: "column",
      data: [78, 84, 89, 93, 95, 98, 102],
    },
    {
      name: "Sof Foyda Trendi",
      type: "line",
      data: [107, 121, 133, 145, 157, 176, 183],
    },
  ]

  const options = {
    chart: {
      type: "line",
      height: 360,
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    colors: ["#2563eb", "#f43f5e", "#059669"], // Ko'k (Tushum), Qizil (Xarajat), Zumrad (Sof foyda trendi)
    stroke: {
      width: [0, 0, 3],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    markers: {
      size: [0, 0, 5],
      strokeColors: "#ffffff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}M`,
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
        },
      },
    },
    legend: {
      show: false, // Custom toza legend yuqori o'ngda ko'rsatiladi
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => (y !== undefined ? `${y.toFixed(1)} mln so'm` : y),
      },
      style: {
        fontSize: "12px",
      },
    },
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Daromad va Xarajatlar Dinamikasi
            </CardTitle>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
              2024 Yil
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Oylik sof tushum, operatsion xarajat va sof EBITDA foyda korrelyatsiyasi.
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#2563eb]"></span>
            <span>Jami Tushum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f43f5e]"></span>
            <span>Operatsion Xarajat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#059669]"></span>
            <span>Sof Foyda Trendi</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-5">
        {/* Asosiy ApexChart */}
        <div className="w-full">
          <Chart options={options} series={series} type="line" height={340} />
        </div>

        {/* Pastki 4 ta Xulosa Ko'rsatkichlar Qatori (Google Stitch dizayni bo'yicha) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">
              Jami yillik kutilayotgan tushum
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">
              1.450.000.000 so'm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">
              O'rtacha oylik operatsion marja
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 mt-1 block flex items-center gap-1">
              <TrendingUp className="size-3.5" /> 58.4% sof marja
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">
              Eng daromadli oy
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">
              Iyul <span className="text-xs font-normal text-slate-500">(Yozgi cho'qqi)</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">
              Xarajatlar o'sish sur'ati
            </span>
            <span className="text-sm sm:text-base font-bold text-blue-600 mt-1 block">
              Nazorat ostida (+4.8%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FinanceDynamicChart
