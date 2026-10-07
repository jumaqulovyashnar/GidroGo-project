import { Outlet } from "react-router-dom"
import { DoubleNavbar } from "@/widgets/sidebar"
import { Header } from "@/widgets/header"

export function MainLayout() {
  return (
    <div className="h-screen w-full flex bg-[#f8fafc] text-slate-900 overflow-hidden">
      {/* Chap tomondagi DoubleNavbar (Sidebar) */}
      <aside className="h-full shrink-0 z-20">
        <DoubleNavbar />
      </aside>

      {/* O'ng tomondagi asosiy qism: Header + Sahifa Kontenti (Outlet) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
           {/* Sahifalar (SuperAdmin, Manager, Boss) shu yerda almashadi  */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout;