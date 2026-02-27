"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Michroma } from "next/font/google";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

const sections = [
  {
    title: "Principal",
    items: [
      { label: "Inicio Panel", href: "/dashboard" },
    ],
  },
  {
    title: "Agenda clínica",
    items: [
      { label: "Calendario General", href: "/dashboard/calendarioGeneral" },
      { label: "Ingreso Agendamientos", href: "/dashboard/calendario" },
      { label: "Estado de Reservaciones", href: "/dashboard/agendaCitas" },
    ],
  },
  {
    title: "Registros clínicos",
    items: [
      { label: "Ingreso de Pacientes", href: "/dashboard/GestionPaciente" },
      { label: "Carpeta del paciente", href: "/dashboard/FichaClinica" },
    ],
  },
  {
    title: "Administración web",
    items: [
      { label: "Publicaciones Estandar", href: "/dashboard/publicaciones" },
      { label: "Carrusel", href: "/dashboard/portadaEdit" },
    ],
  },
  {
    title: "Productos y servicios",
    items: [
      { label: "Tratamientos y Servicios", href: "/dashboard/ingresoProductos" },
      { label: "Categorias", href: "/dashboard/categoriasProductos" },
      { label: "Generacion de Presupuesto", href: "/dashboard/presupuestoTratamiento" },
    ],
  },
  {
    title: "Cobro por consulta",
    items: [
      { label: "Registro de Profesionales", href: "/dashboard/profesionales" },
      { label: "Prestaciones en Agenda", href: "/dashboard/serviciosAgendamiento" },
      { label: "Cobro por Consulta", href: "/dashboard/tarifaServicio" },
    ],
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-[#0c111d] border-b border-white/[0.06]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-blue-900 shadow-[0_0_16px_rgba(34,211,238,0.2)]">
              <span className="text-[11px] font-bold text-white leading-none">A.C</span>
            </div>
            <div className="leading-none">
              <span className={`text-sm font-semibold tracking-[-0.01em] text-white/90 ${michroma.className}`}>
                AgendaClinica
              </span>
              <span className="block mt-0.5 text-[9px] font-medium text-white/30">Panel Administrador</span>
            </div>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.05] text-white/70 hover:bg-white/[0.1] transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[56px] bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel */}
          <div className="absolute left-0 right-0 z-50 mx-2 mt-1 max-h-[75vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0c111d] shadow-2xl">
            <nav className="p-3 space-y-2">
              {sections.map((section) => (
                <div key={section.title}>
                  <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                    {section.title}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group/link flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white/15 group-hover/link:bg-cyan-400 group-hover/link:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-150" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Volver al sitio */}
              <div className="border-t border-white/[0.06] pt-2">
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                  Atajos
                </div>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="group/link flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
                >
                  <svg className="h-3.5 w-3.5 text-white/25 group-hover/link:text-cyan-400 transition-colors duration-150" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                  Volver al sitio
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
