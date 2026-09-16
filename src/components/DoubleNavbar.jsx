import { useState } from "react"
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

const linksMockdata = [
  "Dashboard",
  "Fermalar",
  "Ferma Egalari",
  "Mijozlar",
  "Buyrutmalar",
  "Tizim Jurnali",
  "Statistika",
  "Sozlamalar",
  "Tasdiqlash So'rovlari",
]

export function DoubleNavbar() {
  const [active, setActive] = useState("Dashboard")
  const [activeLink, setActiveLink] = useState("Boshqaruv paneli")
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

  const links = linksMockdata.map((link) => (
    <a
      className={classes.link}
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault()
        setActiveLink(link)
      }}
      key={link}
    >
      {link}
    </a>
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