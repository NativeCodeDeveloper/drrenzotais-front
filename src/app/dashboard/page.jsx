"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
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
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } },
};

/* ── Data estatica ── */

const acciones = [
    { label: "Nuevo paciente", desc: "Registrar", icon: UserPlus, href: "/dashboard/GestionPaciente", color: "from-cyan-500 to-blue-500" },
    { label: "Nueva cita", desc: "Agendar", icon: CalendarPlus, href: "/dashboard/calendario", color: "from-indigo-500 to-purple-500" },
    { label: "Ficha clinica", desc: "Consultar", icon: FileText, href: "/dashboard/FichaClinica", color: "from-amber-400 to-orange-500" },
    { label: "Calendario", desc: "Ver agenda", icon: Calendar, href: "/dashboard/calendarioGeneral", color: "from-emerald-400 to-teal-500" },
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
        <div className="rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 p-5">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white/80 capitalize">{monthLabel}</span>
                <Link href="/dashboard/calendarioGeneral" className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    Expandir
                </Link>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                    <span key={d} className="pb-2 text-[10px] font-bold uppercase text-white/50">
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
                                "flex h-8 w-full items-center justify-center rounded-lg text-[11px] font-medium transition-all duration-200",
                                isToday
                                    ? "bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/30 scale-110"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
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

    // ── Estados ──
    const [dataLista, setdataLista] = useState([]);

    // ── Funciones ──
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

    // ── Efectos ──
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
        { label: "Citas para hoy", value: totalCitas, icon: CalendarDays, color: "from-cyan-500 to-blue-500", glow: "cyan", pct: 100 },
        { label: "Confirmadas", value: citasConfirmadas, icon: TrendingUp, color: "from-emerald-400 to-teal-500", glow: "emerald", pct: totalCitas > 0 ? Math.round((citasConfirmadas / totalCitas) * 100) : 0 },
        { label: "Anuladas", value: citasAnuladas, icon: ClipboardList, color: "from-red-400 to-rose-500", glow: "red", pct: totalCitas > 0 ? Math.round((citasAnuladas / totalCitas) * 100) : 0 },
        { label: "Reservadas", value: citasReservadas, icon: Users, color: "from-indigo-500 to-purple-500", glow: "indigo", pct: totalCitas > 0 ? Math.round((citasReservadas / totalCitas) * 100) : 0 },
    ];

    // ── JSX ──
    return (
        <div className="relative h-full min-h-screen w-full bg-white">
            {/* Background image */}
            <div className="pointer-events-none absolute inset-0">
                <Image src="/pru14.png" alt="" fill className="object-cover" priority />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">

                {/* ── Header ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="mb-10"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="mt-8 flex items-center gap-4">
                                <h1 className={cn("text-4xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl", michroma.className)}>
                                    AgendaClinica
                                </h1>
                            </div>
                            <p className={cn("mt-4 text-base font-bold tracking-wide text-white/50", michroma.className)}>Healthcare Information System</p>
                        </div>

                        {/* Status pill */}
                        <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 px-5 py-2.5">
                            <div className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-[12px] font-semibold text-white/70">{getGreeting()}</span>
                            <span className="h-3 w-px bg-white/20 hidden sm:block" />
                            <span className="text-[12px] text-white/50 capitalize">{getFechaHoy()}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── KPI Cards ── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
                >
                    {kpis.map((kpi, i) => {
                        const Icon = kpi.icon;
                        const glowColors = {
                            cyan: { blob1: "bg-cyan-500", blob2: "bg-blue-500", bar: "from-cyan-500 to-blue-500", barShadow: "shadow-cyan-500/40", iconRing: "ring-cyan-400/30", iconShadow: "shadow-cyan-500/30", pctText: "text-cyan-400", labelText: "text-cyan-300/70", numGrad: "from-white to-cyan-200", dotBg: "bg-cyan-400", dotGlow: "bg-cyan-400" },
                            emerald: { blob1: "bg-emerald-500", blob2: "bg-teal-500", bar: "from-emerald-400 to-teal-500", barShadow: "shadow-emerald-500/40", iconRing: "ring-emerald-400/30", iconShadow: "shadow-emerald-500/30", pctText: "text-emerald-400", labelText: "text-emerald-300/70", numGrad: "from-white to-emerald-200", dotBg: "bg-emerald-400", dotGlow: "bg-emerald-400" },
                            red: { blob1: "bg-red-500", blob2: "bg-rose-500", bar: "from-red-400 to-rose-500", barShadow: "shadow-red-500/40", iconRing: "ring-red-400/30", iconShadow: "shadow-red-500/30", pctText: "text-red-400", labelText: "text-red-300/70", numGrad: "from-white to-red-200", dotBg: "bg-red-400", dotGlow: "bg-red-400" },
                            indigo: { blob1: "bg-indigo-500", blob2: "bg-purple-500", bar: "from-indigo-500 to-purple-500", barShadow: "shadow-indigo-500/40", iconRing: "ring-indigo-400/30", iconShadow: "shadow-indigo-500/30", pctText: "text-indigo-400", labelText: "text-indigo-300/70", numGrad: "from-white to-indigo-200", dotBg: "bg-indigo-400", dotGlow: "bg-indigo-400" },
                        };
                        const g = glowColors[kpi.glow];

                        return (
                            <motion.div
                                key={kpi.label}
                                variants={fadeUp}
                                custom={i + 1}
                                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 hover:ring-white/20 hover:bg-slate-900/70 transition-all duration-300 cursor-default p-6"
                            >
                                {/* Glow blobs */}
                                <div className={cn("pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-[0.12] blur-3xl transition-opacity group-hover:opacity-[0.2]", g.blob1)} />
                                <div className={cn("pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full opacity-[0.08] blur-3xl", g.blob2)} />

                                <div className="relative">
                                    {/* Top row: icon + percentage */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-2", kpi.color, g.iconShadow, g.iconRing)}>
                                            <Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", g.dotGlow)} />
                                                <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", g.dotBg)} />
                                            </span>
                                            <span className={cn("text-[12px] font-semibold tabular-nums", g.pctText)}>{kpi.pct}%</span>
                                        </div>
                                    </div>

                                    {/* Number */}
                                    <div className="text-5xl font-extrabold tracking-tight text-white">
                                        {kpi.value}
                                    </div>

                                    {/* Label */}
                                    <span className="mt-1.5 block text-[12px] font-bold uppercase tracking-widest text-white/60">
                                        {kpi.label}
                                    </span>

                                    {/* Progress bar */}
                                    <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={cn("h-full rounded-full bg-gradient-to-r shadow-sm transition-all duration-700 ease-out", g.bar, g.barShadow)}
                                            style={{ width: `${Math.max(kpi.pct, 3)}%` }}
                                        />
                                    </div>
                                    <div className="mt-2.5 flex items-center justify-between">
                                        <span className="text-[10px] text-white/50 font-medium">del total de hoy</span>
                                        <span className="text-[11px] font-semibold tabular-nums text-white/70">{kpi.value}/{totalCitas}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ── Two Columns ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Left — Proximas citas */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="lg:col-span-2 rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 overflow-hidden"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 shadow-sm shadow-cyan-500/20">
                                    <Clock className="h-4 w-4 text-white" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-semibold text-white">Proximas citas</h2>
                                    <p className="text-[11px] text-white/50">Agenda de hoy</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/agendaCitas"
                                className="group/link flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white/70 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-white/15 transition-all"
                            >
                                Ver todo
                                <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-white/10">
                            {citasHoy.length === 0 ? (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-sm text-white/50">No hay citas programadas para hoy</p>
                                </div>
                            ) : (
                                citasHoy.map((cita, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={idx * 0.5 + 6}
                                        className="group flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition-all duration-200"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[14px] font-bold tabular-nums text-white">{cita.hora}</span>
                                            <span className="text-[10px] text-white/40 font-medium">hrs</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                cita.estado === "confirmada" && "bg-emerald-400 shadow-sm shadow-emerald-400/40",
                                                cita.estado === "reservada" && "bg-indigo-400 shadow-sm shadow-indigo-400/40",
                                                cita.estado === "anulada" && "bg-red-400 shadow-sm shadow-red-400/40",
                                                !["confirmada", "reservada", "anulada"].includes(cita.estado) && "bg-white/40"
                                            )} />
                                            <div className="h-6 w-px bg-white/20" />
                                        </div>

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white/70">
                                            {cita.iniciales}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[13px] font-semibold text-white/90 truncate">{cita.paciente}</div>
                                            <div className="text-[12px] text-white/50">{cita.tipo}</div>
                                        </div>

                                        <span className={cn(
                                            "hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
                                            cita.estado === "confirmada" && "bg-emerald-500/15 text-emerald-400",
                                            cita.estado === "reservada" && "bg-indigo-500/15 text-indigo-400",
                                            cita.estado === "anulada" && "bg-red-500/15 text-red-400",
                                            !["confirmada", "reservada", "anulada"].includes(cita.estado) && "bg-white/10 text-white/50"
                                        )}>
                                            <span className={cn(
                                                "h-1 w-1 rounded-full",
                                                cita.estado === "confirmada" && "bg-emerald-400",
                                                cita.estado === "reservada" && "bg-indigo-400",
                                                cita.estado === "anulada" && "bg-red-400",
                                                !["confirmada", "reservada", "anulada"].includes(cita.estado) && "bg-white/40"
                                            )} />
                                            {cita.estado}
                                        </span>

                                        <ChevronRight className="h-4 w-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-slate-900/40 backdrop-blur-xl">
                            <div className="flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-white/50" />
                                <span className="text-[11px] text-white/50">{citasHoy.length} citas programadas para hoy</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[11px] text-white/50">{citasConfirmadas} confirmadas</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 ml-2" />
                                <span className="text-[11px] text-white/50">{citasReservadas} reservadas</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Acciones rapidas */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={6}
                            className="rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 p-5"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                                <h2 className="text-[14px] font-semibold text-white">Acciones rapidas</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                {acciones.map((acc) => {
                                    const Icon = acc.icon;
                                    return (
                                        <Link
                                            key={acc.label}
                                            href={acc.href}
                                            className="group relative flex flex-col items-center gap-2.5 rounded-xl border border-white/40 bg-slate-900/50 backdrop-blur-xl ring-1 ring-white/10 px-3 py-5 text-center transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:-translate-y-0.5"
                                        >
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-300 group-hover:scale-110",
                                                acc.color
                                            )}>
                                                <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                                            </div>
                                            <div>
                                                <span className="block text-[12px] font-semibold text-white/80">{acc.label}</span>
                                                <span className="block text-[10px] text-white/50">{acc.desc}</span>
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
        </div>
    );
}
