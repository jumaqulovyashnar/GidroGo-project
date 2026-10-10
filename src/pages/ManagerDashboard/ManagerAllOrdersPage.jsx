import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Package, Search, Download, AlertCircle, ChevronRight, Home, Copy, LayoutDashboard, Truck, MapPin, Users, CheckCircle2, Clock, ChevronDown, Calendar, Filter } from "lucide-react"
import { Select } from "@mantine/core"
import { TablePagination, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui"
import { toast } from "sonner"
import { useManagerAllOrders } from "@/shared/hooks"


const TIME_PERIOD_OPTIONS = [
  { value: "all", label: "Vaqt: Barchasi" },
  { value: "Bugun", label: "Bugun" },
  { value: "Kecha", label: "Kecha" },
  { value: "Hafta", label: "Bu hafta" },
  { value: "Oy", label: "Bu oy" },
]

export default function ManagerAllOrdersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all") 
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Real Manager All Orders API hook
  const { data: allOrdersRes } = useManagerAllOrders({
    page: currentPage,
    limit: pageSize,
    status: activeTab !== "all" ? activeTab : undefined,
  })

  const rawOrders = allOrdersRes?.data?.orders || allOrdersRes?.data || (Array.isArray(allOrdersRes) ? allOrdersRes : null)
  const orders = Array.isArray(rawOrders) ? rawOrders : []

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
    const payment = String(order.paymentType || order.paymentMethod || "")

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

    if (paymentFilter !== "all") {
      if (paymentFilter === "cash" && !payment.includes("Naqd") && !payment.includes("CASH")) return false
      if (paymentFilter === "card" && !payment.includes("Karta") && !payment.includes("CARD")) return false
      if (paymentFilter === "transfer" && !payment.includes("Hisob") && !payment.includes("TRANSFER")) return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleCopyPhone = (phone) => {
    navigator.clipboard?.writeText(phone)
    toast.success(`Telefon raqami nusxalandi: ${phone}`)
  }

  const handleExport = () => {
    toast.success("Barcha buyurtmalar ro'yxati Excel (XLSX) formatida yuklab olindi!")
  }

  return (
    <div className="space-y-4">
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
              Barcha buyurtmalar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Barcha buyurtmalar</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {orders.length} ta umumiy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Barcha davrlardagi suv buyurtmalari arxivi, to'lovlar va yetkazish monitoringi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tepadagi Vaqt Selektori */}
          <Select
            value={timeFilter}
            onChange={(val) => {
              setTimeFilter(val || "all")
              setCurrentPage(1)
            }}
            data={TIME_PERIOD_OPTIONS}
            allowDeselect={false}
            leftSection={<Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-36",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100/80 focus:!bg-white !text-slate-700 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white z-50",
              option:
                "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-semibold",
            }}
          />

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Eksport (Excel)</span>
          </button>
        </div>
      </div>

      {/* 1-Qator: Bo'limlarga tezkor o'tish kartalari (4 ta bir xil karta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          to="/manager"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-h-22.5"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Bosh sahifa
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kunlik ko'rsatkichlar</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/manager/buyurtmalar"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-h-22.5"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Buyurtmalar
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Tezkor taqsimlash markazi</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/manager/dastavkachilar-xarita"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-h-22.5"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Jonli Xarita
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kuryerlar monitoringi</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/manager/xodimlar"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-h-22.5"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Xodimlar
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Dastavkachilar ro'yxati</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* 2-Qator: Buyurtmalar statistikasi kartalari (4 ta bir xil karta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between min-h-22.5">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami buyurtmalar</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{orders.length} ta</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Barcha davrlar arxivi</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between min-h-22.5">
          <div>
            <span className="text-xs font-medium text-slate-500">Yetkazilgan</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === "completed").length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Muvaffaqiyatli topshirildi</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between min-h-22.5">
          <div>
            <span className="text-xs font-medium text-slate-500">Yetkazilmoqda</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === "delivering" || o.status === "processing").length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kuryerlar yo'nalishda</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between min-h-22.5">
          <div>
            <span className="text-xs font-medium text-slate-500">Yangi buyurtmalar</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === "new").length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Taqsimot kutilmoqda</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Orders Table Container & Pagination */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">Buyurtmalar ro'yxati</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {filteredOrders.length} ta topildi
                </span>
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
                  root: "w-52",
                  input:
                    "!h-9 !rounded-xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100/80 focus:!bg-white !text-slate-700 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
                  dropdown:
                    "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white z-50",
                  option:
                    "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-semibold",
                }}
              />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Qisqa Search Input */}
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

              {/* Filters: Vaqt va To'lov */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Select
                  value={timeFilter}
                  onChange={(val) => {
                    setTimeFilter(val || "all")
                    setCurrentPage(1)
                  }}
                  data={TIME_PERIOD_OPTIONS}
                  allowDeselect={false}
                  leftSection={<Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
                  rightSection={<ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
                  classNames={{
                    root: "w-36",
                    input:
                      "!h-9 !rounded-xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100/80 focus:!bg-white !text-slate-700 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
                    dropdown:
                      "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white z-50",
                    option:
                      "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-semibold",
                  }}
                />

                <Select
                  value={paymentFilter}
                  onChange={(val) => {
                    setPaymentFilter(val || "all")
                    setCurrentPage(1)
                  }}
                  data={PAYMENT_OPTIONS}
                  allowDeselect={false}
                  rightSection={<ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />}
                  classNames={{
                    root: "w-44",
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
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Mijoz & Telefon</th>
                  <th className="py-3 px-4">Manzil & Sektor</th>
                  <th className="py-3 px-4">Sana / Vaqt</th>
                  <th className="py-3 px-4">Mahsulot</th>
                  <th className="py-3 px-4">Dastavkachi</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-4">Summa</th>
                  <th className="py-3 px-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Hech qanday buyurtma topilmadi
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/manager/buyurtmalar/${order.id}`)}
                      className="cursor-pointer hover:bg-blue-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {order.customer}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{order.phone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyPhone(order.phone)
                            }}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                            title="Telefon raqamini nusxalash"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-50">
                        <div className="truncate text-slate-800 font-medium">{order.address}</div>
                        <div className="text-[11px] text-slate-400">{order.sector}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {order.createdAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">{order.product}</span>
                        <span className="text-slate-500 ml-1.5 font-semibold">× {order.qty}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.courier ? (
                          <div>
                            <div className="font-medium text-slate-800">{order.courier}</div>
                            <div className="text-[10px] text-slate-400">{order.vehicle}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                            Biriktirilmagan
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
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
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {order.total.toLocaleString()} so'm
                      </td>
                      <td className="py-3.5 px-4 text-center">
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
            Jami {filteredOrders.length} ta buyurtmadan {paginatedOrders.length} tasi ko'rsatilmoqda (Sahifa: {currentPage} / {totalPages})
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
