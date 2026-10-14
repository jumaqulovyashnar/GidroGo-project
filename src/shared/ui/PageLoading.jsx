import { Spinner } from "./Spinner"

export function PageLoading({ message = "Yuklanmoqda...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs gap-3">
        <Spinner size="lg" />
        <p className="text-xs font-semibold text-slate-600 tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 py-16 animate-in fade-in duration-200">
      <Spinner size="lg" />
      <p className="text-xs font-medium text-slate-500 tracking-wide">
        {message}
      </p>
    </div>
  )
}

export default PageLoading
