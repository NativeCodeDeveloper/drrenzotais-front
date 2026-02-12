"use client"

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useState, useEffect} from "react";
import ToasterClients from "@/Componentes/ToasterClient";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnButton from "@/Componentes/shadcnButton2";
import {toast} from "react-hot-toast";
import * as React from "react"
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import {useRouter} from "next/navigation";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import {ClipboardDocumentListIcon} from "@heroicons/react/24/outline";
import {InfoButton} from "@/Componentes/InfoButton";


export default function FichaClinica() {

//PARAMETROS USESTATE PARA INSERCION DE DATOS EN PACIENTES
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaPacientes, setListaPacientes] = useState([]);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");


    //PARAMETRO PARA BUSCAR POR SIMILITUD DE NOMBRES
    const [nombreBuscado, setNombreBuscado] = useState("");


    //PARAMETRO PARA BUSCAR POR SIMILITUD DE RUT
    const [rutBuscado, setRutBuscado] = useState("");


    //PARAMETRO PARA LA NAVEGACION ENTRE COMPONENTES EL COMPONENTE LE POGO NOMBRE DE ROUTER
    const router = useRouter();


    //SE CREA UNA FUNCION PARA PODER NAVEGAR A LA RUTA DINAMICA POR ID DE CADA PACIENTE ( EN ESTE CASO USO LINK PERO EN CASO DE BOTON USAR ESTA FN
    function verDetallePaciente(id_paciente) {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }


    //FUNCION PARA ENCONTRAR PACIENTES POR SIMILITD DE RUT
    async function buscarRutSimilar(rutBuscado) {
        try {
            if (!rutBuscado) {
                toast.error("Debe ingresar previamente un RUT para buscar similitudes.")
            }

            let rut = rutBuscado;

            const res = await fetch(`${API}/pacientes/contieneRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({rut}),
                mode: "cors"
            })
            if (!res.ok) {
                return res.json();
            } else {
                const dataRutSimilar = await res.json()

                if (Array.isArray(dataRutSimilar) && dataRutSimilar.length > 0) {
                    setListaPacientes(dataRutSimilar)
                    return toast.success("Similitud encontrada!")
                } else {
                    return toast.error("No se han encontrado similitudes.")
                }

            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }


//FUNCION PARA BUSCAR POR SIMILITUD DE NOMBRES
    async function buscarNombreSimilar(nombreBuscado) {
        try {

            let nombre = nombreBuscado.trim();

            if (!nombreBuscado) {
                toast.error("Debe ingresar previamente un nombre para buscar similitudes.")
            }

            const res = await fetch(`${API}/pacientes/contieneNombre`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nombre}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return res.json();
            } else {

                const dataSimilar = await res.json();

                if (Array.isArray(dataSimilar) && dataSimilar.length > 0) {
                    setListaPacientes(dataSimilar);
                    return toast.success("Similitud encontrada!")
                } else {
                    return toast.error("No se han encontrado similitudes.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha habido un problema en el servidor por favor contacte a soporte de Medify");
        }

    }


//FUNCION PARA INSERTAR NUEVOS PACIENTES
    async function insertarPaciente(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais) {
        try {
            let prevision_id = null;

            if (prevision.includes("FONASA")) {
                prevision_id = 1;
            } else if (prevision.includes("ISAPRE")) {
                prevision_id = 2;
            } else {
                return toast.error("Debe seleccionar al menos una prevision")
            }

            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais) {
                return toast.error("Debe llenar todos los campos para ingresar un nuevo paciente en las bases de datos.")
            }

            const res = await fetch(`${API}/pacientes/pacientesInsercion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento,
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais
                }),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("Problema al Ingresar nuevo paciente en el servidor. Por favor contacte a soporte Tecnico de Medify")
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {

                    setNombre("");
                    setApellido("");
                    setRut("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setPais("");

                    return toast.success("Nuevo paciente ingresado con exito!");

                } else {
                    return toast.error("No se ha podido ingresar paciente. Intente mas tarde");
                }
            }
        } catch (err) {
            console.error(err);
            return toast.error("Problema al Ingresar nuevo paciente en el servidor. Por favor contacte a soporte Tecnico de Medify")

        }
    }


