import { useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useConfirmCashHandover, useRejectCashHandover } from "@/shared/hooks"

function ConfirmHandoverModalContent({ isOpen, onClose, handover }) {
  const [actionType, setActionType] = useState("confirm") // "confirm" or "reject"
  const [confirmedAmount, setConfirmedAmount] = useState(
    handover?.declaredAmount ? String(handover.declaredAmount) : ""
  )
  const [note, setNote] = useState("")
  const [reason, setReason] = useState("")
  const { mutate: confirmHandover, isPending: isConfirming } = useConfirmCashHandover()
  const { mutate: rejectHandover, isPending: isRejecting } = useRejectCashHandover()
  const isPending = isConfirming || isRejecting

  const handleSubmit = (e) => {
    e.preventDefault()

    // 1. Double request protection
    if (isPending || !handover?.id) return

    if (actionType === "confirm") {
      const amountNum = Number(confirmedAmount)
      if (!amountNum || amountNum <= 0) {
        toast.error("Tasdiqlash summasi noldan katta bo'lishi kerak!")
        return
      }

      // Faqat Swagger talab qilgan fildlar: { confirmedAmount, note }
      const payload = {
        id: handover.id,
        confirmedAmount: amountNum,
        ...(note.trim() ? { note: note.trim() } : {}),
      }

      confirmHandover(payload, {
        onSuccess: () => {
          onClose()
        },
      })
    } else {
      if (!reason.trim()) {
        toast.error("Iltimos, rad etish sababini yozing!")
        return
      }

      // Faqat Swagger talab qilgan fildlar: { reason }
      const payload = {
        id: handover.id,
        reason: reason.trim(),
      }

      rejectHandover(payload, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={() => !isPending && onClose()}
      title={
        <div className="flex items-center gap-2">
          <div className={`size-8 rounded-lg flex items-center justify-center ${actionType === "confirm" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {actionType === "confirm" ? <CheckCircle2 className="size-4.5" /> : <XCircle className="size-4.5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {actionType === "confirm" ? "Kassa topshirishni tasdiqlash" : "Kassa topshirishni rad etish"}
            </h3>
            <p className="text-[11px] text-slate-500">So'rov #{handover?.id}</p>
          </div>
        </div>
      }
      centered
      size="sm"
      classNames={{
        content: "!rounded-2xl !p-1",
        header: "!px-4 !pt-3 !pb-2 border-b border-slate-100",
        body: "!p-4",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Switch tab */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setActionType("confirm")}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              actionType === "confirm" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tasdiqlash
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setActionType("reject")}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              actionType === "reject" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rad etish
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Dastavkachi:</span>
            <span className="font-bold text-slate-900">{handover?.courierName || "Dastavkachi"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kuryer bildirgan summa:</span>
            <span className="font-bold text-blue-600">{Number(handover?.declaredAmount || 0).toLocaleString()} so'm</span>
          </div>
          {handover?.note && (
            <div className="flex justify-between">
              <span className="text-slate-500">Kuryer izohi:</span>
              <span className="text-slate-700 italic">{handover.note}</span>
            </div>
          )}
        </div>

        {actionType === "confirm" ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tasdiqlangan summa (so'm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                disabled={isPending}
                value={confirmedAmount}
                onChange={(e) => setConfirmedAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Izoh <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
              </label>
              <textarea
                rows={2}
                disabled={isPending}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tasdiqlash izohi..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 resize-none disabled:bg-slate-50"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rad etish sababi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              disabled={isPending}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: Kassa summasi kam chiqdi..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500 resize-none disabled:bg-slate-50"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              actionType === "confirm" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Bajarilmoqda...</span>
              </>
            ) : actionType === "confirm" ? (
              <span>Tasdiqlash</span>
            ) : (
              <span>Rad etish</span>
            )}
          </button>
        </div>
      </form>
    </MantineModal>
  )
}

export function ConfirmHandoverModal({ isOpen, onClose, handover }) {
  if (!isOpen) return null

  return (
    <ConfirmHandoverModalContent
      key={handover?.id || "empty"}
      isOpen={isOpen}
      onClose={onClose}
      handover={handover}
    />
  )
}

export default ConfirmHandoverModal
