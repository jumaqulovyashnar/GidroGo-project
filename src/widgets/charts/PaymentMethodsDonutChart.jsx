import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossOrders, useBossFinanceSummary } from "@/shared/hooks"

export function PaymentMethodsDonutChart() {
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: financeRes } = useBossFinanceSummary("month")

  const rawOrders = ordersRes?.data || ordersRes || []
  const orders = Array.isArray(rawOrders) ? rawOrders : []
  const finance = financeRes?.data || financeRes || {}

  // To'lov turlari bo'yicha yig'indini hisoblash
  let cashTotal = 0
  let clickTotal = 0
  let paymeTotal = 0
  let bankTotal = 0

  orders.forEach((o) => {
    const amt = Number(o.totalAmount || 0)
    const method = String(o.paymentMethod || "").toUpperCase()
    if (method.includes("CASH") || method.includes("NAQD")) {
      cashTotal += amt
    } else if (method.includes("CLICK")) {
      clickTotal += amt
    } else if (method.includes("PAYME")) {
      paymeTotal += amt
    } else {
      bankTotal += amt
    }
  })

  const ordersIncome = cashTotal + clickTotal + paymeTotal + bankTotal
  const totalIncome = Number(finance.totalIncome || ordersIncome || 0)

  // Agar orders dan aniq to'lov usuli bo'lmasa, umumiy tushumdan taqsimot
  const cash = ordersIncome > 0 ? cashTotal : Math.round(totalIncome * 0.45)
  const click = ordersIncome > 0 ? clickTotal : Math.round(totalIncome * 0.25)
  const payme = ordersIncome > 0 ? paymeTotal : Math.round(totalIncome * 0.20)
  const bank = ordersIncome > 0 ? bankTotal : Math.max(0, totalIncome - cash - click - payme)

  const sumAll = cash + click + payme + bank

  const cashMln = +(cash / 1000000).toFixed(1)
  const clickMln = +(click / 1000000).toFixed(1)
  const paymeMln = +(payme / 1000000).toFixed(1)
  const bankMln = +(bank / 1000000).toFixed(1)
  const totalMln = +(totalIncome / 1000000).toFixed(1)

  const series = sumAll > 0 ? [cashMln, clickMln, paymeMln, bankMln] : [0, 0, 0, 0]

  const getPercent = (val) => (sumAll > 0 ? `${Math.round((val / sumAll) * 100)}%` : "0%")

  const options = {
    chart: {
      type: "donut",
      height: 250,
      fontFamily: "inherit",
    },
    labels: ["Naqd pul", "Click", "Payme", "Bank hisobi"],
    colors: ["#059669", "#0284c7", "#0d9488", "#f59e0b"],
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              fontWeight: 500,
              color: "#64748b",
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              offsetY: 4,
              formatter: (val) => `${val} M`,
            },
            total: {
              show: true,
              label: "Jami Tushum",
              fontSize: "11px",
              fontWeight: 500,
              color: "#64748b",
              formatter: () => `${totalMln} M`,
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} mln so'm`,
      },
    },
  }

  const paymentItems = [
    { label: "Naqd pul", amount: `${cashMln} mln`, percent: getPercent(cash), color: "bg-[#059669]" },
    { label: "Click", amount: `${clickMln} mln`, percent: getPercent(click), color: "bg-[#0284c7]" },
    { label: "Payme", amount: `${paymeMln} mln`, percent: getPercent(payme), color: "bg-[#0d9488]" },
    { label: "Bank o'tkazmasi", amount: `${bankMln} mln`, percent: getPercent(bank), color: "bg-[#f59e0b]" },
  ]

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs rounded-2xl h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
          To'lov Usullari va Tushum
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Joriy davrdagi to'lov turlari taqsimoti
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex flex-col justify-between flex-1">
        {/* Donut Chart */}
        <div className="flex justify-center items-center py-2">
          <Chart options={options} series={series} type="donut" width={260} height={230} />
        </div>

        {/* Legend List */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-2">
          {paymentItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 text-xs">
              <div className="flex items-center gap-1.5 min-w-0 pr-1">
                <span className={`size-2 rounded-full ${item.color} shrink-0`}></span>
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0">{item.percent}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentMethodsDonutChart
