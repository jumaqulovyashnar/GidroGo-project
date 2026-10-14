import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { PageLoading } from "@/shared/ui"

function AuthLayout() {
  return (
    <div className="h-full w-full overflow-y-auto flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <Suspense fallback={<PageLoading message="Yuklanmoqda..." />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default AuthLayout;