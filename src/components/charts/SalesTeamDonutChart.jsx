import Chart from "react-apexcharts"

export function SalesTeamDonutChart() {
  const series = [44, 25, 18, 13]

  const options = {
    chart: {
      type: "donut",
      fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
    },
    labels: [
      "Marguerite Tillman",
      "Gabriel Barton",
      "Kathleen Abernathy",
      "Devon Reyes",
    ],
    colors: ["#0ea5e9", "#14b8a6", "#f59e0b", "#f43f5e"],
    plotOptions: {
      pie: {
        borderRadius: 8,
        spacing: 4,
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 600,
              color: "#64748b",
            },
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 700,
              color: "#0f172a",
              formatter: (val) => `${val}%`,
            },
            total: {
              show: true,
              label: "Jami buyurtmalar",
              fontSize: "13px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 600,
              color: "#64748b",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return `${total}%`
              },
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      fontFamily: "'Google Sans', sans-serif",
      fontWeight: 500,
      labels: {
        colors: "#0f172a",
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val}% ulush`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Chart
        options={options}
        series={series}
        type="donut"
        width="100%"
        height={320}
      />
    </div>
  )
}

export default SalesTeamDonutChart;
