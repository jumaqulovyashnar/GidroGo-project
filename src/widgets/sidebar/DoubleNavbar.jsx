import { useNavigate, useLocation, Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useAuth } from "@/provider/AuthProvider"
import { getSidebarMenu } from "./sidebarConfig"
import LogoImg from "@/shared/assets/Logo.png"

const ROLE_TITLES = {
  SUPER_ADMIN: "Boshqaruv",
  BOSS: "Ferma boshlig'i",
  MANAGER: "Menejer",
  DRIVER: "Yetkazib beruvchi",
}

export function DoubleNavbar({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  // Foydalanuvchi roli: 1) prop 'role', 2) URL prefiksi, 3) user?.role, 4) default 'SUPER_ADMIN'
  const currentRole = (
    role ||
    (location.pathname.startsWith("/boss")
      ? "BOSS"
      : location.pathname.startsWith("/manager")
      ? "MANAGER"
      : location.pathname.startsWith("/driver")
      ? "DRIVER"
      : location.pathname.startsWith("/super-admin")
      ? "SUPER_ADMIN"
      : user?.role || "SUPER_ADMIN")
  ).toUpperCase()

  const menuItems = getSidebarMenu(currentRole)
  const roleTitle = ROLE_TITLES[currentRole] || "Boshqaruv"

  return (
    <nav
      aria-label="Asosiy boshqaruv menyusi"
      className="w-64 h-full flex flex-col justify-between border-r border-slate-200 bg-white select-none shrink-0"
    >
      {/* Yuqori qism: Logo + Boshqaruv sarlavhasi (SEO va A11y ga moslangan) */}
      <div className="flex flex-col min-h-0 flex-1">
        <header className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <Link
            to={menuItems[0]?.path || "/"}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
            title="GidroGo — Bosh sahifa"
          >
            {/* Logo - SEO va tezlik uchun optimallashtirilgan */}
            <div className="size-11 rounded-full overflow-hidden border border-slate-200/90 bg-white p-1 shrink-0 shadow-2xs group-hover:border-blue-400 transition-colors flex items-center justify-center">
              <img
                src={LogoImg}
                alt="GidroGo — Zamonaviy Gidroponika Boshqaruv Tizimi"
                width="44"
                height="44"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Boshqaruv sarlavhasi */}
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight truncate leading-tight font-sans group-hover:text-blue-600 transition-colors">
                {roleTitle}
              </h1>
              <p className="text-[11px] font-semibold text-blue-600 truncate tracking-wide mt-0.5">
                GidroGo Platformasi
              </p>
            </div>
          </Link>
        </header>

        {/* Asosiy navigatsiya ro'yxati */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isRootPath =
              item.path === "/boss" ||
              item.path === "/manager" ||
              item.path === "/super-admin" ||
              item.path === "/driver" ||
              item.path === "/"

            const isActive = isRootPath
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(item.path + "/")

            return (
              <a
                key={item.path}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(item.path)
                }}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 font-medium hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`size-5 transition-colors shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-900"
                  }`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className="truncate">{item.title}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Pastki Chiqish tugmasi */}
      <footer className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={logout}
          aria-label="Tizimdan chiqish"
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-700 border border-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="size-4.5 stroke-[2]" />
          <span>Chiqish</span>
        </button>
      </footer>
    </nav>
  )
}

export default DoubleNavbar
