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

            /* Estilos para eventos en vista semana y dia */
            .rbc-time-view .rbc-event {
                padding: 4px 6px !important;
                line-height: 1.2 !important;
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
                z-index: 2 !important;
            }

            /* Forzar que el contenedor del evento en time view no corte */
            .rbc-time-view .rbc-event-content {
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                white-space: normal !important;
                word-break: break-word !important;
                line-height: 1.2 !important;
                font-size: 0.75rem !important;
            }

            /* Ocultar label de hora dentro del evento para ganar espacio */
            .rbc-time-view .rbc-event-label {
                display: none !important;
            }

            /* Que el slot del dia/semana permita overflow */
            .rbc-day-slot .rbc-events-container {
                margin-right: 0 !important;
            }

            .rbc-day-slot .rbc-event {
                overflow: visible !important;
            }

            /* Aumentar altura de las celdas del mes para que quepan los nombres */
            .rbc-month-view .rbc-day-slot {
                min-height: 80px !important;
            }

            /* Contenedor de eventos en mes */
            .rbc-row-segment {
                z-index: 1 !important;
            }

            /* Texto del evento global */
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
    const eventStyleGetter = (_event, _start, _end, _isSelected) => {
        return {
            style: {
                display: 'flex',
                alignItems: 'flex-start',
                minHeight: '24px',
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'clip',
                lineHeight: '1.2',
                padding: '4px 6px',
                fontSize: '0.75rem',
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
                className="break-words text-[12px] leading-tight font-medium w-full"
                style={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    lineHeight: '1.2',
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
                <div className="mb-6 flex flex-col gap-2">
                    <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-slate-900">Calendario General</h1>
                    <p className="text-sm text-slate-600">Revisa tus reservas y actividades.</p>
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
