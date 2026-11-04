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
    items: Array.isArray(apiOrder.items) ? apiOrder.items : [],
    sector: apiOrder.sector || apiOrder.region || "Markaz",
    paymentType: apiOrder.paymentType || apiOrder.paymentMethod || "Naqd pul",
    paymentStatus: apiOrder.paymentStatus || "To'langan",
    courier: apiOrder.courier || apiOrder.courierName || apiOrder.courier?.name,
    courierId: apiOrder.courierId || apiOrder.courier?.id,
    vehicle:
      apiOrder.courierVehicleModel ||
      apiOrder.vehicle ||
      apiOrder.courierVehicle ||
      apiOrder.courier?.vehicle ||
      "—",
    plateNumber:
      apiOrder.courierVehiclePlateNumber ||
      apiOrder.courier?.plate ||
      "",
    cartGroupId: apiOrder.cartGroupId,
    deliverySequence: apiOrder.deliverySequence,
    anchorOrderId: apiOrder.anchorOrderId,
    preparingReason: apiOrder.preparingReason,
    preparingSince: apiOrder.preparingSince,
    dispatchAttempts: apiOrder.dispatchAttempts,
    productsSum: Number(apiOrder.productsSum || 0),
    taraQtyEstimated: apiOrder.taraQtyEstimated,
    taraQtyFinal: apiOrder.taraQtyFinal,
    taraSum: Number(apiOrder.taraSum || 0),
    bottles: Array.isArray(apiOrder.bottles) ? apiOrder.bottles : [],
    warnings: Array.isArray(apiOrder.warnings) ? apiOrder.warnings : [],
    statusHistory: Array.isArray(apiOrder.statusHistory) ? apiOrder.statusHistory : [],
    reviewed: apiOrder.reviewed,
    reviewedAt: apiOrder.reviewedAt,
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Buyurtma #{currentOrder.id}
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
            >
              {formatOrderStatusUz(currentOrder.statusText || currentOrder.status)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
            Buyurtma tafsilotlari va yetkazish marshruti monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
          <button
            type="button"
            onClick={() => handleCopyPhone(currentOrder.phone)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Telefon raqamini nusxalash"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600" />
            <span>Raqamni nusxalash</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBottleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Droplet className="w-3.5 h-3.5 text-blue-600" />
            <span>Idish balansini tuzatish</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReassignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Kuryerni biriktirish</span>
          </button>
        </div>
      </div>

      {/* Buyurtma tafsilotlari va kuryer ma'lumotlari */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {currentOrder.warnings && currentOrder.warnings.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-800">
              <span className="font-bold flex items-center gap-2 text-blue-600">
                <AlertCircle className="size-4.5 text-blue-600" />
                <span className="text-sm font-bold">Tizim Ogohlantirishlari:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-xs">
                {currentOrder.warnings.map((w, idx) => (
                  <li key={idx}>{typeof w === "string" ? w : JSON.stringify(w)}</li>
                ))}
              </ul>
            </div>
          )}

          {(currentOrder.cartGroupId || currentOrder.deliverySequence || currentOrder.dispatchAttempts || currentOrder.reviewed) && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap items-center gap-2.5 text-xs">
              {currentOrder.cartGroupId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-mono text-xs font-semibold">
                  <span>Savat guruhi: #{String(currentOrder.cartGroupId).slice(0, 8)}</span>
                </span>
              )}
              {currentOrder.deliverySequence && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs">
                  <span>Marshrut navbati: #{currentOrder.deliverySequence}</span>
                </span>
              )}
              {currentOrder.dispatchAttempts > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                  <span>Tayinlash urinishlari: {currentOrder.dispatchAttempts}</span>
                </span>
              )}
              {currentOrder.reviewed && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  <CheckCircle2 className="size-3.5 text-blue-600" />
                  <span>Mijoz tomonidan baholangan</span>
                </span>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Mijoz va Manzil</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Buyurtmachi</span>
                <p className="text-base font-bold text-slate-900">{currentOrder.customer}</p>
                <p className="font-mono text-sm text-slate-600 font-medium">{currentOrder.phone}</p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Hudud / Sektor</span>
                <p className="text-base font-bold text-slate-900">{currentOrder.sector}</p>
                <p className="text-sm text-slate-500 font-medium">{currentOrder.region || currentOrder.city || "Yetkazish manzili"}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5 text-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Aniq Manzil</span>
              <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{currentOrder.address}</p>
              {currentOrder.coords && (
                <p className="text-xs text-slate-500 font-mono mt-1">
                  GPS Koordinatalar: {currentOrder.coords[0]}, {currentOrder.coords[1]}
                </p>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 h-[380px] sm:h-[440px] shadow-2xs">
              <Suspense
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 bg-slate-50 text-slate-400">
                    <Spinner size="md" />
                    <span className="text-xs font-medium">Xarita yuklanmoqda...</span>
                  </div>
                }
              >
                <GoogleMap
                  center={{ lat: currentOrder.coords?.[0] || 38.8986231, lng: currentOrder.coords?.[1] || 66.0463534 }}
                  zoom={14}
                  couriers={couriersList}
                  selectedCourierId={currentOrder.courierId}
                  className="w-full h-full min-h-[380px]"
                />
              </Suspense>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Mahsulotlar va To'lov Holati</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[550px] lg:min-w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <th className="py-4 px-5">Mahsulot nomi</th>
                    <th className="py-4 px-5">Miqdor</th>
                    <th className="py-4 px-5">Narxi</th>
                    <th className="py-4 px-5 text-right">Jami summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-sm sm:text-base">{item.productName || item.product?.name || "Mahsulot"}</div>
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-800 text-sm">
                          {item.quantity || item.qty} dona
                        </td>
                        <td className="py-4 px-5 text-slate-700 font-medium text-sm">
                          {Number(item.unitPrice || item.price || 0).toLocaleString()} so'm
                        </td>
                        <td className="py-4 px-5 text-right font-extrabold text-blue-600 text-sm sm:text-base">
                          {Number(item.subtotal || (item.quantity * item.unitPrice) || 0).toLocaleString()} so'm
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4.5 px-5">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">{currentOrder.product}</div>
                        <div className="text-xs text-slate-400 mt-0.5">18.9 Litr toza filtrlangan tog' suvi</div>
                      </td>
                      <td className="py-4.5 px-5 font-bold text-slate-800 text-sm">
                        {currentOrder.qty} dona
                      </td>
                      <td className="py-4.5 px-5 text-slate-700 font-medium text-sm">
                        {(currentOrder.qty > 0 ? Math.round(Number(currentOrder.total || 0) / currentOrder.qty) : Number(currentOrder.total || 0)).toLocaleString()} so'm
                      </td>
                      <td className="py-4.5 px-5 text-right font-extrabold text-blue-600 text-sm sm:text-base">
                        {Number(currentOrder.total || 0).toLocaleString()} so'm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {(currentOrder.taraSum > 0 || currentOrder.taraQtyEstimated !== undefined || currentOrder.taraQtyFinal !== undefined || currentOrder.bottles?.length > 0) && (
              <div className="p-5 sm:p-6 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-blue-100/70 pb-2.5">
                  <span className="font-bold text-sm text-blue-900 flex items-center gap-2">
                    <Droplet className="size-4 text-blue-600" />
                    <span>Tara / Idishlar Hisob-kitobi</span>
                  </span>
                  {currentOrder.taraSum > 0 && (
                    <span className="font-bold font-mono text-sm text-blue-700">
                      Depozit: {Number(currentOrder.taraSum).toLocaleString()} so'm
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100/90 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium block">Mahsulot summasi</span>
                    <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base mt-1 block">
                      {Number(currentOrder.productsSum || (currentOrder.total - currentOrder.taraSum)).toLocaleString()} so'm
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100/90 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium block">Kutilgan bo'sh idish</span>
                    <span className="font-extrabold text-blue-600 font-mono text-sm sm:text-base mt-1 block">
                      {currentOrder.taraQtyEstimated ?? 0} dona
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100/90 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium block">Qaytarilgan idish</span>
                    <span className="font-extrabold text-blue-600 font-mono text-sm sm:text-base mt-1 block">
                      {currentOrder.taraQtyFinal ?? currentOrder.emptyBottlesReturned ?? 0} dona
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100/90 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium block">Tara depoziti</span>
                    <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base mt-1 block">
                      {Number(currentOrder.taraSum || 0).toLocaleString()} so'm
                    </span>
                  </div>
                </div>

                {currentOrder.bottles && currentOrder.bottles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-100/70">
                    <span className="font-bold text-xs text-slate-700 block mb-2">Idish turlari bo'yicha taqsimot:</span>
                    <div className="space-y-1.5">
                      {currentOrder.bottles.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-blue-100/70 text-xs">
                          <span className="font-semibold text-slate-800">{b.productName || `Mahsulot #${b.productId}`}</span>
                          <span className="text-slate-600 font-mono text-xs">
                            To'liq: <strong className="text-slate-900">{b.fullQty}</strong> ta | Kutilgan bo'sh: <strong className="text-blue-600">{b.expectedEmptyQty}</strong> ta
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4.5 h-4.5 text-slate-400" />
                <span className="text-slate-500 font-medium">To'lov usuli:</span>
                <span className="font-bold text-slate-900">{currentOrder.paymentType}</span>
                <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs">
                  {currentOrder.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-slate-500 font-medium">Jami to'lov:</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {Number(currentOrder.total || 0).toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Yetkazish Jarayoni Xronologiyasi</span>
            </h2>

            <div className="space-y-5 text-sm pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">Buyurtma tizimga qabul qilindi</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Bugun, {currentOrder.createdAt || "10:15"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">Ombor zaxirasidan ajratildi va qadoqlandi</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ferma ombori tayyorgarligi</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  currentOrder.courier ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">
                    {currentOrder.courier ? `Kuryerga yuklandi: ${currentOrder.courier}` : "Kuryer kutilmoqda"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentOrder.vehicle || "Transport biriktirilmagan"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  currentOrder.status === "completed" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">Mijozga yetkazib berish</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentOrder.status === "completed" ? "Muvaffaqiyatli yetkazildi" : "Kutilayotgan vaqt: 8-15 daqiqa"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Biriktirilgan Kuryer
            </h3>

            {currentOrder.courier ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {currentOrder.courier.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{currentOrder.courier}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentOrder.vehicle}</p>
                    {currentOrder.plateNumber && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                        {currentOrder.plateNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Holat:</span>
                    <span className="font-bold text-blue-600">Yo'nalishda</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Taxminiy yetib borish:</span>
                    <span className="font-bold text-slate-800">{currentOrder.eta || "10 daqiqa"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(currentOrder.courierPhone || currentOrder.courier?.phone || "")}
                    disabled={!currentOrder.courierPhone && !currentOrder.courier?.phone}
                    className="flex-1 h-10 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Kuryer raqamini nusxalash"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Raqam nusxalash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReassignModalOpen(true)}
                    className="flex-1 h-10 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>O'zgartirish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Kuryer biriktirilmagan</p>
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(true)}
                  className="w-full h-10 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  Kuryer tanlash
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-sm sm:text-base">
              Buyurtma Xulosasi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Mahsulot narxi:</span>
                <span className="font-semibold text-slate-800">{Number(currentOrder.total || 0).toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Yetkazish narxi:</span>
                <span className="text-blue-600 font-bold">0 so'm (Bepul)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Qaytariladigan idish:</span>
                <span className="font-semibold text-slate-800">{currentOrder.qty} dona kapsula</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-base">
                <span>Jami:</span>
                <span className="text-lg font-extrabold text-blue-600">{Number(currentOrder.total || 0).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
