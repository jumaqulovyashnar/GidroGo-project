import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { FileText } from "lucide-react"

export function CustomerSegmentDonutChart() {
  const series = [68, 24, 8]
  
  const options = {
    chart: {
      type: "donut",
      height: 140,
      width: 140,
      toolbar: { show: false },
      fontFamily: "inherit",
      dropShadow: {
        enabled: false,
      },
    },
    labels: [
      "Xonadonlar (B2C)",
      "Ofislar va Korxonalar (B2B)",
      "Ulgurji do'konlar va shoxobchalar",
    ],
    colors: ["#047857", "#0284c7", "#6ee7b7"],
    stroke: {
      width: 2.5,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
              offsetY: 6,
              formatter: () => "1,248",
            },
            total: {
              show: true,
              label: "Jami",
              fontSize: "11px",
              fontWeight: 500,
              color: "#64748b",
              formatter: () => "1,248",
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex]
        const val = series[seriesIndex]
        return `
          <div style="background: #0f172a; color: #ffffff; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid #1e293b; white-space: nowrap;">
            <span>${label}:</span> <span style="color: #38bdf8; font-weight: 700; margin-left: 4px;">${val}%</span>
          </div>
        `
      },
    },
  }

  const segments = [
    {
      id: "b2c",
      title: "Xonadonlar (B2C)",
      sub: "1,040 faol buyurtmachi",
      percentage: "68%",
      volume: "12,580 L",
      dotColor: "bg-[#047857]",
    },
    {
      id: "b2b",
      title: "Ofislar va Korxonalar (B2B)",
      sub: "165 ta tashkilot",
      percentage: "24%",
      volume: "4,440 L",
      dotColor: "bg-[#0284c7]",
    },
    {
      id: "wholesale",
      title: "Ulgurji do'konlar va shoxobchalar",
      sub: "43 ta doimiy nuqta",
      percentage: "8%",
      volume: "1,480 L",
      dotColor: "bg-[#6ee7b7]",
    },
  ]

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between h-full">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
          Mijozlar Segmenti bo'yicha Savdo
        </CardTitle>
        <p className="text-xs text-slate-500 mt-0.5">
          Faol iste'molchilar tarkibi va daromad shakllanishi.
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex flex-col justify-between flex-1 gap-5">
        {/* Top visual: Donut Chart + ASOSIY FOKUS block */}
        <div className="flex items-center gap-4 pt-1">
          <div className="relative shrink-0 flex items-center justify-center w-[140px] h-[140px]">
            <Chart options={options} series={series} type="donut" width={140} height={140} />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
              ASOSIY FOKUS
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
              B2C Xonadonlar yetakchi
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-3">
              Qarshi shahar markazi va yaqin tumanlardagi xususiy xonadonlar suvning eng katta qismini buyurtma qilmoqda.
            </p>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 pt-2">
          {segments.map((seg) => (
            <div key={seg.id} className="flex items-center justify-between text-xs">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className={`size-2.5 rounded-full ${seg.dotColor} mt-1 shrink-0`}></span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{seg.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{seg.sub}</div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-3">
                <div className="font-bold text-slate-900 text-sm">{seg.percentage}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{seg.volume}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Banner */}
        <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-3 flex items-start gap-2.5 mt-auto">
          <FileText className="size-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-snug">
            B2B shartnomalari bo'yicha har dushanba rejaviy to'lovlar kutilmoqda.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerSegmentDonutChart;
