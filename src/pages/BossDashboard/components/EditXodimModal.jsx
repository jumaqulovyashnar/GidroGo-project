import { useState, useEffect } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { toast } from "sonner"
import { Pencil, Phone, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui"

export function EditXodimModal({ opened, onClose, employee, onSaveEmployee }) {
  const [form, setForm] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (employee) {
      setForm({ ...employee })
      setShowPassword(false)
    } else {
      setForm(null)
    }
  }, [employee])

  if (!form) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Iltimos, ism-familiyani kiriting!")
      return
    }

    if (!form.phone.trim()) {
      toast.error("Iltimos, telefon raqamini kiriting!")
      return
    }

    if (!form.password?.trim()) {
      toast.error("Iltimos, parolni kiriting!")
      return
    }

    onSaveEmployee(form)
    onClose()
    toast.success(`${form.name} ma'lumotlari muvaffaqiyatli yangilandi!`)
  }

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Pencil className="size-5 stroke-2" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Xodimni Tahrirlash
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ma'lumotlar, login, parol va biriktirilgan hududni o'zgartirish
            </p>
          </div>
        </div>
      }
      size="620px"
      centered
      radius="xl"
      styles={{
        content: {
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
          minHeight: "560px",
        },
        header: {
          borderBottom: "1px solid #f1f5f9",
          padding: "20px 28px",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: "24px 28px 28px",
        },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4.5">
        {/* Ism va Familiya */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Ism va Familiya *
          </label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            required
          />
        </div>

        {/* Roli va Lavozimi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Xodim Turi *
            </label>
            <select
              value={form.roleType || "courier"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  roleType: e.target.value,
                  roleTitle:
                    e.target.value === "manager"
                      ? "Logistika Menejeri"
                      : "Dastavkachi",
                }))
              }
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer font-medium"
            >
              <option value="courier">Dastavkachi (Kuryer)</option>
              <option value="manager">Menejer (Dispetcher)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Lavozim Nomi
            </label>
            <input
              type="text"
              value={form.roleTitle || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, roleTitle: e.target.value }))
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Telefon (Login) va Parol */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="size-3.5 text-blue-600" />
              <span>Telefon (Login) *</span>
            </label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-blue-600" />
              <span>Kirish Paroli *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Biriktirilgan Hudud va Transport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Biriktirilgan Hudud / Bo'lim *
            </label>
            <select
              value={form.sector || "Markaziy sektor"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sector: e.target.value }))
              }
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer font-medium"
            >
              <option value="Markaziy sektor">Markaziy sektor</option>
              <option value="Shimoliy mikrorayon">Shimoliy mikrorayon</option>
              <option value="Janubiy sanoat zonasi">Janubiy sanoat zonasi</option>
              <option value="G'arbiy daha">G'arbiy daha</option>
              <option value="Omborxona & Zaxira">Omborxona &amp; Zaxira</option>
              <option value="Dispetcherlik shtabi">Dispetcherlik shtabi</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Transport / Xona
            </label>
            <input
              type="text"
              value={form.vehicle || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, vehicle: e.target.value }))
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Tugmalar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-10.5 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold transition-all cursor-pointer"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="h-10.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <CheckCircle2 className="size-4" />
            <span>O'zgarishlarni Saqlash</span>
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}
