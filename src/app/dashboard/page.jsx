"use client";

import { useMemo } from "react";
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

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

/* ── Animations ── */
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

/* ── Mock data ── */
const citasHoy = [
  { hora: "09:00", paciente: "María González", tipo: "Limpieza dental", estado: "confirmada", iniciales: "MG" },
  { hora: "10:30", paciente: "Carlos Muñoz", tipo: "Control ortodoncia", estado: "confirmada", iniciales: "CM" },
  { hora: "11:45", paciente: "Ana Sepúlveda", tipo: "Extracción", estado: "pendiente", iniciales: "AS" },
  { hora: "14:00", paciente: "Jorge Ramírez", tipo: "Blanqueamiento", estado: "confirmada", iniciales: "JR" },
  { hora: "16:00", paciente: "Valentina Torres", tipo: "Revisión general", estado: "pendiente", iniciales: "VT" },
];

const kpis = [
  { label: "Citas de hoy", value: "12", delta: "+3", deltaUp: true, icon: CalendarDays, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-50", text: "text-cyan-600" },
  { label: "Pacientes nuevos", value: "28", delta: "+12%", deltaUp: true, sub: "este mes", icon: Users, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50", text: "text-indigo-600" },
  { label: "Fichas pendientes", value: "5", delta: "-2", deltaUp: false, icon: ClipboardList, color: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
  { label: "Tasa asistencia", value: "94%", delta: "+2%", deltaUp: true, icon: TrendingUp, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
];

const acciones = [
  { label: "Nuevo paciente", desc: "Registrar", icon: UserPlus, href: "/dashboard/GestionPaciente", color: "from-cyan-500 to-blue-500" },
  { label: "Nueva cita", desc: "Agendar", icon: CalendarPlus, href: "/dashboard/calendario", color: "from-indigo-500 to-purple-500" },
  { label: "Ficha clínica", desc: "Consultar", icon: FileText, href: "/dashboard/FichaClinica", color: "from-amber-400 to-orange-500" },
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
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

/* ── Mini Calendar ── */
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
    <div className="rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 p-5 shadow-sm">
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

/* ── Sparkline SVG (decorativo) ── */
function Sparkline({ up }) {
  const d = up
    ? "M0 16 L4 14 L8 15 L12 10 L16 11 L20 6 L24 7 L28 3 L32 4 L36 1"
    : "M0 4 L4 3 L8 5 L12 8 L16 6 L20 10 L24 12 L28 11 L32 14 L36 16";
  return (
    <svg viewBox="0 0 36 18" className="h-6 w-16" fill="none">
      <path d={d} stroke={up ? "#06b6d4" : "#f59e0b"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Main Dashboard ── */
export default function DashboardHome() {
  return (
    <div className="relative h-full min-h-screen w-full bg-white">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image src="/puntos2.png" alt="" fill className="object-cover" priority />
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
                <h1 className={cn("text-4xl font-extrabold tracking-tight text-gray-800 sm:text-4xl lg:text-6xl", michroma.className)}>
                  AgendaClinica
                </h1>
              </div>
              <p className={cn("mt-2 text-base font-bold tracking-wide text-gray-400", michroma.className)}>Healthcare Information System</p>
            </div>

            {/* Status pill */}
            <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 px-5 py-2.5 shadow-sm">
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
            return (
              <motion.div
                key={kpi.label}
                variants={fadeUp}
                custom={i + 1}
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 p-5 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                {/* Decorative gradient blob */}
                <div className={cn("pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.15]", kpi.color)} />

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", kpi.bg)}>
                      <Icon className={cn("h-4 w-4", kpi.text)} strokeWidth={2} />
                    </div>
                    <Sparkline up={kpi.deltaUp} />
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-white">{kpi.value}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[12px] text-white/50">{kpi.label}</span>
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      kpi.deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {kpi.delta}
                    </span>
                  </div>
                  {kpi.sub && <span className="text-[11px] text-white/40">{kpi.sub}</span>}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Two Columns ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left — Próximas citas */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="lg:col-span-2 rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 shadow-sm shadow-cyan-500/20">
                  <Clock className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-white">Próximas citas</h2>
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
              {citasHoy.map((cita, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={idx * 0.5 + 6}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition-all duration-200"
                >
                  {/* Time */}
                  <div className="flex flex-col items-center">
                    <span className="text-[14px] font-bold tabular-nums text-white">{cita.hora}</span>
                    <span className="text-[10px] text-white/40 font-medium">hrs</span>
                  </div>

                  {/* Divider */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      cita.estado === "confirmada" ? "bg-emerald-400 shadow-sm shadow-emerald-400/40" : "bg-amber-400 shadow-sm shadow-amber-400/40"
                    )} />
                    <div className="h-6 w-px bg-white/20" />
                  </div>

                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white/70">
                    {cita.iniciales}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-white/90 truncate">{cita.paciente}</div>
                    <div className="text-[12px] text-white/50">{cita.tipo}</div>
                  </div>

                  {/* Status badge */}
                  <span className={cn(
                    "hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    cita.estado === "confirmada"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  )}>
                    <span className={cn(
                      "h-1 w-1 rounded-full",
                      cita.estado === "confirmada" ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    {cita.estado === "confirmada" ? "Confirmada" : "Pendiente"}
                  </span>

                  {/* Arrow on hover */}
                  <ChevronRight className="h-4 w-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-slate-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-white/50" />
                <span className="text-[11px] text-white/50">5 citas programadas para hoy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-white/50">3 confirmadas</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 ml-2" />
                <span className="text-[11px] text-white/50">2 pendientes</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Acciones rápidas */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
              className="rounded-2xl border border-white/40 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                <h2 className="text-[14px] font-semibold text-white">Acciones rápidas</h2>
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
