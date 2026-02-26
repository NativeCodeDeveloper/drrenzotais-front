"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
import OrbBackground from "@/Componentes/OrbBackground";
import {
    CalendarDays,
    Users,
    ClipboardList,
    TrendingUp,
    UserPlus,
    CalendarPlus,
    FileText,
    Calendar,
    ChevronRight,
    Clock,
    ArrowUpRight,
    Activity,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

/* ── Font ── */
const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

/* ── Animaciones ── */
const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.04 } },
};

/* ── Data estatica ── */
const acciones = [
    { label: "Nuevo paciente", desc: "Registrar", icon: UserPlus, href: "/dashboard/GestionPaciente", color: "from-cyan-500 to-indigo-500" },
    { label: "Nueva cita", desc: "Agendar", icon: CalendarPlus, href: "/dashboard/calendario", color: "from-indigo-500 to-cyan-500" },
    { label: "Ficha clinica", desc: "Consultar", icon: FileText, href: "/dashboard/FichaClinica", color: "from-cyan-600 to-indigo-600" },
    { label: "Calendario", desc: "Ver agenda", icon: Calendar, href: "/dashboard/calendarioGeneral", color: "from-indigo-600 to-cyan-600" },
];

/* ── Helpers ── */
function getFechaHoy() {
    return new Date().toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos dias";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
}

