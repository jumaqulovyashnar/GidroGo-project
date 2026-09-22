import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function OrdersWeeklyChart() {
  const categories = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"]
  const data = [120, 138, 145, 132, 165, 178, 150]

  const series = [
    {
      name: "Buyurtmalar",
      data: data,
    },
  ]

  const options = {
    chart: {
      type: "bar",
      height: 230,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "top",
        columnWidth: "55%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    // Shanba kuni eng yuqori bo'lgani uchun to'q yashil (#059669), qolganlari och binafsha/ko'k (#E0E7FF)
    colors: [
      "#E2E8F0",
      "#E2E8F0",
      "#E2E8F0",
      "#E2E8F0",
      "#E2E8F0",
      "#059669",
      "#E2E8F0",
    ],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: ["#64748B", "#64748B", "#64748B", "#64748B", "#64748B", "#059669", "#64748B"],
      },
    },
    legend: { show: false },
    grid: {
      show: false,
      padding: { top: 15, right: 0, bottom: 0, left: 0 },
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
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} ta buyurtma`,
      },
    },
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Buyurtmalar (Haftalik dinamika)
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Oxirgi 7 kunlik yetkazilgan suv hajmi
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            JAMI
          </span>
          <span className="text-base font-bold text-emerald-600">
            1023 ta
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[210px] w-full">
          <Chart options={options} series={series} type="bar" height={210} />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-1">
          <span>O'rtacha ko'rsatkich:</span>
          <span className="font-semibold text-slate-700">146 ta / kun</span>
        </div>
      </CardContent>
    </Card>
  )
}
