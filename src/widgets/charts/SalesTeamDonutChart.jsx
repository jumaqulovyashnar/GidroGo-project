import { useMemo } from "react"
import Chart from "react-apexcharts"

export function SalesTeamDonutChart({ dashboard = {}, regionalStats = {} }) {
  const { series, labels, colors, totalCount, totalLabel } = useMemo(() => {
    const regions = regionalStats?.regions || []
    const hasRegions = Array.isArray(regions) && regions.length > 0

    // 1. Agar hududlar kesimida statistika kelsa (API: /superadmin/statistics/regions)
    if (hasRegions) {
      const regionSeries = regions.map((r) => Number(r.totalFarms ?? r.count ?? r.value ?? 0))
      const hasAnyValue = regionSeries.some((v) => v > 0)

      if (hasAnyValue) {
        const regionLabels = regions.map((r) => r.regionName || r.name || "Hudud")
        const total = Number(regionalStats.totalFarms || dashboard.totalFarms || regionSeries.reduce((a, b) => a + b, 0))

        const palette = [
          "#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4",
          "#EC4899", "#84CC16", "#F97316", "#6366F1", "#14B8A6",
        ]

        return {
          series: regionSeries,
          labels: regionLabels,
          colors: palette.slice(0, Math.max(regionLabels.length, 1)),
          totalCount: total,
          totalLabel: "Jami fermalar",
        }
      }
    }

    // 2. Aks holda Dashboard KPI dan (API: /superadmin/dashboard)
    // Faol fermalar vs Bloklangan fermalar
    const active = Number(dashboard.activeFarms ?? 0)
    const blocked = Number(dashboard.blockedFarms ?? 0)
    const total = Number(dashboard.totalFarms ?? (active + blocked))

    // Agar ikkalasi ham 0 bo'lsa - default gray aylana
    if (active === 0 && blocked === 0) {
      return {
        series: [1],
        labels: ["Ma'lumot yo'q"],
        colors: ["#E2E8F0"],
        totalCount: 0,
        totalLabel: "Jami fermalar",
      }
    }

    return {
      series: [active, blocked],
      labels: ["Faol fermalar", "Bloklangan fermalar"],
      colors: ["#10B981", "#EF4444"], // Faol: Yashil, Bloklangan: Qizil
      totalCount: total,
      totalLabel: "Jami fermalar",
    }
  }, [dashboard, regionalStats])

  const options = {
    chart: {
      type: "donut",
      fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
    },
    labels,
    colors,
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
              fontSize: "13px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 600,
              color: "#64748b",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 700,
              color: "#0f172a",
              formatter: (val) => `${val} ta`,
            },
            total: {
              show: true,
              label: totalLabel,
              fontSize: "12px",
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 600,
              color: "#64748b",
              formatter: () => `${totalCount} ta`,
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 2.5,
      colors: ["#ffffff"],
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
        formatter: (val) => `${val} ta ferma`,
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

export default SalesTeamDonutChart
