import { useState, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { Select } from "@mantine/core"
import { CreditCard, Receipt, Landmark, ShoppingBag, Download, Plus, ChevronRight, Calendar, ChevronDown, HandCoins, ArrowDownToLine, Wallet, Users, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Card, Button, Spinner } from "@/shared/ui"
import {
  useBossFinanceSummary,
  useBossOrders,
  useBossCashSummary,
  useBossCreateExpense,
} from "@/shared/hooks"
import { AddExpenseModal } from "@/components"

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

  const {
    data: financeRes,
    isError: isFinanceError,
    error: financeError,
    refetch: refetchFinance,
  } = useBossFinanceSummary(periodParam)
  const { data: ordersRes } = useBossOrders({ all: true })
  const { data: cashSummaryRes } = useBossCashSummary()

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const { mutate: createExpense, isPending: isCreatingExpense } = useBossCreateExpense()

  const handleAddExpense = (payload, onSuccessCallback) => {
    createExpense(payload, {
      onSuccess: () => {
        toast.success("Xarajat muvaffaqiyatli qo'shildi!")
        onSuccessCallback?.()
        refetchFinance()
      },
      onError: (err) => {
        toast.error(err.message || "Xarajat qo'shishda xatolik yuz berdi!")
      },
    })
  }

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
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Tanlangan davrdagi jami tushum",
    },
    {
      id: "xarajat",
      title: "OPERATSION XARAJATLAR",
      value: formatNumber(totalExp),
      unit: "so'm",
      icon: Receipt,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Fermaning operatsion sarf-xarajatlari",
    },
    {
      id: "sof_foyda",
      title: "SOF FOYDA (EBITDA)",
      value: formatNumber(netProf),
      unit: "so'm",
      icon: Landmark,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Tushumdan xarajat chegirilgan sof foyda",
    },
    {
      id: "chek",
      title: "O'RTACHA BUYURTMA CHEKI",
      value: formatNumber(avgCheck),
      unit: "so'm",
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: orders.length > 0 ? `${orders.length} ta buyurtma asosida` : "Buyurtmalar asosida hisoblanadi",
    },
  ]

  const cashMetrics = [
    {
      id: "collected",
      title: "JAMI YIG'ILGAN NAQD PUL",
      value: formatNumber(cashSummary.totalCollected),
      unit: "so'm",
      icon: HandCoins,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Kuryerlar tomonidan qabul qilingan naqd pul",
    },
    {
      id: "handed_over",
      title: "KASSAGA TOPSHIRILGAN",
      value: formatNumber(cashSummary.totalHandedOver),
      unit: "so'm",
      icon: ArrowDownToLine,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Menejer tomonidan tasdiqlangan summa",
    },
    {
      id: "couriers_hand",
      title: "DASTAVKACHILAR QO'LIDA",
      value: formatNumber(cashSummary.remainingWithCouriers),
      unit: "so'm",
      icon: Wallet,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Topshirilishi kutilayotgan kassa balansi",
    },
    {
      id: "couriers_count",
      title: "KASSASI BOR KURYERLAR",
      value: String(cashSummary.activeCouriersWithCash ?? 0),
      unit: "nafar",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100/80",
      subtext: "Qo'lida naqd pul bo'lgan xodimlar soni",
    },
  ]

  const renderMetricCard = (item) => {
    const Icon = item.icon
    return (
      <Card
        key={item.id}
        className="border border-slate-200/80 bg-white hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[148px] sm:min-h-[156px]"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 leading-snug">
            {item.title}
          </span>
          <div className="size-11 sm:size-12 rounded-full flex items-center justify-center shrink-0 border shadow-2xs bg-blue-50 text-blue-600 border-blue-100/80">
            <Icon className="size-5.5 stroke-[1.8] text-blue-600" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600">
              {item.value}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {item.unit}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate" title={item.subtext}>
            {item.subtext}
          </p>
        </div>
      </Card>
    )
  }

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
            onClick={() => setIsExpenseModalOpen(true)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs h-9 px-4 flex items-center transition-colors cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Xarajat qo'shish</span>
          </button>
        </div>
      </div>

      {/* Error state banner */}
      {isFinanceError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Moliya ma'lumotlarini yuklashda xatolik yuz berdi: {financeError?.response?.data?.message || financeError?.message || "Server xatosi"}</span>
          </div>
          <button
            type="button"
            onClick={() => refetchFinance()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* 3. Top 4 ta Moliyaviy KPI Kartalari (100% Real API) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {topMetrics.map(renderMetricCard)}
      </div>
 
      {/* 4. Kassa va Inkassatsiya Monitoringi (GET /api/boss/cash/summary) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Kassa va Inkassatsiya Hisoboti
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              Kuryerlardan yig'ilgan naqd pul, kassaga topshirilgan va qoldiq summalar monitoringi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cashMetrics.map(renderMetricCard)}
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

      {/* 6. Xarajat qo'shish Modali */}
      <AddExpenseModal
        opened={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
        isSubmitting={isCreatingExpense}
      />
    </div>
  )
}

export default BossMoliyaPage;
