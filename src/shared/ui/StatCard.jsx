import { Card, CardHeader, CardContent } from "./card"

/**
 * StatCardProgressRing - Aylanma doira:
 * - Default holatda orqa foni toza kulrang (#E2E8F0)
 * - Ko'rsatkich oshgan sari aylanasi ko'k (#2563EB) rangga to'lib boradi
 */
export function StatCardProgressRing({ percentage = 0, size = 52, strokeWidth = 3.5, children }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const strokeDashoffset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Default holatda kulrang doira */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* To'lgan sari ko'k rang bilan to'lib boruvchi progress aylanasi */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

/**
 * Barcha dashboard va sahifalar uchun YAGONA va STANDART StatCard komponenti.
 * Barcha iconlar bir xil ko'k (blue-600) rangda va bir xil doira aylanada joylashadi.
 */
export function StatCard({
  title,
  value,
  subText,
  badge,
  icon: Icon,
  percentage = 0,
  isLoading = false,
  className = "",
}) {
  return (
    <Card
      className={`border border-slate-200/90 bg-white hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)] transition-all duration-200 rounded-2xl p-5 sm:p-5.5 min-h-34 flex flex-col justify-between group ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
        <div className="space-y-1 pr-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 line-clamp-1">
            {title}
          </span>
          <div className="text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors">
            {isLoading ? "—" : value}
          </div>
        </div>

        <StatCardProgressRing percentage={percentage} size={50} strokeWidth={3.5}>
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shadow-2xs">
            {Icon && <Icon className="size-4.5 text-blue-600" strokeWidth={2} />}
          </div>
        </StatCardProgressRing>
      </CardHeader>

      {(subText || badge) && (
        <CardContent className="p-0 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          {subText && (
            <p className="text-[11px] font-medium text-slate-500 truncate" title={subText}>
              {subText}
            </p>
          )}
          {badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-blue-700 bg-blue-50 border border-blue-100/60 shrink-0 ml-auto">
              {badge}
            </span>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default StatCard
