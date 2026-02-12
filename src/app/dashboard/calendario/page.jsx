"use client"

import {useState, useMemo, useEffect} from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";


import es from "date-fns/locale/es";
import {InfoButton} from "@/Componentes/InfoButton";
import * as React from "react";

const locales = {
    es: es,
};

const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: dfStartOfWeek,
    getDay,
    locales,
});

export default function Calendario() {

    const API = process.env.NEXT_PUBLIC_API_URL;

    // Estilos CSS personalizados para mejorar la visualización de eventos
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para eventos en vista mes */
            .rbc-month-view .rbc-event {
                min-height: 28px !important;
                height: auto !important;
                padding: 6px 8px !important;
                line-height: 1.3 !important;
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
            }
            
            /* Estilos para eventos en vista semana y día */
            .rbc-time-view .rbc-event {
                min-height: 30px !important;
                height: auto !important;
                padding: 6px 8px !important;
                line-height: 1.3 !important;
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
            }
            
            /* Aumentar altura de las celdas del mes para que quepan los nombres */
            .rbc-month-view .rbc-day-slot {
                min-height: 80px !important;
            }
            
            /* Contenedor de eventos en mes */
            .rbc-row-segment {
                z-index: 1 !important;
            }
            
            /* Texto del evento */
            .rbc-event-label,
            .rbc-event-content {
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);


    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");


    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [fechaInicio, setfechaInicio,] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion,] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva,] = useState("");
    const [id_reserva, setid_reserva] = useState(0);

    const [dataAgenda, setDataAgenda] = useState([] || []);


    function formatearFechaLocal(d) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime))
        setHoraInicio(dateTime.toTimeString().slice(0, 8))
    }

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime))
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8))
    }


    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    // Helper: comprueba si un rango [start, end) se solapa con alguna reserva en dataAgenda
    function isOverlapping(start, end) {
        if (!dataAgenda || dataAgenda.length === 0) return false;

        // Normalizamos a Date para comparar
        for (const cita of dataAgenda) {
            const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
            const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));

            // Si cualquier parte se solapa
            if (start < evEnd && end > evStart) {
                return true;
            }
        }

        return false;
    }


    async function cargarDataAgenda() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"}
            })

            if (!res.ok) {
                return toast.error('No fue posible cargar las agendas, Contacte a soporte de Medify')
            }

            const data = await res.json();
            setDataAgenda(data);

        } catch (err) {
            return toast.error(err.message)
        }
    }

    useEffect(() => {
        cargarDataAgenda()
    }, [])



    async function bloquearAgenda(
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFinalizacion
    ) {
        try {

            if ( !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar los campos de fechas para bloquear un periodo');
            }

            const nombrePaciente = "AGENDA BLOQUEADA";
            const apellidoPaciente = "-";
            const rut = "-";
            const telefono = "-";
            const email = "-";
            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);

            if (inicio < ahora) {
                return toast.error("No es posible agendar en fechas NO vigentes")
            }

            if (final < inicio) {
                return toast.error("No es posible en fechas irreales")
            }

            // Validación local: si el rango se solapa con alguna reserva ya cargada, evitar llamar al servidor
            if (isOverlapping(inicio, final)) {
                return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');
            }


            if (fechaInicio === fechaFinalizacion) {

                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
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
                    await cargarDataAgenda();
                    return toast.success("Se ha bloqueado el periodo indicado correctamente.")

                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada")

                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');

                }

            } else {
                return toast.error("Solo se permite bloquear periodos dentro de un mismo dia. No se pueden bloquear periodos en dias diferentes.")
            }


        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');

        }
    }






    async function insertarNuevaReserva(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFinalizacion
    ) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar todos los campos');
            }

            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);

            if (inicio < ahora) {
                return toast.error("No es posible agendar en fechas NO vigentes")
            }

            if (final < inicio) {
                return toast.error("No es posible en fechas irreales")
            }

            // Validación local: si el rango se solapa con alguna reserva ya cargada, evitar llamar al servidor
            if (isOverlapping(inicio, final)) {
                return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');
            }


            if (fechaInicio === fechaFinalizacion) {

                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
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
                    await cargarDataAgenda();
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


    const messages = useMemo(
        () => ({
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos",
        }),
        []
    );


    useEffect(() => {
        if (!dataAgenda || dataAgenda.length === 0) {
            setEvents([]);
            return;
        }

        const eventosCalendario = dataAgenda.map((cita) => ({
            // id de la reserva para poder abrir el detalle al seleccionar
            id_reserva: cita.id_reserva,
            title: cita.nombrePaciente + " " + cita.apellidoPaciente,
            start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio),
            end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion),
        }));

        setEvents(eventosCalendario);
    }, [dataAgenda]);

    // Permite que el contenido del evento haga wrap y no se corte en vistas con poco espacio
    const eventStyleGetter = (..._args) => {
        return {
            style: {
                display: 'flex',
                alignItems: 'center',
                height: 'auto',
                minHeight: '28px',
                maxHeight: 'none',
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'clip',
                lineHeight: '1.3',
                padding: '6px 8px',
                fontSize: '0.8rem',
                boxSizing: 'border-box',
                borderRadius: '4px',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontWeight: '500',
                wordBreak: 'break-word',
            },
        };
    };

    // Componente ligero para renderizar el título del evento permitiendo salto de línea
    const EventComponent = ({event}) => {
        // Usamos title para mostrar tooltip nativo con el nombre completo
        return (
            <div
                title={event.title}
                className="break-words text-[13px] leading-snug w-full"
                style={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                }}
            >
                {event.title}
            </div>
        );
    };

    // Componente que muestra SOLO el título (para vistas Day y Agenda)
    const TitleOnlyEvent = ({event}) => {
        return (
            <div
                title={event.title}
                className="break-words text-[13px] leading-snug font-medium w-full"
                style={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    wordBreak: 'break-word',
                }}
            >
                {event.title}
            </div>
        );
    };


    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_reserva) {
                return toast.error("Debe llenar todos los campos para poder actualizar la reserva")
            }

            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
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
                    estadoReserva,
                    id_reserva
                })
            });

            if (!res.ok) {
                return toast.error("El servidor no responde")
            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    await cargarDataAgenda()
                    return toast.success("Se ha actualizado la reserva correctamente")
                }
            }


        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }


    async function seleccionarReservaEspecifica(id_reserva) {
        try {

            if (!id_reserva) {
                return toast.error("Debe seleccionar una Reserva");
            }

            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_reserva})
            });

            if (!res.ok) {
                return toast.error("El servidor no responde")
            }

            const data = await res.json();


            let reserva;

            if (Array.isArray(data)) {
                reserva = data[0];
            } else {
                reserva = data;
            }

            if (!reserva) {
                return toast.error("Sin Data")
            }

            // Seteamos los inputs desde la reserva (objeto)
            setNombrePaciente(reserva.nombrePaciente ?? "");
            setApellidoPaciente(reserva.apellidoPaciente ?? "");
            setRut(reserva.rut ?? "");
            setEmail(reserva.email ?? "");
            setTelefono(reserva.telefono ?? "");

            // Si tu endpoint trae estos campos, los cargamos también
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10));
            setHoraInicio(reserva.horaInicio ?? "");
            setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10));
            setHoraFinalizacion(reserva.horaFinalizacion ?? "");
            setEstadoReserva(reserva.estadoReserva ?? "");

        } catch (error) {
            console.log(error);
            return toast.error("El servidor no responde")
        }
    }

    useEffect(() => {
        if (id_reserva) {
            seleccionarReservaEspecifica(id_reserva);
        }
    }, [id_reserva]);


    function limpiarData() {
        setNombrePaciente("");
        setApellidoPaciente("");
        setTelefono("");
        setRut("");
        setEmail("");
    }


    return (
        // Contenedor con altura fija para que el calendario se muestre correctamente
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8 md:px-10">
            <ToasterClient/>

            <div className="mx-auto w-full max-w-7xl">
               <div className='flex justify-end'>
                   <InfoButton informacion={"En este apartado, usted puede ingresar pacientes de manera manual directamente en la agenda o sistema de citas. Además, es posible editar los datos de los pacientes ya registrados, permitiéndole mantener la información siempre actualizada y correcta.\n" +
                       "\n" +
                       "Asimismo, este módulo le permite bloquear períodos específicos de la agenda cuando no se encuentre disponible para atender.\n" +
                       "Para bloquear un período, solo debe seleccionar el rango horario que desea bloquear dentro del mismo día y luego presionar el botón “Bloquear”. El sistema marcará automáticamente ese período como no disponible para nuevas citas.\n" +
                       "\n" +
                       "Esta funcionalidad le entrega un control total sobre la agenda, facilitando la organización de horarios, la gestión de pacientes y la administración de tiempos no disponibles."}/>
               </div>
                <div className="mb-6 flex flex-col gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Módulo de Agenda</h1>
                  <p className="text-sm text-slate-600">Gestiona reservas, revisa disponibilidad y actualiza datos en un solo lugar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm p-5 ring-1 ring-black/5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Nombre</label>
                                <ShadcnInput value={nombrePaciente ?? ""}
                                             onChange={(e) => setNombrePaciente(e.target.value)}/>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Apellido</label>
                                <ShadcnInput
                                    value={apellidoPaciente ?? ""}
                                    onChange={(e) => setApellidoPaciente(e.target.value)}/>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Rut</label>
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
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Correo</label>
                                <ShadcnInput value={email ?? ""}
                                             onChange={(e) => setEmail(e.target.value)}/>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Teléfono</label>
                                <ShadcnInput value={telefono ?? ""}
                                             onChange={(e) => setTelefono(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm p-5 ring-1 ring-black/5">
                            <div className="mb-3 flex items-center justify-between">
                              <h2 className="text-sm font-semibold text-slate-900">Inicio</h2>
                              <span className="text-xs text-slate-500">Selecciona fecha y hora</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">

                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraInicio}/>
                                </div>

                                <div
                                    className="mt-3 md:mt-0 bg-slate-50/70 border border-slate-200 rounded-xl p-3 w-full md:w-52 ring-1 ring-black/5">
                                    <div className="text-xs text-slate-500">Fecha</div>
                                    <div className="text-sm font-medium text-slate-800">{fechaInicio || "--"}</div>
                                    <div className="text-xs text-slate-500 mt-2">Hora</div>
                                    <div className="text-sm font-medium text-green-700">{horaInicio || "--"}</div>
                                </div>

                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm p-5 ring-1 ring-black/5">
                            <div className="mb-3 flex items-center justify-between">
                              <h2 className="text-sm font-semibold text-slate-900">Final</h2>
                              <span className="text-xs text-slate-500">Debe ser el mismo día</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">

                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraFinalizacion}/>
                                </div>

                                <div
                                    className="mt-3 md:mt-0 bg-slate-50/70 border border-slate-200 rounded-xl p-3 w-full md:w-52 ring-1 ring-black/5">
                                    <div className="text-xs text-slate-500">Fecha</div>
                                    <div
                                        className="text-sm font-medium text-slate-800">{fechaFinalizacion || "--"}</div>
                                    <div className="text-xs text-slate-500 mt-2">Hora</div>
                                    <div
                                        className="text-sm font-medium text-purple-700">{horaFinalizacion || "--"}</div>
                                </div>

                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-1">
                            <ShadcnButton2
                                funcion={() => insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion)}
                                className="h-10 w-full sm:w-auto px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                nombre={"Agregar"}></ShadcnButton2>

                            <ShadcnButton2
                                funcion={() => actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva)}
                                className="h-10 w-full sm:w-auto px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                nombre={"Actualizar"}></ShadcnButton2>

                            <ShadcnButton2
                                funcion={() => limpiarData()}
                                className="h-10 w-full sm:w-auto px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
                                nombre={"Limpiar"}></ShadcnButton2>

                            <ShadcnButton2
                                funcion={() => bloquearAgenda(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion)}
                                className="h-10 w-full sm:w-auto px-4 rounded-lg bg-red-600 text-white hover:bg-red-500 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                nombre={"Bloquear"}></ShadcnButton2>


                        </div>

                    </div>
                </div>

                <div className="mt-10">
                    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200 ring-1 ring-black/5 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Calendario de Reservas</h3>
                            <p className="text-xs text-slate-500">Navega por mes/semana/día y selecciona una reserva para ver su detalle.</p>
                          </div>
                          <div className="text-xs text-slate-500">Vista: <span className="font-medium text-slate-700">{currentView}</span></div>
                        </div>
                      </div>
                      <div className="p-6 h-[700px]">
                        <Calendar
                            // Pasamos el localizador configurado para manejar fechas y formatos
                            localizer={localizer}
                            // Eventos que se mostrarán en el calendario
                            events={events}
                            // Evita que el título se corte en vistas comprimidas (p. ej. semana)
                            eventPropGetter={eventStyleGetter}
                            // Usamos componentes específicos: para day y agenda mostramos sólo el título
                            components={{
                                event: EventComponent,
                                day: {event: TitleOnlyEvent},
                                agenda: {event: TitleOnlyEvent}
                            }}
                            // Propiedades que indican qué campos del evento usar para inicio y fin
                            startAccessor="start"
                            endAccessor="end"
                            // Mensajes personalizados para la UI del calendario
                            messages={messages}
                            culture="es"
                            date={currentDate}
                            onNavigate={(nextDate) => setCurrentDate(nextDate)}
                            view={currentView}
                            onView={(nextView) => setCurrentView(nextView)}
                            defaultView="month"
                            style={{height: "100%"}}

                            // Permite seleccionar rangos de tiempo en el calendario
                            selectable
                            // Evitar seleccionar rangos que choquen con reservas existentes
                            onSelecting={(slot) => {
                                // slot puede ser {start, end} o directamente un objeto
                                const start = slot.start ?? slot;
                                const end = slot.end ?? slot;
                                if (isOverlapping(start, end)) {
                                    toast.error('Horario no disponible (solapa con una reserva existente)');
                                    return false; // cancela la selección
                                }
                                return true;
                            }}

                            onSelectEvent={(event) => {
                                if (!event?.id_reserva) {
                                    toast.error("No se encontró el ID de la reserva");
                                    return;
                                }
                                setid_reserva(event.id_reserva)
                                seleccionarReservaEspecifica(event.id_reserva)
                                toast.success(`Reserva: Numero # ${event.id_reserva}`);
                            }}

                            /* Función que se ejecuta al seleccionar un rango de tiempo.
                               Solicita al usuario el título del evento y lo añade a la lista de eventos */
                            onSelectSlot={(slotInfo) => {
                                const start = slotInfo.start ?? slotInfo;
                                const end = slotInfo.end ?? slotInfo;
                                if (isOverlapping(start, end)) {
                                    toast.error('No puede seleccionar un horario que ya está ocupado');
                                    return;
                                }
                                const title = prompt("Título del evento");
                                if (!title) return;

                                setEvents((prev) => [
                                    ...prev,
                                    {
                                        title,
                                        start: slotInfo.start,
                                        end: slotInfo.end,
                                    },
                                ]);
                            }}
                        />
                        {/* Leyenda / ayuda */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-6">
                            <span className="inline-block w-3 h-3 rounded-sm bg-sky-600" aria-hidden="true"/>
                            <span>Reserva</span>
                            <span className="text-xs italic text-slate-500">Pasa el cursor sobre una reserva para ver el nombre completo</span>
                        </div>
                      </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
