import { useMemo } from "react"
import Chart from "react-apexcharts"
import { Droplet, ShoppingBag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossOrders, useBossDashboard, useBossSalesSummary } from "@/shared/hooks"

export function WeeklySalesDynamicsChart() {
  const { data: salesRes } = useBossSalesSummary({ period: "7days" })
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: dashboardRes } = useBossDashboard()

  const { categories, actualOrders, waterKL } = useMemo(() => {
    const salesData = salesRes?.data || salesRes || {}
    const rawOrders = ordersRes?.data || ordersRes || []
    const orders = Array.isArray(rawOrders) ? rawOrders : []
    const db = dashboardRes?.data || dashboardRes || {}

    let cats = ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"]
    let ordersList = []
    let waterList = []

    if (Array.isArray(salesData.weeklyDynamics) && salesData.weeklyDynamics.length > 0) {
      cats = salesData.weeklyDynamics.map((d) => d.day || d.date || "Kun")
      waterList = salesData.weeklyDynamics.map((d) => +(Number(d.waterVolumeKl || 0).toFixed(1)))
      ordersList = salesData.weeklyDynamics.map((d) => Number(d.ordersCount || 0))
    } else {
      const countByDay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 }
      const litersByDay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 }

      orders.forEach((o) => {
        if (o.createdAt) {
          const day = new Date(o.createdAt).getDay()
          countByDay[day] = (countByDay[day] || 0) + 1
          const bottles = Number(o.bottleCount || 1)
          litersByDay[day] = (litersByDay[day] || 0) + bottles * 18.9
        }
      })

      const todayDay = new Date().getDay()
      if (orders.length === 0 && db.todayOrders) {
        countByDay[todayDay] = db.todayOrders
        litersByDay[todayDay] = (db.bottlesSoldToday || db.todayOrders) * 18.9
      }

      ordersList = [
        countByDay[1] || 0,
        countByDay[2] || 0,
        countByDay[3] || 0,
        countByDay[4] || 0,
        countByDay[5] || 0,
        countByDay[6] || 0,
        countByDay[0] || 0,
      ]

      waterList = [
        +(litersByDay[1] / 1000).toFixed(1),
        +(litersByDay[2] / 1000).toFixed(1),
        +(litersByDay[3] / 1000).toFixed(1),
        +(litersByDay[4] / 1000).toFixed(1),
        +(litersByDay[5] / 1000).toFixed(1),
        +(litersByDay[6] / 1000).toFixed(1),
        +(litersByDay[0] / 1000).toFixed(1),
      ]
    }

    return { categories: cats, actualOrders: ordersList, waterKL: waterList }
  }, [salesRes, ordersRes, dashboardRes])

  const totalWeeklyOrders = actualOrders.reduce((a, b) => a + b, 0)
  const totalWeeklyLiters = (waterKL.reduce((a, b) => a + b, 0) * 1000).toLocaleString("ru-RU")

  const series = [
    {
      name: "Suv hajmi (kL)",
      data: waterKL,
    },
    {
      name: "Buyurtmalar soni",
      data: actualOrders,
    },
  ]

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
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
      padding: {
        top: 20,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: "#94a3b8",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          if (opts.seriesIndex === 0) {
            return `${val} ming litr`
          }
          return `${val} ta buyurtma`
        },
      },
    },
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Haftalik Savdo Dinamikasi
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Yetkazilgan suv hajmi va buyurtmalar soni
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#047857]" />
            <span>Suv hajmi (kL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#38bdf8]" />
            <span>Buyurtmalar</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">
        <div className="h-72 w-full">
          <Chart options={options} series={series} type="bar" height={280} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-6 border-t border-slate-100">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between shadow-2xs min-h-[104px]">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Jami haftalik hajm
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {totalWeeklyLiters}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-500">L</span>
              </div>
            </div>
            <div className="size-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
              <Droplet className="size-6 text-blue-600 stroke-[1.8]" />
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between shadow-2xs min-h-[104px]">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Jami haftalik buyurtmalar
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {totalWeeklyOrders}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-500">ta</span>
              </div>
            </div>
            <div className="size-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBag className="size-6 text-blue-600 stroke-[1.8]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklySalesDynamicsChart
