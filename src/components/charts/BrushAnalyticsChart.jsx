import React, { useState, useMemo } from "react"
import Chart from "react-apexcharts"

function generateData(days, startLevel, seed) {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  const data1 = []
  const data2 = []
  const now = new Date("15 Mar 2025").getTime()
  let ts = now - days * 86400000
  let level = startLevel

  for (let i = 0; i < days; i++) {
    level += (rand() - 0.48) * 40
    if (level < 100) level = 120
    if (level > 600) level = 550
    const orders = Math.round(level)
    const revenue = Math.round(orders * (0.35 + rand() * 0.1) * 10) / 10

    data1.push([ts, orders])
    data2.push([ts, revenue])
    ts += 86400000
  }

  return { data1, data2 }
}

export function BrushAnalyticsChart() {
  const [timeRange, setTimeRange] = useState("1M")

  const daysMap = {
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
  }

  const { series, options } = useMemo(() => {
    const days = daysMap[timeRange] || 30
    const { data1, data2 } = generateData(days, 320, 42)

    const seriesData = [
      {
        name: "Buyurtmalar",
        type: "area",
        data: data1,
      },
      {
        name: "Daromad ($k)",
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
      colors: ["#1670FF", "#10B981"],
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
          labels: {
            style: {
              colors: "#1670FF",
              fontFamily: "'Google Sans', sans-serif",
              fontSize: "12px",
            },
            formatter: (val) => Math.round(val),
          },
          title: {
            text: "Buyurtmalar soni",
            style: {
              color: "#1670FF",
              fontSize: "11px",
              fontWeight: 500,
            },
          },
        },
        {
          opposite: true,
          seriesName: "Daromad ($k)",
          labels: {
            style: {
              colors: "#10B981",
              fontFamily: "'Google Sans', sans-serif",
              fontSize: "12px",
            },
            formatter: (val) => `$${val?.toFixed ? val.toFixed(1) : val}k`,
          },
          title: {
            text: "Daromad ($k)",
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
      },
    }

    return { series: seriesData, options: chartOpts }
  }, [timeRange])

  return (
    <div className="w-full space-y-3">
      {/* Vaqt oralig'i filtr tugmalari */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200/50">
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
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                timeRange === item.value
                  ? "bg-[#1670FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asosiy toza grafik */}
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
