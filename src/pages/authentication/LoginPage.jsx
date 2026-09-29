import { useRef, useState } from "react"
import { useLogin } from "@/shared"
import { Button, Field, Input, Label } from "@/shared/ui"

function LoginPage() {
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const passwordRef = useRef(null)

  const [error, setError] = useState("")

  const loginMutation = useLogin()

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")

    const name = nameRef.current?.value?.trim() || ""
    const phone = phoneRef.current?.value?.trim() || ""
    const password = passwordRef.current?.value?.trim() || ""

    const loginIdentifier = name || phone  

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
      phone: phone || loginIdentifier,
      password,
    })
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

      <form
        noValidate
        autoComplete="off"
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
            autoComplete="new-password"
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

export default LoginPage;
