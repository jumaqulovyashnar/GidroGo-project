import { BusinessMetricsSummary } from "@/widgets"

export function BossOsishPage() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Biznes o'sishi va Dinamika
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Oylik strategik ko'rsatkichlar va reja monitoringi
        </p>
      </div>

      {/* Biznes o'sishi kartasi */}
      <BusinessMetricsSummary />
    </div>
  )
}

export default BossOsishPage
