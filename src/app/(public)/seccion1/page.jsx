"use client";

import Image from "next/image";

const procedimientos = [
  {
    title: "Cirugía Plástica Mamaria",
    text: "Aumento mamario, mastopexia, reducción mamaria y recambio de implantes con planificación personalizada.",
    image: "/cirugiamamaria.png",
  },
  {
    title: "Contorno Corporal",
    text: "Lipoescultura, abdominoplastía y armonización de silueta para resultados proporcionales y naturales.",
    image: "/foto4.avif",
  },
  {
    title: "Cirugía Facial",
    text: "Blefaroplastia, rinoplastia y rejuvenecimiento facial orientado a preservar expresión y equilibrio.",
    image: "/foto1.avif",
  },
  {
    title: "Cirugía Masculina",
    text: "Protocolos específicos para pacientes masculinos con foco en definición, funcionalidad y estética.",
    image: "/foto3.avif",
  },
  {
    title: "Cirugía Íntima y Reconstructiva",
    text: "Abordaje médico integral para indicaciones estéticas y reconstructivas según cada caso clínico.",
    image: "/intimafem.jpg",
  },
  {
    title: "Medicina Estética Integral",
    text: "Tratamientos no invasivos para calidad de piel, firmeza y prevención del envejecimiento.",
    image: "/foto2.avif",
  },
];

export default function Seccion1() {
  return (
    <section id="doctor" className="scroll-mt-[96px] bg-white py-20 md:scroll-mt-[108px] md:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 xl:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center xl:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)]">
            <Image
              src="/renzo1.png"
              alt="Dr. Renzo Tais"
              fill
              className="object-cover object-center"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Dr. Renzo Tais
            </p>
            <h2 className="mt-5 text-3xl leading-tight text-slate-900 sm:text-4xl">
              Profesional de la medicina estética integral con enfoque quirúrgico y no
              invasivo.
            </h2>
            <p className="mt-6 text-base text-justify leading-relaxed text-slate-600">
              El enfoque clínico se basa en evaluación personalizada, indicación honesta y
              seguimiento cercano. Cada procedimiento busca armonía facial/corporal,
              seguridad y resultados naturales en el tiempo.
            </p>
            <p className="mt-5 text-base text-justify leading-relaxed text-slate-600">
              Esta base replica la estructura de servicios del sitio anterior para migrar
              contenido sin perder información, pero con una presentación mucho más premium.
            </p>
          </div>
        </div>

        <div className="mt-20 md:mt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Áreas de trabajo
          </p>
          <h3 className="mt-5 max-w-3xl text-3xl leading-tight text-slate-900 sm:text-4xl">
            Resultados naturales y armónicos.
          </h3>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {procedimientos.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-sm"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-7">
                  <h4 className="text-xl leading-tight text-slate-900">{item.title}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
