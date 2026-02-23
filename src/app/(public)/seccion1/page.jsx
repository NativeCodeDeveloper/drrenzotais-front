"use client";

import { useState, useEffect } from "react";
import { parseDescripcionPublicacion } from "@/FuncionesTranversales/PublicacionesCarrusel";
import Image from "next/image";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [datapublicaciones, setDatapublicaciones] = useState([]);

  async function llamarPublicaciones() {
    try {
      const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      const data = await res.json();
      if (data) {
        setDatapublicaciones(data);
      } else {
        toast.error("No se encontraron publicaciones");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error al obtener las publicaciones, contacte soporte NATIVECODE");
    }
  }

  useEffect(() => {
    llamarPublicaciones();
  }, []);

  const cards = datapublicaciones.map((item) => ({
    title: item.titulo,
    text: parseDescripcionPublicacion(item.descripcionPublicaciones),
    image: item.imagenPublicaciones_primera,
  }));

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
              Profesional de la medicina estética integral con enfoque regenerativo y no
              invasivo.
            </h2>
            <p className="mt-6 text-base text-justify leading-relaxed text-slate-600">
              El enfoque clínico se basa en evaluación personalizada, indicación honesta y
              seguimiento cercano. Cada procedimiento busca armonía facial/corporal,
              seguridad y resultados naturales en el tiempo.
            </p>
            <p className="mt-5 text-base text-justify leading-relaxed text-slate-600">
              Cada plan se diseña según diagnóstico clínico, objetivos del paciente y
              combinación estratégica de tecnologías regenerativas no invasivas.
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
            {cards.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-sm"
              >
                <div className="relative aspect-[16/10]">
                  <img
                    src={`https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.image}/full`}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
