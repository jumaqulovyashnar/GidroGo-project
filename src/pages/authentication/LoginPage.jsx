import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Iltimos, login yoki telefon raqamingizni kiriting."),
  password: z
    .string()
    .min(1, "Iltimos, parolingizni kiriting.")
    .min(3, "Parol kamida 3 ta belgidan iborat bo'lishi kerak.")
    .regex(/^\S+$/, "Parolda bo'sh joy (probel) bo'lmasligi kerak."),
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
      identifier: "",
      password: "",
    },
    mode: "onBlur",
  })

  // Backend uchun telefon raqamini ixcham formatlash (+998901234567)
  const cleanPhoneForBackend = (val) => {
    if (!val) return ""
    const trimmed = val.trim()
    const digits = trimmed.replace(/\D/g, "")
    if (digits.length === 9) {
      return `+998${digits}`
    }
    if (digits.length === 12 && digits.startsWith("998")) {
      return `+${digits}`
    }
    return trimmed
  }

  const onSubmit = (data) => {
    if (loginMutation.isPending) return
    const raw = data.identifier?.trim() || ""
    const password = data.password

    const digits = raw.replace(/\D/g, "")
    const isPhoneNumber =
      digits.length >= 9 && (/^\+/.test(raw) || digits.startsWith("998") || digits.length === 9)

    const compactPhone = isPhoneNumber ? cleanPhoneForBackend(raw) : ""
    const loginValue = isPhoneNumber ? compactPhone : raw

    loginMutation.mutate({
      login: loginValue,
      ...(compactPhone ? { phone: compactPhone } : {}),
      password,
    })
  }

  return (
    <section className="w-full h-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tizimga kirish
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 font-normal">
          Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border-none"
      >
        <Field>
          <Label htmlFor="identifier" className="font-medium text-sm text-slate-700">
            Login yoki Telefon raqam
          </Label>
          <Input
            id="identifier"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="admin yoki +998 90 123 45 67"
            {...register("identifier")}
            className="h-10 rounded-xl bg-white text-sm"
          />
          {errors.identifier && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.identifier.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="password" className="font-medium text-sm text-slate-700">
            Parol
          </Label>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Parolingizni kiriting"
              autoComplete="new-password"
              {...register("password")}
              className="h-10 rounded-xl bg-white text-sm pr-11"
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

        {loginMutation.isError && (
          <p className="text-xs text-rose-500 font-medium mt-1 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            {loginMutation.error?.response?.data?.message ||
              loginMutation.error?.message ||
              "Telefon raqami yoki parol noto'g'ri."}
          </p>
        )}

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-10 font-semibold text-white bg-[#2563EB] hover:bg-blue-700 cursor-pointer rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {loginMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loginMutation.isPending ? "Kirilmoqda..." : "Tizimga kirish"}</span>
        </Button>
      </form>
    </section>
  )
}

export default LoginPage
