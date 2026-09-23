import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Truck,
  Copy,
  Search,
  MapPin,
  CheckCircle2,
  Star,
} from "lucide-react"
import { MOCK_COURIERS } from "@/mock"
import { toast } from "sonner"

export default function ManagerXodimlarPage() {
  const navigate = useNavigate()
  const [couriers] = useState(MOCK_COURIERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCouriers = couriers.filter((courier) => {
    const matchesSearch =
      courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.phone.includes(searchQuery) ||
      courier.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.sector.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter === "on_way") return courier.status === "on_way"
    if (statusFilter === "free") return courier.status === "free"
    if (statusFilter === "loading") return courier.status === "loading"
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Xodimlar (Dastavkachilar)</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Qarshi Filiali
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Qarshi filiali kuryerlar shtati, transport vositalari, sektorlar va kunlik yetkazish monitoringi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/dastavkachilar-xarita")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Jonli Xaritada ko'rish</span>
        </button>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami kuryerlar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{couriers.length}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Barcha transportlar texnik soz</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Faol liniyada</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">2 kuryer navbatchilikda</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugun yetkazilgan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">94</span>
              <span className="text-xs font-semibold text-slate-400">buyurtma</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">1,780 Litr toza suv</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">O'rtacha xizmat reytingi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">4.94</span>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-600" />
                a'lo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Mijozlar bahosi asosida</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Couriers List Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kuryer ismi, telefon yoki transport raqami..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi ({couriers.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("on_way")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "on_way" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Yo'lda ({couriers.filter((c) => c.status === "on_way").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("free")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "free" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Bo'sh ({couriers.filter((c) => c.status === "free").length})
            </button>
          </div>
        </div>

        {/* Couriers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Kuryer</th>
                <th className="py-2.5 px-3">Telefon raqam</th>
                <th className="py-2.5 px-3">Transport</th>
                <th className="py-2.5 px-3">Hudud / Sektor</th>
                <th className="py-2.5 px-3">Yuk sig'imi</th>
                <th className="py-2.5 px-3">Holat</th>
                <th className="py-2.5 px-3">Bugun</th>
                <th className="py-2.5 px-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCouriers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Kuryerlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredCouriers.map((courier) => (
                  <tr key={courier.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {courier.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{courier.name}</span>
                            <span className="text-[10px] text-amber-500 font-medium">
                              ★ {courier.rating}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">Dastavkachi xodim</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {courier.phone}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{courier.vehicle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{courier.plate}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {courier.sector}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-blue-600">{courier.load}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          courier.status === "on_way"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : courier.status === "free"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {courier.statusText}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {courier.completedToday} ta
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(courier.phone)
                            toast.success(`Telefon raqami nusxalandi: ${courier.phone}`)
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Telefon raqamini nusxalash"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/manager/dastavkachilar-xarita")}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          Xaritada
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
