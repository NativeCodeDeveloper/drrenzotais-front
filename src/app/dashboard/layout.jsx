// app/dashboard/layout.jsx
import Link from "next/link";

export const metadata = {
    title: "Dashboard",
    description: "Panel de administración",
};

export default function DashboardLayout({ children }) {
    return (
        <div className="h-screen w-full overflow-hidden bg-slate-50">
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <aside className="hidden md:flex h-screen w-[272px] shrink-0 flex-col bg-[#0c111d] text-white border-r border-white/[0.06] selection:bg-cyan-500/30">

                    {/* ── Brand ── */}
                    <div className="relative px-6 py-5 shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                        <div className="relative flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                                <span className="text-[13px] font-bold text-white leading-none">SC</span>
                            </div>
                            <div className="leading-none">
                                <div className="text-[13px] font-semibold tracking-[-0.01em] text-white">Silueta Chic</div>
                                <div className="mt-0.5 text-[10px] font-medium text-white/40">Panel Administrador</div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 px-3 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-1">

                            {/* — Principal — */}
                            <details className="group" open>
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none">
                                    <span>Principal</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">
                                    <Link
                                        href="/dashboard"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Inicio Panel
                                    </Link>
                                </div>
                            </details>

                            {/* — Agenda Clínica — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none mt-3">
                                    <span>Agenda Clínica</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-3 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/calendarioGeneral"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Calendario General
                                    </Link>
                                    <Link
                                        href="/dashboard/calendario"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Ingreso Agendamientos
                                    </Link>
                                    <Link
                                        href="/dashboard/agendaCitas"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Estado de Reservaciones
                                    </Link>
                                </div>
                            </details>

                            {/* — Fichas Clínicas — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none mt-3">
                                    <span>Fichas Clinicas</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-3 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/GestionPaciente"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Ingreso Pacientes en sistema
                                    </Link>
                                    <Link
                                        href="/dashboard/FichaClinica"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Fichas Clinicas
                                    </Link>
                                </div>
                            </details>

                            {/* — Administración Web — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none mt-3">
                                    <span>Administracion Web</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-3 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/publicaciones"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Publicaciones Estandar
                                    </Link>
                                    <Link
                                        href="/dashboard/portadaEdit"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Carrusel de Portada
                                    </Link>
                                </div>
                            </details>

                            {/* — Productos y Servicios — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none mt-3">
                                    <span>Productos y Servicios</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-3 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/ingresoProductos"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Productos / Servicios
                                    </Link>
                                    <Link
                                        href="/dashboard/cupones"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Cupones Descuentos
                                    </Link>
                                    <Link
                                        href="/dashboard/categoriasProductos"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Categorías Productos/Servicios
                                    </Link>
                                </div>
                            </details>

                            {/* — Ventas Online — */}
                            <details className="group">
                                <summary className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors duration-150 cursor-pointer list-none select-none mt-3">
                                    <span>Ventas Online</span>
                                    <svg className="h-3.5 w-3.5 text-white/25 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 ml-3 space-y-0.5 border-l border-white/[0.06] pl-3">
                                    <Link
                                        href="/dashboard/pedidosCompras"
                                        className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <span className="h-1 w-1 rounded-full bg-white/20 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                                        Compras en Linea
                                    </Link>
                                </div>
                            </details>

                        </div>

                        {/* ── Atajos ── */}
                        <div className="mt-6 pt-5 relative">
                            <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                            <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/30">Atajos</div>
                            <div className="mt-2 space-y-0.5">
                                <Link
                                    href="/"
                                    className="group/link flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                >
                                    <svg className="h-3.5 w-3.5 text-white/30 group-hover/link:text-cyan-400 transition-colors duration-150" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                    </svg>
                                    Volver al sitio
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* ── Footer status ── */}
                    <div className="relative px-4 py-4 shrink-0">
                        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                        <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] font-medium text-white/35 uppercase tracking-wider">Estado</div>
                                    <div className="mt-0.5 text-[13px] font-semibold text-white/80">Operativo</div>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                                    <span className="relative h-2 w-2 rounded-full bg-emerald-400 block shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto">
                    {/* Mobile top bar */}
                    <div className="md:hidden sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-blue-500">
                                    <span className="text-[10px] font-bold text-white leading-none">SC</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">Silueta Chic</span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-400">Dashboard</div>
                        </div>
                        <div className="px-4 pb-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex gap-1.5 w-max">
                                <Link href="/dashboard" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Inicio</Link>
                                <Link href="/dashboard/pedidosCompras" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Pedidos</Link>
                                <Link href="/dashboard/ingresoProductos" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Productos</Link>
                                <Link href="/dashboard/cupones" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Cupones</Link>
                                <Link href="/dashboard/calendario" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Agenda</Link>
                                <Link href="/dashboard/agendaCitas" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Citas</Link>
                                <Link href="/dashboard/categoriasProductos" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Categorías</Link>
                                <Link href="/dashboard/publicaciones" className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all whitespace-nowrap">Publicaciones</Link>
                            </div>
                        </div>
                    </div>

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
