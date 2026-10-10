import { useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Droplet, Plus, Minus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAdjustBottleBalance } from "@/shared/hooks"

export function AdjustBottleBalanceModal({
  isOpen,
  onClose,
  clientId,
  customerName = "Mijoz",
  productId = 1,
  productName = "18.9L Kapsula",
}) {
  const [deltaType, setDeltaType] = useState("add") // "add" (+) yoki "subtract" (-)
  const [amount, setAmount] = useState(1)
  const [note, setNote] = useState("")

  const { mutate: adjustBottles, isPending } = useAdjustBottleBalance()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Double-submit protection
    if (isPending) return

    const parsedAmount = Math.abs(Number(amount) || 0)
    if (parsedAmount === 0) {
      toast.error("Iltimos, noldan farqli miqdor kiriting!")
      return
    }

    const finalDelta = deltaType === "add" ? parsedAmount : -parsedAmount

    // Faqat backend talab qilgan fildlar: { productId, delta, note }
    const payload = {
      productId: Number(productId) || 1,
      delta: finalDelta,
      note: note.trim(),
    }

    adjustBottles(
      { clientId, ...payload },
      {
        onSuccess: () => {
          onClose()
          setAmount(1)
          setNote("")
        },
      }
    )
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={() => !isPending && onClose()}
      title={
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplet className="size-4 stroke-2" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Idish Balansini Tuzatish
            </h3>
            <p className="text-[11px] text-slate-500">{customerName}</p>
          </div>
        </div>
      }
      centered
      radius="lg"
      padding="lg"
      overlayProps={{ backgroundOpacity: 0.45, blur: 3 }}
      styles={{
        header: { paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" },
        content: { borderRadius: "1rem" },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Mahsulot ma'lumoti */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Mahsulot:</span>
          <span className="font-bold text-slate-900">{productName}</span>
        </div>

        {/* Amal turi (+ Qabul qilindi yoki - Berildi) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Amal turi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setDeltaType("add")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                deltaType === "add"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>Idish qaytarildi (+)</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => setDeltaType("subtract")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                deltaType === "subtract"
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Minus className="size-3.5 stroke-[2.5]" />
              <span>Idish berildi (-)</span>
            </button>
          </div>
        </div>

        {/* Miqdor (Delta) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Idishlar soni (dona)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            disabled={isPending}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full h-9.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
            placeholder="Masalan: 1"
            required
          />
        </div>
        {/* Izoh (Note) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Izoh (ixtiyoriy)
          </label>
          <textarea
            rows="2"
            disabled={isPending}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-2xs"
            placeholder="Masalan: Eski bo'sh idish qabul qilindi..."
          />
        </div>

        {/* Amallar: Bekor qilish va Saqlash (Double request himoyalangan) */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Bekor qilish
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <span>Saqlash</span>
            )}
          </button>
        </div>
      </form>
    </MantineModal>
  )
}

export default AdjustBottleBalanceModal;
