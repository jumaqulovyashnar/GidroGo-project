import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useConfirmCashHandover, useRejectCashHandover, useBossConfirmHandover, useBossRejectHandover } from "@/shared/hooks"
import { useAuth } from "@/provider/AuthProvider"
import { cn, AMOUNT_REGEX } from "@/shared/lib"

const handoverSchema = z
  .object({
    actionType: z.enum(["confirm", "reject"]),
    confirmedAmount: z
      .any()
      .transform((val) => String(val ?? "").trim()),
    note: z.string().trim().max(250, "Izoh 250 ta belgidan oshmasligi kerak").optional().default(""),
    reason: z.string().trim().max(250, "Sabab 250 ta belgidan oshmasligi kerak").optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.actionType === "confirm") {
      if (!data.confirmedAmount || !AMOUNT_REGEX.test(data.confirmedAmount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmedAmount"],
          message: "Summani to'g'ri musbat son shaklida kiriting (Masalan: 50000)",
        })
      }
    } else if (data.actionType === "reject") {
      if (!data.reason || !data.reason.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reason"],
          message: "Iltimos, rad etish sababini yozing!",
        })
      }
    }
  })

function ConfirmHandoverModalContent({ isOpen, onClose, handover }) {
  const { user } = useAuth()
  const isBoss = user?.role === "BOSS" || user?.rawRole === "ROLE_BOSS"

  const { mutate: confirmManager, isPending: isConfirmingManager } = useConfirmCashHandover()
  const { mutate: rejectManager, isPending: isRejectingManager } = useRejectCashHandover()
  const { mutate: confirmBoss, isPending: isConfirmingBoss } = useBossConfirmHandover()
  const { mutate: rejectBoss, isPending: isRejectingBoss } = useBossRejectHandover()

  const confirmHandover = isBoss ? confirmBoss : confirmManager
  const rejectHandover = isBoss ? rejectBoss : rejectManager
  const isPending = isConfirmingManager || isRejectingManager || isConfirmingBoss || isRejectingBoss

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(handoverSchema),
    defaultValues: {
      actionType: "confirm",
      confirmedAmount: Number(handover?.declaredAmount || 0),
      note: "",
      reason: "",
    },
    mode: "onBlur",
  })

  const actionType = watch("actionType")

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  const onSubmit = (data) => {
    if (isPending || !handover?.id) return

    if (data.actionType === "confirm") {
      const payload = {
        id: handover.id,
        confirmedAmount: Number(data.confirmedAmount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      }

      confirmHandover(payload, {
        onSuccess: () => {
          handleClose()
        },
      })
    } else {
      const payload = {
        id: handover.id,
        reason: data.reason.trim(),
      }

      rejectHandover(payload, {
        onSuccess: () => {
          handleClose()
        },
      })
    }
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            {actionType === "confirm" ? (
              <CheckCircle2 className="size-4.5" />
            ) : (
              <XCircle className="size-4.5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {actionType === "confirm"
                ? "Kassa topshirishni tasdiqlash"
                : "Kassa topshirishni rad etish"}
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setValue("actionType", "confirm", { shouldValidate: true })}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              actionType === "confirm"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Tasdiqlash
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setValue("actionType", "reject", { shouldValidate: true })}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              actionType === "reject"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
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
            <span className="font-bold text-blue-600">
              {Number(handover?.declaredAmount || 0).toLocaleString()} so'm
            </span>
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
                disabled={isPending}
                {...register("confirmedAmount")}
                className={cn(
                  "w-full h-10 px-3 rounded-xl border text-sm font-bold text-slate-900 focus:outline-none transition-all disabled:bg-slate-50",
                  errors.confirmedAmount
                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                )}
              />
              {errors.confirmedAmount && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.confirmedAmount.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Izoh <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
              </label>
              <textarea
                rows={2}
                disabled={isPending}
                {...register("note")}
                placeholder="Tasdiqlash izohi..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none disabled:bg-slate-50"
              />
              {errors.note && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.note.message}</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rad etish sababi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              disabled={isPending}
              {...register("reason")}
              placeholder="Masalan: Kassa summasi kam chiqdi..."
              className={cn(
                "w-full p-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none resize-none disabled:bg-slate-50 transition-all",
                errors.reason
                  ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-rose-500"
              )}
            />
            {errors.reason && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.reason.message}</p>
            )}
          </div>
        )}

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
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
