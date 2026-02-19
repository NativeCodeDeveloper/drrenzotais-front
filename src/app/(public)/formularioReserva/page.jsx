"use client"
import {useEffect, useState} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import {useAgenda} from "@/ContextosGlobales/AgendaContext";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {SelectDinamic} from "@/Componentes/SelectDinamic";


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
    const [listaTarifasProfesionales, setListaTarifasProfesionales] = useState([]);

    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");

    const [totalPago, setTotalPago] = useState("");
    const router = useRouter();




    async function seleccionarTodasTarifasProfesionales() {
        try {
            const res = await fetch(`${API}/tarifasProfesional/seleccionarTodasTarifasConNombres`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente.');
            }else{

                const respustaBackend = await res.json();
                if(respustaBackend){
                    setListaTarifasProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente .');
                }
            }
        }catch (error) {

            return toast.error('Error al cargar los tarifas y Servicios Profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodasTarifasProfesionales();
    }, []);







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
        horaFin,
        totalPago,
        profesionalSeleccionado,
        servicioSeleccionado
    ) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            if (totalPago <= 0) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            let horaFinalizacion = horaFin;

            const res = await fetch(`${API}/pagosMercadoPago/create-order`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productosDelCarrito: [
                        {
                            tituloProducto: `Reserva Consulta: ${servicioSeleccionado} con ${profesionalSeleccionado}`,
                            precio: Number(totalPago),
                            cantidad: 1,
                        }
                    ],
                    comprador: {
                        nombre_comprador: nombrePaciente,
                        apellidosComprador: apellidoPaciente,
                        telefono_comprador: telefono,
                        email_Comprador: email,
                        identificacion_comprador: rut,
                        direccion_despacho: "",
                        comuna: "",
                        regionPais: "",
                        comentarios: `Fecha: ${fechaInicio} | Hora: ${horaInicio} - ${horaFinalizacion}`,
                        totalPagado: Number(totalPago),
                    }
                }),
                mode: "cors",
            });

            if (!res.ok) {
                return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")
            }

            const data = await res.json();
            console.log("Respuesta create-order:", data);

            if (data) {

                const checkoutUrl = data.sandbox_init_point || data?.init_point;
                console.log("checkoutUrl:", checkoutUrl);

                if (checkoutUrl) {
                    console.log(checkoutUrl);
                    window.location.href = checkoutUrl;

                } else {
                    return toast.error("No se puede procesar el pago. Problema a nivel del Link de init poiunt")
                }
            } else {
                return toast.error("No se puede procesar el pago. Intenet mas tarde.")

            }
        } catch (err) {
            console.error(err);
            return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")

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
            <div className="mx-auto max-w-3xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-900">Formulario Agendamiento</h1>
                    <p className="mt-1 text-sm text-slate-500">Completa los datos para agendar tu hora.</p>
                </header>

                <form
                    className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
<div className="mt-4 flex flex-col  ">

    <label className="block text-xs font-semibold text-slate-700 mb-2">Seleccione motivo de consulta</label>

    <SelectDinamic
        value={totalPago}
        onChange={(e) =>{
            const indice = e.target.value;
            const tarifaSeleccionada = listaTarifasProfesionales[indice];
            if(tarifaSeleccionada){
                setTotalPago(tarifaSeleccionada.precio);
                setServicioSeleccionado(tarifaSeleccionada.nombreServicio);
                setProfesionalSeleccionado(tarifaSeleccionada.nombreProfesional);
            }else{
                setTotalPago("");
                setServicioSeleccionado("");
            }
        }}


        placeholder="Seleccione un servicio"
        options={listaTarifasProfesionales.map((tarifa,index) => ({
            value: index,
            label: `${tarifa.nombreServicio} - ${formatoCLP.format(tarifa.precio)}`
        }))}
        className={"-mt-2 " + (totalPago ? "border-green-400 bg-green-50 text-gray-900 font-semibold" : "")}
    />
</div>

                    <br/>

                    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Nombre</label>
                            <ShadcnInput
                                value={nombrePaciente}
                                onChange={(e) => setNombrePaciente(e.target.value)}
                                placeholder="Ej: Ana"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Apellido</label>
                            <ShadcnInput
                                value={apellidoPaciente}
                                onChange={(e) => setApellidoPaciente(e.target.value)}
                                placeholder="Ej: Pérez"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Rut</label>
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
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Correo</label>
                            <ShadcnInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.cl"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Teléfono</label>
                            <ShadcnInput
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+56 9 1234 5678"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Rango fecha
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


                                {totalPago && (
                                    <div className="text-sm text-slate-600">
                                        <span>Valor Consulta :</span> {formatoCLP.format(totalPago)}
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
                                        totalPago,
                                        profesionalSeleccionado,
                                        servicioSeleccionado
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
                    <span className="font-medium text-slate-700">Importante:</span> Revisa que los datos sean
                    correctos antes de agendar.
                </div>



                {/*BAJADA DE FOMULARIO PARA ESCRITORIO*/}

            </div>
        </div>
    )
}
