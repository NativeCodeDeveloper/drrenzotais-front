"use client";

import Image from "next/image";
import Link from "next/link";

const serviceBlocks = [
  {
    id: "01",
    title: "Servicio 01",
    subtitle: "Contorno corporal regenerativo y no invasivo",
    description:
      "Protocolo orientado a reducción de grasa localizada, reafirmación y tonificación con tecnologías de última generación.",
    procedures: [
      {
        name: "Scizer",
        detail:
          "Ultrasonido macrofocalizado por escaneo (MFSU) que actúa en tejido adiposo profundo para reducción de grasa localizada.",
      },
      {
        name: "Emsculpt Neo",
        detail:
          "Estimulación muscular de alta intensidad para tonificar, fortalecer y mejorar definición corporal.",
      },
      {
        name: "Ultraformer MPT",
        detail:
          "Ultrasonido focalizado de alta precisión para tensado cutáneo, retracción y soporte de tejidos.",
      },
      {
        name: "Protocolo EMFORMER",
        detail:
          "Combinación de Scizer + Emsculpt Neo + Ultraformer MPT para abordar grasa, músculo y flacidez de forma integral.",
      },
    ],
  },
  {
    id: "02",
    title: "Servicio 02",
    subtitle: "Rejuvenecimiento facial y protocolos no invasivos",
    description:
      "Plan médico personalizado para calidad de piel, firmeza y armonización, sin procedimientos quirúrgicos.",
    procedures: [
      {
        name: "Volnewmer",
        detail:
          "Protocolo regenerativo no invasivo para estimular colágeno y mejorar flacidez de forma progresiva.",
      },
      {
        name: "Láser de CO2",
        detail:
          "Tecnología para mejorar textura, poros, líneas finas y calidad global de la piel.",
      },
      {
        name: "Blefaroplastia no quirúrgica con Láser de CO2",
        detail:
          "Abordaje de rejuvenecimiento periocular con enfoque médico y recuperación guiada.",
      },
      {
        name: "Armonización genital masculina y femenina no invasiva",
        detail:
          "Tratamientos orientados al bienestar íntimo con evaluación clínica personalizada.",
      },
    ],
  },
];

const tecnologiasDestacadas = [
  {
    title: "Scizer",
    text: "Alcanza 45 °C a 75 °C en tejido adiposo profundo y permite reducción progresiva del contorno en 8 a 12 semanas.",
    image: "/scizer.jpeg",
  },
  {
    title: "Protocolo Combinado Scizer + Emsculpt Neo",
    text: "Scizer usa ultrasonido focalizado para reducir adiposidad localizada. Emsculpt Neo combina radiofrecuencia y energía electromagnética (HIFEM+) para construir músculo y quemar grasa simultáneamente, logrando definición y volumen muscular sin cirugía.",
    image: "/szicer+emscul.png",
  },
  {
    title: "Ultraformer MPT",
    text: "Estimulación de colágeno y elastina en profundidad para firmeza, retracción cutánea y efecto lifting progresivo.",
    image: "/resultadosultraformer.jpeg",
  },
  {
    title: "Volnewmer",
    text: "Protocolo regenerativo para estimular colágeno y mejorar firmeza de piel con resultados progresivos.",
    image: "/lucirjoven.jpeg",
  },
  {
    title: "Láser de CO2",
    text: "Rejuvenecimiento cutáneo para mejorar textura, luminosidad y líneas de expresión.",
    image: "/cportada1.png",
  },
  {
    title: "Blefaroplastia No Quirúrgica con Láser de CO2",
    text: "Tratamiento de zona periocular con enfoque no invasivo y resultados naturales.",
    image: "/bletaforoplastia.png",
  },
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

      <section className="mx-auto grid w-full max-w-7xl gap-7 px-6 pb-16 md:grid-cols-2 md:px-10 md:pb-20 xl:px-12">
        {serviceBlocks.map((service) => (
          <article
            key={service.id}
            className="group rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-32px_rgba(15,23,42,0.52)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Servicio {service.id}
            </p>
            <h2 className="mt-4 text-2xl leading-snug text-slate-900">{service.subtitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{service.description}</p>
            <div className="mt-6 space-y-4">
              {service.procedures.map((procedure) => (
                <div
                  key={procedure.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">{procedure.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{procedure.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10 md:pb-32 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Tecnologías y procedimientos destacados
        </p>
        <h2 className="mt-5 max-w-4xl text-3xl leading-tight text-slate-900 sm:text-4xl">
          Scizer, Emsculpt Neo, Ultraformer MPT, Volnewmer, Láser de CO2 y Blefaroplastia No Quirúrgica.
        </h2>
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {tecnologiasDestacadas.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-tight text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
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
