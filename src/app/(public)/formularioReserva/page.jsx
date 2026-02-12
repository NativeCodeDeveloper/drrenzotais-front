"use client"
import {useEffect, useState} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import {useAgenda} from "@/ContextosGlobales/AgendaContext";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";


import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";

export default function FormularioReserva() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const {horaInicio, horaFin, fechaInicio, fechaFinalizacion,} = useAgenda();
    const [servicios, setServicios] = useState([]);
    const [totalPago, setTotalPago] = useState(0);
    const router = useRouter();


    useEffect(() => {
        setServicios();
    }, []);

    // handleSubmit: se ejecuta al enviar el formulario
    // Envía los datos al backend que crea la preferencia de Mercado Pago

    async function pagarMercadoPago(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFin
    ) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            let horaFinalizacion = horaFin;

            const res = await fetch(`${API}/reservaPacientes/insertarReservaPacienteFicha`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombrePaciente,
                    apellidoPaciente,
                    rut,
                    telefono,
                    email,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva: "reservada"}),
                mode: "cors"

            });

            if (!res.ok) {
                return toast.error("No se realizar el agendamiento por favor evalue otro medio.")
            }

            const respuestaBackendAgenda = await res.json();

            if (respuestaBackendAgenda.message === true) {
                setNombrePaciente("");
                setApellidoPaciente("");
                setTelefono("");
                setRut("");
                setEmail("");
                toast.success("Se ha ingresado correctamente el agendamiento");
                setTimeout(() => {
                    router.push(`/reserva-hora?fecha=${encodeURIComponent(fechaInicio)}&hora=${encodeURIComponent(horaInicio)}&email=${encodeURIComponent(email)}`);
                }, 1500);

            } else if (respuestaBackendAgenda.message === "conflicto" || respuestaBackendAgenda.message.includes("conflicto")) {
                return toast.error("No puede agendar una hora que ya esta ocupada")

            } else if (respuestaBackendAgenda.message === false) {
                return toast.error('Asegure que no esta ocupada la Hora');

            }


        } catch (err) {

            console.error(err);
            return toast.error("No se puede agendar el favor evalue otro medio o intente contactandonos por nuestros canales de contacto.")
        }
    }







    async function insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar todos los campos');
            }



            if (fechaInicio === fechaFinalizacion) {

                const res = await fetch(`${API}/reservaPacientes/reservaInsercionPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        nombrePaciente,
                        apellidoPaciente,
                        rut,
                        telefono,
                        email,
                        fechaInicio,
                        horaInicio,
                        fechaFinalizacion,
                        horaFinalizacion,
                        estadoReserva: "reservada"
                    })
                })


                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    return toast.success("Se ha ingresado correctamente el agendamiento")

                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada")

                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');

                }


            } else {
                return toast.error("Solo se permite agendar si es en el mismo dia")
            }


        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');

        }
    }










    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 ">
            <ToasterClient/>
            <div className="mx-auto max-w-3xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-extrabold text-indigo-700">Formulario Agendamiento</h1>
                    <p className="mt-1 text-sm text-slate-500">Completa los datos para agendar tu hora.</p>
                </header>

                <form
                    className="rounded-2xl bg-white border border-sky-100 p-6 shadow-sm"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Nombre</label>
                            <ShadcnInput
                                value={nombrePaciente}
                                onChange={(e) => setNombrePaciente(e.target.value)}
                                placeholder="Ej: Ana"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Apellido</label>
                            <ShadcnInput
                                value={apellidoPaciente}
                                onChange={(e) => setApellidoPaciente(e.target.value)}
                                placeholder="Ej: Pérez"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Rut</label>
                            <ShadcnInput
                                value={rut}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                    setRut(value);
                                }}
                                placeholder="12345678K (Sin puntos ni guion)"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Correo</label>
                            <ShadcnInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.cl"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Teléfono</label>
                            <ShadcnInput
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+56 9 1234 5678"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Rango fecha
                                Seleccionado</label>


                            <div className="">
                                {
                                    fechaInicio && (
                                        <div className="text-sm text-slate-600">
                                            <span>Fecha Seleccionada :</span> {fechaInicio.toString()}
                                        </div>
                                    )
                                }


                                {horaInicio && (
                                    <div className="text-sm text-slate-600">
                                        <span>Hora inicio :</span> {horaInicio.toString()}
                                    </div>
                                )}


                                {horaFin && (
                                    <div className="text-sm text-slate-600">
                                        <span>Hora Finalizacion :</span> {horaFin.toString()}
                                    </div>
                                )}
                            </div>


                        </div>


                    </div>

                    <div
                        className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">


                        <div className="flex gap-2">
                            <ShadcnButton2
                                nombre={"FINALIZAR"}
                                funcion={(e) => {
                                    // Evita que el form intente hacer submit (recarga/navegación) y corta el redirect
                                    if (e?.preventDefault) e.preventDefault();
                                    if (e?.stopPropagation) e.stopPropagation();

                                    return pagarMercadoPago(
                                        nombrePaciente,
                                        apellidoPaciente,
                                        rut,
                                        telefono,
                                        email,
                                        fechaInicio,
                                        horaInicio,
                                        fechaFinalizacion,
                                        horaFin,
                                        totalPago
                                    );
                                }}
                            />

                            <Link href={"/AgendaProceso"}>
                                <ShadcnButton2 nombre={"RETROCEDER"}/>
                            </Link>
                        </div>
                    </div>

                </form>

                <br/>

                <div className="text-sm text-slate-500">
                    <span className="font-medium text-sky-600">Importante:</span> Revisa que los datos sean
                    correctos antes de agendar.
                </div>

                {/*BAJADA DE FOMULARIO PARA ESCRITORIO*/}

            </div>
        </div>
    )
}
