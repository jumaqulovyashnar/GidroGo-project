import { useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Truck, Package, Clock, Banknote, Search, Download, AlertCircle, ChevronRight, Home, Copy, ChevronDown, Filter } from "lucide-react"
import { Select } from "@mantine/core"
import { TablePagination, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui"
import { toast } from "sonner"
import { useManagerTodayOrders, useManagerDashboard } from "@/shared/hooks"
import { exportToCsv } from "@/shared/lib"

export default function ManagerOrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all") // all, new, processing, delivering, completed
  const [searchQuery, setSearchQuery] = useState("")

  // Real Manager Orders & Dashboard API Hooks
  const {
    data: todayOrdersRes,
    isPending: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useManagerTodayOrders()
  const { data: dashboardRes } = useManagerDashboard()

  const rawOrders = todayOrdersRes?.data?.orders || todayOrdersRes?.data || (Array.isArray(todayOrdersRes) ? todayOrdersRes : null)
  const orders = useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map((o) => ({
      ...o,
      id: o.id || o._id,
      customer: o.customer || o.clientName || o.client?.name || o.client?.fullName || "Mijoz",
      phone: o.phone || o.clientPhone || o.client?.phone || "—",
      address: o.address || o.deliveryAddress || "Manzil ko'rsatilmagan",
      sector: o.sector || o.region || o.district || "",
      product: o.product || o.productName || o.items?.[0]?.productName || "Suv 18.9L",
      qty: Number(o.qty || o.quantity || o.bottlesCount || 1),
      courier: o.courier || o.courierName || o.courier?.fullName || o.courier?.name || null,
      vehicle: o.vehicle || o.courier?.vehicle || "",
      status: o.status || "CREATED",
      statusText: o.statusText || o.status || "Yangi",
      total: Number(o.total ?? o.totalPrice ?? o.totalAmount ?? o.price ?? o.amount ?? 0),
      createdAt: o.createdAt || o.date || o.created_at || "—",
    }))
  }, [rawOrders])
  const dbData = dashboardRes?.data || dashboardRes || {}

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const statusOptions = [
    { value: "all", label: `Holat: Barchasi (${orders.length})` },
    { value: "new", label: `Yangi (${orders.filter((o) => o.status === "new" || o.status === "CREATED").length})` },
    { value: "processing", label: `Jarayonda (${orders.filter((o) => o.status === "processing" || o.status === "PREPARING").length})` },
    { value: "delivering", label: `Yetkazilmoqda (${orders.filter((o) => o.status === "delivering" || o.status === "DELIVERING").length})` },
    { value: "completed", label: `Yetkazildi (${orders.filter((o) => o.status === "completed" || o.status === "DELIVERED").length})` },
  ]

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderId = String(order.id || "")
    const customer = String(order.customer || order.clientName || "")
    const phone = String(order.phone || order.clientPhone || "")
    const address = String(order.address || order.deliveryAddress || "")

    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      address.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === "new") return order.status === "new" || order.status === "CREATED"
    if (activeTab === "processing") return order.status === "processing" || order.status === "PREPARING"
    if (activeTab === "delivering") return order.status === "delivering" || order.status === "DELIVERING"
    if (activeTab === "completed") return order.status === "completed" || order.status === "DELIVERED"

    return true
  })

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <Link to="/manager" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Bosh sahifa</span>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-800">
              Buyurtmalar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Buyurtmalar va Taqsimot Markazi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Barcha buyurtmalarni monitoring qilish, kuryerlarga taqsimlash va yetkazish holatini boshqarish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!orders || orders.length === 0) {
                toast.error("Eksport qilish uchun buyurtmalar mavjud emas")
                return
              }
              const headers = ["ID", "Mijoz", "Telefon", "Manzil", "Miqdor", "Summa (so'm)", "Holat"]
              const rows = orders.map((o) => [
                o.id || "",
                o.customer || o.clientName || "",
                o.phone || o.clientPhone || "",
                o.address || o.deliveryAddress || "",
                o.bottles || o.quantity || o.qty || 0,
                o.price || o.total || 0,
                o.statusText || o.status || "",
              ])
              exportToCsv("bugungi_buyurtmalar", headers, rows)
              toast.success("Buyurtmalar ro'yxati CSV shaklida yuklab olindi!")
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Eksport (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugungi buyurtmalar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{orders.length || dbData.todayOrders || 0}</span>
              <span className="text-xs font-semibold text-blue-600">ta</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {orders.filter((o) => o.status === "completed" || o.status === "DELIVERED").length} tasi yetkazib berildi
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yangi & Taqsimlanmagan</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {orders.filter((o) => o.status === "new" || o.status === "CREATED").length}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Kutilmoqda
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Taqsimlanish navbatidagi buyurtmalar</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yo'ldagi buyurtmalar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {orders.filter((o) => o.status === "delivering" || o.status === "DELIVERING").length}
              </span>
              <span className="text-xs font-semibold text-slate-400">ta faol</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Kuryerlar tomonidan yetkazilmoqda</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Kassa tushumi (Bugun)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {Number(dbData.todayRevenue || 0).toLocaleString("ru-RU")}
              </span>
              <span className="text-xs font-semibold text-slate-400">so'm</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Jami operatsion tushum</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Orders Table Container & Pagination (Full width) */}
      <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            {/* Controls Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">Buyurtmalar</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {filteredOrders.length} ta
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-72 md:w-80">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Qidiruv..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Status Select Filter */}
                <Select
                  value={activeTab}
                  onChange={(val) => {
                    setActiveTab(val || "all")
                    setCurrentPage(1)
                  }}
                  data={statusOptions}
                  allowDeselect={false}
                  leftSection={<Filter className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
                  rightSection={<ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
                  classNames={{
                    root: "w-full sm:w-52",
                    input:
                      "!h-9 !rounded-xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100/80 focus:!bg-white !text-slate-700 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
                    dropdown:
                      "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white z-50",
                    option:
                      "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-semibold",
                  }}
                />
              </div>
            </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3.5 px-4">Mijoz & Telefon</th>
                  <th className="py-3.5 px-4">Manzil & Sektor</th>
                  <th className="py-3.5 px-4">Mahsulot</th>
                  <th className="py-3.5 px-4">Dastavkachi</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4">Summa</th>
                  <th className="py-3.5 px-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isOrdersLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Buyurtmalar yuklanmoqda...</span>
                      </div>
                    </td>
                  </tr>
                ) : isOrdersError ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-red-600">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-xs font-semibold">
                          {ordersError?.response?.data?.message || ordersError?.message || "Buyurtmalarni yuklashda xatolik"}
                        </span>
                        <button
                          type="button"
                          onClick={() => refetchOrders()}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                          Qayta urinish
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      Hech qanday buyurtma topilmadi
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/manager/buyurtmalar/${order.id}`)}
                      className="cursor-pointer hover:bg-blue-50/60 transition-colors group min-h-14"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {order.customer}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{order.phone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard?.writeText(order.phone)
                              toast.success(`Telefon raqami nusxalandi: ${order.phone}`)
                            }}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                            title="Telefon raqamini nusxalash"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-50">
                        <div className="truncate text-slate-800 font-medium">{order.address}</div>
                        {order.sector && order.sector !== "—" ? (
                          <div className="text-xs text-slate-400 mt-0.5">{order.sector}</div>
                        ) : null}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-800">{order.product}</span>
                        <span className="text-slate-500 ml-1.5 font-semibold">× {order.qty}</span>
                      </td>
                      <td className="py-4 px-4">
                        {order.courier ? (
                          <div>
                            <div className="font-medium text-slate-800">{order.courier}</div>
                            <div className="text-xs text-slate-400">{order.vehicle}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                            Biriktirilmagan
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
                      <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {Number(order.total || 0).toLocaleString()} so'm
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/manager/buyurtmalar/${order.id}`)
                          }}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs"
                          title="Buyurtma tafsilotlarini ko'rish"
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

        {/* Table Pagination TASHQARIDA */}
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
    </div>
  )
}
