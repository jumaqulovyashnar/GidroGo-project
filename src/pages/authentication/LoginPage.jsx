import { useRef, useState } from "react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"

function LoginPage() {
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const passwordRef = useRef(null)

  const [error, setError] = useState("")
  const loginMutation = useLogin()

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

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")

    const name = nameRef.current?.value?.trim() || ""
    const phone = phoneRef.current?.value?.trim() || ""
    const password = passwordRef.current?.value?.trim() || ""

    // Agar telefon kiritilgan bo'lsa uni formatlaymiz, aks holda login nomini olamiz
    const loginIdentifier = phone ? normalizePhone(phone) : name

    if (!loginIdentifier) {
      setError("Iltimos, login yoki telefon raqamingizni kiriting.")
      phoneRef.current?.focus()
      return
    }

    if (!password) {
      setError("Iltimos, parolingizni kiriting.")
      passwordRef.current?.focus()
      return
    }

    loginMutation.mutate({
      login: loginIdentifier,
      phone: phone ? normalizePhone(phone) : loginIdentifier,
      password,
    })
  }

  return (
    <section className="w-full h-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Tizimga kirish
        </h1>

        <p className="text-sm text-muted-foreground mt-1.5 font-normal">
          Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4 border-none"
      >
        <Field>
          <Label htmlFor="name" className="font-medium text-sm">
            Login yoki Ismingiz
          </Label>

          <Input
            id="name"
            ref={nameRef}
            type="text"
            placeholder=" ismingiz kiriting."
          />
        </Field>

        <Field>
          <Label htmlFor="phone" className="font-medium text-sm">
            Telefon raqamingiz
          </Label>

          <Input
            id="phone"
            ref={phoneRef}
            type="tel"
            placeholder="+998 90 123 45 67"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="password" className="font-medium text-sm">
            Parol
          </Label>

          <Input
            id="password"
            ref={passwordRef}
            type="password"
            placeholder="Parolingizni kiriting"
            autoComplete="current-password"
          />
        </Field>

        {(error || loginMutation.isError) && (
          <p className="text-sm text-red-500 font-medium">
            {error || loginMutation.error?.response?.data?.message || "Telefon raqami yoki parol noto'g'ri."}
          </p>
        )}

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loginMutation.isPending
            ? "Kirilmoqda..."
            : "Tizimga kirish"}
        </Button>
      </form>
    </section>
  )
}

export default LoginPage
