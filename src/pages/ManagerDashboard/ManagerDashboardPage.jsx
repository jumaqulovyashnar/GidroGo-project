import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Banknote, Package, CheckCircle2, Truck, TrendingUp, ExternalLink, ChevronRight, ChevronDown, Calendar, Filter, Copy, AlertCircle } from "lucide-react"
import { Select } from "@mantine/core"
import { TablePagination } from "@/shared/ui"
import { toast } from "sonner"
import {
  useManagerDashboard,
  useManagerTodayOrders,
  useManagerCouriers,
  useManagerStockWarehouse,
  useManagerFinanceSummary,
} from "@/shared/hooks"

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
          "!h-9 !rounded-xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100/80 focus:!bg-white !text-slate-700 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
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

  const pageSize = 5

  // Real Manager API hooks
  const {
    data: dashboardRes,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useManagerDashboard()
  const { data: todayOrdersRes, isPending: isOrdersPending } = useManagerTodayOrders()
  const { data: couriersRes } = useManagerCouriers()
  const { data: stockRes } = useManagerStockWarehouse()
  const { data: financeRes } = useManagerFinanceSummary({
    period: timeFilter === "Bugun" ? "today" : timeFilter === "Kecha" ? "yesterday" : timeFilter === "Hafta" ? "week" : "month",
  })

  const dbData = dashboardRes?.data || dashboardRes || {}
  const rawOrders = todayOrdersRes?.data?.orders || todayOrdersRes?.data || (Array.isArray(todayOrdersRes) ? todayOrdersRes : null)
  const ordersList = Array.isArray(rawOrders) ? rawOrders : []

  const rawCouriers = couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
  const couriersList = Array.isArray(rawCouriers) ? rawCouriers : []

  const stockData = stockRes?.data || stockRes || {}
  const financeData = financeRes?.data || financeRes || {}

  const currentPeriod = PERIOD_LABELS[timeFilter] || PERIOD_LABELS.Bugun

  const formatNum = (val) => (val !== undefined && val !== null ? Number(val).toLocaleString("ru-RU") : "0")

  const displayStats = {
    tushum: formatNum(dbData.todayRevenue ?? dbData.totalRevenue ?? financeData.revenue),
    buyurtmalar: dbData.todayOrders ?? dbData.totalOrders ?? ordersList.length,
    yetkazilgan: dbData.deliveredOrders ?? ordersList.filter((o) => o.status === "completed" || o.status === "DELIVERED").length,
    foiz: dbData.deliveredRate ? `${dbData.deliveredRate}%` : "0%",
    faolKuryer: dbData.activeCouriers ?? couriersList.filter((c) => c.status === "on_way" || c.status === "active").length,
    jamiKuryer: couriersList.length,
    zaxiraLitr: formatNum(stockData.totalStock ?? stockData.quantity),
    omborLitr: formatNum(stockData.warehouseStock ?? stockData.bottles),
    mashinalardaLitr: formatNum(stockData.courierStock ?? stockData.inVehicles),
    bugunQuyilganLitr: formatNum(stockData.bottlesFilledToday),
    kassaTushumi: formatNum(financeData.totalRevenue ?? dbData.todayRevenue),
    logistikaXarajati: formatNum(financeData.totalExpenses ?? dbData.todayExpenses),
    sofFoyda: formatNum(financeData.netProfit ?? (Number(dbData.todayRevenue || 0) - Number(dbData.todayExpenses || 0))),
  }

  const statusOptions = [
    { value: "all", label: `Holat: Barchasi (${ordersList.length})` },
    { value: "new", label: `Yangi (${ordersList.filter((o) => o.status === "new").length})` },
    { value: "processing", label: `Jarayonda (${ordersList.filter((o) => o.status === "processing").length})` },
    { value: "delivering", label: `Yetkazilmoqda (${ordersList.filter((o) => o.status === "delivering").length})` },
    { value: "completed", label: `Yetkazildi (${ordersList.filter((o) => o.status === "completed").length})` },
  ]

  // Filter orders
  const filteredOrders = ordersList.filter((order) => {
    if (orderTab === "new") return order.status === "new"
    if (orderTab === "processing") return order.status === "processing"
    if (orderTab === "delivering") return order.status === "delivering"
    if (orderTab === "completed") return order.status === "completed"
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
      {/* Top Banner & Filial Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Bosh sahifa</h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentPeriod.subtitle}
          </p>
        </div>

        {/* Time Period Filter: Props-driven Select */}
        <div className="flex items-center gap-2.5">
          <SelectFilter
            value={timeFilter}
            onChange={setTimeFilter}
            options={PERIOD_OPTIONS}
            icon={Calendar}
            ariaLabel="Vaqt oralig'ini tanlash"
          />

          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl font-mono shadow-2xs">
            Yangilanish: 10:45
          </div>
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
              <span>{currentPeriod.tushumChange}</span>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Mijoz & Aloqa</th>
                  <th className="py-2.5 px-3">Manzil</th>
                  <th className="py-2.5 px-3">Mahsulot</th>
                  <th className="py-2.5 px-3">Kuryer (Mashina)</th>
                  <th className="py-2.5 px-3">Holat</th>
                  <th className="py-2.5 px-3">Summa</th>
                  <th className="py-2.5 px-3 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isOrdersPending ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Buyurtmalar yuklanmoqda...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      Hech qanday buyurtma topilmadi
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/manager/buyurtmalar/${order.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{order.customer}</div>
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
                    </td>
                    <td className="py-3 px-3 max-w-45">
                      <div className="truncate text-slate-800">{order.address}</div>
                      <div className="text-[10px] text-slate-400">{order.sector}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{order.product}</span>
                      <span className="text-slate-500 ml-1">× {order.qty}</span>
                    </td>
                    <td className="py-3 px-3">
                      {order.courier ? (
                        <div>
                          <div className="font-medium text-slate-800">{order.courier}</div>
                          <div className="text-[10px] text-slate-400">{order.vehicle}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-medium">Taqsimlanmagan</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === "completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : order.status === "delivering"
                            ? "bg-blue-100/80 text-blue-800 border border-blue-200"
                            : order.status === "processing"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {order.statusText}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {order.total.toLocaleString()} so'm
                    </td>
                    <td className="py-3 px-3 text-center">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1 pt-1">
          <div>
            Jami {filteredOrders.length} ta buyurtmadan {paginatedOrders.length} tasi ko'rsatilmoqda
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Bottom 3 Operational Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Widget 1: Dastavkachilar Holati */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Dastavkachilar holati</h3>
                <p className="text-xs text-slate-500 mt-0.5">Qarshi hududi bo'yicha kuryerlar operatsiyasi</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/manager/dastavkachilar-xarita")}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Xaritada ko'rish"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-lg font-extrabold text-slate-900">
                  {couriersList.filter((c) => c.status === "free" || c.status === "AVAILABLE").length}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Bo'sh</span>
              </div>
              <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                <span className="block text-lg font-extrabold text-blue-700">
                  {couriersList.filter((c) => c.status === "on_way" || c.status === "DELIVERING").length}
                </span>
                <span className="text-[11px] font-medium text-blue-600">Yo'lda</span>
              </div>
              <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80">
                <span className="block text-lg font-extrabold text-slate-800">
                  {couriersList.filter((c) => c.status === "loading" || c.status === "BUSY").length}
                </span>
                <span className="text-[11px] font-medium text-slate-600">Yukda</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-lg font-extrabold text-slate-400">
                  {couriersList.filter((c) => c.status === "offline" || c.isOnline === false).length}
                </span>
                <span className="text-[11px] font-medium text-slate-400">Offline</span>
              </div>
            </div>

            {/* Couriers Mini Roster */}
            <div className="space-y-2">
              {couriersList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Kuryerlar mavjud emas</p>
              ) : (
                couriersList.slice(0, 3).map((courier) => (
                <div
                  key={courier.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {courier.initials || courier.name?.substring(0, 2).toUpperCase() || "DX"}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{courier.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {courier.vehicle}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      courier.status === "on_way"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {courier.statusText || (courier.status === "on_way" ? "Yo'lda" : "Faol")}
                  </span>
                </div>
              ))
            )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/manager/dastavkachilar-xarita")}
            className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Barcha dastavkachilar xaritasi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 2: Suv Zaxirasi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Suv zaxirasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Qarshi filial idishlar va hajm ko'rsatkichi</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Me'yorda
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{displayStats.zaxiraLitr}</span>
              <span className="text-xs text-slate-400 font-medium">Min. chegara: 3,000 L</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "78%" }} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block font-bold text-slate-800 text-sm">{displayStats.omborLitr}</span>
                <span className="text-[11px] text-slate-400">Omborda</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block font-bold text-slate-800 text-sm">{displayStats.mashinalardaLitr}</span>
                <span className="text-[11px] text-slate-400">Mashinalarda</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block font-bold text-slate-800 text-sm">{displayStats.bugunQuyilganLitr}</span>
                <span className="text-[11px] text-slate-400">Bugun quyilgan</span>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => toast.info("Suv zaxirasi boshqaruvi ochilmoqda")}
            className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Suv zaxirasini ko'rish</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 3: Bugungi Moliya */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bugungi Moliya</h3>
                <p className="text-xs text-slate-500 mt-0.5">Operatsion tushum va logistika hisobi</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Bugun
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-blue-800">Bugungi tushum</span>
                  <div className="font-extrabold text-slate-900 text-base mt-0.5">
                    {displayStats.kassaTushumi} so'm
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-white px-2.5 py-1 rounded-lg shadow-2xs">
                  Kassa
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-700">Logistika xarajati</span>
                  <div className="font-extrabold text-slate-900 text-base mt-0.5">
                    {displayStats.logistikaXarajati} so'm
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg shadow-2xs">
                  Yoqilg'i
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-blue-800">Sof foyda</span>
                  <div className="font-extrabold text-blue-900 text-base mt-0.5">
                    {displayStats.sofFoyda} so'm
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-white px-2.5 py-1 rounded-lg shadow-2xs">
                  Qoldiq
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Kunlik moliya jurnali")}
            className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Moliya hisobotiga o'tish</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  )
}