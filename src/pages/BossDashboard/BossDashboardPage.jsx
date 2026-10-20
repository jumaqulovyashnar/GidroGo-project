import { useState, lazy, Suspense } from "react"
import { Select } from "@mantine/core"
import { Banknote, Calendar, ChevronDown, Droplet, Receipt, ShoppingBag, TrendingUp, Truck, Users, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Spinner } from "@/shared/ui"
import { useBossDashboard, useBossTodayOrders } from "@/shared/hooks"

const SyncingChart = lazy(() => import("@/widgets").then((m) => ({ default: m.SyncingChart })))
const OrdersWeeklyChart = lazy(() => import("@/widgets").then((m) => ({ default: m.OrdersWeeklyChart })))
const WaterSalesVolumeChart = lazy(() => import("@/widgets").then((m) => ({ default: m.WaterSalesVolumeChart })))
const CouriersPerformanceCard = lazy(() => import("@/widgets").then((m) => ({ default: m.CouriersPerformanceCard })))

const dateOptions = [
  { value: "today", label: "Bugun" },
  { value: "yesterday", label: "Kecha" },
  { value: "this_week", label: "Shu hafta" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

export const BossDashboardPage = () => {
  const [date, setDate] = useState("today")
  const {
    data: dashboardRes,
    isError,
    error,
    refetch,
  } = useBossDashboard()
  const { data: todayOrdersRes, isLoading: isOrdersLoading } = useBossTodayOrders({ limit: 10 })

  const rawTodayOrders = todayOrdersRes?.data?.orders || todayOrdersRes?.data || (Array.isArray(todayOrdersRes) ? todayOrdersRes : null)
  const todayOrders = Array.isArray(rawTodayOrders) ? rawTodayOrders : []
  const db = dashboardRes?.data || dashboardRes || {}

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  const isMonthly = date === "this_month" || date === "this_year"

  // 1. Asosiy moliyaviy ko'rsatkichlar (3 ta - 100% Real API)
  const financialMetrics = [
    {
      id: 1,
      title: isMonthly ? "Oylik tushum" : "Bugungi tushum",
      value: formatNumber(isMonthly ? db.monthIncome : db.todayIncome),
      unit: "so'm",
      icon: Banknote,
      subtext: isMonthly ? "Fermaning oylik jami tushumi" : "Kassadagi bugungi tushum",
    },
    {
      id: 2,
      title: "Bugungi xarajat",
      value: formatNumber(db.todayExpense),
      unit: "so'm",
      icon: Receipt,
      subtext: "Fermaning operatsion sarf-xarajatlari",
    },
    {
      id: 3,
      title: isMonthly ? "Oylik sof foyda" : "Bugungi sof foyda",
      value: formatNumber(isMonthly ? db.monthProfit : db.todayProfit),
      unit: "so'm",
      icon: TrendingUp,
      subtext: "Tushumdan xarajat chegirilgan sof foyda",
    },
  ]

  // 2. Operatsion ko'rsatkichlar (4 ta - 100% Real API)
  const operationalMetrics = [
    {
      id: 4,
      title: "Kunlik buyurtmalar",
      value: formatNumber(db.todayOrders),
      unit: "ta",
      icon: ShoppingBag,
      subtext: `${db.deliveredToday ?? 0} ta yetkazildi • ${db.activeOrders ?? 0} ta faol`,
    },
    {
      id: 5,
      title: "Sotilgan toza suv",
      value: formatNumber(db.bottlesSoldToday),
      unit: "dona",
      icon: Droplet,
      subtext: `Ombor zaxirasi: ${formatNumber(db.warehouseBottles)} dona`,
    },
    {
      id: 6,
      title: "Mijozlar bazasi",
      value: formatNumber(db.totalClients),
      unit: "ta",
      icon: Users,
      subtext: "Fermaga biriktirilgan jami mijozlar",
    },
    {
      id: 7,
      title: "Yetkazib beruvchilar",
      value: `${db.activeCouriers ?? 0}`,
      unit: "nafar",
      icon: Truck,
      subtext: `${db.activeCouriers ?? 0} nafar kuryer ish holatida`,
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Sarlavha va Davr selekti */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ferma Rahbari
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fermangizning joriy holati, ko'rsatkichlari va tahlillari.
          </p>
        </div>

        <div className="shrink-0">
          <Select
            value={date}
            onChange={(val) => setDate(val || "today")}
            data={dateOptions}
            allowDeselect={false}
            maxDropdownHeight={450}
            leftSection={<Calendar className="size-4 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-full sm:w-40",
              input:
                "!h-10 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500 shadow-xs",
              dropdown:
                "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
            }}
          />
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Dashboard ma'lumotlarini yuklashda xatolik yuz berdi: {error?.response?.data?.message || error?.message || "Server xatosi"}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* 1-Qism: Asosiy Moliyaviy Kartochkalar (3 ta ustun) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {financialMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200/80 bg-white hover:border-slate-300/80 hover:shadow-md transition-all duration-200 rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </CardTitle>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-2xs bg-blue-50 text-blue-600 border border-blue-100/80">
                  <Icon className="w-6 h-6 text-blue-600" strokeWidth={2} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
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

      {/* 2-Qism: Operatsion Ko'rsatkichlar Kartochkalari (4 ta ustun) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {operationalMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200/80 bg-white hover:border-slate-300/80 hover:shadow-md transition-all duration-200 rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-semibold text-slate-500">
                  {item.title}
                </CardTitle>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-2xs bg-blue-50 text-blue-600 border border-blue-100/80">
                  <Icon className="w-6 h-6 text-blue-600" strokeWidth={2} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      {item.unit}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2.5 truncate" title={item.subtext}>
                  {item.subtext}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3-Qism: Moliyaviy Holat Grafigi (SyncingChart) */}
      <Suspense fallback={<div className="h-72 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-2"><Spinner size="md" /><span className="text-xs text-slate-400">Moliyaviy grafik yuklanmoqda...</span></div>}>
        <SyncingChart />
      </Suspense>

      {/* 4-Qism: 2 ta grafik (Buyurtmalar haftalik dinamikasi + Suv va zaxira balansi) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-2"><Spinner size="md" /><span className="text-xs text-slate-400">Haftalik grafik yuklanmoqda...</span></div>}>
          <OrdersWeeklyChart />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-2"><Spinner size="md" /><span className="text-xs text-slate-400">Suv sotuvi grafigi yuklanmoqda...</span></div>}>
          <WaterSalesVolumeChart />
        </Suspense>
      </div>

      {/* 5-Qism: Dastavkachilar faoliyati jadvali */}
      <Suspense fallback={<div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-2"><Spinner size="md" /><span className="text-xs text-slate-400">Dastavkachilar jadvali yuklanmoqda...</span></div>}>
        <CouriersPerformanceCard />
      </Suspense>

      {/* 6-Qism: Bugungi so'nggi buyurtmalar monitoringi (GET /api/boss/orders/today) */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Bugungi so'nggi buyurtmalar monitoringi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real vaqtda qabul qilingan va yetkazilayotgan bugungi operativ buyurtmalar
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            {todayOrders.length} ta buyurtma
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Buyurtma</th>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Manzil</th>
                <th className="py-3 px-4">Biriktirilgan kuryer</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isOrdersLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Bugungi buyurtmalar yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : todayOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Bugun hali buyurtmalar tushmadi
                  </td>
                </tr>
              ) : (
                todayOrders.slice(0, 10).map((ord) => {
                  const statusLabel =
                    ord.status === "COMPLETED" || ord.status === "DELIVERED"
                      ? "Yetkazildi"
                      : ord.status === "ON_THE_WAY" || ord.status === "DELIVERING"
                      ? "Yetkazilmoqda"
                      : ord.status === "ASSIGNED"
                      ? "Kuryerda"
                      : ord.status === "NEW"
                      ? "Yangi"
                      : ord.status || "Jarayonda"

                  const isDone = ord.status === "COMPLETED" || ord.status === "DELIVERED"
                  const isDelivering = ord.status === "ON_THE_WAY" || ord.status === "DELIVERING"

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{ord.orderNumber || ord.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block truncate max-w-[140px]">
                          {ord.clientName || "Mijoz"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ord.clientPhone || "—"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={ord.deliveryAddress}>
                        {ord.deliveryAddress || "Manzil ko'rsatilmagan"}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.courierName ? (
                          <span className="font-medium text-slate-800">
                            {ord.courierName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Biriktirilmagan</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                            isDone
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isDelivering
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono whitespace-nowrap">
                        {Number(ord.totalSum || 0).toLocaleString()} so'm
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default BossDashboardPage;
