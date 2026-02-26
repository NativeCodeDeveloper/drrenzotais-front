// app/dashboard/layout.jsx
import Link from "next/link";
import MobileNav from "./MobileNav";

export const metadata = {
    title: "Dashboard",
    description: "Panel de administración",
};

export default function DashboardLayout({ children }) {
    return (
        <div className="h-screen w-full overflow-hidden bg-white">
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <aside className="hidden md:flex h-screen w-[220px] shrink-0 flex-col bg-[#0c111d] text-white border-r border-white/[0.06] selection:bg-cyan-500/30">

                    {/* ── Brand ── */}
                    <div className="relative px-4 py-3.5 shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                        <div className="relative flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-blue-900 shadow-[0_0_16px_rgba(34,211,238,0.2)]">
                                <span className="text-[11px] font-bold text-white leading-none">A.C</span>
                            </div>
                            <div className="leading-none">
                                <div className="text-[12px] font-semibold tracking-[-0.01em] text-white/90">AgendaClinica</div>
                                <div className="mt-0.5 text-[9px] font-medium text-white/30">Panel Administrador</div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 px-2.5 py-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-0.5">

                            {/* — Principal — */}
                            <details className="group" open>
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none">
                                    <span>Principal</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 space-y-px">
                                    <Link
                                        href="/dashboard"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Inicio Panel
                                    </Link>
                                </div>
                            </details>

                            {/* — Agenda Clínica — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none mt-2">
                                    <span>Agenda clinica</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 ml-2.5 space-y-px border-l border-white/[0.05] pl-2.5">
                                    <Link
                                        href="/dashboard/calendarioGeneral"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Calendario General
                                    </Link>
                                    <Link
                                        href="/dashboard/calendario"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Ingreso Agendamientos
                                    </Link>
                                    <Link
                                        href="/dashboard/agendaCitas"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Estado de Reservaciones
                                    </Link>
                                </div>
                            </details>

                            {/* — Registros Clinicos — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none mt-2">
                                    <span>Registros clinicos</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 ml-2.5 space-y-px border-l border-white/[0.05] pl-2.5">
                                    <Link
                                        href="/dashboard/GestionPaciente"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Ingreso de Pacientes
                                    </Link>
                                    <Link
                                        href="/dashboard/FichaClinica"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Carpeta del paciente
                                    </Link>
                                </div>
                            </details>

                            {/* — Administración Web — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none mt-2">
                                    <span>Administracion web</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 ml-2.5 space-y-px border-l border-white/[0.05] pl-2.5">
                                    <Link
                                        href="/dashboard/publicaciones"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Publicaciones Estandar
                                    </Link>
                                    <Link
                                        href="/dashboard/portadaEdit"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Carrusel
                                    </Link>
                                </div>
                            </details>

                            {/* — Productos y Servicios — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none mt-2">
                                    <span>Productos y servicios</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 ml-2.5 space-y-px border-l border-white/[0.05] pl-2.5">
                                    <Link
                                        href="/dashboard/ingresoProductos"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Tratamientos y Servicios
                                    </Link>
                                    <Link
                                        href="/dashboard/categoriasProductos"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Categorias
                                    </Link>
                                    <Link
                                        href="/dashboard/presupuestoTratamiento"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Generacion de Presupuesto
                                    </Link>
                                </div>
                            </details>

                            {/* — Cobro por Consulta — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white/35 hover:text-white/50 transition-colors duration-150 cursor-pointer list-none select-none mt-2">
                                    <span>Cobro por consulta</span>
                                    <svg className="h-3 w-3 text-white/20 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-0.5 ml-2.5 space-y-px border-l border-white/[0.05] pl-2.5">
                                    <Link
                                        href="/dashboard/profesionales"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Registro de Profesionales
                                    </Link>
                                    <Link
                                        href="/dashboard/serviciosAgendamiento"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Prestaciones en Agenda
                                    </Link>
                                    <Link
                                        href="/dashboard/tarifaServicio"
                                        className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Cobro por Consulta
                                    </Link>
                                </div>
                            </details>

                        </div>

                        {/* ── Atajos ── */}
                        <div className="mt-4 pt-3 relative">
                            <div className="absolute top-0 left-2.5 right-2.5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                            <div className="px-2.5 text-[9px] font-medium tracking-[0.04em] text-white/25">Atajos</div>
                            <div className="mt-1.5 space-y-px">
                                <Link
                                    href="/"
                                    className="group/link flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                                >
                                    <svg className="h-3 w-3 text-white/25 group-hover/link:text-cyan-400 transition-colors duration-150" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                    </svg>
                                    Volver al sitio
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* ── Footer status ── */}
                    <div className="relative px-3 py-3 shrink-0">
                        <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                        <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/[0.05] px-3 py-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-medium text-white/30 tracking-wide">Estado</div>
                                    <div className="mt-0.5 text-[11px] font-medium text-white/70">Operativo</div>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 block shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto">
                    <MobileNav />

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
