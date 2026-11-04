import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import {
  UserPlus,
  Truck,
  Briefcase,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  User,
  Clock,
  Car,
  Layers,
} from "lucide-react"
import { Button, Input } from "@/shared/ui"
import { cn, NAME_REGEX, PHONE_REGEX, formatPhoneInput, cleanPhoneForBackend } from "@/shared/lib"

const addXodimSchema = z
  .object({
    role: z.enum(["MANAGER", "COURIER"], {
      errorMap: () => ({ message: "Xodim lavozimini tanlang" }),
    }),
    shiftType: z.string().optional(),
    fullName: z
      .string()
      .trim()
      .min(1, "Ism va familiyani kiriting")
      .min(3, "Ism va familiya kamida 3 ta belgidan iborat bo'lishi kerak")
      .max(60, "Ism va familiya 60 ta belgidan oshmasligi kerak")
      .regex(NAME_REGEX, "Ism va familiyada faqat harflar qatnashishi kerak"),
    phone: z
      .string()
      .trim()
      .transform((val) => formatPhoneInput(val))
      .refine((val) => PHONE_REGEX.test(val), {
        message: "Telefon raqamini to'g'ri formatda kiriting (Masalan: +998901234567)",
      }),
    password: z
      .string()
      .min(1, "Kirish parolini kiriting")
      .min(4, "Parol kamida 4 ta belgidan iborat bo'lishi kerak")
      .max(50, "Parol 50 ta belgidan oshmasligi kerak")
      .regex(/^\S+$/, "Parolda bo'sh joy (probel) bo'lmasligi kerak"),
    vehicleModel: z.string().trim().optional(),
    vehiclePlateNumber: z.string().trim().optional(),
    maxCapacity: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "COURIER") {
      if (!data.vehiclePlateNumber || !data.vehiclePlateNumber.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehiclePlateNumber"],
          message: "Dastavkachi uchun mashina raqami kiritilishi shart (Masalan: 01 A 777 AA)",
        })
      }
    }
  })

const defaultValues = {
  role: "COURIER",
  shiftType: "Kunduzgi",
  fullName: "",
  phone: "+998",
  password: "",
  vehicleModel: "",
  vehiclePlateNumber: "",
  maxCapacity: 50,
}

export function AddXodimModal({ opened, onClose, onAddEmployee, isSubmitting }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addXodimSchema),
    defaultValues,
    mode: "onBlur",
  })

  const currentRole = watch("role")

  const handleClose = () => {
    reset(defaultValues)
    setShowPassword(false)
    onClose()
  }

  const onSubmit = (data) => {
    const formattedPhone = cleanPhoneForBackend(data.phone)

    const payload = {
      fullName: data.fullName.trim(),
      phone: formattedPhone,
      password: data.password.trim(),
      role: data.role,
      ...(data.shiftType ? { shiftType: data.shiftType } : {}),
      ...(data.role === "COURIER" && data.vehicleModel?.trim()
        ? { vehicleModel: data.vehicleModel.trim() }
        : {}),
      ...(data.role === "COURIER" && data.vehiclePlateNumber?.trim()
        ? { vehiclePlateNumber: data.vehiclePlateNumber.trim().toUpperCase() }
        : {}),
      ...(data.role === "COURIER" && data.maxCapacity
        ? { maxCapacity: Number(data.maxCapacity) }
        : {}),
    }

    onAddEmployee(payload, handleClose)
  }

  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <UserPlus className="size-5 stroke-2" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Yangi Xodim Qo'shish
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menejer yoki Dastavkachi uchun tizimga kirish akkaunti yaratish
            </p>
          </div>
        </div>
      }
      size="560px"
      centered
      radius="xl"
      styles={{
        content: {
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
        header: {
          padding: "20px 24px 16px 24px",
          borderBottom: "1px solid #f1f5f9",
        },
        body: {
          padding: "20px 24px 24px 24px",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Xodim Lavozimi *</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setValue("role", "COURIER", { shouldValidate: true })}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer",
                currentRole === "COURIER"
                  ? "bg-blue-50/70 border-blue-500 text-blue-900 shadow-2xs"
                  : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                  currentRole === "COURIER"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                )}
              >
                <Truck className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Dastavkachi</p>
                <p className="text-[11px] text-slate-500">Buyurtma yetkazuvchi</p>
              </div>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setValue("role", "MANAGER", { shouldValidate: true })}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer",
                currentRole === "MANAGER"
                  ? "bg-blue-50/70 border-blue-500 text-blue-900 shadow-2xs"
                  : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                  currentRole === "MANAGER"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                )}
              >
                <Briefcase className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Menejer</p>
                <p className="text-[11px] text-slate-500">Buyurtma boshqaruvchisi</p>
              </div>
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-rose-500 font-medium mt-0.5">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="size-3.5 text-blue-600" />
            <span>Ish smenasi</span>
          </label>
          <select
            disabled={isSubmitting}
            {...register("shiftType")}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
          >
            <option value="Kunduzgi">Kunduzgi smena (08:00 - 18:00)</option>
            <option value="Kechki">Kechki smena (18:00 - 02:00)</option>
            <option value="To'liq">To'liq smena (Kun davomida)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="size-3.5 text-blue-600" />
            <span>Ism va Familiya *</span>
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            autoComplete="name"
            placeholder="Masalan: Anvar Qodirov"
            {...register("fullName")}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-medium disabled:opacity-50",
              errors.fullName
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          />
          {errors.fullName && (
            <p className="text-xs text-rose-500 font-medium mt-0.5">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Phone className="size-3.5 text-blue-600" />
            <span>Telefon Raqam (Login) *</span>
          </label>
          <Input
            type="tel"
            disabled={isSubmitting}
            autoComplete="username"
            placeholder="+998901234567"
            {...register("phone")}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-medium disabled:opacity-50",
              errors.phone
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          />
          {errors.phone && (
            <p className="text-xs text-rose-500 font-medium mt-0.5">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="size-3.5 text-blue-600" />
            <span>Kirish Paroli *</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="new-password"
              placeholder="Masalan: oazis#2026"
              {...register("password")}
              className={cn(
                "w-full h-10 pl-3.5 pr-10 rounded-xl border bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-medium disabled:opacity-50",
                errors.password
                  ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              )}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer transition-colors"
              title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Dastavkachi transport ma'lumotlari */}
        {currentRole === "COURIER" && (
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 border-b border-blue-100 pb-1.5">
              <Car className="size-4 text-blue-600" />
              <span>Dastavkachi Transport Ma'lumotlari</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Transport (rusumi)
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Masalan: Labo, Damas, Porter"
                  {...register("vehicleModel")}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Mashina raqami *
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  placeholder="01 A 777 AA"
                  {...register("vehiclePlateNumber")}
                  className={cn(
                    "w-full h-9 px-3 rounded-xl border bg-white text-xs text-slate-800 placeholder:text-slate-400 uppercase font-mono focus:outline-none",
                    errors.vehiclePlateNumber
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-blue-500"
                  )}
                />
                {errors.vehiclePlateNumber && (
                  <p className="text-[10px] text-rose-500 font-medium">
                    {errors.vehiclePlateNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Layers className="size-3 text-blue-600" />
                <span>Yuk sig'imi (nechta idish sig'adi)</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                disabled={isSubmitting}
                placeholder="50"
                {...register("maxCapacity")}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={handleClose}
            className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Yaratilmoqda...</span>
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
