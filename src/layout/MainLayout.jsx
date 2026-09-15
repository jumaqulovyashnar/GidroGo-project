import { Outlet } from "react-router-dom"
import { DoubleNavbar } from "@/components/DoubleNavbar"
import { Header } from "@/components/Header"

export function MainLayout() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900">
      {/* Chap tomondagi DoubleNavbar (Sidebar) */}
      <aside className="sticky top-0 h-screen shrink-0 z-20">
        <DoubleNavbar />
      </aside>

      {/* O'ng tomondagi asosiy qism: Header + Sahifa Kontenti (Outlet) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
           {/* Sahifalar (SuperAdmin, Manager, Boss) shu yerda almashadi  */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout