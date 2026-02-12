'use client'
import CarruselOfertas from "@/Componentes/CarruselOfertas";
import Link from "next/link";
import {useEffect, useState} from "react";


export default function SeccionComuncacion() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaPublicaciones, setListaPublicaciones] = useState([]);

    async function listarPublicacionesCarrusel() {
        try {
            const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors",
                cache: "no-cache"
            })

            if(!res.ok) {
                console.error("No se han podido Listar Publicaciones / Falla en el fetch desde el frontEnd");
                setListaPublicaciones([])
                return[]
            }else {
                const publicaciones = await res.json();
                setListaPublicaciones(publicaciones);
                return publicaciones;
            }
        }catch(err) {
            console.error("Problema al consultar Backen desde la vista fronend:"+err);
        }
    }


    useEffect(() => {
        listarPublicacionesCarrusel();
    }, []);





    const logos = [
        { src: "/logos/logo1.png", alt: "Logo 1" },
        { src: "/logos/logo2.png", alt: "Logo 2", href: "https://tuweb.cl" },
        { src: "/logos/logo3.png", alt: "Logo 3" },
    ];


    let Carrusel = listaPublicaciones.map((publicacion) =>
        `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicacion.imagenPublicaciones_primera}/full`
    )

    return (
       <div>
           {/* PANTALLAS ESCRITORIO*/}
           <div className="hidden md:block">
               <section className="mt-50 px-6">
                   <div className="max-w-7xl mx-auto text-center">
                       <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                           Revisa nuestras  <span className="bg-gradient-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent">promociones</span>
                       </h1>

                       <p className="mt-4 text-gray-500 text-lg">
                           No solo eliminamos el vello, transformamos tu relación con tu piel
                       </p>



                       <div className="w-full -mt-30 ">
                           <CarruselOfertas
                               title=""
                               images={Carrusel}
                               intervalMs={1800}
                           />

                           <Link href="/catalogo">
                               <button className='
                    -mt-30 border p-2 text-2xl w-100 rounded-3xl
                    bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400
                    text-white font-bold tracking-wide
                    shadow-lg
                    transition-all duration-300 ease-out
                    hover:scale-105
                    hover:shadow-[0_0_35px_rgba(99,102,241,0.7)]
                    hover:brightness-110
                    active:scale-95
                    '>Comprar Ahora</button>
                           </Link>




                       </div>
                   </div>
               </section>
           </div>
















           {/* PANTALLAS CELULARES      */}
           <div className="block md:hidden">
               <section className="mt-50 px-6">
                   <div className="max-w-7xl mx-auto text-center">
                       <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                           Revisa nuestras  <span className="bg-gradient-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent">promociones</span>
                       </h1>

                       <p className="mt-4 text-gray-500 text-lg">
                           No solo eliminamos el vello, transformamos tu relación con tu piel
                       </p>

                       <br/>



                       <div className="w-full -mt-30 ">
                           <CarruselOfertas
                               title=""
                               images={Carrusel}
                               intervalMs={1800}
                           />

                           <Link href="/catalogo">
                               <button className='
                    -mt-50 border p-2 text-2xl w-70 rounded-3xl
                    bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400
                    text-white font-bold tracking-wide
                    shadow-lg
                    transition-all duration-300 ease-out
                    hover:scale-105
                    hover:shadow-[0_0_35px_rgba(99,102,241,0.7)]
                    hover:brightness-110
                    active:scale-95
                    '>Comprar Ahora</button>
                           </Link>




                       </div>
                   </div>
               </section>
           </div>

       </div>
    );
}