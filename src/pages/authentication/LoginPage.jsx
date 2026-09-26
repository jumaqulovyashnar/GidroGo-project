import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"
import { Button, Field, Input, Label } from "@/shared/ui"

function LoginPage() {
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const passwordRef = useRef(null)

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    const phone = phoneRef.current?.value || ""
    const password = passwordRef.current?.value || ""

    if (!phone.trim()) {
      setError("Iltimos, telefon raqamingizni kiriting.")
      phoneRef.current?.focus()
      return
    }

    if (!password.trim()) {
      setError("Iltimos, parolingizni kiriting.")
      passwordRef.current?.focus()
      return
    }

    setIsLoading(true)

    try {
      const result = await login(phone, password)

      setIsLoading(false)

      if (result.success) {
        const userRole = result.user?.role
        if (userRole === "SUPER_ADMIN") {
          navigate("/super-admin", { replace: true })
        } else if (userRole === "MANAGER") {
          navigate("/manager", { replace: true })
        } else if (userRole === "BOSS") {
          navigate("/boss", { replace: true })
        } else {
          navigate("/super-admin", { replace: true })
        }
      } else {
        setError(result.error || "Login yoki parol xato.")
      }
    } catch (err) {
      setIsLoading(false)
      setError(err?.message || "Kutilmagan xatolik yuz berdi!")
    }
  }

  return (
    <section className="w-full h-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Tizimga kirish
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 font-normal">
          Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4 border-none">
        {/* 1-qator: Ism (useRef bilan) */}
        <Field>
          <Label htmlFor="name" className="font-medium text-sm">
            Ismingiz.
          </Label>
          <Input
            id="name"
            ref={nameRef}
            type="text"
            placeholder="Ismingizni kiriting"
          />
        </Field>

        {/* 2-qator: Telefon (useRef bilan) */}
        <Field>
          <Label htmlFor="phone" className="font-medium text-sm">
            Telefon raqamingiz
          </Label>
          <Input
            id="phone"
            ref={phoneRef}
            type="tel"
            defaultValue="+998 90 123 45 67"
            placeholder="+998 90 123 45 67"
            autoFocus
          />
        </Field>

        {/* 3-qator: Parol (useRef bilan) */}
        <Field>
          <Label htmlFor="password" className="font-medium text-sm">
            Parol
          </Label>
          <Input
            id="password"
            ref={passwordRef}
            type="password"
            defaultValue="admin123"
            placeholder="Parolingizni kiriting"
          />
        </Field>

        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Kirilmoqda..." : "Tizimga kirish"}
        </Button>
      </form>
    </section>
  )
}

export default LoginPage;
