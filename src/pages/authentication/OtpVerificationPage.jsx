import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Separator,
} from "@/ui"

function OtpVerificationPage() {
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(120) // 2 minut (120 soniya)
  const [isResending, setIsResending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || sessionStorage.getItem("otp_email")

  // Agar email kiritilmagan bo'lsa, xavfsizlik uchun /forgot-password ga qaytaramiz:
  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  // 2 daqiqalik teskari hisob (Countdown Timer)
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Soniyani 02:00 formatiga o'tkazish
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleVerify = (codeToVerify) => {
    const code = codeToVerify || otp
    if (code.length === 6) {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        toast("Kod muvaffaqiyatli tasdiqlandi!", {
          icon: <CheckCircle2 className="size-5 text-[#2563EB]" />,
        })
        navigate("/reset-password")
      }, 500)
    }
  }

  const handleResend = () => {
    if (timer > 0 || isResending) return
    setIsResending(true)

    setTimeout(() => {
      setIsResending(false)
      setOtp("") // Katakchalarni tozalaymiz
      setTimer(120) // Taymerni qayta 2 minutga (120s) o'rnatamiz
      toast("Yangi 6 xonali tasdiqlash kodi yuborildi!", {
        icon: <CheckCircle2 className="size-5 text-[#2563EB]" />,
      })
    }, 600)
  }

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Tasdiqlash kodi
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-normal">
          <span className="font-medium text-foreground">{email}</span> ga yuborilgan 6 xonali tasdiqlash kodini kiriting.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
        <div className="flex flex-col items-center justify-center py-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(value) => setOtp(value)}
            onComplete={(value) => handleVerify(value)}
            autoFocus
          >
            <InputOTPGroup className="gap-2 sm:gap-2.5">
              <InputOTPSlot index={0} className="size-11 sm:size-12 text-lg font-medium" />
              <InputOTPSlot index={1} className="size-11 sm:size-12 text-lg font-medium" />
              <InputOTPSlot index={2} className="size-11 sm:size-12 text-lg font-medium" />
              <InputOTPSlot index={3} className="size-11 sm:size-12 text-lg font-medium" />
              <InputOTPSlot index={4} className="size-11 sm:size-12 text-lg font-medium" />
              <InputOTPSlot index={5} className="size-11 sm:size-12 text-lg font-medium" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={otp.length !== 6 || isSubmitting}
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? "Tekshirilmoqda..." : "Tasdiqlash"}
        </Button>

        {/* Vertikal Separator bilan ajratilgan pastki qism va 2 minutlik taymer */}
        <div className="flex items-center justify-center gap-3 text-sm pt-2">
          <p className="text-muted-foreground">
            {timer > 0 ? (
              <span className="text-muted-foreground font-normal">
                Qayta yuborish:{" "}
                <span className="font-medium text-foreground">
                  {formatTime(timer)}
                </span>
              </span>
            ) : (
              <span>
                Kod kelmadimi?{" "}
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResend}
                  className="text-[#2563EB] font-medium hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? "Yuborilmoqda..." : "Qayta yuborish"}
                </button>
              </span>
            )}
          </p>

          <Separator
            orientation="vertical"
            className="h-4 w-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"
          />

          <Link
            to="/forgot-password"
            className="text-muted-foreground hover:text-[#2563EB] font-medium transition-colors"
          >
            Boshqa email kiritish
          </Link>
        </div>
      </form>
    </section>
  )
}

export default OtpVerificationPage
