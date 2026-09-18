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
import LogoImg from "@/assets/Logo.png"
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

// Har bir menyuga mos URL yo'llari (path) biriktirish .
const linksMockdata = [
  { label: "Dashboard", path: "/super-admin" },
  { label: "Fermalar", path: "/super-admin/fermalar" },
  { label: "Ferma Egalari", path: "/super-admin/fermaEgalari" },
  { label: "Tizim Jurnali", path: "/super-admin/auditlog" },
  { label: "Statistika", path: "/super-admin/statistika" },
  { label: "Sozlamalar", path: "/super-admin/sozlamalar" },
  { label: "Tasdiqlash So'rovlari", path: "/super-admin/requests" },
]

export function DoubleNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState("Dashboard")
  const { logout } = useAuth()

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
        aria-label={link.label}
      >
        <link.icon size={20} strokeWidth={1.75} />
      </UnstyledButton>
    </Tooltip>
  ))

  const links = linksMockdata.map((item) => {
    // Hozirgi kirib turilgan sahifani avtomatik aktiv ko'rsatish
    const isActive = location.pathname === item.path

    return (
      <a
        className={classes.link}
        data-active={isActive || undefined}
        href={item.path}
        onClick={(event) => {
          event.preventDefault()
          navigate(item.path) // React Router orqali marshrutni o'zgartirish
        }}
        key={item.label}
      >
        {item.label}
      </a>
    )
  })

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
              {active}
            </Title>
            {links}
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

export default DoubleNavbar