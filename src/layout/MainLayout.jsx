import { Suspense, useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { DoubleNavbar } from "@/widgets/sidebar"
import { Header } from "@/widgets/header"
import { PageLoading } from "@/shared/ui"

export function MainLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  // Har safar sahifa o'zgarganda mobil sidebarni avtomatik yopish (React 19 render-phase pattern)
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setIsMobileSidebarOpen(false)
  }

  // Escape tugmasi bosilganda yopish
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobileSidebarOpen])

  return (
    <div className="h-full w-full flex bg-[#f8fafc] text-slate-900 overflow-hidden relative">
      {/* 1. Desktop Sidebar (faqat lg va undan katta ekranlarda ko'rinadi) */}
      <aside className="hidden lg:flex h-full shrink-0 z-20">
        <DoubleNavbar />
      </aside>

      {/* 2. Mobile Sidebar Drawer (mobil va planshetda yopiq turadi, faqat menu bosilganda ochiladi) */}
      {isMobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Orqa qorong'ulatish foni (Backdrop) */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slayd bo'lib chiquvchi mobil menyu paneli */}
          <div className="relative w-64 max-w-[85vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200 flex flex-col">
            <DoubleNavbar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. O'ng tomondagi asosiy qism: Header + Sahifa Kontenti (Outlet) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Sahifalar (SuperAdmin, Manager, Boss) shu yerda almashadi  */}
          <Suspense fallback={<PageLoading message="Sahifa yuklanmoqda..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
