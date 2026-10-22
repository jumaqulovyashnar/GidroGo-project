import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/provider/AuthProvider"
import { useSuperAdminProfile } from "@/shared/hooks"
import { resolveFileUrl } from "@/shared/lib"
import { User, Menu } from "lucide-react"

export function Header({ onToggleSidebar }) {
  const { user } = useAuth()

  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.rawRole === "ROLE_SUPER_ADMIN"
  const { data: profileResponse } = useSuperAdminProfile({
    enabled: isSuperAdmin,
  })
  const profile = profileResponse?.data || profileResponse

  const rawAvatar =
    profile?.avatarUrl ||
    profile?.photoUrl ||
    profile?.avatar ||
    user?.avatarUrl ||
    user?.avatar ||
    user?.photoUrl ||
    user?.attachmentPath ||
    ""

  const avatarUrl = useMemo(() => resolveFileUrl(rawAvatar), [rawAvatar])
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [avatarUrl])

  const displayRole =
    user?.role === "BOSS"
      ? "Ferma rahbari"
      : user?.roleLabel || user?.role || "Super Admin"

  const displayName = useMemo(() => {
    if (user?.role === "BOSS") return "Ferma rahbari"
    if (profile?.fullName) return profile.fullName
    if (profile?.firstName || profile?.lastName) {
      return [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    }
    if (user?.name === "Ferma boshlig'i" || user?.name === "Ferma boshlig‘i") {
      return "Ferma rahbari"
    }
    return user?.name || displayRole
  }, [user, profile, displayRole])

  const displayPhone = profile?.phone || user?.phone || ""

  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Chap tomon: Mobil menu tugmasi + Foydalanuvchi roli */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Menyuni ochish"
            className="lg:hidden p-2 -ml-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="size-5" />
          </button>
        )}
        <h2 className="text-base sm:text-lg font-bold text-black tracking-tight truncate max-w-[160px] sm:max-w-none">
          {displayRole}
        </h2>
      </div>

      {/* O'ng tomon: Profil */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Profil ma'lumotlari */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="size-9 sm:size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs overflow-hidden shrink-0 border border-slate-200/80">
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={displayName || "Avatar"}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              displayName?.[0]?.toUpperCase() || <User className="size-4 text-white" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-black leading-tight">
              {displayName}
            </p>
            {displayPhone ? (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {displayPhone}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
