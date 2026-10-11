import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"

const loginSchema = z
  .object({
    name: z.string().trim().optional().default(""),
    phone: z.string().trim().optional().default(""),
    password: z
      .string()
      .min(1, "Iltimos, parolingizni kiriting.")
      .min(3, "Parol kamida 3 ta belgidan iborat bo'lishi kerak."),
  })
  .refine(
    (data) => Boolean(data.name || data.phone),
    {
      message: "Iltimos, login yoki telefon raqamingizni kiriting.",
      path: ["phone"],
    }
  )

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
      phone: "",
      password: "",
    },
    mode: "onBlur",
  })

  // O'zbekiston telefon raqamini formatlash (+998 XX XXX XX XX)
  const normalizePhone = (val) => {
    if (!val) return ""
    const trimmed = val.trim()
    const digits = trimmed.replace(/\D/g, "")
    if (digits.length === 9) {
      return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
    }
    if (digits.length === 12 && digits.startsWith("998")) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
    }
    return trimmed
  }

  const onSubmit = (data) => {
    if (loginMutation.isPending) return
    const name = data.name?.trim() || ""
    const phone = data.phone?.trim() || ""
    const password = data.password

    const loginIdentifier = phone ? normalizePhone(phone) : name

    loginMutation.mutate({
      login: loginIdentifier,
      phone: phone ? normalizePhone(phone) : loginIdentifier,
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
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border-none"
      >
        <Field>
          <Label htmlFor="name" className="font-medium text-sm">
            Login yoki Ismingiz
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="username"
            placeholder="ismingiz kiriting."
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="phone" className="font-medium text-sm">
            Telefon raqamingiz
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="username"
            placeholder="+998 90 123 45 67"
            autoFocus
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.phone.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="password" className="font-medium text-sm">
            Parol
          </Label>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Parolingizni kiriting"
              autoComplete="current-password"
              {...register("password")}
              className="pr-11"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 focus:outline-none p-1 cursor-pointer transition-colors z-20 flex items-center justify-center"
              title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-slate-500 hover:text-slate-800" />
              ) : (
                <Eye className="w-5 h-5 text-slate-500 hover:text-slate-800" />
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
          <p className="text-sm text-rose-500 font-medium">
            {loginMutation.error?.response?.data?.message ||
              "Telefon raqami yoki parol noto'g'ri."}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 cursor-pointer rounded-xl transition-all shadow-xs"
        >
          Tizimga kirish
        </Button>
      </form>
    </section>
  )
}

export default LoginPage
