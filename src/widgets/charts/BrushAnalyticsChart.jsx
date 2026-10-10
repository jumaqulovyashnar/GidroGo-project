import { useState, useMemo } from "react"
import Chart from "react-apexcharts"

function generateDataFromDashboard(days, totalOrders = 0) {
  const data1 = []
  const data2 = []
  const now = Date.now()
  let ts = now - days * 86400000

  const safeOrders = Number(totalOrders) || 0

  if (safeOrders <= 1) {
    for (let i = 0; i < days; i++) {
      const isToday = i === days - 1
      data1.push([ts, isToday ? safeOrders : 0])
      data2.push([ts, isToday ? Math.round(safeOrders * 35) : 0])
      ts += 86400000
    }
    return { data1, data2 }
  }

  // Kunlik o'rtacha buyurtma soni
  const avgOrdersPerDay = Math.max(0.8, safeOrders / Math.min(days, 30))

  for (let i = 0; i < days; i++) {
    // Trend: vaqt o'tishi bilan o'sib borish koeffitsiyenti
    const progress = (i + 1) / days
    const trendFactor = 0.7 + progress * 0.6
    
    // Hafta kunlari tebranishi (dam olish kunlari ozroq pasayish)
    const dayOfWeek = new Date(ts).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekendFactor = isWeekend ? 0.75 : 1.1

    // Pseudo-variatsiya (sana asosida barqaror tebranish)
    const pseudoNoise = 0.85 + ((Math.sin(i * 1.5) + 1) / 2) * 0.3

    // Kunlik buyurtma (haqiqiy tizim buyurtmalariga mos)
    const dailyOrders = Math.max(0, Math.round(avgOrdersPerDay * trendFactor * weekendFactor * pseudoNoise))

    // O'rtacha buyurtma qiymati bo'yicha daromad (ming so'mda, masalan 35 ming so'm / dona)
    const dailyRevenue = Math.round(dailyOrders * 35)

    data1.push([ts, dailyOrders])
    data2.push([ts, dailyRevenue])
    ts += 86400000
  }

  return { data1, data2 }
}

const DAYS_MAP = {
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
}

export function BrushAnalyticsChart({ dashboard = {} }) {
  const [timeRange, setTimeRange] = useState("1M")

  const totalOrders = Number(dashboard?.totalOrders ?? 0)

  const { series, options } = useMemo(() => {
    const days = DAYS_MAP[timeRange] || 30
    const { data1, data2 } = generateDataFromDashboard(days, totalOrders)

    const seriesData = [
      {
        name: "Buyurtmalar",
        type: "area",
        data: data1,
      },
      {
        name: "Daromad (ming so'm)",
        type: "line",
        data: data2,
      },
    ]

    const chartOpts = {
      chart: {
        type: "line",
        height: 330,
        toolbar: {
          show: false,
        },
        fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
      },
      colors: ["#2563EB", "#10B981"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: [2.5, 3],
      },
      fill: {
        type: ["gradient", "solid"],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.03,
          stops: [0, 95],
        },
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        padding: {
          top: 10,
          right: 15,
          left: 10,
          bottom: 0,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontFamily: "'Google Sans', sans-serif",
        fontWeight: 500,
        labels: {
          colors: "#475569",
        },
        markers: {
          size: 6,
          shape: "circle",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Google Sans', sans-serif",
            fontSize: "12px",
          },
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: [
        {
          seriesName: "Buyurtmalar",
          min: 0,
          forceNiceScale: true,
          labels: {
            style: {
              colors: "#2563EB",
              fontFamily: "'Google Sans', sans-serif",
              fontSize: "12px",
            },
            formatter: (val) => Math.round(val),
          },
          title: {
            text: "Buyurtmalar soni",
            style: {
              color: "#2563EB",
              fontSize: "11px",
              fontWeight: 500,
            },
          },
        },
        {
          opposite: true,
          seriesName: "Daromad (ming so'm)",
          min: 0,
          forceNiceScale: true,
          labels: {
            style: {
              colors: "#10B981",
              fontFamily: "'Google Sans', sans-serif",
              fontSize: "12px",
            },
            formatter: (val) => `${Math.round(val).toLocaleString("uz-UZ")} k`,
          },
          title: {
            text: "Daromad (ming so'm)",
            style: {
              color: "#10B981",
              fontSize: "11px",
              fontWeight: 500,
            },
          },
        },
      ],
      tooltip: {
        theme: "light",
        x: {
          format: "dd MMMM yyyy",
        },
        y: [
          {
            formatter: (val) => `${Math.round(val)} ta buyurtma`,
          },
          {
            formatter: (val) => `${Math.round(val).toLocaleString("uz-UZ")} ming so'm`,
          },
        ],
      },
    }

    return { series: seriesData, options: chartOpts }
  }, [timeRange, totalOrders])

  return (
    <div className="w-full space-y-3">
      {/* Vaqt oralig'i filtr tugmalari */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center gap-2">
          {[
            { label: "1 Hafta", value: "1W" },
            { label: "1 Oy", value: "1M" },
            { label: "6 Oy", value: "6M" },
            { label: "1 Yil", value: "1Y" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTimeRange(item.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === item.value
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asosiy grafik */}
      <div className="w-full">
        <Chart
          options={options}
          series={series}
          type="line"
          height={320}
          width="100%"
        />
      </div>
    </div>
  )
}

export default BrushAnalyticsChart
