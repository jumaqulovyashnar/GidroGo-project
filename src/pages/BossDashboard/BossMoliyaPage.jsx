import { useState, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { Select } from "@mantine/core"
import { CreditCard, Receipt, Landmark, ShoppingBag, Download, Plus, ChevronRight, Calendar, ChevronDown, HandCoins, ArrowDownToLine, Wallet, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from "@/shared/ui"
import { useBossFinanceSummary, useBossOrders, useBossCashSummary } from "@/shared/hooks"

const FinanceDynamicChart = lazy(() => import("@/widgets").then((m) => ({ default: m.FinanceDynamicChart })))

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
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: cashSummaryRes } = useBossCashSummary()

  const finance = financeRes?.data || financeRes || {}
  const rawOrders = ordersRes?.data || ordersRes || []
  const orders = Array.isArray(rawOrders) ? rawOrders : []
  const cashSummary = cashSummaryRes?.data || cashSummaryRes || {}

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  const totalInc = Number(finance.totalIncome || 0)
  const totalExp = Number(finance.totalExpense || 0)
  const netProf = Number(finance.netProfit || 0)
  const avgCheck = orders.length > 0 && totalInc > 0 ? Math.round(totalInc / orders.length) : 0

  const topMetrics = [
    {
      id: "tushum",
      title: "UMUMIY TUSHUM",
      value: formatNumber(totalInc),
      unit: "so'm",
      icon: CreditCard,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      subtext: "Tanlangan davrdagi jami tushum",
    },
    {
      id: "xarajat",
      title: "OPERATSION XARAJATLAR",
      value: formatNumber(totalExp),
      unit: "so'm",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      subtext: "Fermaning operatsion sarf-xarajatlari",
    },
    {
      id: "sof_foyda",
      title: "SOF FOYDA (EBITDA)",
      value: formatNumber(netProf),
      unit: "so'm",
      icon: Landmark,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      subtext: "Tushumdan xarajat chegirilgan sof foyda",
    },
    {
      id: "chek",
      title: "O'RTACHA BUYURTMA CHEKI",
      value: formatNumber(avgCheck),
      unit: "so'm",
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      subtext: orders.length > 0 ? `${orders.length} ta buyurtma asosida` : "Buyurtmalar asosida hisoblanadi",
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

      {/* 3. Top 4 ta Moliyaviy KPI Kartalari (100% Real API) */}
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
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {item.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2.5 truncate" title={item.subtext}>
                  {item.subtext}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
 
      {/* 4. Kassa va Inkassatsiya Monitoringi (GET /api/boss/cash/summary) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Kassa va Inkassatsiya Hisoboti
            </h2>
            <p className="text-xs text-slate-500">
              Kuryerlardan yig'ilgan naqd pul, kassaga topshirilgan va qoldiq summalar monitoringi
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Real vaqt
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Jami Yig'ilgan Naqd Pul
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-bold text-blue-600 font-mono">
                    {formatNumber(cashSummary.totalCollected)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">so'm</span>
                </div>
              </div>
              <div className="size-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                <HandCoins className="size-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Kuryerlar tomonidan qabul qilingan naqd pul
            </p>
          </Card>

          <Card className="border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kassaga Topshirilgan
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-bold text-blue-600 font-mono">
                    {formatNumber(cashSummary.totalHandedOver)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">so'm</span>
                </div>
              </div>
              <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <ArrowDownToLine className="size-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Menejer tomonidan tasdiqlangan summa
            </p>
          </Card>

          <Card className="border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Dastavkachilar Qo'lida
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-bold text-blue-600 font-mono">
                    {formatNumber(cashSummary.remainingWithCouriers)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">so'm</span>
                </div>
              </div>
              <div className="size-8 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Wallet className="size-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Topshirilishi kutilayotgan kassa balansi
            </p>
          </Card>

          <Card className="border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kassasi Bor Kuryerlar
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-bold text-blue-600 font-mono">
                    {cashSummary.activeCouriersWithCash ?? 0}
                  </span>
                  <span className="text-xs font-medium text-slate-500">nafar</span>
                </div>
              </div>
              <div className="size-8 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <Users className="size-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Qo'lida naqd pul bo'lgan xodimlar soni
            </p>
          </Card>
        </div>
      </div>

      {/* 5. Asosiy Daromad va Xarajatlar Dinamikasi Grafigi */}
      <Suspense
        fallback={
          <div className="h-72 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-slate-400">Moliyaviy dinamika grafigi yuklanmoqda...</span>
          </div>
        }
      >
        <FinanceDynamicChart period={periodParam} />
      </Suspense>
    </div>
  )
}

export default BossMoliyaPage;
