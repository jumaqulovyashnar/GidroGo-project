import { useState, useMemo } from "react"
import Chart from "react-apexcharts"
import { useDailyDynamics } from "@/shared/hooks"

const DAYS_MAP = {
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
}

export function BrushAnalyticsChart({ dashboard: _dashboard = {} }) {
  const [timeRange, setTimeRange] = useState("1M")
  const days = DAYS_MAP[timeRange] || 30
  const { data: dynamicsRes } = useDailyDynamics({ days })

  const { series, options } = useMemo(() => {
    const rawData = dynamicsRes?.data || (Array.isArray(dynamicsRes) ? dynamicsRes : null)
    let data1 = []
    let data2 = []

    if (Array.isArray(rawData) && rawData.length > 0) {
      rawData.forEach((item) => {
        const timestamp = new Date(item.date || item.createdAt || item.day).getTime()
        const ordersCount = Number(item.ordersCount || item.orders || item.count || 0)
        const revenue = Number(item.revenue || item.income || item.totalAmount || 0) / 1000 // ming so'mda
        data1.push([timestamp, ordersCount])
        data2.push([timestamp, revenue])
      })
    } else {
      const now = Date.now()
      let ts = now - days * 86400000
      for (let i = 0; i < days; i++) {
        data1.push([ts, 0])
        data2.push([ts, 0])
        ts += 86400000
      }
    }

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
  }, [dynamicsRes, days])

  return (
    <div className="w-full space-y-3">
      {/* Vaqt oralig'i filtr tugmalari */}
      <div className="flex items-center justify-start sm:justify-end overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2">
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
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
