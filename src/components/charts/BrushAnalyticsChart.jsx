import { useMemo } from "react"
import Chart from "react-apexcharts"

function mulberry32(seed) {
  return function () {
    let s = (seed |= 0)
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function BrushAnalyticsChart() {
  const { series, mainOptions, brushOptions } = useMemo(() => {
    const rand = mulberry32(42)
    const data1 = []
    const data2 = []
    let ts = new Date("01 Oct 2024").getTime()
    let level = 300

    for (let i = 0; i < 180; i++) {
      level += (rand() - 0.5) * 55
      level += (300 - level) * 0.03
      if (rand() > 0.94) level += (rand() - 0.5) * 90
      if (level < 120) level = 120
      const orders = Math.round(level)
      data1.push([ts, orders])
      data2.push([ts, Math.round(orders * (0.32 + rand() * 0.12) * 10) / 10])
      ts += 86400000
    }

    const seriesData = [
      {
        name: "Buyurtmalar",
        data: data1,
      },
      {
        name: "Daromad ($k)",
        data: data2,
      },
    ]

    const mainOpts = {
      chart: {
        id: "chart2",
        type: "line",
        height: 240,
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
      },
      colors: ["#2563eb", "#10b981"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [2.5, 3],
        curve: ["straight", "monotoneCubic"],
      },
      fill: {
        opacity: [1, 0.85],
      },
      markers: {
        size: 0,
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontFamily: "'Google Sans', sans-serif",
        labels: {
          colors: "#0f172a",
        },
      },
      yaxis: [
        {
          seriesName: "Buyurtmalar",
          axisTicks: {
            show: true,
            color: "#2563eb",
          },
          axisBorder: {
            show: true,
            color: "#2563eb",
          },
          labels: {
            style: {
              colors: "#2563eb",
              fontFamily: "'Google Sans', sans-serif",
            },
          },
          title: {
            text: "Buyurtmalar soni",
            style: {
              color: "#2563eb",
              fontWeight: 600,
              fontFamily: "'Google Sans', sans-serif",
            },
          },
        },
        {
          seriesName: "Daromad ($k)",
          opposite: true,
          axisTicks: {
            show: true,
            color: "#10b981",
          },
          axisBorder: {
            show: true,
            color: "#10b981",
          },
          labels: {
            style: {
              colors: "#10b981",
              fontFamily: "'Google Sans', sans-serif",
            },
          },
          title: {
            text: "Daromad ($k)",
            style: {
              color: "#10b981",
              fontWeight: 600,
              fontFamily: "'Google Sans', sans-serif",
            },
          },
        },
      ],
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Google Sans', sans-serif",
          },
        },
      },
      tooltip: {
        theme: "light",
        x: {
          format: "dd MMM yyyy",
        },
      },
    }

    const brushOpts = {
      chart: {
        id: "chart1",
        height: 130,
        type: "area",
        brush: {
          target: "chart2",
          enabled: true,
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("05 Jan 2025").getTime(),
            max: new Date("10 Feb 2025").getTime(),
          },
          fill: {
            color: "#2563eb",
            opacity: 0.15,
          },
          stroke: {
            width: 1,
            color: "#2563eb",
          },
        },
        fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
      },
      colors: ["#2563eb", "#10b981"],
      stroke: {
        width: [1.5, 2],
        curve: ["straight", "monotoneCubic"],
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.8,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Google Sans', sans-serif",
          },
        },
      },
      yaxis: {
        tickAmount: 2,
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Google Sans', sans-serif",
          },
        },
      },
      grid: {
        borderColor: "#f1f5f9",
      },
    }

    return {
      series: seriesData,
      mainOptions: mainOpts,
      brushOptions: brushOpts,
    }
  }, [])

  return (
    <div className="w-full flex flex-col">
      <div className="w-full" id="chart-line2">
        <Chart
          options={mainOptions}
          series={series}
          type="line"
          height={240}
          width="100%"
        />
      </div>
      <div className="w-full -mt-2" id="chart-line">
        <Chart
          options={brushOptions}
          series={series}
          type="area"
          height={130}
          width="100%"
        />
      </div>
    </div>
  )
}

export default BrushAnalyticsChart;
