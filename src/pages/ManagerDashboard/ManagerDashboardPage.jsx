import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Banknote, Package, CheckCircle2, Truck, TrendingUp, TrendingDown, ChevronRight, ChevronDown, Calendar, Filter, Copy, AlertCircle, MapPin, ArrowUpRight, ArrowDownRight, Car } from "lucide-react"
import { Select } from "@mantine/core"
import { TablePagination } from "@/shared/ui"
import { toast } from "sonner"
import {
  useManagerDashboard,
  useManagerTodayOrders,
  useManagerCouriers,
  useManagerFinanceSummary,
} from "@/shared/hooks"
import { formatOrderStatusUz, getOrderStatusBadgeClass } from "@/shared/lib"

// Props-driven reusable Select filter component using Mantine UI
export function SelectFilter({
  value,
  onChange,
  options = [],
  className = "", 
  ariaLabel = "Filter",
  icon: Icon,
}) {
  return (
    <Select
      aria-label={ariaLabel}
      value={value}
      onChange={(val) => val && onChange(val)}
      data={options}
      allowDeselect={false}
      maxDropdownHeight={350}
      leftSection={Icon && <Icon className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
      rightSection={<ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
      classNames={{
        root: className || "w-36",
        input:
          "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
        dropdown:
          "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white z-50",
        option:
          "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-semibold",
      }}
    />
  )
}

const PERIOD_OPTIONS = [
  { value: "Bugun", label: "Bugun" },
  { value: "Kecha", label: "Kecha" },
  { value: "Hafta", label: "Bu hafta" },
  { value: "Oy", label: "Bu oy" },
]

const PERIOD_LABELS = {
  Bugun: { label: "Bugungi", subtitle: "Bugungi ishlar va operatsion biznes holati" },
  Kecha: { label: "Kechagi", subtitle: "Kechagi ishlar va yakunlangan hisobot" },
  Hafta: { label: "Haftalik", subtitle: "Haftalik biznes va savdo ko'rsatkichlari" },
  Oy: { label: "Oylik", subtitle: "Oylik umumiy aylanma va buyurtmalar tahlili" },
}

export default function ManagerDashboardPage() {
  const navigate = useNavigate()
  const [timeFilter, setTimeFilter] = useState("Bugun")
  const [orderTab, setOrderTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 8

  const periodParam =
    timeFilter === "Bugun"
      ? "today"
      : timeFilter === "Kecha"
      ? "yesterday"
      : timeFilter === "Hafta"
      ? "week"
      : "month"

  // Real Manager API hooks
  const {
    data: dashboardRes,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useManagerDashboard({ period: periodParam })
  const { data: todayOrdersRes, isPending: isOrdersPending } = useManagerTodayOrders()
  const { data: couriersRes, isPending: isCouriersPending } = useManagerCouriers()
  const { data: financeRes, isPending: isFinancePending } = useManagerFinanceSummary({
    period: periodParam,
  })

  const dbData = dashboardRes?.data || dashboardRes || {}
  const rawOrders = todayOrdersRes?.data?.orders || todayOrdersRes?.data || (Array.isArray(todayOrdersRes) ? todayOrdersRes : null)
  const ordersList = useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map((o) => ({
      ...o,
      id: o.id || o._id,
      customer: o.customer || o.clientName || o.client?.name || o.client?.fullName || o.customerName || "Mijoz",
      phone: o.phone || o.clientPhone || o.client?.phone || "",
      address: o.address || o.deliveryAddress || "Manzil ko'rsatilmagan",
      sector: o.sector || o.region || o.district || "",
      product: o.product || o.productName || o.items?.[0]?.productName || "Suv 18.9L",
      qty: Number(o.qty || o.quantity || o.bottlesCount || 1),
      courier: o.courier || o.courierName || o.courier?.fullName || o.courier?.name || null,
      vehicle: o.vehicle || o.courier?.vehicle || "",
      status: o.status || "CREATED",
      statusText: formatOrderStatusUz(o.status || o.statusText),
      total: Number(o.total ?? o.totalPrice ?? o.totalAmount ?? o.price ?? o.amount ?? 0),
      createdAt: o.createdAt || o.date || o.created_at || "—",
    }))
  }, [rawOrders])

  const rawCouriers = couriersRes?.data?.couriers || couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
  const couriersList = useMemo(() => {
    if (!Array.isArray(rawCouriers)) return []
    return rawCouriers.map((c, idx) => {
      const name = c.fullName || c.name || c.courierName || c.user?.fullName || c.user?.name || "Kuryer"
      const initials =
        name
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "KR"
      const vehicle = c.vehicleModel || c.vehicle || c.carModel || ""
      const plate = c.vehiclePlateNumber || c.plate || ""
      const vehicleDisplay = [vehicle, plate ? `(${plate})` : ""].filter(Boolean).join(" ") || "Avtomobil"
      const statusRaw = String(c.status || c.currentStatus || "free").toLowerCase()
      const status =
        statusRaw === "on_way" || statusRaw === "delivering"
          ? "on_way"
          : statusRaw === "loading" || statusRaw === "busy"
          ? "loading"
          : statusRaw === "offline" || c.isOnline === false
          ? "offline"
          : "free"
      const statusText =
        status === "on_way"
          ? "Yo'lda"
          : status === "loading"
          ? "Band"
          : status === "offline"
          ? "Oflayn"
          : "Bo'sh"

      return {
        ...c,
        id: c.id || c.courierId || `courier-${idx}`,
        name,
        initials,
        phone: c.phone || "",
        vehicle: vehicleDisplay,
        status,
        statusText,
        isOnline: status !== "offline",
      }
    })
  }, [rawCouriers])

  const financeData = financeRes?.data || financeRes || {}

  const currentPeriod = PERIOD_LABELS[timeFilter] || PERIOD_LABELS.Bugun

  const formatNum = (val) => (val !== undefined && val !== null ? Number(val).toLocaleString("ru-RU") : "0")

  const totalIncome = Number(
    financeData.totalIncome ??
    financeData.totalRevenue ??
    financeData.income ??
    financeData.revenue ??
    dbData.todayRevenue ??
    dbData.totalRevenue ??
    0
  )

  const totalExpense = Number(
    financeData.totalExpense ??
    financeData.totalExpenses ??
    financeData.expense ??
    financeData.expenses ??
    dbData.todayExpenses ??
    dbData.totalExpenses ??
    0
  )

  const rawNetProfit = Number(
    financeData.netProfit ??
    financeData.profit ??
    (totalIncome - totalExpense)
  )
  const isNetProfitNegative = rawNetProfit < 0

  const displayStats = {
    tushum: formatNum(totalIncome),
    buyurtmalar: dbData.todayOrders ?? dbData.totalOrders ?? ordersList.length,
    yetkazilgan: dbData.deliveredOrders ?? ordersList.filter((o) => {
      const s = String(o.status).toUpperCase()
      return s === "COMPLETED" || s === "DELIVERED"
    }).length,
    foiz: dbData.deliveredRate ? `${dbData.deliveredRate}%` : "0%",
    faolKuryer: dbData.activeCouriers ?? couriersList.filter((c) => c.status === "on_way" || c.status === "active").length,
    jamiKuryer: couriersList.length,
    kassaTushumi: formatNum(totalIncome),
    logistikaXarajati: formatNum(totalExpense),
    sofFoyda: formatNum(rawNetProfit),
  }

  const isNewStatus = (s) => {
    const u = String(s || "").toUpperCase()
    return u === "NEW" || u === "CREATED" || u === "SEARCHING" || u === "PENDING"
  }
  const isProcessingStatus = (s) => {
    const u = String(s || "").toUpperCase()
    return u === "PROCESSING" || u === "PREPARING" || u === "ASSIGNED" || u === "CONFIRMED" || u === "ACCEPTED"
  }
  const isDeliveringStatus = (s) => {
    const u = String(s || "").toUpperCase()
    return u === "DELIVERING" || u === "ON_WAY" || u === "ON_THE_WAY" || u === "NEARBY"
  }
  const isCompletedStatus = (s) => {
    const u = String(s || "").toUpperCase()
    return u === "COMPLETED" || u === "DELIVERED"
  }

  const statusOptions = [
    { value: "all", label: `Holat: Barchasi (${ordersList.length})` },
    { value: "new", label: `Yangi (${ordersList.filter((o) => isNewStatus(o.status)).length})` },
    { value: "processing", label: `Jarayonda (${ordersList.filter((o) => isProcessingStatus(o.status)).length})` },
    { value: "delivering", label: `Yetkazilmoqda (${ordersList.filter((o) => isDeliveringStatus(o.status)).length})` },
    { value: "completed", label: `Yetkazildi (${ordersList.filter((o) => isCompletedStatus(o.status)).length})` },
  ]

  // Filter orders
  const filteredOrders = ordersList.filter((order) => {
    if (orderTab === "new") return isNewStatus(order.status)
    if (orderTab === "processing") return isProcessingStatus(order.status)
    if (orderTab === "delivering") return isDeliveringStatus(order.status)
    if (orderTab === "completed") return isCompletedStatus(order.status)
    return true
  })

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleCopyPhone = (phone) => {
    navigator.clipboard?.writeText(phone)
    toast.success(`Telefon raqami nusxalandi: ${phone}`)
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Sarlavha va Filtrlash */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Bosh sahifa</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentPeriod.subtitle}
          </p>
        </div>

        {/* Time Period Filter: Props-driven Select */}
        <div className="flex items-center gap-2.5 shrink-0">
          <SelectFilter
            value={timeFilter}
            onChange={setTimeFilter}
            options={PERIOD_OPTIONS}
            icon={Calendar}
            ariaLabel="Vaqt oralig'ini tanlash"
          />
        </div>
      </div>

      {/* Error State Banner */}
      {isDashboardError && (
        <div className="p-4 sm:p-5 bg-red-50/80 border border-red-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-red-700 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>Dashboard ma'lumotlarini yuklashda xatolik yuz berdi: {dashboardError?.response?.data?.message || dashboardError?.message || "Server xatosi"}</span>
          </div>
          <button
            type="button"
            onClick={() => refetchDashboard()}
            className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-medium text-slate-500">{currentPeriod.label} tushum</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {displayStats.tushum}
              </span>
              <span className="text-xs font-semibold text-slate-500">so'm</span>
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {dbData.growthRate != null ? `${dbData.growthRate >= 0 ? "+" : ""}${dbData.growthRate}% o'sish` : "Operatsion daromad"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Banknote className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-medium text-slate-500">{currentPeriod.label} buyurtmalar</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {displayStats.buyurtmalar}
              </span>
              <span className="text-xs font-semibold text-slate-500">ta</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1.5">
              Rejadagi umumiy talab
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Package className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-medium text-slate-500">Yetkazilgan buyurtmalar</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {displayStats.yetkazilgan}
              </span>
              <span className="text-xs font-bold text-blue-600">
                / {displayStats.foiz}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1.5">
              {timeFilter === "Bugun" ? "Faol monitoring jarayonida" : "Muvaffaqiyatli yetkazildi"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-medium text-slate-500">Faol dastavkachilar</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {displayStats.faolKuryer}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {displayStats.jamiKuryer} nafar
              </span>
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1.5">
              Joriy marshrutdagi kuryerlar
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Main Section: Bugungi Buyurtmalar Table & Tashqaridagi Pagination */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
          {/* Table header & quick filter */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Bugungi buyurtmalar</h2>
              {/* Props-driven Select for status filtering */}
              <SelectFilter
                value={orderTab}
                onChange={(val) => {
                  setOrderTab(val)
                  setCurrentPage(1)
                }}
                options={statusOptions}
                icon={Filter}
                className="w-48"
                ariaLabel="Buyurtma holatini tanlash"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/manager/barcha-buyurtmalar")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>Barcha buyurtmalar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table Content (No ID column, clean and readable) */}
          <div className="overflow-x-auto min-h-[320px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3.5 px-4">Mijoz & Aloqa</th>
                  <th className="py-3.5 px-4">Manzil</th>
                  <th className="py-3.5 px-4">Mahsulot</th>
                  <th className="py-3.5 px-4">Kuryer (Mashina)</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4">Summa</th>
                  <th className="py-3.5 px-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isOrdersPending ? (
                  <tr>
                    <td colSpan={7} className="py-[89px] text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Buyurtmalar yuklanmoqda...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-[89px] text-center text-slate-400">
                      Hech qanday buyurtma topilmadi
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/manager/buyurtmalar/${order.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group min-h-14"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{order.customer}</div>
                      {order.phone ? (
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <span>{order.phone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyPhone(order.phone)
                            }}
                            className="text-slate-400 hover:text-blue-600 p-0.5"
                            title="Raqamdan nusxa olish"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null}
                    </td>
                    <td className="py-4 px-4 max-w-45">
                      <div className="truncate text-slate-800 font-medium">{order.address}</div>
                      {order.sector && order.sector !== "—" ? (
                        <div className="text-xs text-slate-400 mt-0.5">{order.sector}</div>
                      ) : null}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-800">{order.product}</span>
                      <span className="text-slate-500 ml-1">× {order.qty}</span>
                    </td>
                    <td className="py-4 px-4">
                      {order.courier ? (
                        <div>
                          <div className="font-medium text-slate-800">{order.courier}</div>
                          <div className="text-xs text-slate-400">{order.vehicle}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium">Taqsimlanmagan</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.statusText}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {Number(order.total ?? order.totalPrice ?? order.totalAmount ?? order.price ?? 0).toLocaleString()} so'm
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/manager/buyurtmalar/${order.id}`)
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Batafsil sahifaga kirish"
                      >
                        <span>Batafsil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Table Carddan TASHQARIDA */}
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pt-4 pb-1"
          />
        )}
      </div>

      {/* Bottom 2 Operational Cards (2 qatorda alohida zamonaviy blok ko'rinishida) */}
      <div className="space-y-6">
        {/* Card 1: Dastavkachilar Holati */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Dastavkachilar holati</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Faol kuryerlar, transport vositalari va logistika operatsiyasi monitoringi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/manager/dastavkachilar-xarita")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Jonli xaritada ko'rish</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Status KPI Cards (Grey & Blue unified minimalist palette) */}
          {isCouriersPending ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs animate-pulse space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-7 w-8 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Bo'sh kuryerlar</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                </div>
                <span className="text-2xl font-bold text-slate-900 mt-2 block">
                  {couriersList.filter((c) => c.status === "free").length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-700">Yo'lda</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-700 mt-2 block">
                  {couriersList.filter((c) => c.status === "on_way").length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Band</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                </div>
                <span className="text-2xl font-bold text-slate-900 mt-2 block">
                  {couriersList.filter((c) => c.status === "loading").length}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Oflayn</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <span className="text-2xl font-bold text-slate-400 mt-2 block">
                  {couriersList.filter((c) => c.status === "offline").length}
                </span>
              </div>
            </div>
          )}

          {/* Courier Roster Grid */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Dastavkachilar tarkibi ({isCouriersPending ? "..." : couriersList.length})
            </div>
            {isCouriersPending ? (
              <div className="flex flex-wrap gap-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-full sm:w-72 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 animate-pulse flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 rounded" />
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-12 bg-slate-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : couriersList.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                Hozircha biriktirilgan kuryerlar mavjud emas
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {couriersList.map((courier) => (
                  <div
                    key={courier.id}
                    className="w-full sm:w-72 p-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/40 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {courier.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                          {courier.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{courier.vehicle}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 border ${
                        courier.status === "on_way"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : courier.status === "free"
                          ? "bg-blue-50/60 text-blue-600 border-blue-100"
                          : courier.status === "loading"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {courier.statusText}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Bugungi Moliya */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Bugungi Moliya va Balans</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Operatsion kassa tushumi, logistika xarajatlari va sof balans tahlili
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
              {currentPeriod.label} hisobot
            </span>
          </div>

          {/* 3 Modern Financial Metric Cards (Grey & Blue unified palette) */}
          {isFinancePending ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 w-24 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                  </div>
                  <div className="h-8 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-44 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
              {/* Tushum */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Bugungi tushum</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    Kassa
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {displayStats.kassaTushumi} <span className="text-xs font-semibold text-slate-500">so'm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">Yetkazilgan buyurtmalardan tushgan summa</p>
                </div>
              </div>

              {/* Xarajat */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Logistika xarajati</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    Xarajat
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {displayStats.logistikaXarajati} <span className="text-xs font-semibold text-slate-500">so'm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">Kunlik yoqilg'i va transport xarajatlari</p>
                </div>
              </div>

              {/* Sof balans */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/30 border border-blue-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center">
                      {isNetProfitNegative ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      Sof balans
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md">
                    Qoldiq
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {displayStats.sofFoyda} <span className="text-xs font-semibold text-slate-500">so'm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">
                    Barcha xarajatlar va tushumlar yakuniy qoldig'i
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <span>Kunlik kassa va xarajatlar balansi real vaqt rejimida hisoblanadi</span>
            <button
              type="button"
              onClick={() => toast.info("Kunlik moliya jurnali va to'liq hisobot")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors self-end sm:self-auto cursor-pointer"
            >
              <span>To'liq moliya jurnali</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}