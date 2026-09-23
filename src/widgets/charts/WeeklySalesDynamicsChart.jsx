import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { TrendingUp } from "lucide-react"

export function WeeklySalesDynamicsChart() {
  const categories = ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"]

  const series = [
    {
      name: "Suv hajmi (kL)",
      data: [14.2, 15.8, 13.9, 17.1, 19.4, 16.0, 18.5],
    },
    {
      name: "Buyurtmalar soni",
      data: [13.2, 14.8, 12.6, 16.0, 18.2, 15.0, 17.2], // scaled for visual symmetry
    },
  ]

  const actualOrders = [128, 142, 120, 152, 174, 140, 162]

  const options = {
    chart: {
      type: "bar",
      height: 290,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "46%",
        borderRadius: 4,
        borderRadiusApplication: "top",
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#047857", "#38bdf8"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        if (opts.seriesIndex === 0) {
          return `${val}kL`
        }
        return ""
      },
      offsetY: -20,
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: ["#64748b"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      padding: {
        top: 25,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex }) {
          if (seriesIndex === 0) {
            return `${val} kL (${Math.round(val * 1000).toLocaleString("uz-UZ")} L)`
          }
          return `${actualOrders[dataPointIndex]} ta buyurtma`
        },
      },
    },
  }

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl relative overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Haftalik Savdo va Buyurtmalar Dinamikasi
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Oxirgi 7 kunlik suv tarqatish hajmi (Litr) va bajarilgan umumiy buyurtmalar soni
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#047857]"></span>
            <span>Suv hajmi (kL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#38bdf8]"></span>
            <span>Buyurtmalar soni</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[290px] w-full">
          <Chart options={options} series={series} type="bar" height={290} />
        </div>

        {/* Footer info row */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <TrendingUp className="size-3.5 text-emerald-600" />
            <span>
              Haftalik jami realizatsiya:{" "}
              <strong className="font-semibold text-slate-900">115,500 L</strong>{" "}
              (912 ta muvaffaqiyatli buyurtma)
            </span>
          </div>
          <div className="text-slate-500 font-medium sm:text-right">
            Eng faol kun:{" "}
            <span className="font-semibold text-slate-800">Juma (19,400 L)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklySalesDynamicsChart
