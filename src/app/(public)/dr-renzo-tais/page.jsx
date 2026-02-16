"use client";

import Image from "next/image";
import Link from "next/link";

const tratamientos = [
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

export default function DrRenzoTaisPage() {
  return (
    <main className="bg-[#f6f7fb] text-slate-900">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 lg:grid-cols-[1fr_1.15fr] lg:items-center xl:px-12 xl:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 bg-slate-100 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.5)]">
          <Image
            src="/renzo2.png"
            alt="Dr. Renzo Tais"
            fill
            className="object-cover object-center"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Dr. Renzo Tais
          </p>
          <h1 className="mt-5 text-4xl text-left leading-tight sm:text-5xl">
            Médico Cirujano con enfoque médico-estético integral.
          </h1>

          <div className="mt-7 space-y-5 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Soy el Dr. Renzo Tais, Médico Cirujano, especialista en Medicina Estética
              (Universidad de Buenos Aires) y especialista en Nefrología.
            </p>
            <p>
              Mi enfoque combina evaluación médica rigurosa, técnicas no invasivas y planes
              personalizados para lograr resultados naturales y armónicos.
            </p>
            <p>
              La atención es cercana y adaptada a cada caso, priorizando seguridad,
              bienestar y seguimiento clínico continuo.
            </p>
            <p>
              Atiendo en Providencia, Santiago de Chile, y te acompaño en cada etapa del
              tratamiento para que vivas una experiencia profesional y confiable.
            </p>
          </div>

          <Link
            href="/contacto"
            className="mt-10 inline-flex rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Enviar consulta ahora
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10 md:pb-32 xl:px-12"> 
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">Acerca de mi</h2>
              
              <div className="mt-7 space-y-5 text-justify text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
            Inicie mi formación de Medicina en el 2005, siendo ya 12 años que soy Medico, donde me gradué en la Universidad Nacional de Córdoba, Argentina.
            Luego de 1 año viviendo en Nueva Zelanda, regrese para formarme como Medico especialista en Nefrología y Medio Interno. Ya en el 2016 encontré mi segunda pasión, la Medicina Estética. Realice mi formación de postgrado en la Universidad de Buenos Aires y en la Sociedad Argentina de Clínica Estética.
            Desde entonces encontré un mundo donde el Arte y la Ciencia se fusionan, en el que encontrar la belleza en cada persona y potenciarla para lograr que se sientan a gusto con su apariencia, logren aceptar sus rasgos y mejorar aquellos que le quitan seguridad, ha sido mi objetivo principal.
            <br />
            <br />
            Fue allí que en el 2018 funde Tais Medicina Estética, donde inicie con tratamientos mínimamente invasivos de Armonización Facial con Acido Hialuronico, Bioestimuladores, así como también tratamientos con tecnología premium como Ultraformer, Scizer, Emsculpt, ente otros.
            Me fui capacitando de manera continua con KOL en áreas especificas con el Dr Fernando Silik ( experto a nivel mundial en Rinomodelacion ), el dermatólogo Dr Daniel Muszalski, Dr Sergio Escobar ( fundador del BAAS ), Dra Veronica Muchnik ( reconocida por su manejo en cánulas en tratamientos faciales) entre otros.
            En el año 2023 luego de tanto tiempo de esfuerzo, decidí mudarme a Chile, donde aprobe el examen Eunacom con un 80% e inicie nuevas capacitaciones con expertos en el área de Medicina Estética , ya que la formación continua es imprescindible para brindar tratamientos seguros y con respaldo científico.
            </p>
            </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10 md:pb-32 xl:px-12">
        <h2 className="text-3xl leading-tight text-slate-900 sm:text-4xl">
          Servicios destacados
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Procedimientos médicos para rostro y cuerpo, con protocolos modernos y objetivos
          realistas definidos junto a cada paciente.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tratamientos.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm"
            >
              {item}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
