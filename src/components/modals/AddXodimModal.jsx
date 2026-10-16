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
} from "lucide-react"
import { Button, Input } from "@/shared/ui"
import { cn, NAME_REGEX, PHONE_REGEX, formatPhoneInput, cleanPhoneForBackend } from "@/shared/lib"

const addXodimSchema = z.object({
  role: z.enum(["MANAGER", "COURIER"], {
    errorMap: () => ({ message: "Xodim lavozimini tanlang" }),
  }),
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
})

const defaultValues = {
  role: "MANAGER",
  fullName: "",
  phone: "+998",
  password: "",
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
      size="540px"
      centered
      radius="xl"
      styles={{
        content: {
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
        },
        header: {
          borderBottom: "1px solid #f1f5f9",
          padding: "20px 24px",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Xodim roli tanlash (Menejer yoki Dastavkachi) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Xodim Lavozimi / Roli *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setValue("role", "MANAGER", { shouldValidate: true })}
              className={cn(
                "p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left",
                currentRole === "MANAGER"
                  ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                  currentRole === "MANAGER"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                <Briefcase className="size-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Menejer</span>
                <span className="text-[11px] text-slate-500 font-medium">Boshqaruv</span>
              </div>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setValue("role", "COURIER", { shouldValidate: true })}
              className={cn(
                "p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left",
                currentRole === "COURIER"
                  ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                  currentRole === "COURIER"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                <Truck className="size-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Dastavkachi</span>
                <span className="text-[11px] text-slate-500 font-medium">Kuryer</span>
              </div>
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Ism va familiya */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="size-3.5 text-blue-600" />
            <span>Ism va Familiya (Foydalanuvchi) *</span>
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

        {/* Telefon Raqami (Login) */}
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

        {/* Kirish Paroli */}
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

        {/* Tugmalar */}
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
