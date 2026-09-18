import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui"
import { Download } from "lucide-react"
import { Tractor, Users, BadgeCheck, Gauge } from "lucide-react";


export const MOCK_AUDIT_METRICS_CARDS = [
    {
        id: 1,
        title: "YANGI QO'SHILGAN FERMALAR",
        value: "+4 ta",
        badge: "+25%",
        description: "O'tgan oyga nisbatan barqaror",
        icon: Tractor,
    },
    {
        id: 2,
        title: "FAOL MIJOZLAR OYLIK BAZASI",
        value: "68,420",
        unit: "nafar",
        badge: "+12%",
        description: "Faol buyurtma beruvchi iste'molchilar",
        icon: Users,
    },
    {
        id: 3,
        title: "MUVAFFAQIYATLI YETKAZISH",
        value: "97.8%",
        badge: "SLA Norm",
        description: "O'rtacha yetkazish vaqti: 38 min",
        icon: BadgeCheck,
    },
    {
        id: 4,
        title: "TIZIM TALAB DARAJASI (PEAK)",
        value: "1,840",
        unit: "buyurtma/soat",
        description: "Server hisoblash yuklanishi: 45%",
        icon: Gauge,
    },
];
const StatistikaPage = () => {
    return (
        <section>
            <div>
                <div className="flex items-center  justify-between">
                    <div>
                        <h2 className="font-bold  leading-normal">Statistika va Platforma Tahlili.</h2>
                        <p>GidroGo tarmog'idagi fermalar, buyurtmalar oqimi va mijozlar dinamikasining umumiy tahliliy ko'rsatkichlari.</p>
                    </div>
                    <div>
                        <Button type="button">
                            <span><Download /></span> hisobotni yuklash
                        </Button>
                    </div>
                </div>
                {/* mock data 4 ta card uchun  */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-12">
                    {MOCK_AUDIT_METRICS_CARDS.map((audit) => {
                        const Icon = audit.icon;

                        return (
                            <Card key={audit.id} className="shadow-sm">
                                {/* Sarlavha va ikonkani yonma-yon qilish uchun flex va justify-between */}
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                        {audit.title}
                                    </CardTitle>
                                    <div className="flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 shrink-0">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-2">
                                    {/* Qiymat va Badge */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">{audit.value}</span>
                                        {audit.badge && (
                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                                {audit.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Izoh */}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {audit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default StatistikaPage