import { useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { UserPlus, Truck, Briefcase, Phone, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui"

const initialFormState = {
  name: "",
  phone: "+998 ",
  password: "",
  roleType: "courier",
  roleTitle: "Dastavkachi",
  sector: "Markaziy sektor",
  vehicle: "Labo",
}

export function AddXodimModal({ opened, onClose, onAddEmployee }) {
  const [form, setForm] = useState(initialFormState)
  const [showPassword, setShowPassword] = useState(false)

  const handleClose = () => {
    setForm(initialFormState)
    setShowPassword(false)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Faqat formadagi toza ma'lumotlarni yuboramiz (hech qanday mock id yoki soxta statistika yo'q)
    onAddEmployee(form)
    handleClose()
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
        {/* Xodim roli tanlash (Manager yoki Dastavkachi) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Xodim Lavozimi / Roli *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  roleType: "courier",
                  roleTitle: "Dastavkachi",
                  vehicle: "Labo",
                }))
              }
              className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${form.roleType === "courier"
                ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div
                className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${form.roleType === "courier"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-500"
                  }`}
              >
                <Truck className="size-4.5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-900">Dastavkachi</span>
                <span className="text-xs text-slate-500 font-medium">Haydovchi / Kuryer</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  roleType: "manager",
                  roleTitle: "Logistika Menejeri",
                  vehicle: "Boshqaruv shtabi",
                }))
              }
              className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${form.roleType === "manager"
                ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div
                className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${form.roleType === "manager"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-500"
                  }`}
              >
                <Briefcase className="size-4.5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-900">Menejer</span>
                <span className="text-xs text-slate-500 font-medium">Dispetcher / Nazorat</span>
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
            placeholder="Masalan: Anvar Qodirov"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            required
          />
        </div>

        {/* Telefon Raqami (Login) va Kirish Paroli */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Telefon (Login) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="size-3.5 text-blue-600" />
              <span>Telefon Raqam (Login) *</span>
            </label>
            <input
              type="text"
              placeholder="+998 90 123 45 67"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              required
            />
          </div>

          {/* Parol */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-blue-600" />
              <span>Kirish Paroli *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masalan: oazis#2026"
                value={form.password}
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

        {/* Hudud va Transport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Hudud / Bo'lim */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Biriktirilgan Hudud / Bo'lim *
            </label>
            <select
              value={form.sector}
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

          {/* Transport vositasi (Dastavkachi uchun) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {form.roleType === "courier"
                ? "Avtomobil Rusumi"
                : "Ish Joyi / Xona"}
            </label>
            <input
              type="text"
              placeholder={
                form.roleType === "courier"
                  ? "Masalan: Labo (70 A 123 AA)"
                  : "Masalan: 2-boshqaruv xonasi"
              }
              value={form.vehicle}
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
            onClick={handleClose}
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
            <span>Saqlash va Ruxsat Berish</span>
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}
