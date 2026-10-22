import { useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Package, Search, Download, AlertCircle, ChevronRight, Home, Copy, LayoutDashboard, Truck, MapPin, Users, CheckCircle2, Clock, ChevronDown, Calendar, Filter } from "lucide-react"
import { Select } from "@mantine/core"
import { TablePagination, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui"
import { toast } from "sonner"
import { useManagerAllOrders } from "@/shared/hooks"
import { exportToCsv, formatOrderStatusUz, getOrderStatusBadgeClass } from "@/shared/lib"

const PAYMENT_OPTIONS = [
  { value: "all", label: "To'lov: Barchasi" },
  { value: "cash", label: "Naqd pul" },
  { value: "card", label: "Plastik karta" },
  { value: "transfer", label: "Hisob raqam / O'tkazma" },
]

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
  const pageSize = 10

  // Real Manager All Orders API hook
  const {
    data: allOrdersRes,
    isPending: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useManagerAllOrders({
    page: currentPage,
    limit: pageSize,
    status: activeTab !== "all" ? activeTab : undefined,
  })

  const rawOrders = allOrdersRes?.data?.orders || allOrdersRes?.data || (Array.isArray(allOrdersRes) ? allOrdersRes : null)
  const orders = useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map((o) => {
      const status = o.status || "CREATED"
      return {
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
        status,
        statusText: formatOrderStatusUz(o.statusText || status),
        total: Number(o.total ?? o.totalPrice ?? o.totalAmount ?? o.price ?? o.amount ?? 0),
        createdAt: o.createdAt || o.date || o.created_at || "—",
      }
    })
  }, [rawOrders])

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
    { value: "all", label: `Holat: Barchasi (${orders.length})` },
    { value: "new", label: `Yangi (${orders.filter((o) => isNewStatus(o.status)).length})` },
    { value: "processing", label: `Jarayonda (${orders.filter((o) => isProcessingStatus(o.status)).length})` },
    { value: "delivering", label: `Yetkazilmoqda (${orders.filter((o) => isDeliveringStatus(o.status)).length})` },
    { value: "completed", label: `Yetkazildi (${orders.filter((o) => isCompletedStatus(o.status)).length})` },
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

    if (activeTab === "new") return isNewStatus(order.status)
    if (activeTab === "processing") return isProcessingStatus(order.status)
    if (activeTab === "delivering") return isDeliveringStatus(order.status)
    if (activeTab === "completed") return isCompletedStatus(order.status)

    if (paymentFilter !== "all") {
      if (paymentFilter === "cash" && !payment.includes("Naqd") && !payment.includes("CASH")) return false
      if (paymentFilter === "card" && !payment.includes("Karta") && !payment.includes("CARD")) return false
      if (paymentFilter === "transfer" && !payment.includes("Hisob") && !payment.includes("TRANSFER")) return false
    }

    return true
  })

  const totalItems = allOrdersRes?.data?.total || allOrdersRes?.total || orders.length
  const totalPages = allOrdersRes?.data?.totalPages || allOrdersRes?.totalPages || Math.ceil(totalItems / pageSize) || 1
  const isServerPaginated = Boolean(allOrdersRes?.data?.totalPages || allOrdersRes?.totalPages || (allOrdersRes?.data?.total && allOrdersRes?.data?.total > orders.length))
  const paginatedOrders = isServerPaginated ? filteredOrders : filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleCopyPhone = (phone) => {
    navigator.clipboard?.writeText(phone)
    toast.success(`Telefon raqami nusxalandi: ${phone}`)
  }

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast.error("Eksport qilish uchun buyurtmalar mavjud emas")
      return
    }
    const headers = ["ID", "Mijoz", "Telefon", "Manzil", "Miqdor", "Summa (so'm)", "Holat", "To'lov turi", "Sana"]
    const rows = orders.map((o) => [
      o.id || "",
      o.customer || o.clientName || "",
      o.phone || o.clientPhone || "",
      o.address || o.deliveryAddress || "",
      o.bottles || o.quantity || o.qty || 0,
      o.price || o.total || 0,
      o.statusText || o.status || "",
      o.paymentType || o.paymentMethod || "",
      o.date || o.created_at || "",
    ])
    exportToCsv("manager_barcha_buyurtmalar", headers, rows)
    toast.success("Barcha buyurtmalar ro'yxati CSV faylga yuklab olindi!")
  }

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
              Barcha buyurtmalar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Barcha buyurtmalar</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {orders.length} ta umumiy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <Link
          to="/manager"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Bosh sahifa
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kunlik ko'rsatkichlar</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5.5 h-5.5" />
          </div>
        </Link>

        <Link
          to="/manager/buyurtmalar"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Buyurtmalar
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Tezkor taqsimlash markazi</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </Link>

        <Link
          to="/manager/dastavkachilar-xarita"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Jonli Xarita
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kuryerlar monitoringi</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5.5 h-5.5" />
          </div>
        </Link>

        <Link
          to="/manager/xodimlar"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500">Bo'lim</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
              Xodimlar
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Dastavkachilar ro'yxati</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </Link>
      </div>

      {/* 2-Qator: Buyurtmalar statistikasi kartalari (4 ta bir xil karta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami buyurtmalar</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{orders.length} ta</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Barcha davrlar arxivi</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yetkazilgan</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => isCompletedStatus(o.status)).length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Muvaffaqiyatli topshirildi</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yetkazilmoqda</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => isDeliveringStatus(o.status) || isProcessingStatus(o.status)).length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kuryerlar yo'nalishda</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yangi buyurtmalar</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => isNewStatus(o.status)).length} ta
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Taqsimot kutilmoqda</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Orders Table Container & Pagination */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
          {/* Controls Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-200/80 space-y-3">
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
                    root: "w-full sm:w-36",
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
                    root: "w-full sm:w-44",
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
            <table className="w-full text-left text-sm border-collapse min-w-[850px] lg:min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3.5 px-4">Mijoz & Telefon</th>
                  <th className="py-3.5 px-4">Manzil & Sektor</th>
                  <th className="py-3.5 px-4">Sana / Vaqt</th>
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
                    <td colSpan={8} className="p-0 py-16 text-center text-slate-400">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex items-center justify-center gap-2 px-4 whitespace-normal">
                        <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Buyurtmalar yuklanmoqda...</span>
                      </div>
                    </td>
                  </tr>
                ) : isOrdersError ? (
                  <tr>
                    <td colSpan={8} className="p-0 py-16 text-center text-red-600">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-2 px-4 whitespace-normal">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
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
                    <td colSpan={8} className="p-0 py-16 text-center text-slate-400">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex items-center justify-center px-4 whitespace-normal">
                        <span>Hech qanday buyurtma topilmadi</span>
                      </div>
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
                        {order.phone && order.phone !== "—" ? (
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
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
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : null}
                      </td>
                      <td className="py-4 px-4 max-w-50">
                        <div className="truncate text-slate-800 font-medium">{order.address}</div>
                        {order.sector && order.sector !== "—" ? (
                          <div className="text-xs text-slate-400 mt-0.5">{order.sector}</div>
                        ) : null}
                      </td>
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        {order.createdAt}
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                            Biriktirilmagan
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusBadgeClass(
                            order.status
                          )}`}
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
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pt-4 pb-1"
          />
        )}
      </div>
    </div>
  )
}
