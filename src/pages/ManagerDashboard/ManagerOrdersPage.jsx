import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Truck,
  Package,
  Clock,
  Banknote,
  Search,
  Plus,
  Download,
  AlertCircle,
  ChevronRight,
  Home,
  Copy,
  ChevronDown,
  Filter,
} from "lucide-react"
import { Modal as MantineModal, Select } from "@mantine/core"
import { MOCK_ORDERS, MOCK_COURIERS } from "@/mock"
import {
  TablePagination,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui"
import { toast } from "sonner"

const PAYMENT_OPTIONS = [
  { value: "all", label: "To'lov: Barchasi" },
  { value: "card", label: "Karta (Payme/Click)" },
  { value: "cash", label: "Naqd pul" },
  { value: "transfer", label: "Hisob-raqam" },
]

export default function ManagerOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [activeTab, setActiveTab] = useState("all") // all, new, processing, delivering, completed
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")

  // Modal for new order
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)
  const [newOrderForm, setNewOrderForm] = useState({
    customer: "",
    phone: "",
    address: "",
    sector: "Markaziy sektor",
    product: "18.9L Kapsula",
    qty: 2,
    price: 45000,
    paymentType: "Payme",
    courierId: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const statusOptions = [
    { value: "all", label: `Holat: Barchasi (${orders.length})` },
    { value: "new", label: `Yangi (${orders.filter((o) => o.status === "new").length})` },
    { value: "processing", label: `Jarayonda (${orders.filter((o) => o.status === "processing").length})` },
    { value: "delivering", label: `Yetkazilmoqda (${orders.filter((o) => o.status === "delivering").length})` },
    { value: "completed", label: `Yetkazildi (${orders.filter((o) => o.status === "completed").length})` },
  ]

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === "new") return order.status === "new"
    if (activeTab === "processing") return order.status === "processing"
    if (activeTab === "delivering") return order.status === "delivering"
    if (activeTab === "completed") return order.status === "completed"

    if (paymentFilter !== "all") {
      if (paymentFilter === "cash" && !order.paymentType.includes("Naqd")) return false
      if (paymentFilter === "card" && (order.paymentType.includes("Naqd") || order.paymentType.includes("Hisob"))) return false
      if (paymentFilter === "transfer" && !order.paymentType.includes("Hisob")) return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleCreateOrder = (e) => {
    e.preventDefault()
    if (!newOrderForm.customer || !newOrderForm.phone || !newOrderForm.address) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring")
      return
    }

    const assignedCourier = MOCK_COURIERS.find((c) => c.id === Number(newOrderForm.courierId))
    const totalSum = newOrderForm.qty * newOrderForm.price

    const newOrder = {
      id: `ORD-${Math.floor(9103 + Math.random() * 899)}`,
      customer: newOrderForm.customer,
      phone: newOrderForm.phone,
      address: newOrderForm.address,
      sector: newOrderForm.sector,
      coords: [38.8612, 65.7847],
      product: newOrderForm.product,
      qty: Number(newOrderForm.qty),
      total: totalSum,
      courier: assignedCourier ? assignedCourier.name : null,
      courierId: assignedCourier ? assignedCourier.id : null,
      vehicle: assignedCourier ? `${assignedCourier.vehicle} (${assignedCourier.plate})` : null,
      status: assignedCourier ? "delivering" : "new",
      statusText: assignedCourier ? "Yetkazilmoqda" : "Yangi",
      paymentType: newOrderForm.paymentType,
      paymentStatus: newOrderForm.paymentType === "Naqd pul" ? "Kutilmoqda" : "To'langan",
      createdAt: "Hozir",
      eta: assignedCourier ? "20 daqiqa" : "Taqsimlanmagan",
    }

    MOCK_ORDERS.unshift(newOrder)
    setOrders([newOrder, ...orders])
    setIsNewOrderModalOpen(false)
    toast.success("Yangi buyurtma muvaffaqiyatli saqlandi!")

    setNewOrderForm({
      customer: "",
      phone: "",
      address: "",
      sector: "Markaziy sektor",
      product: "18.9L Kapsula",
      qty: 2,
      price: 45000,
      paymentType: "Payme",
      courierId: "",
    })
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
              Buyurtmalar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Buyurtmalar va Taqsimot Markazi</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Qarshi Filiali
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Barcha buyurtmalarni monitoring qilish, kuryerlarga taqsimlash va yetkazish holatini boshqarish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast.success("Excel hisobot yuklab olindi")
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Eksport (Excel)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi buyurtma</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugungi buyurtmalar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">128</span>
              <span className="text-xs font-semibold text-blue-600">+14%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">94 tasi yetkazib berildi</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yangi & Taqsimlanmagan</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">12</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Shoshilinch
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">2 tasi zudlik bilan kuryer kutmoqda</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Yo'ldagi kuryerlar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs font-semibold text-slate-400">/ 10 faol</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">O'rtacha yetkazish: 24 daqiqa</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Kassa aylanmasi (Bugun)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">8,460</span>
              <span className="text-xs font-semibold text-slate-400">ming</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">K2B va Onlayn to'lovlar</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Orders Table Container & Pagination (Full width) */}
      <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            {/* Controls Bar */}
            <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">Buyurtmalar</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {orders.length} ta
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
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buyurtma ID, mijoz ismi, telefon..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
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
                    <td colSpan={7} className="py-12 text-center text-slate-400">
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
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="truncate text-slate-800 font-medium">{order.address}</div>
                        <div className="text-[11px] text-slate-400">{order.sector}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{order.product}</span>
                        <span className="text-slate-500 ml-1.5 font-semibold">× {order.qty}</span>
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {order.total.toLocaleString()} so'm
                      </td>
                      <td className="py-3 px-4 text-center">
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

      {/* New Order Modal */}
      <MantineModal
        opened={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Yangi buyurtma qo'shish</span>
          </div>
        }
        centered
        size="md"
      >
        <form onSubmit={handleCreateOrder} className="space-y-3.5 py-1 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Mijoz to'liq ismi *</label>
            <input
              type="text"
              required
              placeholder="Masalan: Jamshid Mahmudov"
              value={newOrderForm.customer}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Telefon raqam *</label>
              <input
                type="text"
                required
                placeholder="+998 (90) 000-00-00"
                value={newOrderForm.phone}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Hudud / Sektor</label>
              <select
                value={newOrderForm.sector}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, sector: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="Markaziy sektor">Markaziy sektor</option>
                <option value="Shimoliy sektor">Shimoliy sektor</option>
                <option value="Sanoat sektori">Sanoat sektori</option>
                <option value="G'arbiy sektor">G'arbiy sektor</option>
                <option value="Janubiy sektor">Janubiy sektor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Yetkazish manzili *</label>
            <input
              type="text"
              required
              placeholder="Qarshi sh., ko'cha, uy/xonadon raqami"
              value={newOrderForm.address}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Mahsulot turi</label>
              <select
                value={newOrderForm.product}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, product: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="18.9L Kapsula">18.9L Kapsula</option>
                <option value="10L Idish">10L Idish</option>
                <option value="5L Qadoq">5L Qadoq (Blok)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Miqdor (dona)</label>
              <input
                type="number"
                min="1"
                value={newOrderForm.qty}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, qty: Math.max(1, Number(e.target.value)) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">To'lov turi</label>
              <select
                value={newOrderForm.paymentType}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="Payme">Payme</option>
                <option value="Click">Click</option>
                <option value="Naqd pul">Naqd pul</option>
                <option value="Hisob-raqam">Hisob-raqam</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Kuryer biriktirish</label>
              <select
                value={newOrderForm.courierId}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, courierId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">Keyinroq taqsimlash</option>
                {MOCK_COURIERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.vehicle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-semibold">Jami hisob:</span>
            <span className="font-bold text-blue-700 text-sm">
              {(newOrderForm.qty * newOrderForm.price).toLocaleString()} so'm
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewOrderModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
            >
              Saqlash va Yuborish
            </button>
          </div>
        </form>
      </MantineModal>
    </div>
  )
}
