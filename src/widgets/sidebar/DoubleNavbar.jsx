import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Calendar,
  User,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react"
import { Title, Tooltip, UnstyledButton } from "@mantine/core"
import { useAuth } from "@/provider/AuthProvider"
import { getSidebarMenu } from "./sidebarConfig"
import LogoImg from "@/shared/assets/Logo.png"
import classes from "./DoubleNavbar.module.css"

const mainLinksMockdata = [
  { icon: Home, label: "Bosh sahifa" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BarChart3, label: "Statistika" },
  { icon: Calendar, label: "Hisobotlar" },
  { icon: User, label: "Foydalanuvchilar" },
  { icon: ShieldCheck, label: "Xavfsizlik" },
  { icon: Settings, label: "Sozlamalar" },
]

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
  const [activeTab, setActiveTab] = useState("Dashboard")

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

  // Rolga mos menyu ro'yxati (config-driven)
  const menuItems = getSidebarMenu(currentRole)
  const roleTitle = ROLE_TITLES[currentRole] || "Dashboard"

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActiveTab(link.label)}
        className={classes.mainLink}
        data-active={link.label === activeTab || undefined}
        aria-label={link.label}
      >
        <link.icon size={20} strokeWidth={1.75} />
      </UnstyledButton>
    </Tooltip>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        {/* Chapdagi tor ikonka paneli */}
        <div className={classes.aside}>
          {/* Logo */}
          <div className={classes.logo}>
            <img
              src={LogoImg}
              alt="GidroGo Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          {mainLinks}
        </div>

        {/* O'ngdagi keng menyu paneli */}
        <div className={classes.main}>
          <div className={classes.mainTop}>
            <Title order={4} className={classes.title}>
              {roleTitle}
            </Title>

            <nav className="space-y-1 mt-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.startsWith(item.path + "/"))

                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(item.path)
                    }}
                    className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-50/80 text-blue-600 font-bold border-l-4 border-l-blue-600 rounded-l-none shadow-2xs"
                        : "text-slate-700 hover:bg-slate-50 font-medium hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`size-5 transition-colors shrink-0 ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-600 group-hover:text-slate-900"
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.75}
                    />
                    <span className="truncate">{item.title}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          {/* O'ng pastdagi yagona toza Chiqish tugmasi */}
          <div className={classes.footer}>
            <button
              type="button"
              onClick={logout}
              className={classes.logoutLink}
            >
              <LogOut size={18} strokeWidth={1.75} />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DoubleNavbar;
