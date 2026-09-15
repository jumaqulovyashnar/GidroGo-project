import { useAuth } from "@/provider/AuthProvider"
import { User, Bell } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Chap tomon: Foydalanuvchi roli (user.role) */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-black tracking-tight">
          {user?.roleLabel || user?.role || "Super Admin"}
        </h2>
      </div>

      {/* O'ng tomon: Yumaloq Bildirishnoma va Profil */}
      <div className="flex items-center gap-4">
        {/* Yumaloq Bildirishnoma (Notification) ikonkasi */}
        <button
          type="button"
          aria-label="Bildirishnomalar"
          className="size-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-all cursor-pointer relative shadow-2xs hover:border-blue-200"
        >
          <Bell className="size-4.5 text-blue-600" />
          {/* Bildirishnoma qizil nuqtasi */}
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profil ma'lumotlari */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name?.[0] || <User className="size-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-black leading-tight">
              {user?.name || "Yashnarbek Jumaqulov"}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {user?.phone || "+998 90 123 45 67"}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header