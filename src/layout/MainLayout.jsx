import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { DoubleNavbar } from "@/widgets/sidebar"
import { Header } from "@/widgets/header"
import { PageLoading } from "@/shared/ui"

export function MainLayout() {
  return (
    <div className="h-full w-full flex bg-[#f8fafc] text-slate-900 overflow-hidden">
      {/* Chap tomondagi DoubleNavbar (Sidebar) */}
      <aside className="h-full shrink-0 z-20">
        <DoubleNavbar />
      </aside>

      {/* O'ng tomondagi asosiy qism: Header + Sahifa Kontenti (Outlet) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Sahifalar (SuperAdmin, Manager, Boss) shu yerda almashadi  */}
          <Suspense fallback={<PageLoading message="Sahifa yuklanmoqda..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default MainLayout;