//FUNCION PARA LISTAR TODOS LOS PACIENTES INGRESADOS
    async function listarPacientes() {
        try {
            const res = await fetch(`${API}/pacientes`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("Ha ocurrido un error listando los pacientes . contacte a soporte IT de Medify")
            } else {
                const dataPacientes = await res.json()
                setListaPacientes(dataPacientes);
            }

        } catch (error) {
            console.log(error);
            return toast.success("Ha ocurrido un error contacte a soporte de Medify");

        }
    }

    useEffect(() => {
        listarPacientes();
    }, [])


    // OBJETO JS QUE SE LE PASA LA DATA ENCONTRADA EN LA PETICION HTTP AL BACKEND ( DE ACA SE LISTAN)
    const pacientesParaRenderizarEnTabla = listaPacientes;


    return (
        <div className='p-20'>
            <ToasterClients/>

            {/*PANTALLAS CELULARES*/}
            <div className="block md:hidden">
                <div>
                    <div className="flex">
                        <h1 className="text-sm font-semibold tracking-tight text-blue-700">Ficha Clínica del Paciente</h1>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-600">Busca al paciente para revisar su ficha clínica</p>

                    <div>
                        {/* Search card */}
                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-900">Búsqueda de pacientes</h3>

                            <div className="mt-3 grid grid-cols-1 gap-3">
                                <div className="w-full">
                                    <label className="text-[11px] font-medium text-slate-700">Buscar por similitud de
                                        Nombres</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <ShadcnInput
                                            placeholder="Ej: Nicolas Andres .."
                                            value={nombreBuscado}
                                            onChange={(e) => setNombreBuscado(e.target.value)}
                                        />
                                        <ShadcnButton
                                            nombre={"Buscar"}
                                            funcion={() => buscarNombreSimilar(nombreBuscado)}/>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="text-[11px] font-medium text-slate-700">Buscar por similitud de
                                        RUT</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <ShadcnInput
                                            value={rutBuscado}
                                            placeholder={"12.345.678-9"}
                                            onChange={(e) => setRutBuscado(e.target.value)}
                                        />
                                        <ShadcnButton
                                            nombre={"Buscar"}
                                            funcion={() => buscarRutSimilar(rutBuscado)}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table card */}
                        <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm overflow-x-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-900">Listado de Pacientes</h3>
                                <div className="text-[11px] text-slate-500">Total: <span
                                    className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-200/60">{pacientesParaRenderizarEnTabla.length}</span>
                                </div>
                            </div>
