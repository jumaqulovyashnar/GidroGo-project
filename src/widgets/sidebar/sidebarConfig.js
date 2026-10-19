import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  Calendar,
  LayoutGrid,
  Banknote,
  TrendingUp,
  Tractor,
  Contact,
  Truck,
  ClipboardList,
  MapPin,
} from "lucide-react"

// 1. Super Admin (Tizim administratori) menyusi
const SUPER_ADMIN_MENU = [
  { title: "Dashboard", path: "/super-admin", icon: LayoutDashboard },
  { title: "Fermalar", path: "/super-admin/fermalar", icon: Building2 },
  { title: "Ferma Egalari", path: "/super-admin/fermaEgalari", icon: Users },
  { title: "Tizim Jurnali", path: "/super-admin/auditlog", icon: ShieldCheck },
  { title: "Statistika", path: "/super-admin/statistika", icon: BarChart3 },
  { title: "Sozlamalar", path: "/super-admin/sozlamalar", icon: Settings },
  { title: "Tasdiqlash So'rovlari", path: "/super-admin/tasdiqlash", icon: Calendar },
]

// 2. Boss (Rahbar / Ferma Egasi) menyusi
const BOSS_MENU = [
  { title: "Bosh sahifa", path: "/boss", icon: LayoutGrid },
  { title: "Moliya", path: "/boss/moliya", icon: Banknote },
  { title: "Savdo", path: "/boss/savdo", icon: TrendingUp },
  { title: "O'sish", path: "/boss/osish", icon: BarChart3 },
  { title: "Ferma", path: "/boss/ferma", icon: Tractor },
  { title: "Xodimlar", path: "/boss/xodimlar", icon: Contact },
  { title: "Jonli xarita", path: "/boss/xarita", icon: MapPin },
]

// 3. Manager (Menejer) menyusi
const MANAGER_MENU = [
  { title: "Bosh sahifa", path: "/manager", icon: LayoutDashboard },
  { title: "Buyurtmalar", path: "/manager/buyurtmalar", icon: Truck },
  { title: "Barcha buyurtmalar", path: "/manager/barcha-buyurtmalar", icon: ClipboardList },
  { title: "Xodimlar", path: "/manager/xodimlar", icon: Users },
  { title: "Jonli xarita", path: "/manager/dastavkachilar-xarita", icon: MapPin },
]

export const SIDEBAR_MENU = {
  // Asosiy rollar
  SUPER_ADMIN: SUPER_ADMIN_MENU,
  BOSS: BOSS_MENU,
  MANAGER: MANAGER_MENU,

  // Katta harfli alias'lar
  ADMIN: SUPER_ADMIN_MENU,
  ROLE_SUPER_ADMIN: SUPER_ADMIN_MENU,
  ROLE_BOSS: BOSS_MENU,
  FERMA_RAHBARI: BOSS_MENU,
  ROLE_FERMA_RAHBARI: BOSS_MENU,
  ROLE_MANAGER: MANAGER_MENU,

  // Kichik harfli alias'lar
  admin: SUPER_ADMIN_MENU,
  super_admin: SUPER_ADMIN_MENU,
  boss: BOSS_MENU,
  manager: MANAGER_MENU,
}

export const getSidebarMenu = (role) => {
  if (!role) return []
  const normalized = String(role).trim().toUpperCase()
  return SIDEBAR_MENU[normalized] || SIDEBAR_MENU[role] || []
}
