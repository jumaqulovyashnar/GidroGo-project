import { useAuth } from "@/provider/AuthProvider"
import { Button } from "@/ui"

function BossDashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rahbariyat (Boss) Paneli</h1>
          <p className="text-slate-500 text-sm mt-1">
            Xush kelibsiz, <span className="font-semibold text-blue-600">{user?.name}</span> ({user?.roleLabel})
          </p>
        </div>
        <Button variant="destructive" onClick={logout}>
          Chiqish
        </Button>
      </div>
    </div>
  )
}

export default BossDashboardPage
