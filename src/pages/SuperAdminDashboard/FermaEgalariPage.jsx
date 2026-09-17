import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import { Button, Card, CardHeader } from "@/ui";
import { Plus, User, ShieldCheck, TrendingUpIcon, Hammer } from "lucide-react";

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

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        setFarm("all");
    };

    return (
        <section>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold">Ferma egalari.</h2>

                        <p>
                            Fermalar egalari va asosiy rahbarlar monitoringi
                            hamda hisob holati.
                        </p>
                    </div>

                    <Button>
                        <Plus />
                        Yangi rahbar biriktirish
                    </Button>
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
            </div>
        </section>
    );
};

export default FermaEgalariPage;