"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactCards = [
  {
    title: "Ubicación",
    value: "Providencia, Santiago de Chile",
    href: null,
    icon: MapPin,
  },
  {
    title: "WhatsApp",
    value: "+56 9 9483 6980",
    href: "https://wa.me/56994836980",
    icon: MessageCircle,
  },
  {
    title: "Email",
    value: "drtaismedestetica@gmail.com",
    href: "mailto:drtaismedestetica@gmail.com",
    icon: Mail,
  },
  {
    title: "Instagram",
    value: "@dr.renzotais",
    href: "https://www.instagram.com/dr.renzotais",
    icon: Instagram,
  },
];

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function enviarCorreo() {
    try {
      if (!nombre || !email || !mensaje) {
        return toast.error("Completa todos los campos para enviar tu mensaje.");
      }

      const res = await fetch(`${API}/correo/contacto`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, mensaje }),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        return toast.error("No se pudo enviar tu solicitud. Intenta nuevamente.");
      }

      const respuestaBackend = await res.json();

      if (respuestaBackend.message === true) {
        setNombre("");
        setEmail("");
        setMensaje("");
        return toast.success("Tu consulta fue enviada correctamente.");
      }

      return toast.error("Correo no válido. Verifica e intenta otra vez.");
    } catch (error) {
      console.error(error);
      return toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  }

  return (
    <main className="bg-[#f6f7fb] text-slate-900">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(148,163,184,0.22),transparent_35%),radial-gradient(circle_at_88%_2%,rgba(59,130,246,0.12),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[1fr_1.05fr] xl:px-12 xl:gap-14">
          <aside className="rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Contacto
            </p>
            <h1 className="mt-4 text-4xl leading-[1.02] text-slate-900 sm:text-5xl">
              Agenda tu evaluación con atención personalizada.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Escríbenos y te ayudaremos a resolver tus dudas sobre procedimientos,
              evaluación inicial y tiempos estimados.
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Para resguardar privacidad, la dirección exacta se entrega solo al confirmar
              la evaluación.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">
                      {item.value}
                    </p>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    {content}
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Horario de atención
              </p>
              <div className="mt-3 flex items-start gap-3 text-sm text-slate-700">
                <Clock3 className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="space-y-1.5">
                  <p>Lunes a Viernes: 9:00 a 19:00</p>
                  <p>Sábado: 10:00 a 14:00</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-white/80 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Formulario de contacto
            </p>
            <h2 className="mt-4 text-3xl leading-tight text-slate-900 sm:text-4xl">
              Cuéntanos tu caso y te responderemos a la brevedad.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Si prefieres, indícanos en tu mensaje si quieres respuesta por WhatsApp o
              llamada telefónica.
            </p>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                enviarCorreo();
              }}
            >
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Camila Pérez"
                  className="h-11 rounded-xl border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: correo@ejemplo.com"
                  className="h-11 rounded-xl border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-slate-700">
                  Mensaje
                </label>
                <Textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu consulta..."
                  className="min-h-[150px] rounded-xl border-slate-300 bg-white"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Enviar mensaje
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
