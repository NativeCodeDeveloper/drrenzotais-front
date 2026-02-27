"use client";
import {useParams, useRouter} from "next/navigation";
import {useState,useEffect} from "react";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import {router} from "next/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {ShadcnInput} from "@/Componentes/shadcnInput";
import {subirImagenCloudflare} from "@/FuncionesTranversales/FuncionesCloudflare.js";


export default function SubSubCategoria(){
    const API = process.env.NEXT_PUBLIC_API_URL;
    const {id} = useParams(); // Este id corresponde a la subcategoría padre
    const router = useRouter();

    function irEspecificacion(id_subsubcategoria) {
        router.push(`/dashboard/EspecificacionProductos/${id_subsubcategoria}`);
    }

    // Estados para la subcategoría padre
    const [nombreSubcategoriaPadre, setNombreSubcategoriaPadre] = useState("");

    // Estados para las subsubcategorías
    const [listaSubSubCategorias, setListaSubSubCategorias] = useState([]);
    const [nombreSubSubCategoria, setNombreSubSubCategoria] = useState("");
    const [idSubSubCategoriaSeleccionada, setIdSubSubCategoriaSeleccionada] = useState(0);
    const [imagenReferencial, setImagenReferencial] = useState(null);
    const [previzualizacion, setprevizualizacion] = useState('')


    // FUNCION PARA SELECCIONAR SUBCATEGORIA PADRE ESPECIFICA
    async function obtenerSubcategoriaPadre(id_subcategoria) {
        try {
            if (!id_subcategoria) {
                console.error({ message: "Id de subcategoría no proporcionado" });
                return null;
            }
            const res = await fetch(`${API}/subcategorias/seleccionarSubCategoriaid`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({id_subcategoria})
            })
            if (!res.ok) {
                return toast.error('No fue posible seleccionar la subcategoría, contacte a soporte de NativeCode');
            }
            const data = await res.json();
            const subcategoria = Array.isArray(data) ? data[0] : data;
            if (subcategoria) {
                setNombreSubcategoriaPadre(subcategoria.descripcionCategoria);
            }
            return toast.success('Subcategoría cargada correctamente')
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (id) {
            obtenerSubcategoriaPadre(id)
        }
    }, [id]);


    // FUNCION PARA LISTAR SUBSUBCATEGORIAS POR ID DE SUBCATEGORIA
    async function listarSubSubCategorias(id_subcategoria) {
        try {
            if (!id_subcategoria) {
                return toast.error("Debe seleccionar al menos una subcategoría para listar las sub-subcategorías.");
            }
            const res = await fetch(`${API}/subsubcategorias/seleccionarPorSubSubCategoriaPorIdSubCategoria`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({id_subcategoria})
            })
            if (!res.ok) {
                return toast.error("Ha ocurrido un error con el servidor, contacte a soporte de NativeCode");
            } else {
                const resultadoData = await res.json();
                if (resultadoData.length > 0) {
                    setListaSubSubCategorias(resultadoData);
                } else {
                    setListaSubSubCategorias([]);
                }
            }
        } catch (e) {
            return toast.error('No se han podido listar las sub-subcategorías, contacte a soporte de NativeCode')
        }
    }

    useEffect(() => {
        if (id) {
            listarSubSubCategorias(id)
        }
    }, [id]);


    // FUNCION PARA INSERTAR SUBSUBCATEGORIA
    async function insertarSubSubCategoria(descripcionSubSubCategoria, imagenReferencial, id_subcategoria) {

        try {
            if (!id_subcategoria || !descripcionSubSubCategoria || descripcionSubSubCategoria === "") {
                return toast.error('Debe haber seleccionado al menos una subcategoría y escribir el nombre de la sub-subcategoría')
            }

            const res = await fetch(`${API}/subsubcategorias/insertarSubSubCategoria`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({descripcionSubSubCategoria,imagenReferencial, id_subcategoria}),
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                console.error("Backend insertarSubSubCategoria no ok:", txt);
                return toast.error('Ha ocurrido un error, intente más tarde');

            } else {

                const resultadoBackend = await res.json();

                if (resultadoBackend.message === "true") {
                    await listarSubSubCategorias(id)
                    setNombreSubSubCategoria("");
                    setImagenReferencial(null)

                    return toast.success('Sub-subcategoría ingresada correctamente')
                } else if (resultadoBackend.message === "sindata") {
                    return toast.error('Debe seleccionar al menos una subcategoría y no debe quedar el campo vacío');
                } else {
                    return toast.error('Ha ocurrido un problema, contacte a soporte');
                }
            }
        } catch (e) {
            return toast.error('Ha ocurrido un error, contacte a soporte de NativeCode')
        }
    }


    // FUNCION PARA SELECCIONAR UNA SUBSUBCATEGORIA PARA EDICION
    async function seleccionarSubSubCategoria(id_subsubcategoria) {
        try {
            if (!id_subsubcategoria) {
                return toast.error('Debe seleccionar una sub-subcategoría para poder acceder a la edición.');
            }

            const res = await fetch(`${API}/subsubcategorias/seleccionarPorSubSubCategoria`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({id_subsubcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un error, contacte a soporte de NativeCode')
            } else {
                const resultadoData = await res.json();
                const subsubcategoria = Array.isArray(resultadoData) ? resultadoData[0] : resultadoData;

                if (subsubcategoria) {
                    setNombreSubSubCategoria(subsubcategoria.descripcionSubSubCategoria);
                    setIdSubSubCategoriaSeleccionada(subsubcategoria.id_subsubcategoria);
                    setImagenReferencial(subsubcategoria.imagenReferencial);
                    return toast.success('Sub-subcategoría seleccionada!')
                }
            }
        } catch (e) {
            return toast.error('Ha ocurrido un problema en el servidor, contacte a soporte de NativeCode')
        }
    }


    // FUNCION PARA ELIMINAR SUBSUBCATEGORIA
    async function eliminarSubSubCategoria(id_subsubcategoria) {
        try {
            if (!id_subsubcategoria) {
                return toast.error('Debe seleccionar una sub-subcategoría para poder eliminarla.');
            }

            const res = await fetch(`${API}/subsubcategorias/eliminarSubSubCategoria`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({id_subsubcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un error al eliminar la sub-subcategoría, contacte a soporte de NativeCode')
            } else {
                const resultadoBackend = await res.json();

                if (resultadoBackend.message === "true") {
                    await listarSubSubCategorias(id);
                    limpiarFormulario();
                    return toast.success('Sub-subcategoría eliminada!')
                } else if (resultadoBackend.message === "false") {
                    return toast.error('No se ha podido eliminar la sub-subcategoría, contacte a soporte de NativeCode');
                } else {
                    return toast.error('Ha ocurrido un error, contacte a soporte de NativeCode');
                }
            }
        } catch (e) {
            return toast.error('Ha ocurrido un problema en el servidor, contacte a soporte de NativeCode')
        }
    }


    // FUNCION PARA LIMPIAR FORMULARIO
    function limpiarFormulario() {
        setNombreSubSubCategoria("")
        setIdSubSubCategoriaSeleccionada(0)
        setImagenReferencial(null)
    }


    // FUNCION PARA ACTUALIZAR SUBSUBCATEGORIA
    async function actualizarSubSubCategoria(descripcionSubSubCategoria,imagenReferencial, id_subsubcategoria) {
        try {
            if (!descripcionSubSubCategoria || !id_subsubcategoria || !imagenReferencial) {
                return toast.error('Debe completar todos los campos para actualizar la información (No es posible ingresar campos sin datos).')
            }

            const res = await fetch(`${API}/subsubcategorias/actualizarSubSubCategoria`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({descripcionSubSubCategoria,imagenReferencial, id_subsubcategoria})
            })

            if (!res.ok) {
                return toast.error('Ha ocurrido un problema interno, contacte a soporte de NativeCode');

            } else {

                const resultadoBackend = await res.json();
                if (resultadoBackend.message === "true") {
                    await listarSubSubCategorias(id);
                    setImagenReferencial(null);
                    limpiarFormulario();
                    return toast.success('Sub-subcategoría actualizada!')

                } else if (resultadoBackend.message === "false") {
                    return toast.error('No fue posible actualizar la sub-subcategoría')

                } else {
                    return toast.error('No fue posible actualizar la sub-subcategoría, contacte a soporte de NativeCode')
                }
            }
        } catch (e) {
            return toast.error('Ha ocurrido un problema interno, contacte a soporte de NativeCode')
        }
    }


    useEffect(() => {
        // Si no hay imagen, limpiamos la previsualización
        if (!imagenReferencial) {
            setprevizualizacion(null);
            return;
        }

        // Si ya viene como string (ID de Cloudflare o URL), construimos la URL completa
        if (typeof imagenReferencial === "string") {
            const esUrl = imagenReferencial.startsWith("http");
            setprevizualizacion(
                esUrl
                    ? imagenReferencial
                    : `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${imagenReferencial}/card`
            );
            return;
        }

        // Si viene como FileList/Array, tomamos el primer archivo
        const posibleArchivo =
            imagenReferencial instanceof File || imagenReferencial instanceof Blob
                ? imagenReferencial
                : imagenReferencial?.[0];

        // createObjectURL solo acepta Blob/File
        if (!(posibleArchivo instanceof Blob)) {
            setprevizualizacion(null);
            return;
        }

        const urlTemporal = URL.createObjectURL(posibleArchivo);
        setprevizualizacion(urlTemporal);

        return () => URL.revokeObjectURL(urlTemporal);
    }, [imagenReferencial]);


    async function insertarSubCategoriaConImagen(descripcion, imagenReferencial, id) {
        try {
            if (!imagenReferencial || !descripcion || !id) {
                return toast.error('Debe seleccionar una imagen de referencia para la sub-subcategoría');
            }

            const imagenCloudflareID = await subirImagenCloudflare(imagenReferencial);

            if (!imagenCloudflareID) {
                return toast.error('No fue posible obtener el ID de Cloudflare (imagen no subida)');
            }

            const descripcionSubSubCategoria = descripcion;
            const id_subcategoria = id;

            // Espera la inserción para que cualquier toast/error ocurra dentro del flujo
            return await insertarSubSubCategoria(descripcionSubSubCategoria, imagenCloudflareID, id_subcategoria);
        } catch (e) {
            console.error(e);
            return toast.error('Error subiendo imagen o insertando la sub-subcategoría');
        }
    }




    async function actualizarSubCategoriaConImagen(descripcion, imagenReferencial, id) {
        try {
            if (!imagenReferencial || !descripcion || !id) {
                return toast.error('Debe seleccionar una imagen de referencia para la sub-subcategoría');
            }

            const imagenCloudflareID = await subirImagenCloudflare(imagenReferencial);

            if (!imagenCloudflareID) {
                return toast.error('No fue posible obtener el ID de Cloudflare (imagen no subida)');
            }

            const descripcionSubSubCategoria = descripcion;
            const id_subcategoria = id;

            // Espera la inserción para que cualquier toast/error ocurra dentro del flujo
            return await actualizarSubSubCategoria(descripcionSubSubCategoria, imagenCloudflareID, id_subcategoria);
        } catch (e) {
            console.error(e);
            return toast.error('Error subiendo imagen o insertando la sub-subcategoría');
        }
    }



    return (
        <div className="min-h-screen bg-white">
            <ToasterClient/>

            <div className="mx-auto w-full max-w-6xl px-6 py-10">
                {/* Header */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                            Gestión de Sub-Subcategorías
                        </h1>
                        <p className="text-sm text-slate-600">
                            Subcategoría principal:
                            <span className="ml-2 font-semibold text-blue-700">{nombreSubcategoriaPadre}</span>
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-1">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Ingreso y edición
                                    <span className="ml-2 text-blue-700">(Sub-Subcategoría)</span>
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Sub-Subcategoría seleccionada:
                                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                                        {idSubSubCategoriaSeleccionada}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <label className="text-sm font-medium text-slate-700">Nombre de sub-subcategoría</label>
                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                                <ShadcnInput
                                    value={nombreSubSubCategoria}
                                    onChange={(e)=> setNombreSubSubCategoria(e.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                    placeholder="Ej: XS MUJER, M HOMBRE, etc."
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                Escribe el nombre y luego ingrésala o actualízala si ya está seleccionada.
                            </p>
                        </div>



                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Imagen */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">Imagen referencial</label>
                              <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                                  onChange={(e) => {
                                    const archivo = e.target.files?.[0];
                                    if (!archivo) {
                                      return;
                                    }
                                    setImagenReferencial(archivo);
                                  }}
                                />
                              </div>
                              <p className="text-xs leading-relaxed text-slate-500">
                                Selecciona una imagen de referencia para las sub-categorías que se mostrarán en el catálogo principal.
                              </p>
                            </div>

                            {/* Preview */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">Previsualización</label>
                              <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                                {previzualizacion ? (
                                  <img
                                    src={previzualizacion}
                                    alt="Previsualización"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <p className="px-4 text-center text-sm text-slate-500">
                                    No hay imagen seleccionada
                                  </p>
                                )}
                              </div>
                            </div>

                        </div>




                        <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <div className="w-full sm:w-auto">
                                    <ShadcnButton
                                        nombre={'Ingresar Sub-Subcategoría'}

                                    funcion={()=> insertarSubCategoriaConImagen(nombreSubSubCategoria,imagenReferencial, id)}

                                        className="w-full"
                                    />
                                </div>


                                <div className="w-full sm:w-auto">
                                    <ShadcnButton
                                        nombre={'Limpiar'}
                                        funcion={()=> limpiarFormulario()}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-auto">
                                {idSubSubCategoriaSeleccionada > 0 && (
                                    <ShadcnButton
                                        nombre={'Actualizar Sub-Subcategoría'}
                                        funcion={()=> actualizarSubCategoriaConImagen(nombreSubSubCategoria,imagenReferencial, idSubSubCategoriaSeleccionada)}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-slate-900">Sub-Subcategorías</h3>
                        <p className="text-sm text-slate-600">
                            Lista asociada a
                            <span className="ml-2 font-semibold text-blue-700">{nombreSubcategoriaPadre}</span>
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <Table>
                            <TableCaption className="caption-bottom bg-slate-50 py-3 text-sm text-slate-600">
                                Lista de Sub-Subcategorías asociadas a subcategoría
                                <span className='ml-2 font-bold text-blue-700'>{nombreSubcategoriaPadre}</span>
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="text-slate-700">Imagen Referencial</TableHead>
                                    <TableHead className="text-slate-700">Sub-Subcategoría</TableHead>
                                    <TableHead className="text-slate-700">Acciones</TableHead>
                                    <TableHead className="text-slate-700"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listaSubSubCategorias.length > 0 ? (
                                    listaSubSubCategorias.map((subsubcategoria) => (
                                        <TableRow
                                            key={subsubcategoria.id_subsubcategoria}
                                            className="transition-colors hover:bg-slate-50"
                                        >


                                            <TableCell className="font-medium text-slate-900">
                                                <img
                                                src={`https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${subsubcategoria.imagenReferencial}/mini`}
                                                alt='miniatura'
                                                className='h-20 w-20 object-cover rounded-lg'
                                                />
                                            </TableCell>


                                            <TableCell className="font-medium text-slate-900">
                                                {subsubcategoria.descripcionSubSubCategoria}
                                            </TableCell>

                                            <TableCell className="py-3">
                                                <ShadcnButton
                                                    nombre={'Seleccionar para Edición'}
                                                    funcion={()=> seleccionarSubSubCategoria(subsubcategoria.id_subsubcategoria)}
                                                />
                                            </TableCell>





                                            <TableCell className="py-3">
                                                <ShadcnButton
                                                    nombre={'Eliminar'}
                                                    funcion={()=> eliminarSubSubCategoria(subsubcategoria.id_subsubcategoria)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                                            No hay sub-subcategorías registradas para esta subcategoría
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}