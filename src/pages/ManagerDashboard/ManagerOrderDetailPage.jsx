import { useState, lazy, Suspense } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Copy, MapPin, Package, Clock, CheckCircle2, CreditCard, UserCheck, AlertCircle, Truck, Home, Droplet } from "lucide-react"
import { Modal as MantineModal } from "@mantine/core"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, Spinner } from "@/shared/ui"
import { toast } from "sonner"
import { AdjustBottleBalanceModal } from "@/components"
import { useManagerOrderDetail, useManagerCouriers, useManagerReassignOrder } from "@/shared/hooks"
import { formatOrderStatusUz, getOrderStatusBadgeClass } from "@/shared/lib"

const GoogleMap = lazy(() => import("@/widgets/map").then((mod) => ({ default: mod.GoogleMap })))

export default function ManagerOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Real Manager Order Detail & Couriers API Hooks
  const {
    data: orderRes,
    isPending: isOrderLoading,
    isError: isOrderError,
    error: orderError,
    refetch: refetchOrder,
  } = useManagerOrderDetail(id)
  const { data: couriersRes } = useManagerCouriers()
  const reassignMutation = useManagerReassignOrder()

  const apiOrder = orderRes?.data || orderRes

  const [reassignedOverride, setReassignedOverride] = useState(null)

  const rawCouriers = couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
  const couriersList = Array.isArray(rawCouriers) ? rawCouriers : []

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  const [isBottleModalOpen, setIsBottleModalOpen] = useState(false)
  const [selectedCourierId, setSelectedCourierId] = useState(null)

  const handleCopyPhone = (phone) => {
    if (!phone || phone === "—") return
    navigator.clipboard?.writeText(phone)
    toast.success(`Telefon raqami nusxalandi: ${phone}`)
  }

  if (isOrderLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Spinner size="lg" />
        <p className="text-sm font-medium">Buyurtma ma'lumotlari yuklanmoqda...</p>
      </div>
    )
  }

  if (isOrderError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 p-6 bg-red-50/50 rounded-2xl border border-red-200 text-center max-w-lg mx-auto mt-8">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-base font-bold text-red-800">Buyurtma yuklanmadi</h3>
        <p className="text-xs text-red-600 max-w-sm">
          {orderError?.response?.data?.message || orderError?.message || "Server bilan aloqada xatolik yuz berdi"}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => refetchOrder()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
          >
            Qayta urinish
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  if (!apiOrder || (!apiOrder.id && !apiOrder._id)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto mt-8">
        <Package className="w-10 h-10 text-slate-400" />
        <h3 className="text-base font-bold text-slate-800">Buyurtma topilmadi</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Kiritilgan identifikator ({id}) bo'yicha buyurtma mavjud emas yoki o'chirilgan.
        </p>
        <Link
          to="/manager/buyurtmalar"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition inline-block"
        >
          Buyurtmalar ro'yxatiga qaytish
        </Link>
      </div>
    )
  }

  const currentOrder = {
    ...apiOrder,
    customer: apiOrder.customer || apiOrder.clientName || apiOrder.client?.name || "Mijoz",
    phone: apiOrder.phone || apiOrder.clientPhone || apiOrder.client?.phone || "—",
    address: apiOrder.address || apiOrder.deliveryAddress || "Manzil ko'rsatilmagan",
    status: apiOrder.status || "CREATED",
    statusText: formatOrderStatusUz(apiOrder.statusText || apiOrder.status || "Yangi"),
    total: Number(apiOrder.total || apiOrder.totalPrice || apiOrder.amount || 0),
    qty: Number(apiOrder.qty || apiOrder.quantity || apiOrder.bottlesCount || 1),
    product: apiOrder.product || apiOrder.items?.[0]?.productName || "18.9L Kapsula",
    sector: apiOrder.sector || apiOrder.region || "Markaz",
    paymentType: apiOrder.paymentType || apiOrder.paymentMethod || "Naqd pul",
    paymentStatus: apiOrder.paymentStatus || "To'langan",
    courier: apiOrder.courier || apiOrder.courierName || apiOrder.courier?.name,
    courierId: apiOrder.courierId || apiOrder.courier?.id,
    vehicle: apiOrder.vehicle || apiOrder.courierVehicle || apiOrder.courier?.vehicle,
    ...(reassignedOverride || {}),
  }

  const activeCourierId = selectedCourierId ?? (currentOrder.courierId || 1)

  const handleReassign = async () => {
    const courier = couriersList.find((c) => c.id === Number(activeCourierId))
    if (!courier) return

    try {
      if (apiOrder?.id) {
        await reassignMutation.mutateAsync({
          id: currentOrder.id,
          data: { newCourierId: Number(activeCourierId) },
        })
      }
      setReassignedOverride({
        courier: courier.name,
        courierId: courier.id,
        vehicle: `${courier.vehicle || "Avtomobil"} (${courier.plate || ""})`,
        status: "delivering",
        statusText: "Yetkazilmoqda",
      })

      setIsReassignModalOpen(false)
      toast.success(`Buyurtma ${courier.name}ga muvaffaqiyatli biriktirildi!`)
    } catch (err) {
      toast.error(err?.message || "Kuryer biriktirishda xatolik yuz berdi")
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
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
            <Link to="/manager/buyurtmalar" className="text-slate-500 hover:text-blue-600 transition-colors">
              Buyurtmalar
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-800">
              {currentOrder.id}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Buyurtma #{currentOrder.id}
            </h1>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getOrderStatusBadgeClass(
                currentOrder.status
              )}`}
            >
              {formatOrderStatusUz(currentOrder.statusText || currentOrder.status)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
            Buyurtma tafsilotlari va yetkazish marshruti monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => handleCopyPhone(currentOrder.phone)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Telefon raqamini nusxalash"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600" />
            <span>Raqamni nusxalash</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBottleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Droplet className="w-3.5 h-3.5 text-blue-600" />
            <span>Idish balansini tuzatish</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReassignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Kuryerni biriktirish</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details (8 cols) + Courier & Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Buyurtmachi & Yetkazish Manzili */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Mijoz va Yetkazish Manzili</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Buyurtmachi</span>
                <p className="text-sm font-bold text-slate-900">{currentOrder.customer}</p>
                <p className="font-mono text-slate-600">{currentOrder.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Hudud / Sektor</span>
                <p className="text-sm font-bold text-slate-900">{currentOrder.sector}</p>
                <p className="text-slate-500">{currentOrder.region || currentOrder.city || "Yetkazish manzili"}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Aniq Manzil</span>
              <p className="font-semibold text-slate-800 text-sm">{currentOrder.address}</p>
              {currentOrder.coords && (
                <p className="text-[11px] text-slate-500 font-mono">
                  GPS Koordinatalar: {currentOrder.coords[0]}, {currentOrder.coords[1]}
                </p>
              )}
            </div>

            {/* Interactive Map Preview for this order */}
            <div className="rounded-lg overflow-hidden border border-slate-200 h-64">
              <Suspense
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                    <Spinner size="md" />
                    <span className="text-xs">Xarita yuklanmoqda...</span>
                  </div>
                }
              >
                <GoogleMap
                  center={{ lat: currentOrder.coords?.[0] || 38.8986231, lng: currentOrder.coords?.[1] || 66.0463534 }}
                  zoom={14}
                  couriers={couriersList}
                  selectedCourierId={currentOrder.courierId}
                  className="w-full h-full min-h-[250px]"
                />
              </Suspense>
            </div>
          </div>

          {/* Card 2: Mahsulot va To'lov Tafsilotlari */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Mahsulotlar va To'lov Holati</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <th className="py-3.5 px-4">Mahsulot nomi</th>
                    <th className="py-3.5 px-4">Miqdor</th>
                    <th className="py-3.5 px-4">Narxi</th>
                    <th className="py-3.5 px-4 text-right">Jami summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{currentOrder.product}</div>
                      <div className="text-xs text-slate-400 mt-0.5">18.9 Litr toza filtrlangan tog' suvi</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {currentOrder.qty} dona
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {(currentOrder.qty > 0 ? Math.round(Number(currentOrder.total || 0) / currentOrder.qty) : Number(currentOrder.total || 0)).toLocaleString()} so'm
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-blue-600">
                      {Number(currentOrder.total || 0).toLocaleString()} so'm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">To'lov usuli:</span>
                <span className="font-semibold text-slate-800">{currentOrder.paymentType}</span>
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  {currentOrder.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Jami to'lov:</span>
                <span className="text-base font-bold text-slate-900">
                  {Number(currentOrder.total || 0).toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Yetkazish Bosqichlari (Timeline) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Yetkazish Jarayoni Xronologiyasi</span>
            </h2>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Buyurtma tizimga qabul qilindi</p>
                  <p className="text-[11px] text-slate-500 font-mono">Bugun, {currentOrder.createdAt || "10:15"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Ombor zaxirasidan ajratildi va qadoqlandi</p>
                  <p className="text-[11px] text-slate-500">Ferma ombori tayyorgarligi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  currentOrder.courier ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {currentOrder.courier ? `Kuryerga yuklandi: ${currentOrder.courier}` : "Kuryer kutilmoqda"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentOrder.vehicle || "Transport biriktirilmagan"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  currentOrder.status === "completed" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Mijozga yetkazib berish</p>
                  <p className="text-[11px] text-slate-500">
                    {currentOrder.status === "completed" ? "Muvaffaqiyatli yetkazildi" : "Kutilayotgan vaqt: 8-15 daqiqa"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Courier & Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Courier Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Biriktirilgan Kuryer
            </h3>

            {currentOrder.courier ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {currentOrder.courier.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{currentOrder.courier}</h4>
                    <p className="text-xs text-slate-500">{currentOrder.vehicle}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Holat:</span>
                    <span className="font-semibold text-blue-600">Yo'nalishda</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxminiy yetib borish:</span>
                    <span className="font-semibold text-slate-800">{currentOrder.eta || "10 daqiqa"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(currentOrder.courierPhone || currentOrder.courier?.phone || "")}
                    disabled={!currentOrder.courierPhone && !currentOrder.courier?.phone}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Kuryer raqamini nusxalash"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Raqam nusxalash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReassignModalOpen(true)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>O'zgartirish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">Kuryer biriktirilmagan</p>
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(true)}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Kuryer tanlash
                </button>
              </div>
            )}
          </div>

          {/* Quick Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Buyurtma Xulosasi
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Mahsulot narxi:</span>
                <span>{Number(currentOrder.total || 0).toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Yetkazish narxi:</span>
                <span className="text-emerald-600 font-semibold">0 so'm (Bepul)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Qaytariladigan idish:</span>
                <span>{currentOrder.qty} dona kapsula</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                <span>Jami:</span>
                <span className="text-blue-600">{Number(currentOrder.total || 0).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      <MantineModal
        opened={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Kuryerni biriktirish ({currentOrder.id})</span>
          </div>
        }
        centered
        size="md"
      >
        <div className="space-y-3 py-2 text-xs">
          <p className="text-slate-600">Qashqadaryo bo'yicha faol kuryerni tanlang:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {couriersList.map((c) => (
              <label
                key={c.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${
                  Number(activeCourierId) === c.id ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="courierModal"
                    checked={Number(activeCourierId) === c.id}
                    onChange={() => setSelectedCourierId(c.id)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500">{c.vehicle} • {c.load}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {c.statusText}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReassignModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              disabled={reassignMutation.isPending}
              onClick={handleReassign}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {reassignMutation.isPending ? "Biriktirilmoqda..." : "Biriktirish"}
            </button>
          </div>
        </div>
      </MantineModal>

      {/* Idish balansini tuzatish modali (POST /api/manager/clients/{clientId}/bottles/adjust) */}
      <AdjustBottleBalanceModal
        isOpen={isBottleModalOpen}
        onClose={() => setIsBottleModalOpen(false)}
        clientId={currentOrder.clientId || currentOrder.customerId || currentOrder.customer_id || currentOrder.client?.id}
        customerName={currentOrder.customer || currentOrder.clientName || currentOrder.client?.name}
        productId={currentOrder.productId || currentOrder.items?.[0]?.productId || currentOrder.items?.[0]?.product_id || 1}
        productName={currentOrder.product || currentOrder.items?.[0]?.productName || "18.9L Kapsula"}
      />
    </div>
  )
}
