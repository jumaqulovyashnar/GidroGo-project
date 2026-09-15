import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/provider/AuthProvider"
import { Button, Field, Input, Label } from "@/ui"

function LoginPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting.")
      return
    }

    if (!phone.trim()) {
      setError("Iltimos, telefon raqamingizni kiriting.")
      return
    }

    if (!password.trim()) {
      setError("Iltimos, parolingizni kiriting.")
      return
    }

    setIsLoading(true)

    const result = await login(phone, password)

    setIsLoading(false)

    if (result.success) {
      const userRole = result.user?.role
      if (userRole === "SUPER_ADMIN") {
        navigate("/super-admin")
      } else if (userRole === "MANAGER") {
        navigate("/manager")
      } else if (userRole === "BOSS") {
        navigate("/boss")
      } else {
        navigate("/super-admin")
      }
    } else {
      setError(result.error || "Login yoki parol xato.")
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
        {/* 1-qator: Ism */}
        <Field>
          <Label htmlFor="name" className="font-medium text-sm">
            Ismingizni kiriting.
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError("")
            }}
            placeholder="Ismingizni kiriting"
            autoFocus
          />
        </Field>

        {/* 2-qator: Telefon */}
        <Field>
          <Label htmlFor="phone" className="font-medium text-sm">
            Telefon raqamingizni kiriting.
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (error) setError("")
            }}
            placeholder="+998 90 123 45 67"
          />
        </Field>

        {/* 3-qator: Parol */}
        <Field>
          <Label htmlFor="password" className="font-medium text-sm">
            Parol
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError("")
            }}
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
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Kirilmoqda..." : "Tizimga kirish"}
        </Button>
      </form>
    </section>
  )
}

export default LoginPage