import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossFinanceSummary, useBossDashboard, useBossFinanceChart } from "@/shared/hooks"

export function FinanceDynamicChart({ period = "month" }) {
  const { data: chartRes } = useBossFinanceChart(period)
  const { data: financeRes } = useBossFinanceSummary(period)
  const { data: dashboardRes } = useBossDashboard()

  const rawChart = chartRes?.data || chartRes || []
  const chartList = Array.isArray(rawChart) ? rawChart : []
  const finance = financeRes?.data || financeRes || {}
  const db = dashboardRes?.data || dashboardRes || {}

  let categories = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Joriy oy",
  ]
  let incomeData = []
  let expenseData = []
  let profitData = []

  const totalIncomeVal = Number(finance.totalIncome || db.monthIncome || db.todayIncome || 0)
  const totalExpenseVal = Number(finance.totalExpense || db.monthExpense || db.todayExpense || 0)
  const isZeroFinance = totalIncomeVal === 0 && totalExpenseVal === 0

  if (isZeroFinance) {
    if (chartList.length > 0) {
      categories = chartList.map((item) => item.date || "Sana")
    }
    incomeData = categories.map(() => 0)
    expenseData = categories.map(() => 0)
    profitData = categories.map(() => 0)
  } else if (chartList.length > 0) {
    categories = chartList.map((item) => item.date || "Sana")
    incomeData = chartList.map((item) => +(Number(item.income || 0) / 1000000).toFixed(1))
    expenseData = chartList.map((item) => +(Number(item.expense || 0) / 1000000).toFixed(1))
    profitData = chartList.map((item) => +(Number(item.profit || 0) / 1000000).toFixed(1))
  } else {
    incomeData = categories.map(() => 0)
    expenseData = categories.map(() => 0)
    profitData = categories.map(() => 0)
  }

  const series = [
    {
      name: "Jami Tushum",
      type: "column",
      data: incomeData,
    },
    {
      name: "Operatsion Xarajat",
      type: "column",
      data: expenseData,
    },
    {
      name: "Sof Foyda Trendi",
      type: "line",
      data: profitData,
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
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        formatter: (val) => {
          if (!val) return ""
          if (typeof val === "string" && val.length === 10 && val.includes("-")) {
            const parts = val.split("-")
            return `${parts[2]}.${parts[1]}`
          }
          return val
        },
        style: {
          colors: "#64748b",
          fontSize: "11px",
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
      show: false,
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
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Daromad va Xarajatlar Dinamikasi
            </CardTitle>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fermaning umumiy aylanmasi, sarf-xarajatlari va marjinalligi
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#2563eb]" />
            <span>Tushum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#f43f5e]" />
            <span>Xarajat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#059669]" />
            <span>Sof Foyda</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <div className="w-full">
          <Chart options={options} series={series} type="line" height={340} />
        </div>
      </CardContent>
    </Card>
  )
}

export default FinanceDynamicChart
