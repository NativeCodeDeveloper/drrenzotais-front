'use client'
import React, {useState, useEffect} from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {ButtonDinamic} from "@/Componentes/ButtonDinamic";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {SelectDinamic} from "@/Componentes/SelectDinamic";
import {InputTextDinamic} from "@/Componentes/InputTextDinamic";




export default function PresupuestoTratamiento() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaServicios, setListaServicios] = useState([]);
    const [listaPresupuesto, setListaPresupuesto] = useState([]);
    const [totalPresupuesto, setTotalPresupuesto] = useState(0);
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [nombreProfesional, setNombreProfesional] = useState("");
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [rutaPaciente, setRutaPaciente] = useState("");
    const [valorFinalDescuento, setValorFinalDescuento] = useState("");

    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    async function getProductosServicios() {
        try {
            const res = await fetch(`${API}/producto/seleccionarProducto`,{
                method:"GET",
                headers:{Accept:"application/json"},
                mode:'cors'
            });
            if (!res.ok) {
                return toast.error("No es posible cargar los productos/Servicios, contacte a soporte");
            }else{
                const dataBackend = await res.json();
                setListaServicios(dataBackend);
            }
        }catch (error) {
            return toast.error("No es posible cargar los productos/Servicios, contacte a soporte");
        }
    }
    useEffect(() => {
        getProductosServicios();
    },[])



    function generarPresupuesto(servicioCotizado) {
        setListaPresupuesto(servicioCotizadoPrev => [...servicioCotizadoPrev,servicioCotizado]);
        let valorPresupuesto = servicioCotizado.valorProducto;
        listaPresupuesto.forEach(element => {
            valorPresupuesto += element.valorProducto;
        })
        setTotalPresupuesto(valorPresupuesto);
    }

    function quitarDelPresupuesto(indexEliminar) {
        setListaPresupuesto(prev => {
            const nueva = prev.filter((_, i) => i !== indexEliminar);
            let total = 0;
            nueva.forEach(el => { total += el.valorProducto; });
            setTotalPresupuesto(total);
            return nueva;
        });
    }




    async function descargarPresupuestoPDF() {
        const doc = new jsPDF("p", "mm", "letter");
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 16;

        // --- Colores del tema elegante fondo blanco ---
        const dark = [24, 24, 27];       // zinc-900 (textos fuertes)
        const darkAlt = [244, 244, 245]; // zinc-100 (cajas sutiles)
        const gold = [212, 175, 55];     // dorado elegante
        const lightText = [39, 39, 42];  // zinc-800 (texto cuerpo)
        const mutedText = [113, 113, 122]; // zinc-500
        const white = [255, 255, 255];

        // --- Cargar logo ---
        try {
            const logoRes = await fetch("/dr1.png");
            const logoBuffer = await logoRes.arrayBuffer();
            const logoBytes = new Uint8Array(logoBuffer);
            let logoBinary = "";
            for (let i = 0; i < logoBytes.length; i++) {
                logoBinary += String.fromCharCode(logoBytes[i]);
            }
            const logoBase64 = btoa(logoBinary);
            doc.addImage(logoBase64, "PNG", margin, 10, 35, 35);
        } catch (e) {
            console.error("No se pudo cargar el logo:", e);
        }

        // --- Header: info al lado del logo ---
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...white);
        doc.text("Dr. Renzo Tais", margin + 42, 22);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...mutedText);
        doc.text("Medicina Estetica Regenerativa y No Invasiva", margin + 42, 28);

        doc.setFontSize(7.5);
        doc.setTextColor(...mutedText);
        doc.text("Luis Thayer Ojeda 0191, oficina 1205", margin + 42, 34);
        doc.text("(diagonal al Costanera Center)", margin + 42, 38);

        // --- Linea dorada separadora ---
        doc.setDrawColor(...gold);
        doc.setLineWidth(0.6);
        doc.line(margin, 50, pageW - margin, 50);

        // --- Titulo del documento ---
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gold);
        doc.text("PRESUPUESTO DE ATENCION", margin, 60);

        // --- Fecha y numero ---
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...mutedText);
        doc.text(`Fecha de emision: ${new Date().toLocaleDateString("es-CL")}`, margin, 67);
        doc.text(`N° ${String(Date.now()).slice(-6)}`, pageW - margin, 67, {align: "right"});

        // --- Caja datos paciente / profesional ---
        doc.setFillColor(...darkAlt);
        doc.roundedRect(margin, 72, pageW - margin * 2, 28, 3, 3, "F");

        const profesionalLabel = listaProfesionales.find(p => String(p.id_profesional) === String(nombreProfesional));
        const colLeft = margin + 6;
        const colRight = pageW / 2 + 6;

        doc.setFontSize(7.5);
        doc.setTextColor(...mutedText);
        doc.text("PROFESIONAL", colLeft, 80);
        doc.text("PACIENTE", colRight, 80);
        doc.text("RUT / DNI", colLeft, 91);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...lightText);
        doc.text(profesionalLabel?.nombreProfesional || "-", colLeft, 85);
        doc.text(nombrePaciente || "-", colRight, 85);
        doc.setFont("helvetica", "normal");
        doc.text(rutaPaciente || "-", colLeft, 96);

        // --- Tabla de servicios ---
        const columns = ["N°", "Servicio / Tratamiento", "Valor"];
        const rows = listaPresupuesto.map((servicio, i) => [
            String(i + 1),
            servicio.tituloProducto,
            formatoCLP.format(servicio.valorProducto)
        ]);

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 106,
            theme: "plain",
            headStyles: {
                fillColor: gold,
                textColor: dark,
                fontStyle: "bold",
                fontSize: 9,
                cellPadding: {top: 4, bottom: 4, left: 6, right: 6},
                halign: "left",
            },
            bodyStyles: {
                textColor: lightText,
                fontSize: 9,
                cellPadding: {top: 3.5, bottom: 3.5, left: 6, right: 6},
            },
            alternateRowStyles: {
                fillColor: darkAlt,
            },
            styles: {
                fillColor: white,
                lineColor: [228, 228, 231], // zinc-200
                lineWidth: 0.2,
            },
            columnStyles: {
                0: {cellWidth: 14, halign: "center"},
                2: {cellWidth: 40, halign: "right", fontStyle: "bold"},
            },
            margin: {left: margin, right: margin},
        });

        // --- Totales ---
        let finalY = doc.lastAutoTable.finalY + 6;

        // Caja de totales alineada a la derecha
        const totBoxW = 90;
        const totBoxX = pageW - margin - totBoxW;

        doc.setFillColor(...darkAlt);
        doc.roundedRect(totBoxX, finalY, totBoxW, valorFinalDescuento ? 36 : 22, 3, 3, "F");

        // Subtotal
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...mutedText);
        doc.text("Subtotal:", totBoxX + 6, finalY + 8);
        doc.setTextColor(...lightText);
        doc.text(formatoCLP.format(totalPresupuesto), totBoxX + totBoxW - 6, finalY + 8, {align: "right"});

        if (valorFinalDescuento) {
            // Descuento
            const descuento = totalPresupuesto - Number(valorFinalDescuento);
            const pctDesc = totalPresupuesto > 0 ? Math.round((descuento / totalPresupuesto) * 100) : 0;
            doc.setTextColor(...mutedText);
            doc.text(`Descuento (${pctDesc}%):`, totBoxX + 6, finalY + 16);
            doc.setTextColor(239, 68, 68); // red-500
            doc.text(`-${formatoCLP.format(descuento)}`, totBoxX + totBoxW - 6, finalY + 16, {align: "right"});

            // Linea separadora en caja
            doc.setDrawColor(...gold);
            doc.setLineWidth(0.4);
            doc.line(totBoxX + 6, finalY + 21, totBoxX + totBoxW - 6, finalY + 21);

            // Total final
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...gold);
            doc.text("TOTAL:", totBoxX + 6, finalY + 30);
            doc.text(formatoCLP.format(Number(valorFinalDescuento)), totBoxX + totBoxW - 6, finalY + 30, {align: "right"});

            finalY += 36;
        } else {
            // Linea separadora
            doc.setDrawColor(...gold);
            doc.setLineWidth(0.4);
            doc.line(totBoxX + 6, finalY + 12, totBoxX + totBoxW - 6, finalY + 12);

            // Total
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...gold);
            doc.text("TOTAL:", totBoxX + 6, finalY + 19);
            doc.text(formatoCLP.format(totalPresupuesto), totBoxX + totBoxW - 6, finalY + 19, {align: "right"});

            finalY += 22;
        }

        // --- Validez ---
        finalY += 12;
        doc.setFillColor(...darkAlt);
        doc.roundedRect(margin, finalY, pageW - margin * 2, 14, 2, 2, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gold);
        doc.text("Presupuesto de atencion valido por 15 dias habiles", pageW / 2, finalY + 9, {align: "center"});

        // --- Footer ---
        doc.setDrawColor(...gold);
        doc.setLineWidth(0.3);
        doc.line(margin, pageH - 18, pageW - margin, pageH - 18);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...mutedText);
        doc.text("Dr. Renzo Tais | Medicina Estetica Regenerativa y No Invasiva", pageW / 2, pageH - 13, {align: "center"});
        doc.text("Luis Thayer Ojeda 0191, oficina 1205 (diagonal al Costanera Center)", pageW / 2, pageH - 9, {align: "center"});

        doc.save("presupuesto-dr-renzo-tais.pdf");
    }






    async function seleccionarTodosProfesionales() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');

            }else{
                const respustaBackend = await res.json();

                if(respustaBackend){
                    setListaProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
                }
            }
        }catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodosProfesionales();
    }, []);




    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Administracion</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                        Presupuesto de Tratamiento
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Selecciona servicios para armar el presupuesto del paciente.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Presupuesto armado - columna izquierda */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
                                    </svg>
                                    <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Presupuesto</h2>
                                </div>
                                <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
                                    {listaPresupuesto.length}
                                </span>
                            </div>

                            <div className="p-4">
                                {listaPresupuesto.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                                        </svg>
                                        <p className="text-sm text-slate-500">Presupuesto vacio</p>
                                        <p className="text-xs text-slate-400 mt-1">Selecciona servicios de la tabla para agregarlos.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[24rem] overflow-y-auto pr-1">
                                        {listaPresupuesto.map((servicio, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3.5 py-3 hover:border-slate-200 hover:shadow-sm transition-all duration-150"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-800 truncate">{servicio.tituloProducto}</p>
                                                    <p className="text-xs text-sky-600 font-semibold">{formatoCLP.format(servicio.valorProducto)}</p>
                                                </div>
                                                <button
                                                    onClick={() => quitarDelPresupuesto(index)}
                                                    className="ml-3 flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all active:scale-95"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total</span>
                                <span className="text-xl font-bold text-slate-800">{formatoCLP.format(totalPresupuesto)}</span>
                            </div>

                            {/* Boton descargar PDF */}
                            <div className="px-5 py-3 border-t border-slate-100">
                                <button
                                    onClick={descargarPresupuestoPDF}
                                    disabled={listaPresupuesto.length === 0}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                    </svg>
                                    Descargar PDF
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Servicios disponibles - columna derecha */}
                    <div className="lg:col-span-3">

                        {/* Datos del profesional y paciente */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                                </svg>
                                <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Datos del Presupuesto</h2>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Profesional</label>
                                    <SelectDinamic
                                        value={nombreProfesional}
                                        onChange={(e) => setNombreProfesional(e.target.value)}
                                        options={listaProfesionales.map(profesional => ({
                                            value: profesional.id_profesional,
                                            label: profesional.nombreProfesional
                                        }))}
                                        placeholder="Selecciona un profesional"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo del paciente</label>
                                        <InputTextDinamic
                                            value={nombrePaciente}
                                            onChange={(e) => setNombrePaciente(e.target.value)}
                                            placeholder="Ej: Andrea Varela Garrido"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">RUT / DNI</label>
                                        <InputTextDinamic
                                            value={rutaPaciente}
                                            onChange={(e) => setRutaPaciente(e.target.value)}
                                            placeholder="Ej: 12345678-9"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Valor final con descuento <span className="text-xs text-slate-400 font-normal">(opcional)</span></label>
                                    <div className="relative">
                                        <span className=" absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium"></span>
                                        <input
                                            type="number"
                                            value={valorFinalDescuento}
                                            onChange={(e) => setValorFinalDescuento(e.target.value)}
                                            placeholder="Ingrese el monto final si aplica descuento"
                                            className="w-full p-2 rounded-lg border border-slate-200 bg-white pl-7 pr-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400 transition"
                                        />
                                    </div>
                                    {valorFinalDescuento && totalPresupuesto > 0 && (
                                        <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                                            Descuento aplicado: {formatoCLP.format(totalPresupuesto - Number(valorFinalDescuento))} ({Math.round(((totalPresupuesto - Number(valorFinalDescuento)) / totalPresupuesto) * 100)}%)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabla de servicios */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                                    </svg>
                                    <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Servicios Disponibles</h2>
                                </div>
                                <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
                                    {listaServicios.length}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                
                                <Table>
                                    <TableCaption className="font-medium text-slate-400 text-xs py-4">Selecciona un servicio para agregarlo al presupuesto</TableCaption>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-600 hover:to-cyan-500">
                                            <TableHead className="text-left font-semibold text-white text-xs uppercase tracking-wider px-4 py-3">Servicio</TableHead>
                                            <TableHead className="text-right font-semibold text-white text-xs uppercase tracking-wider px-4 py-3">Valor</TableHead>
                                            <TableHead className="text-center font-semibold text-white text-xs uppercase tracking-wider px-4 py-3 w-[120px]">Accion</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listaServicios.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-10 text-sm text-slate-400">
                                                    Cargando servicios...
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            listaServicios.map((servicio, index) => (
                                                <TableRow
                                                    key={index}
                                                    className={"hover:bg-sky-50/50 transition-colors duration-100 " + (index % 2 === 0 ? "bg-white" : "bg-slate-50/50")}
                                                >
                                                    <TableCell className="font-medium text-slate-800 text-sm px-4 py-3">{servicio.tituloProducto}</TableCell>
                                                    <TableCell className="text-right text-slate-600 text-sm px-4 py-3 font-mono">{formatoCLP.format(servicio.valorProducto)}</TableCell>
                                                    <TableCell className="text-center px-4 py-3">
                                                        <button
                                                            onClick={() => generarPresupuesto(servicio)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-sm active:scale-[0.98]"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                                            </svg>
                                                            Agregar
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
