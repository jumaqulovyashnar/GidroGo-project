import { useRouteError, useNavigate } from "react-router-dom"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export function RouteError() {
  const error = useRouteError()
  const navigate = useNavigate()

  const errorMessage =
    error?.statusText ||
    error?.message ||
    (typeof error === "string" ? error : "Kutilmagan xatolik yuz berdi")

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Kechirasiz, xatolik yuz berdi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sahifani yuklashda xatolik yuz berdi. Sahifani qayta yangilang yoki bosh sahifaga o'ting.
          </p>
          <div className="mt-3 p-2.5 bg-slate-100 rounded-lg text-left overflow-x-auto text-[11px] font-mono text-slate-700">
            {errorMessage}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Qayta yuklash</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Bosh sahifaga</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RouteError