<br/>
                            <div className="mb-3 flex items-center justify-end">
                                <ShadcnButton nombre={"Mostrar Todos"} funcion={() => listarPacientes()}/>
                            </div>

                            <Table>
                                <TableCaption className="text-[11px] font-medium text-slate-500">Listado de Pacientes
                                    Ingresados</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[92px] text-left text-[11px] font-semibold text-slate-700">Ver Ficha</TableHead>
                                        <TableHead className="w-[92px] text-left text-[11px] font-semibold text-slate-700">Nombre</TableHead>
                                        <TableHead className="text-left text-[11px] font-semibold text-slate-700">Apellido</TableHead>
                                        <TableHead className="text-left text-[11px] font-semibold text-slate-700">RUT</TableHead>
                                        <TableHead className="text-right text-[11px] font-semibold text-slate-700">Telefono</TableHead>
                                        <TableHead className="text-right text-[11px] font-semibold text-slate-700">Correo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pacientesParaRenderizarEnTabla.map((paciente) => (
                                        <TableRow key={paciente.id_paciente} className="hover:bg-slate-50">
                                            <TableCell className="text-left text-xs font-medium text-slate-800">
                                                <button
                                                    onClick={() => verDetallePaciente(paciente.id_paciente)}
                                                >
                                                    <BookOpenIcon
                                                        className="h-5 w-5 text-sky-700 transition-colors hover:text-emerald-500"/>
                                                </button>
                                            </TableCell>
                                            <TableCell
                                                className="text-left text-xs font-semibold text-slate-900">{paciente.nombre}</TableCell>
                                            <TableCell
                                                className="text-left text-xs text-slate-600">{paciente.apellido}</TableCell>
                                            <TableCell className="text-left text-xs text-slate-600">{paciente.rut}</TableCell>
                                            <TableCell
                                                className="text-right text-xs text-slate-600">{paciente.telefono}</TableCell>
                                            <TableCell
                                                className="text-right text-xs text-slate-600">{paciente.correo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>


            {/*PANTALLAS ESCRITORIO*/}
            <div className="hidden md:block">
                <div>
                    <div className="flex">
                        <h1 className="text-5xl font-bold tracking-tight text-gray-700">Fichas Clinicas</h1>
                    </div>
                    <p className="text-sm text-slate-600">Busca al paciente para revisar su ficha clínica</p>
                   <div className='flex justify-end'>
                       <InfoButton informacion={'En esta sección podrá encontrar el listado completo de las fichas clínicas correspondientes a los pacientes que han sido ingresados al sistema.\n' +
                           '\n' +
                           'Es importante considerar que los pacientes que solo han sido agendados aún no cuentan con una ficha clínica abierta. Para que un paciente disponga de una ficha clínica activa, debe ser ingresado por primera vez a través del módulo Ingreso de Paciente.\n' +
                           '\n' +
                           'En el listado inferior, cada paciente dispone de un icono de cuaderno. Al seleccionar este icono, será redirigido a la información detallada del paciente, donde podrá visualizar y gestionar todas las fichas clínicas asociadas.\n'}/>
                   </div>
                    <br/>
                    <div className="">
                        {/* Search card */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-slate-900">Búsqueda de pacientes</h3>
                            <p className="mt-1 text-xs text-slate-500">Busca por nombre o RUT para evitar duplicados.</p>
                            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Buscar por similitud de
                                        Nombres</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <ShadcnInput
                                            placeholder="Ej: Nicolas Andres .."
                                            value={nombreBuscado}
                                            onChange={(e) => setNombreBuscado(e.target.value)}
                                        />
                                        <ShadcnButton
                                            nombre={"Buscar"}
                                            funcion={() => buscarNombreSimilar(nombreBuscado)}/>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-700">Buscar por similitud de
                                        RUT</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <ShadcnInput
                                            value={rutBuscado}
                                            placeholder={"12.345.678-9"}
                                            onChange={(e) => setRutBuscado(e.target.value)}
                                        />
                                        <ShadcnButton
                                            nombre={"Buscar"}
                                            funcion={() => buscarRutSimilar(rutBuscado)}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br/>
                        {/* Table card */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm overflow-x-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-slate-900">Listado de Pacientes</h3>
                                <div className="text-xs text-slate-500">Total: <span
                                    className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-200/60">{pacientesParaRenderizarEnTabla.length}</span>
                                </div>
                            </div>
                            <div className="mb-3 flex items-center justify-end">
                                <ShadcnButton nombre={"Mostrar Todos"} funcion={() => listarPacientes()}/>
                            </div>
                            <Table>
                                <TableCaption className="text-xs font-medium text-slate-500">Listado de Pacientes
                                    Ingresados</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px] text-left text-xs font-semibold text-slate-700">Ver Ficha</TableHead>
                                        <TableHead className="w-[120px] text-left text-xs font-semibold text-slate-700">Nombre</TableHead>
                                        <TableHead className="text-left text-xs font-semibold text-slate-700">Apellido</TableHead>
                                        <TableHead className="text-left text-xs font-semibold text-slate-700">RUT</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-slate-700">Telefono</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-slate-700">Correo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pacientesParaRenderizarEnTabla.map((paciente) => (
                                        <TableRow key={paciente.id_paciente} className="hover:bg-slate-50">
                                            <TableCell className="text-left text-sm font-medium text-slate-800">
                                                <button
                                                    onClick={() => verDetallePaciente(paciente.id_paciente)}
                                                >
                                                    <BookOpenIcon
                                                        className="h-5 w-5 text-sky-700 transition-colors hover:text-emerald-500"/>
                                                </button>
                                            </TableCell>
                                            <TableCell
                                                className="text-left text-sm font-semibold text-slate-900">{paciente.nombre}</TableCell>
                                            <TableCell
                                                className="text-left text-sm text-slate-600">{paciente.apellido}</TableCell>
                                            <TableCell className="text-left text-sm text-slate-600">{paciente.rut}</TableCell>
                                            <TableCell
                                                className="text-right text-sm text-slate-600">{paciente.telefono}</TableCell>
                                            <TableCell
                                                className="text-right text-sm text-slate-600">{paciente.correo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}