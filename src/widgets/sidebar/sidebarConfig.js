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
  PackageCheck,
  User,
} from "lucide-react"

/**
 * Rollar bo'yicha markazlashtirilgan yon menyu (Sidebar) konfiguratsiyasi.
 * Har bir rol uchun endpoint'lar to'liq o'zbekcha va semantik nomlangan.
 */
export const SIDEBAR_MENU = {
  // 1. Super Admin (Tizim administratori) menyusi
  SUPER_ADMIN: [
    { title: "Dashboard", path: "/super-admin", icon: LayoutDashboard },
    { title: "Fermalar", path: "/super-admin/fermalar", icon: Building2 },
    { title: "Ferma Egalari", path: "/super-admin/fermaEgalari", icon: Users },
    { title: "Tizim Jurnali", path: "/super-admin/auditlog", icon: ShieldCheck },
    { title: "Statistika", path: "/super-admin/statistika", icon: BarChart3 },
    { title: "Sozlamalar", path: "/super-admin/sozlamalar", icon: Settings },
    { title: "Tasdiqlash So'rovlari", path: "/super-admin/tasdiqlash", icon: Calendar },
  ],

  // 2. Boss (Rahbar / Ferma Egasi) menyusi
  BOSS: [
    { title: "Bosh sahifa", path: "/boss", icon: LayoutGrid },
    { title: "Moliya", path: "/boss/moliya", icon: Banknote },
    { title: "Savdo", path: "/boss/savdo", icon: TrendingUp },
    { title: "O'sish", path: "/boss/osish", icon: BarChart3 },
    { title: "Ferma", path: "/boss/ferma", icon: Tractor },
    { title: "Xodimlar", path: "/boss/xodimlar", icon: Contact },
  ],

  // 3. Manager (Menejer) menyusi
  MANAGER: [
    { title: "Bosh sahifa", path: "/manager", icon: LayoutDashboard },
    { title: "Buyurtmalar", path: "/manager/buyurtmalar", icon: Truck },
    { title: "Xodimlar", path: "/manager/xodimlar", icon: Users },
  ],

  // 4. Driver (Yetkazib beruvchi / Haydovchi) menyusi
  DRIVER: [
    { title: "Buyurtmalar", path: "/driver/buyurtmalar", icon: PackageCheck },
    { title: "Yetkazishlar tarixi", path: "/driver/tarix", icon: Calendar },
    { title: "Mening profilim", path: "/driver/profil", icon: User },
  ],
}

// Kichik harflar bilan kelsa ham xatosiz ishlashi uchun alias'lar
SIDEBAR_MENU.admin = SIDEBAR_MENU.SUPER_ADMIN
SIDEBAR_MENU.super_admin = SIDEBAR_MENU.SUPER_ADMIN
SIDEBAR_MENU.boss = SIDEBAR_MENU.BOSS
SIDEBAR_MENU.manager = SIDEBAR_MENU.MANAGER
SIDEBAR_MENU.driver = SIDEBAR_MENU.DRIVER

/**
 * Rol bo'yicha mos menyu ro'yxatini qaytaruvchi yordamchi funksiya
 * @param {string} role - Foydalanuvchi roli (masalan: 'BOSS', 'MANAGER', 'admin', 'DRIVER')
 * @returns {Array} Menyular massivi
 */
export const getSidebarMenu = (role) => {
  if (!role) return SIDEBAR_MENU.SUPER_ADMIN
  const normalized = String(role).trim().toUpperCase()
  return SIDEBAR_MENU[normalized] || SIDEBAR_MENU[role] || SIDEBAR_MENU.SUPER_ADMIN
}
