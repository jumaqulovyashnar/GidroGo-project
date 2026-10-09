import { useState } from "react"
import { Link } from "react-router-dom"
import { Select } from "@mantine/core"
import { CreditCard, Receipt, Landmark, ShoppingBag, Download, Plus, TrendingUp, TrendingDown, ChevronRight, Calendar, ChevronDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { FinanceDynamicChart, ExpensesBreakdownCard, PaymentMethodsDonutChart } from "@/widgets"
import { useBossFinanceSummary } from "@/shared/hooks"

const periodOptions = [
  { value: "today", label: "Bugun" },
  { value: "week", label: "Hafta" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

export function BossMoliyaPage() {
  const [activePeriod, setActivePeriod] = useState("this_month")

  const periodParam =
    activePeriod === "this_month"
      ? "month"
      : activePeriod === "this_year"
      ? "year"
      : activePeriod

  const { data: financeRes } = useBossFinanceSummary(periodParam)
  const finance = financeRes?.data || financeRes || {}

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  const topMetrics = [
    {
      id: "tushum",
      title: "UMUMIY TUSHUM",
      value: formatNumber(finance.totalIncome),
      unit: "so'm",
      icon: CreditCard,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      change: "+14.2%",
      isPositive: true,
      subtext: "tanlangan davr bo'yicha",
    },
    {
      id: "xarajat",
      title: "OPERATSION XARAJATLAR",
      value: formatNumber(finance.totalExpense),
      unit: "so'm",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      change: "+4.8%",
      isPositive: false,
      subtext: "reja me'yorida",
    },
    {
      id: "sof_foyda",
      title: "SOF FOYDA (EBITDA)",
      value: formatNumber(finance.netProfit),
      unit: "so'm",
      icon: Landmark,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      change: "+21.5%",
      isPositive: true,
      badgeText: "Sof tushum",
    },
    {
      id: "chek",
      title: "O'RTACHA BUYURTMA CHEKI",
      value: "38 400",
      unit: "so'm",
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      change: "+2.1%",
      isPositive: true,
      subtext: "hisoblangan chek",
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link
          to="/boss"
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          BOSHQARUV PANELI
        </Link>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-800">MOLIYA VA FOYDA TAHLILI</span>
      </div>

      {/* 2. Sarlavha, Davr Tanlov Tugmalari va Amallar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Moliya va Foyda Tahlili
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Moliyaviy oqim, xarajatlar va sof foyda hisoboti.
          </p>
        </div>

        {/* O'ng tomon: Davr tugmalari + Action tugmalari */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={activePeriod}
            onChange={(val) => setActivePeriod(val || "this_month")}
            data={periodOptions}
            allowDeselect={false}
            maxDropdownHeight={400}
            leftSection={<Calendar className="size-3.5 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-36 sm:w-40",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />

          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-1.5 shadow-2xs h-9 px-3.5"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Hisobot (PDF/Excel)</span>
          </Button>

          <button
            type="button"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs h-9 px-4 flex items-center transition-colors cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Xarajat qo'shish</span>
          </button>
        </div>
      </div>

      {/* 3. Top 4 ta Moliyaviy KPI Kartalari (1 qatorda tekis) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-1 space-y-0 p-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex-1 leading-snug">
                  {item.title}
                </CardTitle>
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ml-1.5 ${item.iconBg}`}>
                  <Icon className="size-4 stroke-[1.8]" />
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {item.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  {item.change && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.isPositive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.isPositive ? (
                        <TrendingUp className="size-3" strokeWidth={2.5} />
                      ) : (
                        <TrendingDown className="size-3" strokeWidth={2.5} />
                      )}
                      {item.change}
                    </span>
                  )}

                  {item.badgeText && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {item.badgeText}
                    </span>
                  )}

                  {item.subtext && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 4. Asosiy Daromad va Xarajatlar Dinamikasi Grafigi */}
      <FinanceDynamicChart />

      {/* 5. Pastki Qism: Xarajatlar Strukturasi + To'lov Usullari Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ExpensesBreakdownCard />
        </div>
        <div className="lg:col-span-5">
          <PaymentMethodsDonutChart />
        </div>
      </div>
    </div>
  )
}

export default BossMoliyaPage;
