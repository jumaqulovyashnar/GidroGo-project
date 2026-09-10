import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {
  Button,
  Field,
  Input,
  Label,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/ui"

function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!password.trim()) {
      setError("Iltimos, yangi parolni kiriting.")
      return
    }

    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat boʻlishi kerak.")
      return
    }

    if (!confirmPassword.trim()) {
      setError("Iltimos, parolni tasdiqlang.")
      return
    }

    if (password !== confirmPassword) {
      setError("Kiritilgan parollar bir-biriga mos kelmadi!")
      return
    }

    // Parol muvaffaqiyatli tekshirildi -> Modal (Alert Dialog) ochiladi:
    setShowSuccessDialog(true)
  }

  const handleGoToLogin = () => {
    setShowSuccessDialog(false)
    navigate("/login")
  }

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Yangi parol oʻrnatish
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-normal">
          Hisobingiz uchun yangi va xavfsiz parol kiriting.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <Label htmlFor="password" className="font-medium text-sm">
            Yangi parol
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError("")
            }}
            placeholder="Yangi parolingizni kiriting"
          />
        </Field>

        <Field>
          <Label htmlFor="confirmPassword" className="font-medium text-sm">
            Parolni tasdiqlang
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (error) setError("")
            }}
            placeholder="Parolni qayta kiriting"
          />
        </Field>

        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700"
        >
          Parolni yangilash
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

      {/* Muvaffaqiyatli yakunlanganda chiqadigan Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium text-center sm:text-left">
              Parol muvaffaqiyatli yangilandi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center sm:text-left mt-1">
              Sizning parolingiz muvaffaqiyatli oʻzgartirildi. Endi yangi parolingiz orqali tizimga kirishingiz mumkin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleGoToLogin}
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
            >
              Tizimga kirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default ResetPasswordPage
