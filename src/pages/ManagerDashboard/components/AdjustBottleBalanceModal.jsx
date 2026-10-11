import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import { Droplet, Plus, Minus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAdjustBottleBalance } from "@/shared/hooks"
import { cn } from "@/shared/lib"

const adjustBottleSchema = z.object({
  deltaType: z.enum(["add", "subtract"]),
  amount: z.coerce
    .number({ invalid_type_error: "Miqdorni raqamda kiriting" })
    .min(1, "Idishlar soni kamida 1 bo'lishi kerak")
    .max(1000, "Idishlar soni 1000 dan oshmasligi kerak"),
  note: z.string().max(200, "Izoh 200 ta belgidan oshmasligi kerak").optional().default(""),
})

export function AdjustBottleBalanceModal({
  isOpen,
  onClose,
  clientId,
  customerName = "Mijoz",
  productId = 1,
  productName = "18.9L Kapsula",
}) {
  const { mutate: adjustBottles, isPending } = useAdjustBottleBalance()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adjustBottleSchema),
    defaultValues: {
      deltaType: "add",
      amount: 1,
      note: "",
    },
    mode: "onBlur",
  })

  const deltaType = watch("deltaType")

  const handleClose = () => {
    if (isPending) return
    reset({
      deltaType: "add",
      amount: 1,
      note: "",
    })
    onClose()
  }

  const onSubmit = (data) => {
    if (!clientId) {
      toast.error("Mijoz identifikatori (ID) topilmadi!")
      return
    }

    const parsedAmount = Math.abs(Number(data.amount) || 0)
    const finalDelta = data.deltaType === "add" ? parsedAmount : -parsedAmount

    const payload = {
      productId: Number(productId) || 1,
      delta: finalDelta,
      note: (data.note || "").trim(),
    }

    adjustBottles(
      { clientId, ...payload },
      {
        onSuccess: () => {
          handleClose()
        },
      }
    )
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={handleClose}
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
              onClick={() => setValue("deltaType", "add", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                deltaType === "add"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>Idish qaytarildi (+)</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => setValue("deltaType", "subtract", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                deltaType === "subtract"
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Minus className="size-3.5 stroke-[2.5]" />
              <span>Idish berildi (-)</span>
            </button>
          </div>
        </div>

        {/* Miqdor (Delta) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Idishlar soni (dona) *
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            disabled={isPending}
            {...register("amount")}
            className={cn(
              "w-full h-9.5 px-3 rounded-xl border bg-white text-xs font-semibold text-slate-900 focus:outline-none shadow-2xs transition-all",
              errors.amount
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            )}
            placeholder="Masalan: 1"
          />
          {errors.amount && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Izoh (Note) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Izoh (ixtiyoriy)
          </label>
          <textarea
            rows="2"
            disabled={isPending}
            {...register("note")}
            className={cn(
              "w-full p-2.5 rounded-xl border bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none shadow-2xs transition-all",
              errors.note
                ? "border-rose-400 focus:border-rose-500"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            )}
            placeholder="Masalan: Eski bo'sh idish qabul qilindi..."
          />
          {errors.note && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.note.message}</p>
          )}
        </div>

        {/* Amallar: Bekor qilish va Saqlash */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isPending}
            onClick={handleClose}
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

export default AdjustBottleBalanceModal
