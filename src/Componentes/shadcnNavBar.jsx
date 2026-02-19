"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { titulo: "Inicio", href: "/#inicio" },
  { titulo: "Doctor", href: "/#doctor" },
  { titulo: "Procedimientos", href: "/#procedimientos" },
  { titulo: "Ultraformer", href: "/#ultraformer" },
  { titulo: "Contacto", href: "/#footer" },
];

export function ShadcnNavBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_12px_40px_-28px_rgba(15,23,42,0.4)]">
      <div className="mx-auto flex h-[86px] w-full max-w-7xl items-center justify-between px-6 md:h-[94px] md:px-10 xl:px-12">
        <Link href="/#inicio" className="flex items-center" aria-label="Inicio">
          <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden md:h-[88px] md:w-[88px]">
            <Image
              src="/dr1.png"
              alt="Logo Dr. Renzo Tais"
              width={98}
              height={98}
              className="h-full w-full object-contain p-1"
              priority
            />
          </div>
        </Link>

        <nav className="hidden lg:block" aria-label="Navegación principal">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navItems.map((item, index) => (
              <li key={item.titulo} className="relative shrink-0">
                <Link
                  href={item.href}
                  className="inline-flex whitespace-nowrap px-2.5 py-1 text-[15px] font-medium text-slate-600 transition hover:text-slate-900"
                >
                  {item.titulo}
                </Link>
                {index < navItems.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-slate-300"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/AgendaProceso"
            className="hidden rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700 sm:inline-flex"
          >
            Agendar cita
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-slate-200 bg-white lg:hidden",
          mobileOpen ? "max-h-[430px] opacity-100" : "max-h-0 opacity-0",
          "transition-all duration-300",
        ].join(" ")}
      >
        <div className="space-y-2 px-6 py-5">
          {navItems.map((item) => (
            <Link
              key={item.titulo}
              href={item.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              {item.titulo}
            </Link>
          ))}
          <Link
            href="/AgendaProceso"
            className="mt-2 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Agendar Evaluación
          </Link>
        </div>
      </div>
    </header>
  );
}
