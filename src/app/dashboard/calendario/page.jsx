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

const locales = {es: es};
const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});
const localizer = dateFnsLocalizer({format, parse, startOfWeek: dfStartOfWeek, getDay, locales});

export default function Calendario() {

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .rbc-month-view .rbc-event {
                min-height: 28px !important; height: auto !important; padding: 6px 8px !important;
                line-height: 1.3 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important;
            }
            .rbc-time-view .rbc-event {
                min-height: 30px !important; height: auto !important; padding: 6px 8px !important;
                line-height: 1.3 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important;
            }
            .rbc-month-view .rbc-day-slot { min-height: 80px !important; }
            .rbc-row-segment { z-index: 1 !important; }
            .rbc-event-label, .rbc-event-content { white-space: normal !important; overflow: visible !important; word-break: break-word !important; }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");

    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva] = useState("");
    const [id_reserva, setid_reserva] = useState(0);
    const [dataAgenda, setDataAgenda] = useState([]);

    function formatearFechaLocal(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime));
        setHoraInicio(dateTime.toTimeString().slice(0, 8));
    };

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime));
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8));
    };

    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function isOverlapping(start, end) {
        if (!dataAgenda || dataAgenda.length === 0) return false;
        for (const cita of dataAgenda) {
            const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
            const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));
            if (start < evEnd && end > evStart) return true;
        }
        return false;
    }

    async function cargarDataAgenda() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"}
            });
            if (!res.ok) return toast.error('No fue posible cargar las agendas, Contacte a soporte de Medify');
            const data = await res.json();
            setDataAgenda(data);
        } catch (err) {
            return toast.error(err.message);
        }
    }

    useEffect(() => { cargarDataAgenda(); }, []);

    async function bloquearAgenda(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion) {
        try {
            if (!fechaInicio || !horaInicio || !horaFinalizacion) {
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
            if (inicio < ahora) return toast.error("No es posible agendar en fechas NO vigentes");
            if (final < inicio) return toast.error("No es posible en fechas irreales");
            if (isOverlapping(inicio, final)) return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');

            if (fechaInicio === fechaFinalizacion) {
                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
                    method: "POST",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    mode: "cors",
                    body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva: "reservada"})
                });
                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                    await cargarDataAgenda();
                    return toast.success("Se ha bloqueado el periodo indicado correctamente.");
                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada");
                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');
                }
            } else {
                return toast.error("Solo se permite bloquear periodos dentro de un mismo dia.");
            }
        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');
        }
    }

    async function insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar todos los campos');
            }
            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);
            if (inicio < ahora) return toast.error("No es posible agendar en fechas NO vigentes");
            if (final < inicio) return toast.error("No es posible en fechas irreales");
            if (isOverlapping(inicio, final)) return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');

            if (fechaInicio === fechaFinalizacion) {
                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
                    method: "POST",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    mode: "cors",
                    body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva: "reservada"})
                });
                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                    await cargarDataAgenda();
                    return toast.success("Se ha ingresado correctamente el agendamiento");
                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada");
                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');
                }
            } else {
                return toast.error("Solo se permite agendar si es en el mismo dia");
            }
        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');
        }
    }

    const messages = useMemo(() => ({
        next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", noEventsInRange: "No hay eventos",
    }), []);

    useEffect(() => {
        if (!dataAgenda || dataAgenda.length === 0) { setEvents([]); return; }
        const eventosCalendario = dataAgenda.map((cita) => ({
            id_reserva: cita.id_reserva,
            title: cita.nombrePaciente + " " + cita.apellidoPaciente,
            start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio),
            end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion),
        }));
        setEvents(eventosCalendario);
    }, [dataAgenda]);

    const eventStyleGetter = () => ({
        style: {
            display: 'flex', alignItems: 'center', height: 'auto', minHeight: '28px', maxHeight: 'none',
            whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', lineHeight: '1.3',
            padding: '6px 8px', fontSize: '0.8rem', boxSizing: 'border-box', borderRadius: '6px',
            backgroundColor: '#0284c7', color: '#fff', fontWeight: '500', wordBreak: 'break-word',
        },
    });

    const EventComponent = ({event}) => (
        <div title={event.title} className="break-words text-[13px] leading-snug w-full" style={{whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word', hyphens: 'auto'}}>
            {event.title}
        </div>
    );

    const TitleOnlyEvent = ({event}) => (
        <div title={event.title} className="break-words text-[13px] leading-snug font-medium w-full" style={{whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word'}}>
            {event.title}
        </div>
    );

    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_reserva) {
                return toast.error("Debe llenar todos los campos para poder actualizar la reserva");
            }
            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva})
            });
            if (!res.ok) return toast.error("El servidor no responde");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                await cargarDataAgenda();
                return toast.success("Se ha actualizado la reserva correctamente");
            }
        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }

    async function seleccionarReservaEspecifica(id_reserva) {
        try {
            if (!id_reserva) return toast.error("Debe seleccionar una Reserva");
            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_reserva})
            });
            if (!res.ok) return toast.error("El servidor no responde");
            const data = await res.json();
            let reserva = Array.isArray(data) ? data[0] : data;
            if (!reserva) return toast.error("Sin Data");

            setNombrePaciente(reserva.nombrePaciente ?? "");
            setApellidoPaciente(reserva.apellidoPaciente ?? "");
            setRut(reserva.rut ?? "");
            setEmail(reserva.email ?? "");
            setTelefono(reserva.telefono ?? "");
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10));
            setHoraInicio(reserva.horaInicio ?? "");
            setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10));
            setHoraFinalizacion(reserva.horaFinalizacion ?? "");
            setEstadoReserva(reserva.estadoReserva ?? "");
        } catch (error) {
            console.log(error);
            return toast.error("El servidor no responde");
        }
    }

    useEffect(() => {
        if (id_reserva) seleccionarReservaEspecifica(id_reserva);
    }, [id_reserva]);

    function limpiarData() {
        setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Planificación</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Módulo de Agenda
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Gestiona reservas, revisa disponibilidad y actualiza datos en un solo lugar</p>
                    </div>
                    <InfoButton informacion={"En este apartado, usted puede ingresar pacientes de manera manual directamente en la agenda o sistema de citas. Además, es posible editar los datos de los pacientes ya registrados, permitiéndole mantener la información siempre actualizada y correcta.\n\nAsimismo, este módulo le permite bloquear períodos específicos de la agenda cuando no se encuentre disponible para atender.\nPara bloquear un período, solo debe seleccionar el rango horario que desea bloquear dentro del mismo día y luego presionar el botón \"Bloquear\". El sistema marcará automáticamente ese período como no disponible para nuevas citas.\n\nEsta funcionalidad le entrega un control total sobre la agenda, facilitando la organización de horarios, la gestión de pacientes y la administración de tiempos no disponibles."}/>
                </div>

                {/* Formulario + Fechas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Datos del paciente */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Datos del Paciente</h2>
                        </div>
                        <div className="p-5 md:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                                    <ShadcnInput value={nombrePaciente ?? ""} onChange={(e) => setNombrePaciente(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido</label>
                                    <ShadcnInput value={apellidoPaciente ?? ""} onChange={(e) => setApellidoPaciente(e.target.value)}/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">RUT</label>
                                <ShadcnInput
                                    value={rut}
                                    onChange={(e) => { const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); setRut(value); }}
                                    placeholder="12345678K (Sin puntos ni guion)"
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
                                    <ShadcnInput value={email ?? ""} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                                    <ShadcnInput value={telefono ?? ""} onChange={(e) => setTelefono(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fecha/hora + acciones */}
                    <div className="space-y-4">
                        {/* Inicio */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700">Inicio</h3>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Fecha y hora</span>
                            </div>
                            <div className="p-5 flex flex-col md:flex-row md:items-center md:gap-4">
                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraInicio}/>
                                </div>
                                <div className="mt-3 md:mt-0 bg-slate-50 border border-slate-100 rounded-lg p-3 w-full md:w-48">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Fecha</span>
                                        <span className="text-sm font-medium text-slate-800">{fechaInicio || "--"}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[11px] text-slate-400 uppercase">Hora</span>
                                        <span className="text-sm font-semibold text-emerald-600">{horaInicio || "--"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700">Final</h3>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Debe ser el mismo día</span>
                            </div>
                            <div className="p-5 flex flex-col md:flex-row md:items-center md:gap-4">
                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraFinalizacion}/>
                                </div>
                                <div className="mt-3 md:mt-0 bg-slate-50 border border-slate-100 rounded-lg p-3 w-full md:w-48">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Fecha</span>
                                        <span className="text-sm font-medium text-slate-800">{fechaFinalizacion || "--"}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[11px] text-slate-400 uppercase">Hora</span>
                                        <span className="text-sm font-semibold text-sky-600">{horaFinalizacion || "--"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <button
                                onClick={() => insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                </svg>
                                Agregar
                            </button>

                            <button
                                onClick={() => actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Actualizar
                            </button>

                            <button
                                onClick={() => limpiarData()}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Limpiar
                            </button>

                            <button
                                onClick={() => bloquearAgenda(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>
                                Bloquear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendario */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Calendario de Reservas</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-sky-600"></span>
                                <span className="text-xs text-slate-500">Reserva</span>
                            </div>
                            <span className="text-xs text-slate-400">Vista: <span className="font-medium text-slate-600 capitalize">{currentView}</span></span>
                        </div>
                    </div>
                    <div className="p-4 md:p-6 h-[700px]">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            eventPropGetter={eventStyleGetter}
                            components={{
                                event: EventComponent,
                                day: {event: TitleOnlyEvent},
                                agenda: {event: TitleOnlyEvent}
                            }}
                            startAccessor="start"
                            endAccessor="end"
                            messages={messages}
                            culture="es"
                            date={currentDate}
                            onNavigate={(nextDate) => setCurrentDate(nextDate)}
                            view={currentView}
                            onView={(nextView) => setCurrentView(nextView)}
                            defaultView="month"
                            style={{height: "100%"}}
                            selectable
                            onSelecting={(slot) => {
                                const start = slot.start ?? slot;
                                const end = slot.end ?? slot;
                                if (isOverlapping(start, end)) {
                                    toast.error('Horario no disponible (solapa con una reserva existente)');
                                    return false;
                                }
                                return true;
                            }}
                            onSelectEvent={(event) => {
                                if (!event?.id_reserva) { toast.error("No se encontró el ID de la reserva"); return; }
                                setid_reserva(event.id_reserva);
                                seleccionarReservaEspecifica(event.id_reserva);
                                toast.success(`Reserva: Numero # ${event.id_reserva}`);
                            }}
                            onSelectSlot={(slotInfo) => {
                                const start = slotInfo.start ?? slotInfo;
                                const end = slotInfo.end ?? slotInfo;
                                if (isOverlapping(start, end)) { toast.error('No puede seleccionar un horario que ya está ocupado'); return; }
                                const title = prompt("Título del evento");
                                if (!title) return;
                                setEvents((prev) => [...prev, {title, start: slotInfo.start, end: slotInfo.end}]);
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
