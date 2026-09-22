import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"

export function PaymentMethodsDonutChart() {
  const series = [111.8, 62.1, 49.7, 24.9]

  const options = {
    chart: {
      type: "donut",
      height: 250,
      fontFamily: "inherit",
    },
    labels: ["Naqd pul", "Click", "Payme", "Bank hisobi"],
    colors: ["#059669", "#0284c7", "#0d9488", "#f59e0b"],
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              fontWeight: 500,
              color: "#64748b",
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              offsetY: 4,
              formatter: (val) => `${val} M`,
            },
            total: {
              show: true,
              label: "Jami Tushum",
              fontSize: "11px",
              fontWeight: 500,
              color: "#64748b",
              formatter: () => "248.5 M",
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} mln so'm`,
      },
    },
  }

  const paymentItems = [
    { label: "Naqd pul", amount: "111.8 mln", percent: "45%", color: "bg-[#059669]" },
    { label: "Click", amount: "62.1 mln", percent: "25%", color: "bg-[#0284c7]" },
    { label: "Payme", amount: "49.7 mln", percent: "20%", color: "bg-[#0d9488]" },
    { label: "Bank o'tkazmasi", amount: "24.9 mln", percent: "10%", color: "bg-[#f59e0b]" },
  ]

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs rounded-2xl h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
          To'lov Usullari va Tushum
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Joriy davrdagi to'lov turlari taqsimoti
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex flex-col justify-between flex-1">
        {/* Donut Chart */}
        <div className="flex justify-center items-center py-2">
          <Chart options={options} series={series} type="donut" width={260} height={230} />
        </div>

        {/* Legend List */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-2">
          {paymentItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 text-xs">
              <div className="flex items-center gap-1.5 min-w-0 pr-1">
                <span className={`size-2 rounded-full ${item.color} shrink-0`}></span>
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0">{item.percent}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentMethodsDonutChart
