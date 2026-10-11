import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import { Banknote, Loader2 } from "lucide-react"
import { useDirectCashHandover } from "@/shared/hooks"
import { cn, AMOUNT_REGEX } from "@/shared/lib"

const directHandoverSchema = z.object({
  amount: z
    .any()
    .transform((val) => String(val ?? "").trim())
    .refine((val) => AMOUNT_REGEX.test(val), {
      message: "Summani to'g'ri musbat son shaklida kiriting (Masalan: 100000)",
    })
    .transform((val) => Number(val)),
  note: z.string().trim().max(250, "Izoh 250 ta belgidan oshmasligi kerak").optional().default(""),
})

export function ManagerDirectHandoverModal({
  isOpen,
  onClose,
  courierId,
  courierName = "Dastavkachi",
}) {
  const { mutate: directHandover, isPending } = useDirectCashHandover()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(directHandoverSchema),
    defaultValues: {
      amount: "",
      note: "",
    },
    mode: "onBlur",
  })

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  const onSubmit = (data) => {
    if (isPending || !courierId) return

    const payload = {
      courierId: Number(courierId),
      amount: Number(data.amount),
      ...(data.note?.trim() ? { note: data.note.trim() } : {}),
    }

    directHandover(payload, {
      onSuccess: () => {
        handleClose()
      },
    })
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Banknote className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Kassani qabul qilish</h3>
            <p className="text-[11px] text-slate-500">Menejer tomonidan naqd pulni kiritish</p>
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Dastavkachi:</span>
          <p className="text-sm font-bold text-slate-900">{courierName}</p>
        </div>

        {/* Summa (amount) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Topshirilgan summa (so'm) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="any"
              disabled={isPending}
              {...register("amount")}
              placeholder="Masalan: 500000"
              className={cn(
                "w-full h-10 px-3 rounded-xl border text-sm font-bold text-slate-900 focus:outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed",
                errors.amount
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              )}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Izoh (note) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Izoh / Izoh matni <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
          </label>
          <textarea
            rows={2}
            disabled={isPending}
            {...register("note")}
            placeholder="Masalan: Kunlik tushum qabul qilindi..."
            className={cn(
              "w-full p-2.5 rounded-xl border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed resize-none transition-all",
              errors.note
                ? "border-rose-400 focus:border-rose-500"
                : "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            )}
          />
          {errors.note && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.note.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isPending}
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Qabul qilinmoqda...</span>
              </>
            ) : (
              <span>Qabul qilish</span>
            )}
          </button>
        </div>
      </form>
    </MantineModal>
  )
}

export default ManagerDirectHandoverModal
