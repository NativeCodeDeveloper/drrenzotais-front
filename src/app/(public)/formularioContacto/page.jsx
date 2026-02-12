"use client";

import {useState} from "react";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {Textarea} from "@/components/ui/textarea";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";


export default function FormularioContacto() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const[mensaje, setMensaje] = useState("");
    const API = process.env.NEXT_PUBLIC_API_URL;

    async function enviarCorreo(nombre, email, mensaje) {
        try {
            if (!nombre || !email || !mensaje) {
                return toast.error("Por llene todos los campos.");
            }

            const res =  await fetch(`${API}/correo/contacto`,{
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({nombre, email, mensaje}),
                mode: "cors",
                cache: "no-cache"
            })

            if(!res.ok){
                return toast.error("Ha ocurrido un error, Porfavor contactenos por otro medio.");
            }else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setMensaje("");
                    setEmail("");
                    setMensaje("");
                    return toast.success("Se ha enviado su consulta correctamente.");
                }else {
                    return toast.error("Correo ingresado NO Valido. Intente con otro correo.");
                }
            }

        }catch(error) {
            console.log(error);
            return toast.error("Ha ocurrido un error, Porfavor contactenos por otro medio.");
        }
    }




    return (
        <section className="w-full bg-gradient-to-b from-white via-indigo-50/60 to-cyan-50 text-gray-900 py-10 sm:py-12 px-4">
            <ToasterClient/>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">

                {/* --- LADO IZQUIERDO (Texto comercial) --- */}
                <div className="flex flex-col justify-center p-5 sm:p-6 md:p-7 rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-cyan-50 border border-indigo-100 shadow-[0_16px_40px_rgba(79,70,229,0.12)]">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
                        Información de
                        <span className="block bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">Contacto</span>
                    </h1>

                    <div className="mt-6 space-y-5">
                        {/* Dirección */}
                        <div className="flex items-start gap-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                                    <path fillRule="evenodd" d="M12 2.25a7.5 7.5 0 00-7.5 7.5c0 5.318 6.02 10.9 7.2 11.94a.75.75 0 00.98 0c1.18-1.04 7.2-6.622 7.2-11.94a7.5 7.5 0 00-7.5-7.5zm0 10.5a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-bold text-slate-900">Dirección</p>
                                <p className="mt-1 text-slate-600 text-sm sm:text-base leading-relaxed">
                                    Avenida Irarrázaval 1989, oficina 204 placa sur, Ñuñoa, Santiago
                                </p>
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="flex items-start gap-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                                    <path d="M2.25 6.75A4.5 4.5 0 016.75 2.25h.5c.84 0 1.57.58 1.74 1.4l.7 3.44a1.75 1.75 0 01-.5 1.6l-1.2 1.2a13.5 13.5 0 005.62 5.62l1.2-1.2a1.75 1.75 0 011.6-.5l3.44.7c.82.17 1.4.9 1.4 1.74v.5a4.5 4.5 0 01-4.5 4.5H18C9.44 21 3 14.56 3 6V6.75z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-bold text-slate-900">Teléfono</p>
                                <a href="tel:+56981396016" className="mt-1 inline-block text-cyan-700 font-bold text-base sm:text-lg tracking-tight hover:opacity-80">
                                    +56 9 8139 6016
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-start gap-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                                    <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.9-1.5A10 10 0 1012 2zm0 18a7.9 7.9 0 01-4-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1112 20zm4.4-5.6c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.6.1-.7.7-.8.9-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7.4 7.4 0 01-1.3-1.6c-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4s0-.3 0-.4-.6-1.5-.8-2-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 2.9 2.9 0 00-.9 2.1 5 5 0 001 2.6 11.4 11.4 0 004.4 4c1.6.7 1.6.5 1.9.5a3.2 3.2 0 002.1-1.5c.2-.4.2-.8.2-.9s-.2-.2-.4-.3z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-bold text-slate-900">WhatsApp</p>
                                <a href="https://wa.me/56977173029" target="_blank" className="mt-1 inline-block text-emerald-500 font-bold text-base sm:text-lg tracking-tight hover:opacity-80">
                                    +56977173029
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                                    <path d="M2.25 6.75A4.5 4.5 0 016.75 2.25h10.5a4.5 4.5 0 014.5 4.5v10.5a4.5 4.5 0 01-4.5 4.5H6.75a4.5 4.5 0 01-4.5-4.5V6.75zm2.2.9l7.05 4.4a.75.75 0 00.8 0l7.05-4.4a3 3 0 00-2.55-1.4H7a3 3 0 00-2.55 1.4zm16.3 2.3l-6.65 4.15a2.25 2.25 0 01-2.4 0L5.05 9.95v8.8A2.25 2.25 0 007.3 21h9.4a2.25 2.25 0 002.25-2.25v-8.8z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-bold text-slate-900">Email</p>
                                <a href="mailto:silueta.chic200@gmail.com" className="mt-1 inline-block text-cyan-700 font-bold text-base sm:text-lg tracking-tight hover:opacity-80">
                                    silueta.chic200@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Redes */}
                        <div className="pt-1">
                            <p className="text-lg font-bold text-slate-900">Síguenos en Redes Sociales</p>
                            <div className="mt-3 flex items-center gap-3">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61586147694822"
                                    target="_blank"
                                    aria-label="Facebook"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm hover:opacity-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114.3 6h2.2v3h-2.2a1 1 0 00-1 1V12h3.1l-.5 3h-2.6v7A10 10 0 0022 12z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://www.instagram.com/siluetachicoficial/"
                                    target="_blank"
                                    aria-label="Instagram"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white shadow-sm hover:opacity-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://www.tiktok.com/@silueta.chic?_r=1&_t=ZM-91rfsGhFSQN"
                                    target="_blank"
                                    aria-label="TikTok"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm hover:opacity-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M21 8.3a6.7 6.7 0 01-3.9-1.3v7.1a6.3 6.3 0 11-5.3-6.2v3.4a2.9 2.9 0 102.3 2.8V2h3a6.7 6.7 0 003.9 3.9v2.4z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="mt-6 rounded-2xl bg-white/70 p-5 shadow-sm border border-slate-200">
                            <p className="text-lg sm:text-xl font-bold text-slate-900">Horario de Atención</p>
                            <div className="mt-3 space-y-2 text-slate-700 text-sm sm:text-base">
                                <p><span className="font-extrabold">Lunes a Viernes:</span> 9:00 AM – 7:00 PM</p>
                                <p><span className="font-extrabold">Sábados:</span> 10:00 AM – 2:00 PM</p>
                                <p><span className="font-extrabold">Domingos:</span> Cerrado</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FORMULARIO --- */}
                <div className="flex items-center">
                    <div className="w-full bg-white/95 border border-gray-100 rounded-2xl shadow-[0_22px_60px_rgba(79,70,229,0.16)] p-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-indigo-800">Agenda tu contacto</h2>
                                <p className="text-xs sm:text-sm text-gray-500">Cuéntanos tu duda y te ayudaremos a elegir el tratamiento y resolver tus preguntas.</p>
                            </div>
                        </div>

                        <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); enviarCorreo(nombre, email, mensaje); }}>
                            <div>
                                <label htmlFor="nombre" className="block text-xs sm:text-sm font-semibold text-indigo-700 mb-1.5">Nombre</label>
                                <ShadcnInput id="nombre" placeholder="Ej.: Camila Pérez" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full" />
                            </div>

                            <div>
                                <label htmlFor="correo" className="block text-xs sm:text-sm font-semibold text-indigo-700 mb-1.5">Email</label>
                                <ShadcnInput id="correo" placeholder="Ej.: micorreo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
                            </div>

                            <div>
                                <label htmlFor="consulta" className="block text-xs sm:text-sm font-semibold text-indigo-700 mb-1.5">Tu duda</label>
                                <Textarea id="consulta" value={mensaje} onChange={e => setMensaje(e.target.value)} className="w-full min-h-[120px] resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            </div>

                            <div className="pt-2">
                                <ShadcnButton nombre={"Enviar Mensaje"} funcion={() => enviarCorreo(nombre, email, mensaje)} />
                            </div>

                            <div className="mt-3 text-xs sm:text-sm text-gray-500">
                                <p>Te responderemos dentro de 24 horas hábiles.</p>
                                <p className="mt-2">Si quieres que te contactemos por WhatsApp o teléfono, déjanos tu número en el mensaje.</p>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
}
