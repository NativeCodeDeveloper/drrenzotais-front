"use client";

import Link from "next/link";

const servicios = [
  "Lifting facial no quirúrgico con Ultraformer MPT",
  "Reducción de papada",
  "Definición mandibular",
  "Armonización facial",
  "Rinomodelación",
  "Relleno de labios",
  "Tratamiento con toxina botulínica (Dysport)",
  "Láser CO₂",
  "Blefaroplastia no quirúrgica",
  "Emsculpt Neo",
  "Bioestimulación facial y corporal",
  "Polinucleótidos de salmón",
  "Exosomas",
  "Tratamientos corporales",
  "Armonización genital masculina y femenina",
];

export default function ServicioPage() {
  return (
    <main className="bg-[#f6f7fb] text-slate-900">
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Servicios
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-tight sm:text-5xl">
          Medicina estética premium con evaluación médica personalizada.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-slate-600">
          Dr. Renzo Tais, Médico Cirujano, especialista en Medicina Estética (Universidad
          de Buenos Aires) y especialista en Nefrología. Atención en Providencia, Santiago
          de Chile.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-7 px-6 pb-28 md:grid-cols-2 md:px-10 md:pb-32 xl:grid-cols-3 xl:px-12">
        {servicios.map((servicio, index) => (
          <article
            key={servicio}
            className="group rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-32px_rgba(15,23,42,0.52)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Servicio {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-xl leading-snug text-slate-900">{servicio}</h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              Planificación individual y seguimiento clínico para mantener resultados
              armónicos y seguros.
            </p>
          </article>
        ))}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:py-20 md:flex-row md:items-center md:px-10 xl:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Siguiente paso
            </p>
            <h3 className="mt-4 text-3xl leading-tight text-slate-900">
              Agenda una evaluación personalizada con el Dr. Renzo Tais.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Solicitar cita
            </Link>
            <a
              href="https://wa.me/56994836980"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
