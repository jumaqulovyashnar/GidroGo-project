import { useState } from "react"
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Calendar,
  User,
  ShieldCheck,
  Settings,
} from "lucide-react"
import { Title, Tooltip, UnstyledButton } from "@mantine/core"
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
  "Statistika",
  "Sozlamalar",
  "Boshqaruv paneli",
  "Hisobotlar",
  "Foydalanuvchilar",
  "Buyurtmalar",
  "Mijozlar",
  "Ma'lumotlar bazasi",
  "Xabarlar",
  "Tizim jurnali",
]

export function DoubleNavbar() {
  const [active, setActive] = useState("Dashboard")
  const [activeLink, setActiveLink] = useState("Boshqaruv paneli")

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
        <div className={classes.aside}>
          {/* 1-chi icon o'rniga Logo.png rasmi */}
          <div className={classes.logo} title="GidroGo">
            <img
              src={LogoImg}
              alt="GidroGo Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>

          {links}
        </div>
      </div>
    </nav>
  )
}

export default DoubleNavbar