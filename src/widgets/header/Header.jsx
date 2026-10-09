import { useAuth } from "@/provider/AuthProvider"
import { User, Bell } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  const displayRole =
    user?.role === "BOSS"
      ? "Ferma rahbari"
      : user?.roleLabel || user?.role || "Super Admin"

  const displayName =
    user?.name === "Ferma boshlig'i" || user?.name === "Ferma boshlig‘i"
      ? "Ferma rahbari"
      : user?.name || displayRole

  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Chap tomon: Foydalanuvchi roli */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-black tracking-tight">
          {displayRole}
        </h2>
      </div>

      {/* O'ng tomon: Bildirishnoma va Profil */}
      <div className="flex items-center gap-4">
        {/* Bildirishnoma ikonkasi */}
        <button
          type="button"
          aria-label="Bildirishnomalar"
          className="size-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-all cursor-pointer relative shadow-2xs hover:border-blue-200"
        >
          <Bell className="size-4.5 text-blue-600" />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profil ma'lumotlari */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              displayName?.[0]?.toUpperCase() || <User className="size-4" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-black leading-tight">
              {displayName}
            </p>
            {user?.phone ? (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {user.phone}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
