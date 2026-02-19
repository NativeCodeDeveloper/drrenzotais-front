"use client";

import Image from "next/image";
import Link from "next/link";

const heroGallery = [
  { src: "/cportada3.png", alt: "Clínica moderna - vista 1" },
  { src: "/cportada1.png", alt: "Clínica moderna - vista 2" },
  { src: "/cportada2.png", alt: "Clínica moderna - vista 3" },
];

export default function Portada() {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-28 overflow-hidden bg-[#f6f7fb] text-[#111827] md:scroll-mt-32"
    >
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          poster="/portada1.png"
        >
          <source src="/videoportada3.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[#f6f7fb]/95 md:bg-[#f6f7fb]/72" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(148,163,184,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_42%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-86px)] md:min-h-[calc(100svh-94px)] w-full max-w-7xl gap-10 px-6 pb-14 pt-20 sm:gap-12 sm:pb-16 sm:pt-24 md:px-10 md:pb-24 md:pt-28 lg:grid-cols-[1.1fr_1fr] lg:items-center xl:px-12">
        <div>
          <p className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-sm backdrop-blur">
            Médico cirujano y medicina estética
          </p>

          <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-slate-900 [font-family:var(--font-cormorant)] sm:text-5xl lg:text-6xl">
            Dr. Renzo Tais
          </h1>

          <p className="mt-7 max-w-2xl text-justify text-base leading-relaxed text-slate-600 sm:text-lg">
            Médico Cirujano, Especialista en Medicina Estética.
            Clínica moderna y acogedora, especializada en tratamientos estéticos no invasivos, 
            con un enfoque personalizado y resultados naturales. En nuestra clínica, nos dedicamos a realzar tu belleza única a través de procedimientos 
            seguros y efectivos, utilizando la más avanzada tecnología en el mercado para ofrecerte una experiencia excepcional y resultados que superan tus expectativas. 
            <br />
            <br />
            Descubre una nueva era de cuidado estético en nuestra
            clínica, donde tu bienestar y satisfacción son nuestra máxima prioridad.
          </p>


          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/AgendaProceso"
              className="rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Agendar Evaluación
            </Link>
            <Link
              href="/servicios"
              className="rounded-full border border-slate-300 bg-white/95 px-7 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
            >
              Ver servicios
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {[
              { label: "Médico Cirujano", value: "MD" },
              { label: "Medicina Estética", value: "UBA" },
              { label: "Especialidad", value: "Nefrología" },
            ].map((item) => (
              <article
                key={item.label}
                className="min-w-0 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5"
              >
                <p className="truncate text-base font-semibold leading-tight text-slate-900 sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-slate-600 sm:text-xs">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none">
          <Image
            src="/dr2.png"
            alt="Dr. Renzo Tais - imagen principal"
            width={1200}
            height={1500}
            priority
            className="h-auto w-full object-contain"
          />

          <div className="mt-4 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
            {heroGallery.map((item) => (
              <div
                key={item.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/70 bg-white"
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
