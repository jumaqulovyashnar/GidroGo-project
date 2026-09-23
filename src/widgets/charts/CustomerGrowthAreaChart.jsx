import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"

export function CustomerGrowthAreaChart() {
  const categories = [
    "Okt 2025",
    "Noy 2025",
    "Dek 2025",
    "Yan 2026",
    "Fev 2026",
    "Mart 2026 (Hozir)",
  ]

  const series = [
    {
      name: "Jami Faol Mijozlar (dona)",
      data: [620, 710, 830, 940, 1045, 1148],
    },
    {
      name: "Buyurtmalar (18.9L Kapsula)",
      data: [780, 890, 1020, 1180, 1310, 1450],
    },
  ]

  const options = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "inherit",
      dropShadow: {
        enabled: false,
      },
    },
    colors: ["#1d4ed8", "#0284c7"], // Deep blue and vibrant sky blue
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: [4, 4],
      strokeWidth: 2,
      strokeColors: "#ffffff",
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: {
        top: 20,
        right: 15,
        bottom: 0,
        left: 15,
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
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (seriesIndex === 0) return `${val} ta mijoz`
          return `${val * 3} kapsula (${val} ta buyurtma)`
        },
      },
    },
  }

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl relative overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Mijozlar Bazasi va Buyurtmalar O'sish Tendensiyasi
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            So'nggi 6 oylik faol xonadonlar va oylik yetkazib berilgan suv hajmi dinamikasi (Oktabr 2025 - Mart 2026)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#1d4ed8]"></span>
            <span>Jami Faol Mijozlar (dona)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#0284c7]"></span>
            <span>Buyurtmalar (18.9L Kapsula)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[310px] w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerGrowthAreaChart
