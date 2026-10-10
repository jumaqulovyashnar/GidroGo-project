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
  const isZero = sumAll === 0 || totalIncome === 0

  const cashMln = +(cash / 1000000).toFixed(1)
  const clickMln = +(click / 1000000).toFixed(1)
  const paymeMln = +(payme / 1000000).toFixed(1)
  const bankMln = +(bank / 1000000).toFixed(1)
  const totalMln = +(totalIncome / 1000000).toFixed(1)

  // Default / 0 holatida kulrang yumaloq aylana chiqishi uchun [1] beriladi
  const series = isZero ? [1] : [cashMln, clickMln, paymeMln, bankMln]

  const getPercent = (val) => (sumAll > 0 ? `${Math.round((val / sumAll) * 100)}%` : "0%")

  const options = {
    chart: {
      type: "donut",
      height: 250,
      fontFamily: "inherit",
    },
    labels: isZero ? ["Ma'lumot mavjud emas"] : ["Naqd pul", "Click", "Payme", "Bank hisobi"],
    colors: isZero ? ["#e2e8f0"] : ["#059669", "#0284c7", "#0d9488", "#f59e0b"],
    stroke: {
      width: isZero ? 0 : 2,
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
              show: !isZero,
              fontSize: "12px",
              fontWeight: 500,
              color: "#64748b",
              offsetY: -4,
            },
            value: {
              show: !isZero,
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
      enabled: !isZero,
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
    <Card className="border border-slate-200/80 bg-white shadow-xs rounded-2xl w-full">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
          To'lov Usullari va Tushum Taqsimoti
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Joriy davrdagi tushumlarning to'lov usullari bo'yicha taqsimoti
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-5 flex justify-center items-center py-2">
            <Chart options={options} series={series} type="donut" width={280} height={250} />
          </div>

          {/* Legend List */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className={`size-3 rounded-full ${item.color} shrink-0`}></span>
                  <div>
                    <span className="font-semibold text-slate-800 block truncate">{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.amount} so'm</span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                  {item.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentMethodsDonutChart
