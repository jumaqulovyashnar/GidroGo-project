import { useState, useMemo, useEffect, useRef } from "react"
import { useAuth } from "@/provider/AuthProvider"
import {
  useSuperAdminProfile,
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/shared/hooks"
import { resolveFileUrl } from "@/shared/lib"
import { User, Menu, Bell, Check, CheckCheck, Clock, Info, X } from "lucide-react"

export function Header({ onToggleSidebar }) {
  const { user } = useAuth()
  const userRole = user?.role || user?.rawRole || "MANAGER"

  const isSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "ROLE_SUPER_ADMIN"
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

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const { data: unreadRes } = useUnreadNotificationsCount(userRole)
  const unreadCount = Number(unreadRes?.data?.unreadCount || unreadRes?.data || unreadRes?.unreadCount || 0)

  const { data: notifListRes, isLoading: isNotifLoading } = useNotifications(
    userRole,
    { size: 15 },
    { enabled: isNotifOpen }
  )

  const { mutate: markAsRead } = useMarkNotificationAsRead(userRole)
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead(userRole)

  const rawNotifications =
    notifListRes?.data?.content ||
    notifListRes?.data ||
    (Array.isArray(notifListRes) ? notifListRes : [])
  const notifications = Array.isArray(rawNotifications) ? rawNotifications : []

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
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

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Bildirishnomalar */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative size-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Bildirishnomalar"
            title="Bildirishnomalar"
          >
            <Bell className="size-4.5 stroke-[2.2]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] size-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <>
              {/* Mobil uchun orqa fon qoraytirish (Backdrop) */}
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 sm:hidden animate-in fade-in duration-150"
                onClick={() => setIsNotifOpen(false)}
                aria-hidden="true"
              />

              {/* Bildirishnomalar modali: Mobilda to'liq ekranning O'RTASIDA (top-1/2 left-1/2), Desktopda esa dropdown */}
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-sm sm:absolute sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 sm:translate-y-0 sm:mt-2 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Bildirishnomalar</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {unreadCount} yangi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        disabled={isMarkingAll}
                        onClick={() => markAllAsRead()}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        <CheckCheck className="size-3.5" />
                        <span>Hammasini o'qish</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsNotifOpen(false)}
                      className="sm:hidden size-7 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Yopish"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[70vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {isNotifLoading ? (
                  <div className="p-8 text-center text-slate-400">
                    <Clock className="size-5 mx-auto animate-spin mb-1 text-slate-400" />
                    <span>Yuklanmoqda...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <div className="size-11 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Info className="size-5.5 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-700 text-xs">Hozircha bildirishnoma yo'q</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Yangi xabarlar shu yerda paydo bo'ladi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isUnread = !notif.isRead
                    return (
                      <div
                        key={notif.id}
                        className={`p-3 sm:p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                          isUnread ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <div
                          className={`size-2 rounded-full mt-1.5 shrink-0 ${
                            isUnread ? "bg-blue-600" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                            {notif.title || "Xabarnoma"}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed break-words">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleTimeString("uz-UZ", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notif.id)}
                            className="size-7 rounded-full hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                            title="O'qilgan deb belgilash"
                          >
                            <Check className="size-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Foydalanuvchi profili */}
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
              <p className="text-xs font-medium text-slate-500 mt-0.5 font-mono">
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
