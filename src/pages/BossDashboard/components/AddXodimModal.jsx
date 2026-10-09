import { useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { toast } from "sonner"
import { UserPlus, Truck, Briefcase, Phone, KeyRound, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui"
const initialFormState = {
  name: "",
  phone: "+998",
  password: "",
  roleType: "courier",
}

export function AddXodimModal({ opened, onClose, onAddEmployee, isSubmitting }) {
  const [form, setForm] = useState(initialFormState)
  const [showPassword, setShowPassword] = useState(false)

  const handleClose = () => {
    setForm(initialFormState)
    setShowPassword(false)
    onClose()
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Iltimos, xodimning to'liq ism-familiyasini kiriting!")
      return
    }

    if (form.phone.trim().length < 9) {
      toast.error("Iltimos, to'liq telefon raqamini kiriting!")
      return
    }

    if (!form.password.trim() || form.password.length < 4) {
      toast.error("Tizimga kirish paroli kamida 4 ta belgidan iborat bo'lishi kerak!")
      return
    }

    // Faqat backend talab qiladigan 4 ta maydon  
    const payload = {
      fullName: form.name.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      role: form.roleType === "manager" ? "MANAGER" : "COURIER",
    }
    onAddEmployee(payload, handleClose)
  }
  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <UserPlus className="size-5 stroke-2" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Yangi Xodim Qo'shish
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manager yoki Dastavkachi uchun tizimga kirish akkaunti ochish
            </p>
          </div>
        </div>
      }
      size="540px"
      centered
      radius="xl"
      styles={{
        content: {
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
        },
        header: {
          borderBottom: "1px solid #f1f5f9",
          padding: "20px 24px",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Xodim roli tanlash (Manager yoki Dastavkachi) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Xodim Lavozimi / Roli *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  roleType: "courier",
                }))
              }
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${form.roleType === "courier"
                ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${form.roleType === "courier"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500"
                  }`}
              >
                <Truck className="size-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Dastavkachi</span>
                <span className="text-[11px] text-slate-500 font-medium">Kuryer</span>
              </div>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  roleType: "manager",
                }))
              }
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${form.roleType === "manager"
                ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${form.roleType === "manager"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500"
                  }`}
              >
                <Briefcase className="size-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Menejer</span>
                <span className="text-[11px] text-slate-500 font-medium">Boshqaruv</span>
              </div>
            </button>
          </div>
        </div>

        {/* Ism va familiya */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Ism va Familiya *
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            placeholder="Masalan: Anvar Qodirov"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
            required
          />
        </div>

        {/* Telefon Raqami (Login) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Phone className="size-3.5 text-blue-600" />
            <span>Telefon Raqam (Login) *</span>
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            placeholder="+998901234567"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
            required
          />
        </div>

        {/* Kirish Paroli */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="size-3.5 text-blue-600" />
            <span>Kirish Paroli *</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              placeholder="Masalan: oazis#2026"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Tugmalar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={handleClose}
            className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={isSubmitting}
            className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Yaratilmoqda...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Saqlash</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}
