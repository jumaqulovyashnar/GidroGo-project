import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button, Field, Input, Label } from "@/ui"

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Email to'g'ri yozilganini tekshirish (Regex):
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValidEmail) {
      setIsLoading(true)

      // 2 daqiqalik (120 soniya) amal qilish muddati o'rnatiladi:
      const expireTime = Date.now() + 120 * 1000
      sessionStorage.setItem("otp_email", email.trim())
      sessionStorage.setItem("otp_expire", expireTime.toString())

      setTimeout(() => {
        setIsLoading(false)
        navigate("/verify-otp", { state: { email: email.trim() } })
      }, 400)
    }
  }

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Parolni tiklash
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-normal">
          Email manzilingizni kiriting. Tasdiqlash uchun ushbu manzilga 6 xonali bir martalik kod yuboramiz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <Label htmlFor="email" className="font-medium text-sm">
            Email manzilingizni kiriting.
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
            required
            autoFocus
          />
        </Field>

        <Button
          type="submit"
          disabled={!isValidEmail || isLoading}
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Yuborilmoqda..." : "Kodni yuborish"}
        </Button>

        <div className="text-center pt-1">
          <Link
            to="/login"
            className="text-sm text-[#2563EB] hover:underline font-medium inline-flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kirish sahifasiga qaytish</span>
          </Link>
        </div>
      </form>
    </section>
  )
}

export default ForgotPasswordPage