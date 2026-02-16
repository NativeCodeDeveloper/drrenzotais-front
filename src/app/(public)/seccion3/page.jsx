"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Qué es Ultraformer MPT?",
    a: "Es una tecnología no invasiva basada en ultrasonido focalizado para mejorar firmeza, redefinir contornos y estimular colágeno en rostro y cuerpo.",
  },
  {
    q: "¿Cuándo se ven resultados?",
    a: "Puede observarse una mejoría inicial temprana y una evolución progresiva durante las siguientes semanas por el proceso de neocolagénesis.",
  },
  {
    q: "¿Requiere tiempo de recuperación?",
    a: "Generalmente no requiere reposo prolongado. La indicación final depende de la evaluación clínica individual y zona tratada.",
  },
  {
    q: "¿Con qué otros tratamientos se combina?",
    a: "Puede integrarse con planes de medicina estética para potenciar resultados, siempre bajo indicación médica personalizada.",
  },
];

export default function Seccion3() {
  return (
    <section
      id="ultraformer"
      className="scroll-mt-[96px] bg-slate-950 py-20 text-white md:scroll-mt-[108px] md:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 xl:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center xl:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Tecnología no invasiva
            </p>
            <h2 className="mt-5 text-3xl leading-tight text-white sm:text-4xl">
              Ultraformer MPT para lifting y firmeza sin cirugía.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Tratamiento de última generación para tratar la flacidez, contorno corporal y anclaje.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Solicitar evaluación
              </Link>
              <Link
                href="/servicios"
                className="rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ver más procedimientos
              </Link>
            </div>
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.1rem] border border-white/20 bg-slate-900 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.9)]">
            <Image
              src="/ultraformer.avif"
              alt="Tecnología Ultraformer"
              fill
              className="object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
          </div>
        </div>

        <div className="mt-20 rounded-[2rem] border border-white/15 bg-white/5 p-7 backdrop-blur sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Preguntas frecuentes
          </p>
          <h3 className="mt-5 text-2xl leading-tight text-white sm:text-3xl">
            Respuestas claras para pacientes antes de su evaluación.
          </h3>

          <div className="mt-7">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem key={item.q} value={`item-${index}`} className="border-white/20">
                  <AccordionTrigger className="text-base text-white hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-300">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
