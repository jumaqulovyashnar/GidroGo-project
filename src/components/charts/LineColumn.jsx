import { useState } from "react"
import ReactApexChart from "react-apexcharts"

const LineColumn = () => {
  const [state] = useState({
    series: [
      {
        name: "Buyurtmalar soni",
        data: [18, 24, 22, 28, 31, 40, 44, 46, 55, 59, 67, 74],
      },
      {
        name: "Yangi mijozlar",
        data: [12, 15, 18, 21, 27, 32, 37, 42, 48, 53, 58, 63],
      },
    ],
    options: {
      chart: {
        height: 360,
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: "inherit",
      },
      colors: ["#1d4ed8", "#38bdf8"],
      stroke: {
        curve: "smooth",
        width: [3, 2],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: [0.12, 0.45],
          opacityTo: [0.0, 0.05],
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: 0,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 10,
            fillColor: "#ffffff",
            strokeColor: "#1d4ed8",
            size: 5,
            shape: "circle",
          },
          {
            seriesIndex: 0,
            dataPointIndex: 11,
            fillColor: "#1d4ed8",
            strokeColor: "#ffffff",
            size: 6,
            shape: "circle",
          },
        ],
        hover: {
          size: 6,
        },
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 10,
          right: 20,
          bottom: 0,
          left: 10,
        },
      },
      xaxis: {
        categories: [
          "May",
          "Iyun",
          "Iyul",
          "Avg",
          "Sen",
          "Okt",
          "Noy",
          "Dek",
          "Yan",
          "Fev",
          "Mar",
          "Apr '25",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: [
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#64748b",
              "#1d4ed8",
            ],
            fontSize: "12px",
            fontWeight: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 700],
          },
        },
      },
      yaxis: {
        title: {
          text: "Ko'rsatkich (ming ta)",
          style: {
            color: "#64748b",
            fontSize: "12px",
            fontWeight: 500,
          },
        },
        labels: {
          style: {
            colors: ["#64748b"],
            fontSize: "12px",
          },
          formatter: (val) => val.toFixed(0),
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "light",
        y: {
          formatter: (val) => (typeof val !== "undefined" ? val + " ming ta" : "0"),
        },
      },
    },
  })

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Sarlavha va Legend (Rasmga to'liq mos) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Oylik Buyurtmalar va Mijozlar O'sish Tendensiyasi
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Oxirgi 12 oylik retrospektiv oqim dinamikasi
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded-full bg-blue-700 inline-block" />
            <span>Buyurtmalar soni</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded-full bg-sky-400 inline-block" />
            <span>Yangi mijozlar</span>
          </div>
        </div>
      </div>

      {/* ApexChart */}
      <div className="w-full">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={360}
        />
      </div>
    </div>
  )
}

export { LineColumn }
export default LineColumn