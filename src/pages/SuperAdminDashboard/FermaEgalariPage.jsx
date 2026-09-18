import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import { Card, CardHeader, Switch } from "@/ui";
import { User, ShieldCheck, TrendingUpIcon, Hammer } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/ui/table";
import { MOCK_BOSS_DETAILS } from "@/mock/boss.mock";
const stats = [
    {
        id: 1,
        title: "JAMI BOSSlar",
        value: 48,
        label: "nafar",
        icon: User,
    },
    {
        id: 2,
        title: "FAOL HISOBLAR",
        value: 44,
        label: "nafar",
        icon: ShieldCheck,
    },
    {
        id: 3,
        title: "YANGI TASDIQLANGAN",
        value: 5,
        label: "nafar",
        icon: TrendingUpIcon,
    },
    {
        id: 4,
        title: "BLOKLANGAN",
        value: 4,
        label: "nafar",
        icon: Hammer,
    },
];

const statusOptions = [
    { value: "all", label: "Barcha statuslar" },
    { value: "active", label: "Faol" },
    { value: "pending", label: "Tekshiruvda" },
    { value: "blocked", label: "Bloklangan" },
];

const farmOptions = [
    { value: "all", label: "Barcha fermalar" },
    { value: "qarshi", label: "Qarshi Markaziy" },
    { value: "oazis", label: "Oazis Toshkent" },
    { value: "zilol", label: "Zilol Aqua" },
    { value: "sano", label: "Sano Crystal" },
    { value: "kristall", label: "Kristall Buxoro" },
    { value: "tog", label: "Tog' Chashmasi" },
];

const FermaEgalariPage = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [farm, setFarm] = useState("all");
    const [bossList, setBossList] = useState(MOCK_BOSS_DETAILS);

    const handleToggleStatus = (id) => {
        setBossList((prev) =>
            prev.map((b) =>
                b.id === id
                    ? {
                        ...b,
                        profile: {
                            ...b.profile,
                            status: b.profile.status === "active" ? "inactive" : "active",
                        },
                    }
                    : b
            )
        );
    };

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        setFarm("all");
    };

    return (
        <section>
            <div>
                {/* Header */}
                <div className=" items-center justify-between">
                    <div>
                        <h2 className="font-bold">Ferma egalari.</h2>
                        <p>
                            Fermalar egalari va asosiy rahbarlar monitoringi
                            hamda hisob holati.
                        </p>
                    </div>
                </div>
                {/* cardlar qismi  */}
                <div className="grid grid-cols-4 gap-4 pt-6">
                    {stats.map((e) => {
                        const Icon = e.icon;    

                        return (
                            <Card key={e.id} className="p-5">
                                <CardHeader className="flex items-center justify-between p-0">
                                    <span className="text-sm text-muted-foreground">
                                        {e.title}
                                    </span>

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-blue-600">
                                        <Icon className="h-6 w-6" />
                                    </span>
                                </CardHeader>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-2xl font-bold">
                                        {e.value}
                                    </span>

                                    <span className="text-sm text-muted-foreground">
                                        {e.label}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                {/* filter section  */}
                <div className="pt-6">
                    <FilterBar
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        statusOptions={statusOptions}
                        farm={farm}
                        setFarm={setFarm}
                        farmOptions={farmOptions}
                        onReset={handleReset}
                        showStatus={true}
                        showFarm={true}
                        showReset={true}
                        showSort={false}
                        showFilterButton={false}
                        placeholder="Rahbar yoki ferma qidirish..."
                    />
                </div>
                <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <Table className="w-full">
                        <TableHeader className="bg-slate-100">
                            <TableRow className="border-b border-slate-200 hover:bg-transparent">
                                <TableHead className="py-3.5 pl-6 text-left font-semibold text-slate-700 w-16">
                                    Rasm
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700">
                                    Ferma Egasi
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700">
                                    Telefon
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700">
                                    Ferma ID
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700">
                                    Holati
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700">
                                    Ro'yxatdan O'tgan Sanasi
                                </TableHead>
                                <TableHead className="py-3.5 px-4 text-center font-semibold text-slate-700">
                                    Amallar
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bossList.map((owner) => (
                                <TableRow key={owner.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-b-0">
                                    {/* 1. Rasm */}
                                    <TableCell className="py-3.5 pl-6 text-left">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                            src={owner.profile.avatar}
                                            alt={owner.profile.fullName}
                                        />
                                    </TableCell>

                                    {/* 2. Ferma Egasi (Ism + Ferma nomi) */}
                                    <TableCell className="py-3.5 px-4 text-left">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm truncate">
                                                {owner.profile.fullName}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {owner.farm?.name || "Ferma biriktirilmagan"}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* 3. Telefon */}
                                    <TableCell className="py-3.5 px-4 text-left text-slate-600 text-sm font-medium whitespace-nowrap">
                                        {owner.profile.phone}
                                    </TableCell>

                                    {/* 4. Ferma ID */}
                                    <TableCell className="py-3.5 px-4 text-left whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700">
                                            {owner.farm?.id || owner.id}
                                        </span>
                                    </TableCell>

                                    {/* 5. Holati (Switch + Oddiy Matn) */}
                                    <TableCell className="py-3.5 px-4 text-left whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                            <Switch
                                                checked={owner.profile.status === "active"}
                                                onCheckedChange={() => handleToggleStatus(owner.id)}
                                            />
                                            <span
                                                className={`w-12 shrink-0 text-xs font-medium select-none ${owner.profile.status === "active"
                                                    ? "text-blue-600"
                                                    : "text-slate-400"
                                                    }`}
                                            >
                                                {owner.profile.status === "active" ? "Faol" : "Nofaol"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* 6. Ro'yxatdan O'tgan Sanasi */}
                                    <TableCell className="py-3.5 px-4 text-left text-slate-600 text-sm whitespace-nowrap">
                                        {owner.profile.createdAt
                                            ? new Date(owner.profile.createdAt).toLocaleDateString("ru-RU", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </TableCell>

                                    {/* 7. Amallar */}
                                    <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                title="Tahrirlash"
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer capitalize"
                                            >
                                                tahrirlash
                                            </button>
                                            <button
                                                type="button"
                                                title="O'chirish"
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-xs cursor-pointer capitalize"
                                            >
                                                o'chirish
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
};

export default FermaEgalariPage;