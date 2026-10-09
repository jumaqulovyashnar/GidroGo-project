import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossOrders, useBossDashboard } from "@/shared/hooks"

export function OrdersWeeklyChart() {
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: dashboardRes } = useBossDashboard()

  const rawOrders = ordersRes?.data || ordersRes || []
  const orders = Array.isArray(rawOrders) ? rawOrders : []
  const db = dashboardRes?.data || dashboardRes || {}

  const categories = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"]

  // Hafta kunlari bo'yicha hisoblash
  const countsByDayIndex = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 }

  orders.forEach((order) => {
    if (order.createdAt) {
      const d = new Date(order.createdAt)
      const day = d.getDay()
      countsByDayIndex[day] = (countsByDayIndex[day] || 0) + 1
    }
  })

  // Agar orders ro'yxati bo'sh bo'lsa, bugungi buyurtmalar sonini bugungi kunga qo'yamiz
  const todayDay = new Date().getDay()
  if (orders.length === 0 && db.todayOrders) {
    countsByDayIndex[todayDay] = db.todayOrders
  }

  const data = [
    countsByDayIndex[1] || 0, // Dush
    countsByDayIndex[2] || 0, // Sesh
    countsByDayIndex[3] || 0, // Chor
    countsByDayIndex[4] || 0, // Pay
    countsByDayIndex[5] || 0, // Jum
    countsByDayIndex[6] || 0, // Shan
    countsByDayIndex[0] || 0, // Yak
  ]

  const maxVal = Math.max(...data, 1)
  const totalWeekly = data.reduce((a, b) => a + b, 0) || db.todayOrders || 0
  const avgPerDay = Math.round(totalWeekly / 7)

  const series = [
    {
      name: "Buyurtmalar",
      data: data,
    },
  ]

  const options = {
    chart: {
      type: "bar",
      height: 230,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "top",
        columnWidth: "55%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: data.map((val) => (val === maxVal && val > 0 ? "#059669" : "#E2E8F0")),
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: data.map((val) => (val === maxVal && val > 0 ? "#059669" : "#64748B")),
      },
    },
    legend: { show: false },
    grid: {
      show: false,
      padding: { top: 15, right: 0, bottom: 0, left: 0 },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px", fontWeight: 500 },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} ta buyurtma`,
      },
    },
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Buyurtmalar (Haftalik dinamika)
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Oxirgi 7 kunlik yetkazilgan buyurtmalar hajmi
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            JAMI
          </span>
          <span className="text-base font-bold text-emerald-600">
            {totalWeekly} ta
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[210px] w-full">
          <Chart options={options} series={series} type="bar" height={210} />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-1">
          <span>O'rtacha ko'rsatkich:</span>
          <span className="font-semibold text-slate-700">{avgPerDay} ta / kun</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrdersWeeklyChart
