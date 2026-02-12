"use client";

import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

// TikTok (inline SVG)
function TikTokIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 48 48"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M34.3 8.2c1.7 2 4 3.3 6.5 3.7v6.1c-2.5 0-4.8-.7-6.9-1.9v14.5c0 6.7-5.4 12.2-12.2 12.2S9.5 37.3 9.5 30.6s5.4-12.2 12.2-12.2c.7 0 1.4.1 2 .2v6.6c-.6-.2-1.3-.4-2-.4-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4V5.5h6.2c.1 1 .5 1.9 1 2.7z" />
        </svg>
    );
}

// WhatsApp (inline SVG)
function WhatsAppIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M19.1 17.3c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.7-.8.9-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3z" />
            <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.5c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1.1 1.1-3.9-.2-.4c-1-1.7-1.6-3.7-1.6-5.7C5.3 9.9 10 5.3 16 5.3S26.7 10 26.7 16 22.1 26.5 16 26.5z" />
        </svg>
    );
}

const socials = [
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61586147694822", icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/siluetachicoficial/", icon: Instagram },
    { name: "TikTok", href: "https://www.tiktok.com/@silueta.chic?_r=1&_t=ZM-91rfsGhFSQN", icon: TikTokIcon },
    { name: "WhatsApp", href: "https://wa.me/56977173029", icon: WhatsAppIcon },
];

export default function FooterSiluetaChic() {
    return (
        <footer className="bg-neutral-950 text-neutral-300">
            <div className="mx-auto max-w-6xl px-6 pt-14">
                {/* Top grid */}
                <div className="grid gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Silueta Chic Estudio</h3>
                        <p className="mt-4 text-sm leading-6 text-neutral-400">
                            Especialistas en Depilación Triláser avanzada sin dolor en el corazón de Ñuñoa. Tecnología de última generación para resultados visibles, seguros y duraderos desde la primera sesión.
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                            {/* Social icons */}
                            <div className="flex items-center gap-3">
                                {socials.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <a
                                            key={s.name}
                                            href={s.href}
                                            aria-label={s.name}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-indigo-600"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Brand icon */}
                            <img
                                src="/logofooter.png"
                                alt="Silueta Chic"
                                className="h-40 w-auto object-contain opacity-90"
                            />
                        </div>
                    </div>


                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Enlaces Rápidos</h3>
                        <ul className="mt-4 space-y-3 text-sm text-neutral-400">
                            {[
                                ["Inicio", "/"],
                                ["Depilacion Mujer", "/catalogo"],
                                ["Depilacion Hombre", "/catalogo?seccion=hombre"],
                                ["Agenda tus Sesiones", "/AgendaProceso"],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="transition hover:text-indigo-600"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Información</h3>
                        <ul className="mt-4 space-y-3 text-sm text-neutral-400">
                            {[
                                ["Cuidados Previos", "/dudas?seleccionFooter=previos"],
                                ["Cuidados Posteriores", "/dudas?seleccionFooter=posteriores"],
                                ["Preguntas frecuentes", "/dudas?seleccionFooter=frecuentes"],
                                ["Prohibiciones", "/dudas?seleccionFooter=prohibiciones"],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <Link href={href} className="transition hover:text-indigo-600">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Contacto</h3>

                        <ul className="mt-4 space-y-3 text-sm text-neutral-400">
                            <li className="flex gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 flex-none text-white/80" />
                                <span>
                     Avenida Irarrázaval 1989, Oficina 204 placa sur, Ñuñoa
                      </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 flex-none text-white/80" />
                                <a href="tel:+56977173029" className="hover:text-indigo-600">
                                    +56 9 7717 3029
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 flex-none text-white/80" />
                                <a
                                    href="mailto:siluetachicestudio@gmail.com"
                                    className="hover:text-indigo-600"
                                >
                                    siluetachicestudio@gmail.com
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <WhatsAppIcon className="h-5 w-5 flex-none text-white/80" />
                                <a
                                    href="https://wa.me/56977173029"
                                    className="hover:text-indigo-600"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    WhatsApp
                                </a>
                            </li>




                        </ul>
                    </div>
                </div>

                {/* Map */}
                <div className="mt-12 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <div className="relative aspect-[16/6] w-full">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.833121608925!2d-70.61308342614629!3d-33.453653997673065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf8e24e33aef%3A0xc87340a985daad3!2sAv.%20Irarr%C3%A1zaval%201989%2C%207750000%20%C3%91u%C3%B1oa%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 border-t border-white/10 py-8 text-center">
                    <p className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} Silueta.Chic. Todos los derechos
                        reservados.
                    </p>
                    <p className="mt-3 text-sm text-neutral-600">
                        Depilación Triláser Avanzada - Santiago, Chile
                    </p>
                    <p className="mt-2 text-xs text-neutral-600">
                      Plataforma desarrollada por{" "}
                      <a
                        href="https://nativecode.cl"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-neutral-500 hover:text-indigo-600 transition"
                      >
                        NativeCode.cl
                      </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}