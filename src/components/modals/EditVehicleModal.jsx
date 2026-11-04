import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import { Car, Layers, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { cn } from "@/shared/lib"
import { useUpdateStaffVehicle } from "@/shared/hooks"

const vehicleSchema = z.object({
  vehicleModel: z.string().trim().optional(),
  vehiclePlateNumber: z
    .string()
    .trim()
    .min(1, "Mashina davlat raqamini kiriting (Masalan: 01 A 777 AA)"),
  maxCapacity: z
    .any()
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 1 && num <= 500, {
      message: "Yuk sig'imi 1 dan 500 gacha bo'lishi kerak",
    }),
})

export function EditVehicleModal({ opened, onClose, staffId, currentVehicle }) {
  const { mutate: updateVehicle, isPending } = useUpdateStaffVehicle()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleModel: currentVehicle?.vehicleModel || "",
      vehiclePlateNumber: currentVehicle?.vehiclePlateNumber || "",
      maxCapacity: currentVehicle?.maxCapacity || 50,
    },
    mode: "onBlur",
  })

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  const onSubmit = (data) => {
    if (!staffId) return

    updateVehicle(
      {
        id: staffId,
        vehicleModel: data.vehicleModel?.trim(),
        vehiclePlateNumber: data.vehiclePlateNumber?.trim().toUpperCase(),
        maxCapacity: Number(data.maxCapacity),
      },
      {
        onSuccess: () => {
          handleClose()
        },
      }
    )
  }

  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Car className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Transport Ma'lumotlarini Tahrirlash
            </h3>
            <p className="text-[11px] text-slate-500">
              Dastavkachining transport rusumi, davlat raqami va yuk sig'imi
            </p>
          </div>
        </div>
      }
      size="480px"
      centered
      radius="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Transport (mashina rusumi)
          </label>
          <input
            type="text"
            disabled={isPending}
            placeholder="Masalan: Labo, Damas, Porter"
            {...register("vehicleModel")}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-medium transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Mashina davlat raqami *
          </label>
          <input
            type="text"
            disabled={isPending}
            placeholder="01 A 777 AA"
            {...register("vehiclePlateNumber")}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 uppercase font-mono focus:outline-none transition-all",
              errors.vehiclePlateNumber
                ? "border-rose-400 focus:border-rose-500"
                : "border-slate-200 focus:border-blue-500"
            )}
          />
          {errors.vehiclePlateNumber && (
            <p className="text-[11px] text-rose-500 font-medium">
              {errors.vehiclePlateNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Layers className="size-3.5 text-blue-600" />
            <span>Yuk sig'imi (idishlar soni) *</span>
          </label>
          <input
            type="number"
            min="1"
            max="500"
            disabled={isPending}
            placeholder="50"
            {...register("maxCapacity")}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all",
              errors.maxCapacity
                ? "border-rose-400 focus:border-rose-500"
                : "border-slate-200 focus:border-blue-500"
            )}
          />
          {errors.maxCapacity && (
            <p className="text-[11px] text-rose-500 font-medium">
              {errors.maxCapacity.message}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleClose}
            className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={isPending}
            className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Saqlash</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}
