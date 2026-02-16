"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react";

const footerOptions = [
  {
    title: "Dr. Renzo Tais",
    href: "/dr-renzo-tais",
    text: "Médico Cirujano, especialista en Medicina Estética (Universidad de Buenos Aires) y especialista en Nefrología.",
  },
  {
    title: "Misión y Visión",
    href: "/mision-y-vision",
    text: "Nuestra misión es brindar conocimientos y tratamientos de medicina estética de manera personalizada y de alta calidad, logrando mejorar la apariencia y el bienestar de las personas, utilizando tecnologías y procedimientos avanzados, en un entorno seguro, confiable y acogedor. Así, mi compromiso es brindar siempre resultados naturales que realcen la belleza individual de cada paciente, mejorando la autoestima y el cuidado integral de las personas.",
  },
  {
    title: "Servicios",
    href: "/servicios",
    text: "Protocolos médicos no invasivos de armonización facial, contorno corporal y tecnología avanzada para resultados naturales.",
  },
  {
    title: "Ultraformer",
    href: "/ultraformer",
    text: "Ultraformer MPT es la última palabra para el tratamiento de flacidez, contorno corporal y anclaje muscular en el mundo.",
  },
];

const quickLinks = [
  ["Inicio", "/"],
  ["Dr. Renzo Tais", "/dr-renzo-tais"],
  ["Misión y Visión", "/mision-y-vision"],
  ["Servicios", "/servicios"],
  ["Ultraformer", "/ultraformer"],
  ["Contacto", "/contacto"],
];

export default function FooterPremiumMedico() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden scroll-mt-28 bg-[#eef2f8] text-slate-900 md:scroll-mt-32"
    >



      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(148,163,184,0.22),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.12),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-24 md:pt-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">


          


          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Contenido destacado
            </p>
            <h3 className="mt-5 max-w-4xl text-4xl leading-[1.12] text-slate-900 sm:text-5xl">
              Dr. Renzo Tais,
              <br />
              conóceme.
            </h3>
            <p className="mt-8 max-w-3xl text-justify text-base leading-relaxed text-slate-600">
              Conoce nuestro contenido destacado, con información detallada sobre mi formación, experiencia y enfoque en medicina estética integral. Descubre cómo puedo ayudarte a realzar tu belleza única a través de tratamientos personalizados y resultados naturales.
              
            </p>
          </div>

          <div className="mb-2 flex h-10 w-40 items-center justify-center rounded-xl text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
            <img 
            src="/dr1.png"
              alt="Logo Dr. Renzo Tais"
              width={98}
              height={98}
              className="h-auto w-auto rounded-full object-cover object-center"
              loading="lazy" />
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {footerOptions.map((item) => (
            <article
              key={item.title}
              className="group rounded-[2rem] border border-white/80 bg-white/85 p-9 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_26px_65px_-35px_rgba(15,23,42,0.55)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-2xl leading-tight text-slate-900">{item.title}</h4>
                <Link
                  href={item.href}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition group-hover:border-slate-500 group-hover:text-slate-900"
                  aria-label={`Ir a ${item.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-7 text-[15px] leading-8 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 md:px-10 md:pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-14 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.35)] md:px-11 md:py-16">
          <div className="grid gap-16 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Dr. Renzo Tais
              </h4>
              <p className="mt-5 max-w-sm text-[15px] leading-8 text-slate-600">
                Atención personalizada en Providencia, Santiago de Chile, con enfoque
                médico, seguro y natural.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Navegación
              </h4>
              <ul className="mt-6 grid grid-cols-1 gap-4 text-[15px] sm:grid-cols-2">
                {quickLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-700 transition hover:text-slate-950">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Contacto
              </h4>
              <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700">
                <li>
                  <a href="mailto:drtaismedestetica@gmail.com" className="text-slate-700 transition hover:text-slate-950">
                    <Mail className="inline mr-2 h-6 w-6" />
                    drtaismedestetica@gmail.com
                    
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/56994836980"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,0.42)]"
                    aria-label="WhatsApp de Dr. Renzo Tais"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span className="text-[13px] font-semibold text-slate-800">
                        Escríbenos por WhatsApp
                      </span>
                      <span className="text-[12px] text-slate-600">+56 9 9483 6980</span>
                    </span>
                  </a>
                </li>
                <li>Ubicación: Providencia, Santiago de Chile</li>
                <li>
                  <a
                    href="https://www.instagram.com/dr.renzotais"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
                    aria-label="Instagram de Dr. Renzo Tais"
                  >
                    <Instagram className="h-6 w-6" />
                    <span>@dr.renzotais</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center md:px-10">
          <p>
            © {new Date().getFullYear()} Dr. Renzo Tais. Todos los derechos reservados.
          </p>
          <p>
            Desarrollado por{" "}
            <a
              href="https://www.nativecode.cl"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-400/60 underline-offset-2 transition hover:text-slate-700"
            >
              Nativecode.cl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
