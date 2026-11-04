import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  User,
  Truck,
  AlertCircle,
  Filter,
  Send,
  Loader2,
  Package,
} from "lucide-react"
import { Modal as MantineModal, Select } from "@mantine/core"
import { Card, Spinner } from "@/shared/ui"
import { formatDisplayPhone } from "@/shared/lib"
import {
  useManagerFeedback,
  useManagerFeedbackSummary,
  useUpdateFeedback,
} from "@/shared/hooks"

const feedbackReplySchema = z.object({
  status: z.enum(["NEW", "SEEN", "RESOLVED"]),
  managerNote: z.string().trim().max(500, "Izoh 500 ta belgidan oshmasligi kerak").optional().default(""),
})

const CATEGORY_LABELS = {
  SERVICE: "Xizmat ko'rsatish",
  DELIVERY: "Yetkazib berish",
  PRODUCT: "Mahsulot sifati",
  COURIER: "Kuryer xizmati",
  APP: "Ilova / Tizim",
  PAYMENT: "To'lov",
  OTHER: "Boshqa",
}

export default function ManagerFeedbackPage() {
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sourceFilter, setSourceFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: summaryRes } = useManagerFeedbackSummary()
  const { data: feedbackRes, isLoading, isError, refetch } = useManagerFeedback({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    source: sourceFilter === "ALL" ? undefined : sourceFilter,
  })

  const { mutate: updateFeedback, isPending: isUpdating } = useUpdateFeedback()

  const summary = summaryRes?.data || summaryRes || {}
  const rawFeedbackList =
    feedbackRes?.data?.content ||
    feedbackRes?.data ||
    (Array.isArray(feedbackRes) ? feedbackRes : [])
  const feedbackList = Array.isArray(rawFeedbackList) ? rawFeedbackList : []

  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const handleOpenDetailModal = (item) => {
    setSelectedFeedback(item)
  }

  const handleCloseModal = () => {
    setSelectedFeedback(null)
  }

  const handleSaveUpdate = (payload) => {
    updateFeedback(payload, {
      onSuccess: () => {
        handleCloseModal()
      },
    })
  }

  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return feedbackList

    return feedbackList.filter((item) => {
      const name = (item.authorName || "").toLowerCase()
      const phone = (item.authorPhone || "").toLowerCase()
      const msg = (item.message || "").toLowerCase()
      const order = String(item.orderNumber || item.orderId || "")
      const note = (item.managerNote || "").toLowerCase()
      return (
        name.includes(q) ||
        phone.includes(q) ||
        msg.includes(q) ||
        order.includes(q) ||
        note.includes(q)
      )
    })
  }, [feedbackList, searchQuery])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="size-6 text-blue-600" />
            <span>Fikrlar va Sharhlar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mijozlar va dastavkachilar tomonidan qoldirilgan fikrlar, shikoyatlar va takliflar
          </p>
        </div>
      </div>

      {/* KPI ko'rsatkichlar: Mobilda har biri alohida block qator (3 ta qator) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Yangi fikrlar</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-blue-600">
                {Number(summary.newCount || 0)}
              </span>
              <span className="text-xs font-semibold text-slate-400">ta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Ko'rib chiqilishi kerak</p>
          </div>
          <div className="size-11 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Ko'rib chiqilgan</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-blue-600">
                {Number(summary.seenCount || 0)}
              </span>
              <span className="text-xs font-semibold text-slate-400">ta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Jarayondagi fikrlar</p>
          </div>
          <div className="size-11 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Eye className="size-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Hal qilingan (Yopilgan)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-blue-600">
                {Number(summary.resolvedCount || 0)}
              </span>
              <span className="text-xs font-semibold text-slate-400">ta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Muvaffaqiyatli yakunlangan</p>
          </div>
          <div className="size-11 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
      </div>

      {/* Filtrlash va qidiruv: Clean Flex toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Muallif, telefon, buyurtma yoki xabar bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="w-full sm:w-44 shrink-0">
            <Select
              value={sourceFilter}
              onChange={(val) => setSourceFilter(val || "ALL")}
              data={[
                { value: "ALL", label: "Barcha manbalar" },
                { value: "CLIENT", label: "Mijozlar" },
                { value: "COURIER", label: "Dastavkachilar" },
              ]}
              allowDeselect={false}
              size="sm"
              radius="xl"
            />
          </div>
        </div>

        {/* Status filtrlari: Default oq fon (bg-white), startda turadi */}
        <div className="flex flex-wrap items-center gap-2 justify-start pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Barchasi
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("NEW")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === "NEW"
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Yangi
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("SEEN")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === "SEEN"
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Ko'rilgan
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("RESOLVED")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === "RESOLVED"
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Hal qilingan
          </button>
        </div>
      </div>

      {/* Mobil ko'rinish: Clean Cards (block md:hidden) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <Spinner size="md" />
            <span className="text-xs">Fikrlar yuklanmoqda...</span>
          </div>
        ) : isError ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2 text-rose-500">
            <AlertCircle className="size-6" />
            <span className="text-xs font-medium">Ma'lumotlarni yuklab bo'lmadi</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs text-blue-600 font-semibold underline mt-1"
            >
              Qayta urinish
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <MessageSquare className="size-8 text-slate-300" />
            <span className="text-xs font-medium text-slate-600">
              Hech qanday fikr-mulohaza topilmadi
            </span>
          </div>
        ) : (
          filteredList.map((item) => {
            const isClient = item.source === "CLIENT"
            const isNew = item.status === "NEW"
            const isSeen = item.status === "SEEN"

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.authorName || "Noma'lum muallif"}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDisplayPhone(item.authorPhone)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isNew
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : isSeen
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isNew ? "bg-blue-600" : isSeen ? "bg-slate-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{isNew ? "Yangi" : isSeen ? "Ko'rilgan" : "Hal qilingan"}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isClient
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {isClient ? <User className="size-3 text-slate-500" /> : <Truck className="size-3 text-blue-600" />}
                      <span>{isClient ? "Mijoz" : "Dastavkachi"}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>
                      Kategoriya: <strong className="text-slate-700">{CATEGORY_LABELS[item.category] || item.category || "Umumiy"}</strong>
                    </span>
                    <span className="font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("uz-UZ") : ""}</span>
                  </div>
                </div>

                {item.orderNumber && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Package className="size-3 text-slate-400" />
                    <span>Buyurtma: #{item.orderNumber}</span>
                  </div>
                )}

                {item.managerNote && (
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-blue-900 block">Menejer javobi:</span>
                    <p className="text-slate-700 text-[11px]">{item.managerNote}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(item)}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer text-center"
                  >
                    Ko'rish / Javob yozish
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop view: Table (hidden md:block) */}
      <Card className="hidden md:block bg-white border border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[850px] lg:min-w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider whitespace-nowrap">
                <th className="py-3.5 pl-6 pr-2">Muallif</th>
                <th className="py-3.5 px-4">Manba / Kategoriya</th>
                <th className="py-3.5 px-4">Xabar matni</th>
                <th className="py-3.5 px-4">Buyurtma</th>
                <th className="py-3.5 px-4 text-center">Holat</th>
                <th className="py-3.5 px-4">Menejer javobi</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Spinner size="md" />
                      <span className="text-xs">Fikrlar yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-rose-500">
                      <AlertCircle className="size-6" />
                      <span className="text-xs font-medium">Ma'lumotlarni yuklab bo'lmadi</span>
                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="text-xs text-blue-600 font-semibold underline mt-1"
                      >
                        Qayta urinish
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="size-8 text-slate-300" />
                      <span className="text-xs font-medium text-slate-600">
                        Hech qanday fikr-mulohaza topilmadi
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isClient = item.source === "CLIENT"
                  const isNew = item.status === "NEW"
                  const isSeen = item.status === "SEEN"

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/20 transition-colors group h-16 whitespace-nowrap"
                    >
                      <td className="py-3 pl-6 pr-2 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {item.authorName || "Noma'lum muallif"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {formatDisplayPhone(item.authorPhone)}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isClient
                                ? "bg-slate-100 text-slate-700 border border-slate-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {isClient ? <User className="size-3 text-slate-500" /> : <Truck className="size-3 text-blue-600" />}
                            <span>{isClient ? "Mijoz" : "Dastavkachi"}</span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">
                          {CATEGORY_LABELS[item.category] || item.category || "Umumiy"}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate">
                        <p className="text-xs text-slate-800 font-medium truncate" title={item.message}>
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString("uz-UZ") : "—"}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.orderNumber || item.orderId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold">
                            <Package className="size-3 text-slate-500" />
                            <span>#{item.orderNumber || item.orderId}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isNew
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : isSeen
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isNew ? "bg-blue-600" : isSeen ? "bg-slate-500" : "bg-slate-400"
                            }`}
                          />
                          <span>
                            {isNew ? "Yangi" : isSeen ? "Ko'rilgan" : "Hal qilingan"}
                          </span>
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate">
                        {item.managerNote ? (
                          <div>
                            <p className="text-xs text-slate-700 font-medium truncate" title={item.managerNote}>
                              {item.managerNote}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {item.handledByName ? `Javob berdi: ${item.handledByName}` : "Menejer izohi"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Izoh yo'q</span>
                        )}
                      </td>

                      <td className="py-3 pr-6 pl-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Ko'rish / Javob
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ko'rish va javob berish modali */}
      <FeedbackReplyModal
        opened={Boolean(selectedFeedback)}
        onClose={handleCloseModal}
        feedback={selectedFeedback}
        onSave={handleSaveUpdate}
        isUpdating={isUpdating}
      />
    </div>
  )
}

function FeedbackReplyModal({ opened, onClose, feedback, onSave, isUpdating }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackReplySchema),
    defaultValues: {
      status: "RESOLVED",
      managerNote: "",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (feedback) {
      reset({
        status: feedback.status === "NEW" ? "SEEN" : feedback.status || "RESOLVED",
        managerNote: feedback.managerNote || "",
      })
    }
  }, [feedback, reset])

  const targetStatus = watch("status")

  const onSubmit = (data) => {
    if (!feedback?.id) return
    onSave({
      id: feedback.id,
      status: data.status,
      managerNote: data.managerNote,
    })
  }

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MessageSquare className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Fikr-mulohaza tafsiloti
            </h3>
            <p className="text-[11px] text-slate-500">
              Mijoz yoki dastavkachining murojaatini ko'rib chiqish va javob yozish
            </p>
          </div>
        </div>
      }
      size="520px"
      centered
      radius="xl"
    >
      {feedback && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {feedback.authorName || "Muallif"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  feedback.source === "CLIENT"
                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {feedback.source === "CLIENT" ? "Mijoz" : "Dastavkachi"}
              </span>
            </div>
            <div className="text-slate-600 font-mono">
              Tel: {formatDisplayPhone(feedback.authorPhone)}
            </div>
            {feedback.orderNumber && (
              <div className="text-blue-600 font-semibold">
                Buyurtma: #{feedback.orderNumber}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Murojaat matni:</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
              {feedback.message}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Holatni belgilash:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("status", "SEEN", { shouldValidate: true })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetStatus === "SEEN"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Eye className="size-3.5" />
                <span>Ko'rildi (SEEN)</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("status", "RESOLVED", { shouldValidate: true })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetStatus === "RESOLVED"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                <span>Hal qilindi (RESOLVED)</span>
              </button>
            </div>
            {errors.status && (
              <p className="text-xs text-rose-500 font-medium">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Menejer izohi / Muallifga javob:
            </label>
            <textarea
              rows={3}
              placeholder="Murojaat bo'yicha ko'rilgan chora yoki javob matnini yozing..."
              {...register("managerNote")}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
            />
            {errors.managerNote && (
              <p className="text-xs text-rose-500 font-medium">{errors.managerNote.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Saqlash</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </MantineModal>
  )
}
