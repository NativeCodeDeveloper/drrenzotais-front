"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {
  parseDescripcionPublicacion,
} from "@/FuncionesTranversales/PublicacionesCarrusel";
import {toast} from "react-hot-toast";

const fallbackCards = [
  {
    title: "Scizer",
    text: "Ultrasonido macrofocalizado por escaneo (MFSU) para reducir grasa localizada con precisión y seguridad.",
    image: "/scizer.jpeg",
  },
  {
    title: "Emsculpt Neo",
    text: "Fortalecimiento muscular profundo y apoyo al remodelado corporal para una definición más visible.",
    image: "/szicer+emscul.png",
  },
  {
    title: "Ultraformer MPT",
    text: "Tecnología MPT para tensado de piel y estimulación de colágeno en capas profundas, incluido SMAS.",
    image: "/rebordemandibularultraformermpt.jpeg",
  },
  {
    title: "Volnewmer",
    text: "Protocolo no invasivo orientado a mejorar firmeza, calidad de piel y redefinición progresiva del contorno.",
    image: "/lucirjoven.jpeg",
  },
  {
    title: "Láser de CO2",
    text: "Rejuvenecimiento de piel con enfoque en textura, líneas finas, poros y calidad cutánea global.",
    image: "/cportada1.png",
  },
  {
    title: "Blefaroplastia No Quirúrgica con Láser de CO2",
    text: "Abordaje no invasivo para zona periocular, con recuperación guiada y resultados naturales.",
    image: "/bletaforoplastia.png",
  },
];

export default function Seccion2() {
  const CLOUDFLARE_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_HASH;
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [cards, setCards] = useState(fallbackCards);

    //return `https://imagedelivery.net/${CLOUDFLARE_HASH}/${imageId}/card`;


    const API = process.env.NEXT_PUBLIC_API_URL;
    const [dataPublicaciones, setDataPublicaciones] = useState([]);

    async function cargarCards() {
      try {
        const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok)
        {
            return toast.error("No ha sido porisble cargar la informacion.")
        }else{
            const dataCarrusel = await res.json();
            setDataPublicaciones(dataCarrusel);
        }
      } catch (error) {
        return toast.error("Error cargando publicaciones para seccion2");
      }
    }

    useEffect(() => {
        cargarCards();
    }, []);


  return (
    <section
      id="procedimientos"
      className="scroll-mt-[96px] bg-[#f3f5f9] py-20 md:scroll-mt-[108px] md:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Procedimientos destacados
        </p>
        <h2 className="mt-5 max-w-4xl text-3xl leading-tight text-slate-900 sm:text-4xl">
          Tecnologías destacadas para resultados regenerativos, seguros y no invasivos.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600">
          Protocolos personalizados con Scizer, Emsculpt Neo, Ultraformer MPT, Volnewmer,
          Láser de CO2 y Blefaroplastia no quirúrgica con Láser de CO2.
        </p>

        <div className="mt-12 overflow-hidden rounded-[2.1rem] border border-white/70 bg-white p-6 shadow-[0_22px_80px_-44px_rgba(15,23,42,0.5)] md:p-8">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent className="-ml-5">
              {dataPublicaciones.map((card, index) => (
                <CarouselItem
                  key={card.id_publicacionesPortada ?? `${card.tituloPortadaCarrusel}-${index}`}
                  className="basis-full pl-5 md:basis-1/2 xl:basis-1/3"
                >
                  <article className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc]">
                    <div className="relative aspect-[4/3]">
                      <img src={`https://imagedelivery.net/${CLOUDFLARE_HASH}/${card.imagenPortada}/card`} alt="imagen" />
                    </div>
                    <div className="p-7">
                      <h3 className="text-xl leading-tight text-slate-900">{card.tituloPortadaCarrusel}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.descripcionPublicacionesPortada}</p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-7 flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={`${card.id ?? card.title}-dot-${index}`}
                type="button"
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  current === index ? "w-8 bg-slate-900" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
