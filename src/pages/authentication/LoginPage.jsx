import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, ShieldCheck, Droplets, Truck, Sparkles, CheckCircle2 } from "lucide-react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"
import { formatPhoneInput, cleanPhoneForBackend } from "@/shared/lib"
import heroImg from "@/shared/assets/login-hero.png"
import logoImg from "@/shared/assets/Logo.png"

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* ===================== CHAP TOMON: PREMIUM HERO RASM VA BRENDING ===================== */}
      <div className="relative w-full lg:w-1/2 min-h-[360px] lg:min-h-screen bg-gradient-to-br from-[#061224] via-[#0A1B36] to-[#071326] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Orqa fon effektlari: ambient nur to'lqinlari */}
        <div className="absolute -top-24 -left-24 size-96 bg-blue-500/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[480px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Nozik to'r (grid overlay) */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        {/* 1. Yuqori qism: Logo va status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 flex items-center justify-center shadow-lg">
              <img src={logoImg} alt="GidroGo Logo" className="size-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Gidro<span className="text-sky-400">Go</span>
              </span>
              <span className="text-[11px] font-medium text-blue-200/70 tracking-wider uppercase mt-0.5 block">
                Enterprise Platform
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/15 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            v2.0 Online
          </span>
        </div>

        {/* 2. O'rta qism: Asosiy 3D Delivery Truck Rasmi va Ta'rif */}
        <div className="relative z-10 my-auto py-8 lg:py-4 flex flex-col items-center text-center">
          {/* Rasmni ushlab turuvchi premium glass kartochka */}
          <div className="relative group w-full max-w-[420px] rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl p-6 sm:p-8 border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/40 hover:shadow-[0_30px_60px_-10px_rgba(56,189,248,0.25)]">
            {/* Ichki yorug'lik nurlari */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-sky-400/30 blur-2xl rounded-full pointer-events-none" />

            <img
              src={heroImg}
              alt="GidroGo Suv Yetkazib Berish"
              className="w-full h-auto max-h-[260px] sm:max-h-[300px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105"
            />

            {/* Suzuvchi kichik badge (kartochka ichida) */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="size-3.5 text-sky-400" />
                Avto-taqsimot
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Droplets className="size-3.5 text-blue-400" />
                Toza ichimlik suvi
              </span>
            </div>
          </div>

          {/* Tagline matnlari */}
          <div className="mt-8 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Tezkor va Aqlli <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">Suv Yetkazish</span> Boshqaruvi
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-blue-200/80 font-normal leading-relaxed">
              Fermalar, buyurtmalar, kuryerlar marshruti va moliyaviy hisobotlarni yagona zamonaviy tizimda monitoring qiling.
            </p>
          </div>
        </div>

        {/* 3. Pastki qism: KPI ko'rsatkichlar */}
        <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">100%</p>
            <p className="text-[11px] text-blue-200/70 font-medium mt-0.5">Avtomatlashtirilgan</p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-sky-400 tracking-tight">Real-time</p>
            <p className="text-[11px] text-blue-200/70 font-medium mt-0.5">Jonli Monitoring</p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">24/7</p>
            <p className="text-[11px] text-blue-200/70 font-medium mt-0.5">Xavfsiz Tizim</p>
          </div>
        </div>
      </div>

      {/* ===================== O'NG TOMON: LOGIN FORMASI ===================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-white">
        {/* Yuqori qism bo'sh joy / yordam */}
        <div className="hidden sm:flex items-center justify-end text-xs text-slate-500">
          <span>Yordam kerakmi?</span>
          <a
            href="tel:+998712000000"
            className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Qo'llab-quvvatlash markazi
          </a>
        </div>

        {/* O'rta: Asosiy Forma konteyneri */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          {/* Forma sarlavhasi */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
              <Sparkles className="size-3.5 text-blue-600" />
              <span>Boshqaruv Tizimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Tizimga kirish
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-normal">
              Shaxsiy hisobingizga kirish uchun login va parolingizni kiriting
            </p>
          </div>

          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4.5"
          >
            {/* 1. Admin / Login input */}
            <Field>
              <Label htmlFor="name" className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-1.5 block">
                Admin / Login <span className="text-slate-400 font-normal lowercase">(Super admin uchun)</span>
              </Label>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="Masalan: admin"
                {...register("name")}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all"
              />
            </Field>

            {/* 2. Telefon raqam input */}
            <Field>
              <Label htmlFor="phone" className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-1.5 block">
                Telefon raqam <span className="text-slate-400 font-normal lowercase">(Ferma rahbari / Xodim uchun)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder="+998901234567"
                {...register("phone")}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all font-mono"
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                  {errors.phone.message}
                </p>
              )}
            </Field>

            {/* 3. Parol input */}
            <Field>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="font-semibold text-xs text-slate-700 uppercase tracking-wider block">
                  Parol
                </Label>
              </div>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Maxfiy parolingizni kiriting"
                  autoComplete="new-password"
                  {...register("password")}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm pr-11 transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 cursor-pointer transition-colors z-20 flex items-center justify-center rounded-lg hover:bg-slate-100"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4.5 text-slate-500" />
                  ) : (
                    <Eye className="size-4.5 text-slate-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Serverdan qaytgan xatolik */}
            {loginMutation.isError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-medium leading-relaxed">
                {loginMutation.error?.response?.data?.message ||
                  loginMutation.error?.message ||
                  "Login, telefon raqami yoki parol noto'g'ri. Qaytadan urinib ko'ring."}
              </div>
            )}

            {/* Kirish tugmasi */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11.5 font-bold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 cursor-pointer rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 inline-flex items-center justify-center gap-2 mt-3 disabled:opacity-60 active:scale-[0.99]"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <span>Tizimga kirish</span>
                  <CheckCircle2 className="size-4.5 stroke-[2.2]" />
                </>
              )}
            </Button>
          </form>

          {/* Xavfsizlik kafolati */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>256-bit SSL xavfsiz shifrlangan ulanish</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-2 text-xs text-slate-400">
          © {new Date().getFullYear()} GidroGo. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  )
}

export default LoginPage
