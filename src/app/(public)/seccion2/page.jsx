"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const cards = [
  {
    title: "Aumento Mamario",
    text: "Planificación anatómica y técnica personalizada para equilibrio y naturalidad.",
    image: "/aumentomam.png",
  },
  {
    title: "Lipoescultura",
    text: "Definición de contorno corporal con criterios médicos y recuperación guiada.",
    image: "/esteticacorporal.avif",
  },
  {
    title: "Rinoplastia",
    text: "Armonización funcional y estética respetando proporciones faciales propias.",
    image: "/rinoplastia.png",
  },
  {
    title: "Blefaroplastia",
    text: "Rejuvenecimiento de mirada para un resultado fresco y no sobrecorregido.",
    image: "/bletaforoplastia.png",
  },
  {
    title: "Contorno Facial",
    text: "Técnicas combinadas para mejorar firmeza y definición de forma progresiva.",
    image: "/foto1.avif",
  },
];

export default function Seccion2() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    const id = setInterval(() => {
      const snaps = api.scrollSnapList();
      if (!snaps.length) return;
      const next = (api.selectedScrollSnap() + 1) % snaps.length;
      api.scrollTo(next);
    }, 3500);

    return () => {
      api.off("select", onSelect);
      clearInterval(id);
    };
  }, [api]);

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
          Nuestros procedimientos más solicitados para resultados naturales y armónicos.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600">
          Resultados unicos y personalizados, con un enfoque integral que prioriza tu bienestar y seguridad en cada paso del proceso.
        </p>

        <div className="mt-12 overflow-hidden rounded-[2.1rem] border border-white/70 bg-white p-6 shadow-[0_22px_80px_-44px_rgba(15,23,42,0.5)] md:p-8">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent className="-ml-5">
              {cards.map((card) => (
                <CarouselItem
                  key={card.title}
                  className="basis-full pl-5 md:basis-1/2 xl:basis-1/3"
                >
                  <article className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc]">
                    <div className="relative aspect-[4/3]">
                      <Image src={card.image} alt={card.title} fill className="object-cover" />
                    </div>
                    <div className="p-7">
                      <h3 className="text-xl leading-tight text-slate-900">{card.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.text}</p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-7 flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={card.title}
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
