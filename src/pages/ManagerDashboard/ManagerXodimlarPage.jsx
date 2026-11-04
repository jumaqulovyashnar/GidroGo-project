import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Truck,
  Search,
  CheckCircle2,
  Banknote,
  Clock,
  ArrowRight,
  MessageSquare,
  Car,
  Layers,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { Modal as MantineModal } from "@mantine/core"
import { formatDisplayPhone } from "@/shared/lib"
import {
  useCourierCashBalances,
  useCashHandovers,
  useManagerCouriers,
  useManagerCouriersDailySummary,
  useManagerFeedback,
} from "@/shared/hooks"
import { ConfirmHandoverModal, ManagerDirectHandoverModal } from "@/components"

export default function ManagerXodimlarPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Real Couriers & Daily Summary API hooks
  const { data: couriersRes } = useManagerCouriers()
  const { data: dailySummaryRes } = useManagerCouriersDailySummary()

  const couriers = useMemo(() => {
    const raw = couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
    return Array.isArray(raw) ? raw : []
  }, [couriersRes])

  const summaries = useMemo(() => {
    const raw = dailySummaryRes?.data || (Array.isArray(dailySummaryRes) ? dailySummaryRes : [])
    return Array.isArray(raw) ? raw : []
  }, [dailySummaryRes])

  // Real Cash & Handover API hooks
  const { data: cashBalancesRes } = useCourierCashBalances()
  const { data: pendingHandoversRes } = useCashHandovers({ status: "PENDING" })

  const cashBalances = Array.isArray(cashBalancesRes?.data)
    ? cashBalancesRes.data
    : Array.isArray(cashBalancesRes)
    ? cashBalancesRes
    : []
  const pendingHandovers = Array.isArray(pendingHandoversRes?.data)
    ? pendingHandoversRes.data
    : Array.isArray(pendingHandoversRes)
    ? pendingHandoversRes
    : []

  const [selectedHandoverForConfirm, setSelectedHandoverForConfirm] = useState(null)
  const [selectedCourierForDirectHandover, setSelectedCourierForDirectHandover] = useState(null)
  const [selectedCourierForDetail, setSelectedCourierForDetail] = useState(null)

  // Real Feedback API: GET /api/manager/feedback
  const { data: feedbackRes } = useManagerFeedback()
  const allFeedback = useMemo(() => {
    const raw = feedbackRes?.data?.content || feedbackRes?.data || (Array.isArray(feedbackRes) ? feedbackRes : [])
    return Array.isArray(raw) ? raw : []
  }, [feedbackRes])

  const selectedCourierReviews = useMemo(() => {
    if (!selectedCourierForDetail) return []
    const cName = (selectedCourierForDetail.name || "").toLowerCase()
    return allFeedback.filter((item) => {
      const msg = (item.message || "").toLowerCase()
      const author = (item.authorName || "").toLowerCase()
      return item.category === "COURIER" || msg.includes(cName) || author.includes(cName)
    })
  }, [allFeedback, selectedCourierForDetail])

  const getCourierCashBalance = (courierId) => {
    const item = cashBalances.find((b) => Number(b.courierId) === Number(courierId))
    return item ? Number(item.balance || 0) : 0
  }

  const totalCourierCash = cashBalances.reduce((sum, b) => sum + Number(b.balance || 0), 0)

  const normalizedCouriers = useMemo(() => {
    return couriers.map((courier) => {
      const id = courier.id || courier.courierId
      const name = courier.fullName || courier.name || "Kuryer"
      const initials =
        name
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "KR"

      const phone = courier.phone || "-"
      const vehicle = courier.vehicleModel || courier.vehicle || "-"
      const plate = courier.vehiclePlateNumber || courier.plate || ""
      const sector = courier.regionName || courier.sector || "-"
      const load = courier.maxCapacity ? `${courier.maxCapacity} dona` : (courier.load || "-")
      const isOnline = Boolean(
        courier.online ||
        courier.status === "ACTIVE" ||
        courier.status === "on_way" ||
        courier.status === "DELIVERING" ||
        courier.status === "delivering" ||
        courier.status === "free" ||
        courier.status === "AVAILABLE"
      )
      const statusText = courier.statusLabel || (isOnline ? "Onlayn" : "Oflayn")

      return {
        ...courier,
        id,
        name,
        initials,
        phone,
        vehicle,
        plate,
        sector,
        load,
        isOnline,
        statusText,
      }
    })
  }, [couriers])

  const activeCouriersCount = normalizedCouriers.filter((c) => c.isOnline).length
  const totalDeliveredOrders = summaries.reduce((sum, s) => sum + Number(s.completedOrdersCount || 0), 0)
  const totalDeliveredBottles =
    summaries.reduce((sum, s) => sum + Number(s.soldBottlesToday || 0), 0) ||
    couriers.reduce((sum, c) => sum + Number(c.todayDeliveredBottles || 0), 0)

  const filteredCouriers = normalizedCouriers.filter((courier) => {
    const name = courier.name.toLowerCase()
    const phone = courier.phone
    const vehicle = courier.vehicle.toLowerCase()
    const plate = courier.plate.toLowerCase()
    const sector = courier.sector.toLowerCase()
    const query = searchQuery.toLowerCase().trim()

    const matchesSearch =
      !query ||
      name.includes(query) ||
      phone.includes(query) ||
      vehicle.includes(query) ||
      plate.includes(query) ||
      sector.includes(query)

    if (!matchesSearch) return false
    if (statusFilter === "on_way") return courier.status === "on_way" || courier.status === "DELIVERING" || courier.status === "delivering"
    if (statusFilter === "free") return courier.status === "free" || courier.status === "AVAILABLE" || courier.status === "available"
    if (statusFilter === "loading") return courier.status === "loading" || courier.status === "BUSY" || courier.status === "busy"
    return true
  })

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Xodimlar (Dastavkachilar)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kuryerlar, transport va yetkazish monitoringi.
          </p>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami kuryerlar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{couriers.length}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {couriers.length > 0 ? "Barcha ro'yxatdan o'tgan kuryerlar" : "Kuryerlar mavjud emas"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Faol liniyada</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{activeCouriersCount}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeCouriersCount > 0 ? `${activeCouriersCount} kuryer liniyada ishlamoqda` : "Hozirda faol kuryer yo'q"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugun yetkazilgan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{totalDeliveredOrders}</span>
              <span className="text-xs font-semibold text-slate-400">buyurtma</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              {totalDeliveredBottles > 0 ? `${totalDeliveredBottles.toLocaleString()} ta suv idishi` : "Hozircha yetkazilgan buyurtma yo'q"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Dastavkachilar kassasi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {Number(totalCourierCash || 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">so'm</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {pendingHandovers.length > 0
                ? `${pendingHandovers.length} ta topshirish kutilmoqda`
                : "Barcha kassalar nazoratda"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Kassa topshirish so'rovlari bildirishnomasi */}
      {pendingHandovers.length > 0 && (
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>{pendingHandovers.length} ta</strong> dastavkachidan kassa topshirish so'rovi kutilmoqda!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedHandoverForConfirm(pendingHandovers[0])}
            className="w-full sm:w-auto justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <span>Ko'rib chiqish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Couriers List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
        {/* Table Filters */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi ({normalizedCouriers.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("on_way")}
              className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "on_way" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Yo'lda ({normalizedCouriers.filter((c) => c.status === "on_way" || c.status === "DELIVERING" || c.status === "delivering").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("free")}
              className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "free" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Bo'sh ({normalizedCouriers.filter((c) => c.status === "free" || c.status === "AVAILABLE" || c.status === "available").length})
            </button>
          </div>
        </div>

        {/* Couriers Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse min-w-[850px] lg:min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider whitespace-nowrap">
                <th className="py-3.5 pl-4 pr-1 w-14 text-center">Rasm</th>
                <th className="py-3.5 pl-2 pr-4">Kuryer</th>
                <th className="py-3.5 px-4">Telefon raqam</th>
                <th className="py-3.5 px-4">Transport</th>
                <th className="py-3.5 px-4">Yuk sig'imi</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4">Kassa Balansi</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCouriers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-0 py-16 text-center text-slate-400">
                    <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex items-center justify-center px-4 whitespace-normal">
                      <span>Kuryerlar topilmadi</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCouriers.map((courier) => {
                  const courierCash = getCourierCashBalance(courier.id)
                  return (
                    <tr key={courier.id} className="hover:bg-slate-50/80 transition-colors h-16 whitespace-nowrap">
                      <td className="py-3.5 pl-4 pr-1 w-14 text-center whitespace-nowrap">
                        <div className="size-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto border border-blue-100/60 shadow-2xs">
                          {courier.initials}
                        </div>
                      </td>

                      <td className="py-3.5 pl-2 pr-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedCourierForDetail(courier)}
                          className="font-bold text-slate-900 text-sm whitespace-nowrap hover:text-blue-600 transition-colors cursor-pointer text-left block"
                        >
                          {courier.name}
                        </button>
                        <div className="text-[11px] text-slate-400 whitespace-nowrap">Dastavkachi xodim</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700 text-xs">
                        {formatDisplayPhone(courier.phone)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {courier.vehicle && courier.vehicle !== "-" ? (
                          <div>
                            <div className="font-medium text-slate-800 text-xs">{courier.vehicle}</div>
                            {courier.plate && (
                              <div className="text-[11px] text-slate-400 font-mono">{courier.plate}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Biriktirilmagan</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-blue-600 text-xs">{courier.load}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            courier.isOnline
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {courier.statusText}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`font-bold font-mono text-xs ${courierCash > 0 ? "text-blue-600" : "text-slate-500"}`}>
                          {Number(courierCash || 0).toLocaleString()} so'm
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(() => {
                            const courierPendingHandover = pendingHandovers.find(
                              (h) => Number(h.courierId) === Number(courier.id)
                            )
                            if (courierPendingHandover) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => setSelectedHandoverForConfirm(courierPendingHandover)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                  title="Dastavkachi so'rovini tasdiqlash"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Tasdiqlash</span>
                                </button>
                              )
                            }
                            return (
                              <button
                                type="button"
                                onClick={() => setSelectedCourierForDirectHandover(courier)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                                title="Dastavkachidan naqd pul qabul qilish"
                              >
                                <Banknote className="w-3.5 h-3.5 text-blue-600" />
                                <span>Pul qabul qilish</span>
                              </button>
                            )
                          })()}
                          <button
                            type="button"
                            onClick={() => navigate("/manager/dastavkachilar-xarita")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Xaritada
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kuryer kassa so'rovini tasdiqlash/rad etish modali */}
      <ConfirmHandoverModal
        isOpen={Boolean(selectedHandoverForConfirm)}
        onClose={() => setSelectedHandoverForConfirm(null)}
        handover={selectedHandoverForConfirm}
      />

      {/* Menejer tomonidan to'g'ridan-to'g'ri naqd pul qabul qilish modali */}
      <ManagerDirectHandoverModal
        isOpen={Boolean(selectedCourierForDirectHandover)}
        onClose={() => setSelectedCourierForDirectHandover(null)}
        courierId={selectedCourierForDirectHandover?.id}
        courierName={selectedCourierForDirectHandover?.name}
      />

      {/* Dastavkachi Tafsiloti va Sharhlar Modali */}
      <MantineModal
        opened={Boolean(selectedCourierForDetail)}
        onClose={() => setSelectedCourierForDetail(null)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Truck className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Dastavkachi Tafsiloti va Sharhlar
              </h3>
              <p className="text-[11px] text-slate-500">
                Transport ma'lumotlari, kassa va mijozlar fikrlari
              </p>
            </div>
          </div>
        }
        size="560px"
        centered
        radius="xl"
      >
        {selectedCourierForDetail && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedCourierForDetail.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedCourierForDetail.isOnline
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {selectedCourierForDetail.statusText}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {formatDisplayPhone(selectedCourierForDetail.phone)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Kassa balansi</span>
                <span className="text-sm font-bold font-mono text-blue-600">
                  {Number(getCourierCashBalance(selectedCourierForDetail.id)).toLocaleString()} so'm
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Transport</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {selectedCourierForDetail.vehicle && selectedCourierForDetail.vehicle !== "-"
                    ? selectedCourierForDetail.vehicle
                    : "Biriktirilmagan"}
                </p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Mashina Raqami</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">
                  {selectedCourierForDetail.plate || "—"}
                </p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Yuk Sig'imi</span>
                <p className="font-bold text-blue-600 mt-0.5">
                  {selectedCourierForDetail.load || "50 dona"}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MessageSquare className="size-4 text-blue-600" />
                  <span>Dastavkachiga Berilgan Sharhlar</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {selectedCourierReviews.length} ta fikr
                </span>
              </div>

              {selectedCourierReviews.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="font-medium text-slate-600">Hozircha sharhlar yo'q</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mijozlar buyurtma yakunida sharh qoldirganda bu yerda ko'rinadi
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCourierReviews.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {fb.authorName || "Mijoz"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString("uz-UZ") : ""}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{fb.message}</p>
                      {fb.managerNote && (
                        <div className="p-2 bg-blue-50/70 rounded-lg text-[11px] text-blue-900 border border-blue-100 mt-1">
                          <strong className="font-semibold">Menejer javobi:</strong> {fb.managerNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yopish tugmasi */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourierForDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </MantineModal>
    </div>
  )
}