/* ── Sub-componentes ── */
function MiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const { firstDayOffset, daysInMonth, monthLabel } = useMemo(() => {
        const first = new Date(year, month, 1).getDay();
        const offset = first === 0 ? 6 : first - 1;
        const days = new Date(year, month + 1, 0).getDate();
        const label = new Date(year, month).toLocaleDateString("es-CL", { month: "long", year: "numeric" });
        return { firstDayOffset: offset, daysInMonth: days, monthLabel: label };
    }, [year, month]);

    return (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-2.5">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-white/60 capitalize">{monthLabel}</span>
                <Link href="/dashboard/calendarioGeneral" className="text-[8px] font-medium text-cyan-400/70 hover:text-cyan-300 transition-colors">
                    Expandir
                </Link>
            </div>
            <div className="grid grid-cols-7 gap-0 text-center">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                    <span key={d} className="pb-1 text-[7px] font-bold uppercase text-white/30">
                        {d}
                    </span>
                ))}
                {Array.from({ length: firstDayOffset }, (_, i) => (
                    <span key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === today;
                    return (
                        <span
                            key={day}
                            className={cn(
                                "flex h-5 w-full items-center justify-center rounded text-[8px] font-medium transition-all duration-200",
                                isToday
                                    ? "bg-gradient-to-br from-cyan-500/80 to-indigo-500/80 text-white shadow-sm shadow-cyan-500/20"
                                    : "text-white/50 hover:bg-white/[0.06] hover:text-white/70"
                            )}
                        >
                            {day}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}


/* ── Componente Principal ── */
export default function DashboardHome() {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [dataLista, setdataLista] = useState([]);

    async function buscarCitasHoy() {
        try {
            const hoy = new Date().toISOString().split("T")[0];

            const res = await fetch(`${API}/reservaPacientes/buscarEntreFechas`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fechaInicio: hoy, fechaFinalizacion: hoy }),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Error al buscar citas. Por favor, intente de nuevo.");
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend && Array.isArray(respuestaBackend) && respuestaBackend.length > 0) {
                setdataLista(respuestaBackend);
            } else {
                setdataLista([]);
            }
        } catch (error) {
            console.log(error);
            return toast.error("Error inesperado al buscar citas. Por favor, contacte a soporte tecnico.");
        }
    }

    useEffect(() => {
        buscarCitasHoy();
    }, []);

    // ── Datos derivados ──
    const citasHoy = dataLista.map((cita) => ({
        hora: cita.horaInicio || "--:--",
        paciente: `${cita.nombrePaciente || ""} ${cita.apellidoPaciente || ""}`.trim(),
        tipo: cita.estadoReserva || "Sin estado",
        estado: cita.estadoReserva?.toLowerCase() || "reservada",
        iniciales: `${(cita.nombrePaciente || "")[0] || ""}${(cita.apellidoPaciente || "")[0] || ""}`.toUpperCase(),
    }));

    const totalCitas = dataLista.length;
    const citasConfirmadas = dataLista.filter(c => c.estadoReserva?.toLowerCase() === "confirmada").length;
    const citasAnuladas = dataLista.filter(c => c.estadoReserva?.toLowerCase() === "anulada").length;
    const citasReservadas = dataLista.filter(c => c.estadoReserva?.toLowerCase() === "reservada").length;

    const kpis = [
        { label: "Citas hoy", value: totalCitas, icon: CalendarDays, pct: 100 },
        { label: "Confirmadas", value: citasConfirmadas, icon: TrendingUp, pct: totalCitas > 0 ? Math.round((citasConfirmadas / totalCitas) * 100) : 0 },
        { label: "Anuladas", value: citasAnuladas, icon: ClipboardList, pct: totalCitas > 0 ? Math.round((citasAnuladas / totalCitas) * 100) : 0 },
        { label: "Reservadas", value: citasReservadas, icon: Users, pct: totalCitas > 0 ? Math.round((citasReservadas / totalCitas) * 100) : 0 },
    ];

    return (
        <OrbBackground orbX={0.65} orbY={0.55}>
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-10">

                {/* ── Header ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="mb-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="mt-3 flex items-center gap-2">
                                <h1 className={cn("text-3xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl", michroma.className)}>
                                    AgendaClinica
                                </h1>
                            </div>
                            <p className={cn("mt-1.5 text-xs tracking-[0.2em]  text-gray-400/50", michroma.className)}>Healthcare Information System</p>
                        </div>

                        {/* Status pill */}
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-3 py-1.5">
                            <div className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            </div>
                            <span className="text-[9px] font-medium text-white/50">{getGreeting()}</span>
                            <span className="h-2.5 w-px bg-white/10" />
                            <span className="text-[9px] text-white/35 capitalize">{getFechaHoy()}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── KPI Cards ── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4"
                >
                    {kpis.map((kpi, i) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.label}
                                variants={fadeUp}
                                custom={i + 1}
                                className="group relative overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300 cursor-default p-2.5"
                            >
                                <div className="pointer-events-none absolute -top-6 -right-6 h-14 w-14 rounded-full bg-indigo-500 opacity-[0.04] blur-2xl group-hover:opacity-[0.08] transition-opacity" />

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-indigo-500/10">
                                            <Icon className="h-3.5 w-3.5 text-cyan-400/80" strokeWidth={1.8} />
                                        </div>
                                        <span className="text-[8px] font-semibold tabular-nums text-indigo-400/60">{kpi.pct}%</span>
                                    </div>

                                    <div className="text-xl font-extrabold tracking-tight text-white/90">
                                        {kpi.value}
                                    </div>

                                    <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.15em] text-white/30">
                                        {kpi.label}
                                    </span>

                                    <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500/60 to-cyan-500/60 transition-all duration-700 ease-out"
                                            style={{ width: `${Math.max(kpi.pct, 3)}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[7px] text-white/25 font-medium">del total</span>
                                        <span className="text-[7px] font-semibold tabular-nums text-white/40">{kpi.value}/{totalCitas}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ── Two Columns ── */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

                    {/* Left — Proximas citas */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="lg:col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-md overflow-hidden"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-indigo-500/10">
                                    <Clock className="h-3 w-3 text-cyan-400/80" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-semibold text-white/80">Proximas citas</h2>
                                    <p className="text-[8px] text-white/30">Agenda de hoy</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/agendaCitas"
                                className="group/link flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[8px] font-medium text-white/40 hover:text-cyan-400/80 hover:border-cyan-500/20 transition-all"
                            >
                                Ver todo
                                <ArrowUpRight className="h-2 w-2 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-white/[0.04]">
                            {citasHoy.length === 0 ? (
                                <div className="px-3.5 py-6 text-center">
                                    <p className="text-[10px] text-white/30">No hay citas programadas para hoy</p>
                                </div>
                            ) : (
                                citasHoy.map((cita, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={idx * 0.3 + 6}
                                        className="group flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/[0.03] transition-all duration-200"
                                    >
                                        <div className="flex flex-col items-center min-w-[32px]">
                                            <span className="text-[10px] font-bold tabular-nums text-white/70">{cita.hora}</span>
                                            <span className="text-[7px] text-white/25 font-medium uppercase">hrs</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className={cn(
                                                "h-1 w-1 rounded-full",
                                                cita.estado === "confirmada" && "bg-cyan-400/80",
                                                cita.estado === "reservada" && "bg-indigo-400/80",
                                                cita.estado === "anulada" && "bg-white/20",
                                                !["confirmada", "reservada", "anulada"].includes(cita.estado) && "bg-white/20"
                                            )} />
                                            <div className="h-4 w-px bg-white/[0.06]" />
                                        </div>

                                        <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-[7px] font-bold text-indigo-300/60 ring-1 ring-indigo-500/10">
                                            {cita.iniciales}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[9px] font-semibold text-white/70 truncate">{cita.paciente}</div>
                                            <div className="text-[8px] text-white/30">{cita.tipo}</div>
                                        </div>

                                        <span className={cn(
                                            "hidden sm:inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[7px] font-medium capitalize",
                                            cita.estado === "confirmada" && "bg-cyan-500/10 text-cyan-400/70 ring-1 ring-cyan-500/10",
                                            cita.estado === "reservada" && "bg-indigo-500/10 text-indigo-400/70 ring-1 ring-indigo-500/10",
                                            cita.estado === "anulada" && "bg-white/[0.04] text-white/30 ring-1 ring-white/[0.06]",
                                            !["confirmada", "reservada", "anulada"].includes(cita.estado) && "bg-white/[0.04] text-white/30"
                                        )}>
                                            {cita.estado}
                                        </span>

                                        <ChevronRight className="h-2.5 w-2.5 text-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-white/[0.04] px-3.5 py-1.5 bg-white/[0.01]">
                            <div className="flex items-center gap-1">
                                <Activity className="h-2.5 w-2.5 text-white/25" />
                                <span className="text-[7px] text-white/30">{citasHoy.length} citas hoy</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center gap-0.5">
                                    <span className="h-1 w-1 rounded-full bg-cyan-400/60" />
                                    <span className="text-[7px] text-white/30">{citasConfirmadas} confirmadas</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <span className="h-1 w-1 rounded-full bg-indigo-400/60" />
                                    <span className="text-[7px] text-white/30">{citasReservadas} reservadas</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-3">

                        {/* Acciones rapidas */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={6}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-2.5"
                        >
                            <div className="flex items-center gap-1 mb-2">
                                <Zap className="h-3 w-3 text-indigo-400/60" strokeWidth={2} />
                                <h2 className="text-[9px] font-semibold text-white/60">Acciones rapidas</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {acciones.map((acc) => {
                                    const Icon = acc.icon;
                                    return (
                                        <Link
                                            key={acc.label}
                                            href={acc.href}
                                            className="group relative flex flex-col items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-2.5 text-center transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-0.5"
                                        >
                                            <div className={cn(
                                                "flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                                                acc.color
                                            )}>
                                                <Icon className="h-3 w-3 text-white/90" strokeWidth={1.8} />
                                            </div>
                                            <div>
                                                <span className="block text-[8px] font-semibold text-white/60">{acc.label}</span>
                                                <span className="block text-[7px] text-white/25">{acc.desc}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Mini Calendario */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={7}
                        >
                            <MiniCalendar />
                        </motion.div>
                    </div>
                </div>
            </div>
        </OrbBackground>
    );
}
