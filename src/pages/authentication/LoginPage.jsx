import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"
import { cleanPhoneForBackend } from "@/shared/lib"
import heroImg from "@/shared/assets/login-hero.png"

const loginSchema = z
  .object({
    name: z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(1, "Iltimos, parolingizni kiriting.")
      .min(3, "Parol kamida 3 ta belgidan iborat bo'lishi kerak.")
      .regex(/^\S+$/, "Parolda bo'sh joy (probel) bo'lmasligi kerak."),
  })
  .superRefine((data, ctx) => {
    const hasName = Boolean(data.name && data.name.trim().length > 0)
    const phoneDigits = (data.phone || "").replace(/\D/g, "")
    const hasPhone = Boolean(phoneDigits.length >= 9)
    if (!hasName && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Admin logini yoki telefon raqamidan birini kiriting.",
        path: ["phone"],
      })
    }
  })

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      phone: "+998",
      password: "",
    },
    mode: "onBlur",
  })

  const isPhonePattern = (val) => {
    if (!val) return false
    const digits = val.replace(/\D/g, "")
    return digits.length >= 9 && (/^\+/.test(val) || digits.startsWith("998") || digits.length === 9)
  }

  const onSubmit = (data) => {
    if (loginMutation.isPending) return

    const rawPhone = data.phone || ""
    const rawName = data.name?.trim() || ""
    const password = data.password

    let cleanPhone = cleanPhoneForBackend(rawPhone)

    if (!cleanPhone && isPhonePattern(rawName)) {
      cleanPhone = cleanPhoneForBackend(rawName)
    }

    const loginValue = cleanPhone || rawName

    loginMutation.mutate({
      login: loginValue,
      ...(cleanPhone ? { phone: cleanPhone } : {}),
      password,
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900">
      {/* ===================== CHAP TOMON: RASM (ORQA FONI OQ) ===================== */}
      <div className="w-full lg:w-1/2 min-h-[320px] lg:min-h-screen bg-white flex items-center justify-center p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200">
        <div className="w-full max-w-lg flex items-center justify-center">
          <img
            src={heroImg}
            alt="GidroGo"
            className="w-full max-h-[420px] sm:max-h-[480px] object-contain"
          />
        </div>
      </div>

      {/* ===================== O'NG TOMON: LOGIN FORMASI ===================== */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-50/50">
        <div className="w-full max-w-lg mx-auto bg-white p-7 sm:p-9 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          {/* Forma sarlavhasi */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Tizimga kirish
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 font-normal">
              Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* 1. Admin input */}
            <Field>
              <Label htmlFor="name" className="font-medium text-sm text-slate-700 mb-1.5 block">
                Admin
              </Label>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="admin"
                {...register("name")}
                className="h-10 rounded-xl bg-white border-slate-200 shadow-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
              />
            </Field>

            {/* 2. Telefon raqam input */}
            <Field>
              <Label htmlFor="phone" className="font-medium text-sm text-slate-700 mb-1.5 block">
                Telefon raqam
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder="+998901234567"
                {...register("phone")}
                className="h-10 rounded-xl bg-white border-slate-200 shadow-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-mono"
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.phone.message}
                </p>
              )}
            </Field>

            {/* 3. Parol input */}
            <Field>
              <Label htmlFor="password" className="font-medium text-sm text-slate-700 mb-1.5 block">
                Parol
              </Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  autoComplete="new-password"
                  {...register("password")}
                  className="h-10 rounded-xl bg-white border-slate-200 shadow-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm pr-11"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer transition-colors z-20 flex items-center justify-center"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 text-slate-500" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Serverdan qaytgan xatolik */}
            {loginMutation.isError && (
              <p className="text-xs text-rose-500 font-medium mt-1 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {loginMutation.error?.response?.data?.message ||
                  loginMutation.error?.message ||
                  "Login, telefon raqami yoki parol noto'g'ri."}
              </p>
            )}

            {/* Kirish tugmasi (eski ko'k rangi: #2563EB) */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-10 font-semibold text-white bg-[#2563EB] hover:bg-blue-700 cursor-pointer rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loginMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loginMutation.isPending ? "Kirilmoqda..." : "Tizimga kirish"}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
