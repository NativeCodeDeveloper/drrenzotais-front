"use client";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import MediaCardImage from "@/Componentes/MediaCardImage";
import {InfoButton} from "@/Componentes/InfoButton";


export default function Dashboard() {

    // USESTATES DE REACT PARA EL CAMBIO DE ESTADOS CON HOOKS
    const [tituloProducto, settituloProducto] = useState("");
    const [descripcionProducto, setdescripcionProducto] = useState("");
    const [imagenProducto, setimagenProducto] = useState("");
    const [imagenProductoSegunda, setImagenProductoSegunda] = useState("");
    const [imagenProductoTercera, setImagenProductoTercera] = useState("");
    const [imagenProductoCuarta, setImagenProductoCuarta] = useState("");
    const [valorProducto, setvalorProducto] = useState(""); // URL final
    const [file, setFile] = useState(null); // archivo local
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setproductoSeleccionado] = useState(null);
    const [listadoCategorias, setlistadoCategorias] = useState([]);
    const [categoriaProducto, setcategoriaProducto] = useState("");
    const [categoriaProductoSeleccion, setcategoriaProductoSeleccion] = useState("");
    const [tituloSimilar, settituloSimilar] = useState("");
    const [listaSubcategorias, setlistaSubcategorias] = useState([]);
    const [listaSubSubCategorias, setlistaSubSubCategorias] = useState([]);
    const [valor_previo, setvalor_previo] = useState("");
    const [subcategorias, setsubcategorias] = useState("");
    const [subsubcategorias, setsubsubcategorias] = useState("");


    // Previews locales para mostrar las imágenes seleccionadas (no mostrar URLs en inputs)
    const [preview1, setPreview1] = useState("");
    const [preview2, setPreview2] = useState("");
    const [preview3, setPreview3] = useState("");
    const [preview4, setPreview4] = useState("");

    // Orden obligatorio de subida: 1 -> 2 -> 3 -> 4
    // Se habilita la siguiente imagen solo si la anterior ya existe (archivo nuevo o imagen ya guardada)
    const canUpload2 = Boolean(file || imagenProducto);
    const canUpload3 = canUpload2 && Boolean(file2 || imagenProductoSegunda);
    const canUpload4 = canUpload3 && Boolean(file3 || imagenProductoTercera);


    //LLAMADA A HASH DE CLOUDFLARE
    const CLOUDFLARE_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_HASH;
    const VARIANT_CARD = 'card';
    const VARIANT_FULL = 'full';
    const VARIANT_MINI = 'mini';

    // Utilidad para construir la URL de entrega de Cloudflare
    function cfToSrc(imageId, variant = VARIANT_FULL) {
        if (!imageId) return "";
        return `https://imagedelivery.net/${CLOUDFLARE_HASH}/${imageId}/${variant}`;
    }

    // --- Validación/compresión de imágenes antes de subir ---
    const MAX_IMG_DIMENSION = 1600; // px (ancho o alto)
    const MAX_IMG_BYTES_BEFORE_COMPRESS = 1600 * 1024; // ~1.6 MB



    async function seleccionarEspecificacionesProductos(numero_id_subsubcategoria){
        let id_subsubcategoria = Number(numero_id_subsubcategoria);
        try {

            const res = await fetch(`${API}/especificacionProducto/seleccionarEspecificacionPorSubSubCategoria`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_subsubcategoria}),
                mode: "cors"
            })

            if (!res.ok){
                console.error("Error en respuesta:", res.status);
                return toast.error("Ha ocurrido un error en servidor contacte a soporte TI de NativeCode")

            }else{

                const dataBackend = await res.json();
                if (dataBackend) {
                    setlistaEspecificacionesProducto(dataBackend);
                } else {
                    setlistaEspecificacionesProducto([]);
                }
            }

        }catch (error) {
            console.error("Error en seleccionarEspecificacionesProductos:", error);
            return toast.error("Ha ocurrido un error en servidor contacte a soporte TI de NativeCode")

        }
    }


    function getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            try {
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    const w = img.naturalWidth || img.width;
                    const h = img.naturalHeight || img.height;
                    URL.revokeObjectURL(url);
                    resolve({ width: w, height: h });
                };
                img.onerror = (e) => {
                    URL.revokeObjectURL(url);
                    reject(e);
                };
                img.src = url;
            } catch (e) {
                reject(e);
            }
        });
    }

    async function compressIfNeeded(file) {
        // Solo comprimimos por tamaño (bytes). Si excede dimensiones, se bloquea.
        if (!file || file.size <= MAX_IMG_BYTES_BEFORE_COMPRESS) return file;

        const url = URL.createObjectURL(file);
        const img = new Image();

        const loaded = await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

        // eslint-disable-next-line no-unused-vars
        const _ = loaded;

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        // Mantener dimensiones, solo bajar peso (calidad)
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(url);

        const blob = await new Promise((resolve) => {
            // JPEG para comprimir; si falla, vuelve a PNG
            canvas.toBlob(
                (b) => resolve(b),
                "image/jpeg",
                0.82
            );
        });

        if (!blob) return file;

        const compressedFile = new File([blob], file.name.replace(/\.(png|jpg|jpeg|webp)$/i, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
        });

        return compressedFile;
    }

    async function handleSelectImage(e, setter) {
        const f = e.target.files?.[0] || null;
        if (!f) {
            setter(null);
            return;
        }

        try {
            const { width, height } = await getImageDimensions(f);
            const maxSide = Math.max(width, height);

            // Regla solicitada: bloquear si excede 1600px de ancho o alto
            if (maxSide > MAX_IMG_DIMENSION) {
                toast.success(`No es posible subir una imagen con dimensiones mayores a ${MAX_IMG_DIMENSION}px (actual: ${width}x${height}).`);
                // limpiar input y estado
                e.target.value = "";
                setter(null);
                return;
            }

            // Regla extra: si pesa mucho (>1.6MB), comprimimos
            const maybeCompressed = await compressIfNeeded(f);
            setter(maybeCompressed);
        } catch (err) {
            console.error("No se pudo leer la imagen:", err);
            toast.error("No fue posible leer la imagen seleccionada");
            e.target.value = "";
            setter(null);
        }
    }





    async function listarSubSubcategorias(id_subcategoria) {
        try {
            const res = await fetch(`${API}/subsubcategorias/seleccionarPorSubSubCategoriaPorIdSubCategoria`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_subcategoria}),
                mode: "cors"
            })

            if(!res.ok){
                return;
            }

            const dataSubSubcategoria = await res.json();
            if (Array.isArray(dataSubSubcategoria)){
                setlistaSubSubCategorias(dataSubSubcategoria);
            }else {
                setlistaSubSubCategorias([])
            }


        }catch (e) {
            return toast.error('No ha sido posible listar las subcategorias contacte  a soporte de NativeCode: ERROR :' + e);
        }
    }


    useEffect(() => {
        if (subcategorias) {
            listarSubSubcategorias(subcategorias);
        } else {
            setlistaSubSubCategorias([]);
        }
        // Limpiar subsubcategoria y especificación cuando cambia la subcategoria
        setsubsubcategorias("");
    },[subcategorias])








    async function listarSubcategorias(id_categoriaProducto) {
        try {
            const res = await fetch(`${API}/subcategorias/seleccionarPorCategoria`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({id_categoriaProducto}),
                mode: "cors"
            })

            if(!res.ok){
                return;
            }

                const dataSubcategoria = await res.json();
                setlistaSubcategorias(dataSubcategoria);

        }catch (e) {
            return toast.error('No ha sido posible listar las subcategorias contacte  a soporte de NativeCode: ERROR :' + e);
        }
}

useEffect(() => {
    if (categoriaProducto) {
        listarSubcategorias(categoriaProducto);
    } else {
        setlistaSubcategorias([]);
    }
    // Limpiar subcategoria, subsubcategoria y especificación cuando cambia la categoria
    setsubcategorias("");
    setsubsubcategorias("");
    setlistaSubSubCategorias([]);
},[categoriaProducto])


    //FUNCION PARA BUSCAR POR SIMILITUDES DE NOMBRE DE TITULO DE PRODUCTOS
    async function buscarSimilar(tituloSimilar) {
        let tituloProducto = tituloSimilar;

        try {
            const res = await fetch(`${API}/producto/buscarSimilar`,{
                method: "POST",
                headers:{Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({tituloProducto})
            });

            if(!res.ok) {
                return  toast.error("No se ha podido generar la busqueda por similitid contacte a soporte informatico");
            }

            const dataProductosSimilares = await res.json();
            toast.success('Similitud encontrada!')
            setProductos(dataProductosSimilares);

        }catch(err) {
            console.log(err);
            return toast.error('Ha ocurrido un problema al filtrar por similitud de nombre contacte a soporte informatico : ' + err.message);
        }
    }





    //FUNCION PARA FILTRAR PRODUCTOS SEGUN CATEGORIA
    async function filtrarPorCategoria(categoriaProductoSeleccion) {

        let categoriaProducto = categoriaProductoSeleccion;

        try {
            if(!categoriaProducto){
                alert("Seleccione un categoria");
                return;
            }
            const res = await fetch(`${API}/producto/categoriaProducto`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({categoriaProducto})
            })
            if (!res.ok){
                alert("Problema al filtrar categorias contacte a Soporte de NativeCode.cl");
                return;
            }
            const dataFiltrada = await res.json();
            setProductos(dataFiltrada);
        }catch (error) {
            console.log(error);
        }
    }


    // Actualizar previews cuando cambian los archivos o las URLs remotas
    useEffect(() => {
        let obj;
        if (file) {
            obj = URL.createObjectURL(file);
            setPreview1(obj);
        } else {
            setPreview1(cfToSrc(imagenProducto) || "");
        }
        return () => { if (obj) URL.revokeObjectURL(obj); };
    }, [file, imagenProducto]);

    useEffect(() => {
        let obj;
        if (file2) {
            obj = URL.createObjectURL(file2);
            setPreview2(obj);
        } else {
            setPreview2(cfToSrc(imagenProductoSegunda) || "");
        }
        return () => { if (obj) URL.revokeObjectURL(obj); };
    }, [file2, imagenProductoSegunda]);

    useEffect(() => {
        let obj;
        if (file3) {
            obj = URL.createObjectURL(file3);
            setPreview3(obj);
        } else {
            setPreview3(cfToSrc(imagenProductoTercera) || "");
        }
        return () => { if (obj) URL.revokeObjectURL(obj); };
    }, [file3, imagenProductoTercera]);

    useEffect(() => {
        let obj;
        if (file4) {
            obj = URL.createObjectURL(file4);
            setPreview4(obj);
        } else {
            setPreview4(cfToSrc(imagenProductoCuarta) || "");
        }
        return () => { if (obj) URL.revokeObjectURL(obj); };
    }, [file4, imagenProductoCuarta]);

    // API INTERNA PARA HACER LOS FETH DIRECTO AL BACKEND NO USAR http://localhost:3001 PORQUE COMPLICA EL DESPLIEGUE EN LA NUBE
    const API = process.env.NEXT_PUBLIC_API_URL;



    async function marcarOfertaProductos(id_producto) {
        try {
            const res = await fetch(`${API}/producto/marcarOferta`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_producto})
            })
            const out = await res.json();
            if(!res.ok) {
                toast.error("No se ha podido generar la oferta");
                console.error('marcarOferta error', out);
                return out;
            }
            if (out.message === "ok") {
                toast.success("Se ha marcado el producto seleccionado como oferta");
                return out;
            } else {
                toast.error("No se ha podido generar la oferta");
                return out;
            }
        }catch(error) {
            console.log(error);
            toast.error("Error al marcar oferta");
        }
    }


    async function marcarProductoNormal(id_producto) {
        try {
            const res = await fetch(`${API}/producto/marcarNormal`,{
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_producto})
            })
            const out = await res.json();
            if(!res.ok) {
                toast.error("No se ha podido marcar como normal");
                console.error('marcarNormal error', out);
                return out;
            }
            if (out.message === "ok") {
                toast.success("Producto marcado sin Oferta");
                return out;
            }else {
                toast.error("No se ha podido actualizar el estado del producto");
                return out;
            }
        }catch(error) {
            console.log(error);
            toast.error("Error al marcar producto");
        }
    }



    // FUNCION PARA LLAMAR LISTA DE CATEGORIAS
    async function listarCategorias() {
        try {

            const res = await fetch(`${API}/categorias/seleccionarCategoria`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors",
                cache: "no-store",
            })
            if(!res.ok) {
                console.error('Problemas en la categoria');
            }
            const data = await res.json();
            setlistadoCategorias(data);

        }catch (error) {
            console.error("Problema al cargar categoria / Error proveniente de fronend ingreso de productos");
        }
    }

    useEffect(() => {
        listarCategorias();
    }, []);


    //FUNCION PARA ACTUALIZAR PRODUCTO
    async function actualizarProducto(tituloProducto, descripcionProducto, valorProducto, valor_previo, categoriaProducto,subcategorias, subsubcategoria, imagenProducto, imagenProductoSegunda, imagenProductoTercera, imagenProductoCuarta, id_producto) {
        try {
            if (
                !tituloProducto ||
                !descripcionProducto ||
                !valorProducto ||
                !valor_previo ||
                !categoriaProducto ||
                !subcategorias ||
                !subsubcategoria ||
                !imagenProducto||
                !id_producto
            ) {
                return toast.error("Faltan Datos Obligatorios ❌ ");
            }
            const res = await fetch(`${API}/producto/actualizarProducto`, {
                method: 'POST',
                headers: { Accept: "application/json",
                    'Content-Type': 'application/json' },
                mode: "cors",
                body: JSON.stringify({
                    tituloProducto,
                    descripcionProducto,
                    valorProducto,
                    valor_previo,
                    categoriaProducto,
                    subcategoria: subcategorias,
                    subsubcategoria: subsubcategoria,
                    imagenProducto,
                    imagenProductoSegunda,
                    imagenProductoTercera,
                    imagenProductoCuarta,
                    especificacionProducto : 1,
                    id_producto,
                })
            })

            if (!res.ok) {
                return toast.error("No fue posible actualizar el producto contacte a soporte informatico de NativeCode.cl REEWSSSK");
            }

            const resultado = await res.json();

            if (resultado.message === "ok") {
                return toast.success("Producto actualizado correctamente ✅");
            }

        } catch (error) {
            console.error("problema al actualizar producto:", error)
            return toast.error("No fue posible actualizar el producto contacte a soporte informatico de NativeCode.cl");

        }
    }

    // --- NUEVA FUNCION: handleActualizar ---
    // Esta función sube sólo los archivos nuevos a Cloudflare y conserva las URLs existentes
    async function handleActualizar() {
        if (!productoSeleccionado) {
            toast.error('No hay producto seleccionado para actualizar');
            return;
        }

        setSubiendo(true);

        try {
            // Empezamos por tomar los valores actuales (pueden ser URLs existentes)
            let finalImage1 = imagenProducto || productoSeleccionado.imagenProducto || "";
            let finalImage2 = imagenProductoSegunda || productoSeleccionado.imagenProductoSegunda || "";
            let finalImage3 = imagenProductoTercera || productoSeleccionado.imagenProductoTercera || "";
            let finalImage4 = imagenProductoCuarta || productoSeleccionado.imagenProductoCuarta || "";

            // Si hay archivos nuevos, subimos y reemplazamos
            if (file) {
                try {
                    finalImage1 = await uploadToCloudflare(file);
                    setimagenProducto(finalImage1);
                } catch (err) {
                    console.error('Error subiendo imagen 1:', err);
                    toast.error('Error subiendo la imagen 1');
                }
            }
            if (file2) {
                try {
                    finalImage2 = await uploadToCloudflare(file2);
                    setImagenProductoSegunda(finalImage2);
                } catch (err) {
                    console.error('Error subiendo imagen 2:', err);
                    toast.error('Error subiendo la imagen 2');
                }
            }
            if (file3) {
                try {
                    finalImage3 = await uploadToCloudflare(file3);
                    setImagenProductoTercera(finalImage3);
                } catch (err) {
                    console.error('Error subiendo imagen 3:', err);
                    toast.error('Error subiendo la imagen 3');
                }
            }
            if (file4) {
                try {
                    finalImage4 = await uploadToCloudflare(file4);
                    setImagenProductoCuarta(finalImage4);
                } catch (err) {
                    console.error('Error subiendo imagen 4:', err);
                    toast.error('Error subiendo la imagen 4');
                }
            }

            // Llamamos a la funcion existente para actualizar el producto en el backend
            await actualizarProducto(
                tituloProducto,
                descripcionProducto,
                valorProducto,
                valor_previo,
                categoriaProducto,
                subcategorias,
                subsubcategorias,
                finalImage1,
                finalImage2,
                finalImage3,
                finalImage4,
                productoSeleccionado.id_producto
            );

            // Refrescar lista y limpiar estados mínimos si hace falta
            await cargarProductos();

        } catch (error) {
            console.error('Error en handleActualizar:', error);
            return toast.error('No fue posible actualizar las imágenes');
        } finally {
            setSubiendo(false);
        }
    }

    // Nueva función: limpia todos los campos del formulario (texto, imágenes, archivos y previews)
    function limpiarFormulario() {
        // Deselecciona el producto actual y limpia los campos del formulario
        setproductoSeleccionado(null);
        settituloProducto("");
        setdescripcionProducto("");
        setvalorProducto("");
        setvalor_previo("");
        setcategoriaProducto("");
        setsubcategorias("");
        setsubsubcategorias("");

        // Limpiar URLs y archivos
        setimagenProducto("");
        setImagenProductoSegunda("");
        setImagenProductoTercera("");
        setImagenProductoCuarta("");
        setFile(null);
        setFile2(null);
        setFile3(null);
        setFile4(null);

        // Limpiar previews locales
        setPreview1("");
        setPreview2("");
        setPreview3("");
        setPreview4("");

        toast.success("Formulario limpiado");
    }

    //FUNCION PARA ELIMINACION PRODUCTO
    async function eliminarProducto(id_producto) {
        try {
            if(!id_producto){
                console.error("No se estan recibiendo valores relacionados a id del producto en la funcion en fronend")
            }

            const res = await fetch(`${API}/producto/eliminarProducto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id_producto})
            })

            const respuesta = await res.json();

            if (!res.ok) {
                console.error("problema al eliminar producto", out)
                return toast.error("No fue posible eliminar el producto / Contacte a Soporte de NativeCode.cl");
            }
            if (respuesta.message === 'ok') {
                await cargarProductos();
                return toast.success("Producto eliminado correctamente ✅");

            } else {
                return toast.error("No se pudo eliminar el producto ❌ ");
            }



        } catch (error) {
            console.error("problema al eliminar producto:", error)
            toast.error("Error al eliminar producto / Contacte a Soporte de NativeCode.cl ");
        }

    }
    //FUNCION PARA CARGAR PRODUCTO ESPECIFICO POR ID
    async function cargarProductoEspecifico(id_producto) {
        try {
            if (!id_producto) {
                console.error({ message: "Id del producto no proporcionado" });
                return null;
            }
            const res = await fetch(`${API}/producto/${id_producto}`, {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });
            if (!res.ok) {
                console.error({ message: "Error al cargar producto" });
                return null;
            }
            const data = await res.json();
            setproductoSeleccionado(data);
            settituloProducto(data.tituloProducto);
            setdescripcionProducto(data.descripcionProducto);
            setvalorProducto(data.valorProducto);
            setvalor_previo(data.valor_previo || "");
            setimagenProducto(data.imagenProducto);
            setImagenProductoSegunda(data.imagenProductoSegunda || "");
            setImagenProductoTercera(data.imagenProductoTercera || "");
            setImagenProductoCuarta(data.imagenProductoCuarta || "");
            setcategoriaProducto(data.categoriaProducto);
            setsubcategorias(data.subcategoria || "");
            setsubsubcategorias(data.subsubcategoria || "");
            // Mostrar toast al seleccionar producto para edición
            toast.success("👉 Se ha Seleccionado un producto para edicion ✅");
        } catch (error) {
            console.error("Problema al cargar producto especifico");
        }
    }



    //FUNCION PARA CARGAR TODOS LOS PRODUCTOS
    async function cargarProductos() {
        try {
            //END POINT PARA CONECTAR AL BACKEND CON LS PETICCION HTTP
            const endpoint = `${API}/producto/seleccionarProducto`;

            const res = await fetch(endpoint, {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });

            if (!res.ok) {
                console.error("Error al Cargar productos:", res.status);
                setProductos([]);
                return [];
            }
            const data = await res.json();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.rows)
                    ? data.rows
                    : [];
            setProductos(list);
            console.log("Productos cargados:", list.length);
            return list;
        } catch (error) {
            console.error(
                "Problema al hacer el fetch desde el frontend para traer las tarjetas",
                error
            );
            setProductos([]);
            return [];
        }
    }
    //uso de estado para disparar la funcion al recargar la pagina
    useEffect(() => {
        cargarProductos();
    }, []);
//FUNCION PARA CARGAR IMAGENES A CLOUDFLARE (vía backend)
// === AQUÍ SE LLAMA A LA API PARA SUBIR LA IMAGEN A CLOUDFLARE ===
    async function uploadToCloudflare(file) {
        if (!file) throw new Error("No file provided");

        const form = new FormData();
        // el backend espera el campo 'image'
        form.append("image", file);

        const res = await fetch(`${API}/cloudflare/subirimagenes`, {
            method: "POST",
            body: form,
        });

        let data;
        try {

            data = await res.json();


        } catch (e) {
            throw new Error("El backend no devolvió JSON válido al subir la imagen");
        }

        // el backend devuelve { ok: true, imageId, deliveryUrl, ... }
        if (!res.ok || !data?.ok || !data?.imageId) {
            console.error("Cloudflare backend upload failed", data);
            throw new Error(data?.error || data?.message || "Error subiendo a Cloudflare (backend)");
        }

        return data.imageId;
    }

    //FUNCION PARA INSERTAR NUEVOS PRODUCTOS ESPECIFICO POR ID
    async function insertarProducto() {
        try {
            if (!tituloProducto.trim()) {
                toast.error("El campo 'Título del producto' no puede estar vacío");
                return;
            }

            if (!descripcionProducto.trim()) {
                toast.error("El campo 'Descripción' no puede estar vacío");
                return;
            }

            if (!valorProducto || Number(valorProducto) <= 0) {
                toast.error("El campo 'Valor del producto' debe ser mayor que 0");
                return;
            }

            if (!categoriaProducto) {
                toast.error("Debe seleccionar una categoría");
                return;
            }

            if (!subcategorias) {
                toast.error("Debe seleccionar una subcategoria");
                return;
            }

            if (!subsubcategorias) {
                toast.error("Debe seleccionar una sub-subcategoria");
                return;
            }

            if (!valor_previo || Number(valor_previo) <= 0) {
                toast.error("El campo 'Valor antiguo' debe ser mayor que 0");
                return;
            }

            setSubiendo(true);

            // Subidas a Cloudflare según existan archivos
            let finalImageUrl = imagenProducto;
            try {
                if (file) {
                    finalImageUrl = await uploadToCloudflare(file);
                    setimagenProducto(finalImageUrl);
                }
            } catch (err) {
                console.error('Error subiendo imagen principal a Cloudflare:', err);
                toast.error('Error subiendo imagen principal: ' + (err?.message || err));
                setSubiendo(false);
                return;
            }

            let finalImageUrl2 = imagenProductoSegunda;
            try {
                if (file2) {
                    finalImageUrl2 = await uploadToCloudflare(file2);
                    setImagenProductoSegunda(finalImageUrl2);
                }
            } catch (err) {
                console.error('Error subiendo imagen 2 a Cloudflare:', err);
                toast.error('Error subiendo imagen 2: ' + (err?.message || err));
                setSubiendo(false);
                return;
            }

            let finalImageUrl3 = imagenProductoTercera;
            try {
                if (file3) {
                    finalImageUrl3 = await uploadToCloudflare(file3);
                    setImagenProductoTercera(finalImageUrl3);
                }
            } catch (err) {
                console.error('Error subiendo imagen 3 a Cloudflare:', err);
                toast.error('Error subiendo imagen 3: ' + (err?.message || err));
                setSubiendo(false);
                return;
            }

            let finalImageUrl4 = imagenProductoCuarta;
            try {
                if (file4) {
                    finalImageUrl4 = await uploadToCloudflare(file4);
                    setImagenProductoCuarta(finalImageUrl4);
                }
            } catch (err) {
                console.error('Error subiendo imagen 4 a Cloudflare:', err);
                toast.error('Error subiendo imagen 4: ' + (err?.message || err));
                setSubiendo(false);
                return;
            }

            // Validar que la imagen principal no esté vacía
            if (!finalImageUrl) {
                toast.error('La imagen principal no se subió correctamente.');
                setSubiendo(false);
                return;
            }

            const valorNumero = Number(valorProducto);
            const valorPrevioNumero = Number(valor_previo);

            const data = {
                tituloProducto,
                descripcionProducto,
                valorProducto: valorNumero,
                valor_previo: valorPrevioNumero,
                imagenProducto: finalImageUrl,
                imagenProductoSegunda: finalImageUrl2 || "",
                imagenProductoTercera: finalImageUrl3 || "",
                imagenProductoCuarta: finalImageUrl4 || "",
                categoriaProducto: categoriaProducto,
                subcategoria: subcategorias,
                subsubcategoria: subsubcategorias,
                especificacionProducto: 1,
            };

            let res, out;
            try {
                res = await fetch(`${API}/producto/insertarProducto`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                out = await res.json();
            } catch (err) {
                console.error('Error de red al insertar producto:', err);
                toast.error('Error de red al insertar producto: ' + (err?.message || err));
                setSubiendo(false);
                return;
            }
            if (!res.ok) {
                console.error('Error backend al insertar producto:', out);
                toast.error('Error backend: ' + (out?.error || out?.message || 'Error desconocido al insertar producto'));
                setSubiendo(false);
                return;
            }

            toast.success("Producto insertado correctamente ✅");
            await cargarProductos();
            settituloProducto("");
            setdescripcionProducto("");
            setvalorProducto("");
            setvalor_previo("");
            setsubcategorias("");
            setsubsubcategorias("");
            setimagenProducto("");
            setImagenProductoSegunda("");
            setImagenProductoTercera("");
            setImagenProductoCuarta("");
            setFile(null);
            setFile2(null);
            setFile3(null);
            setFile4(null);
        } catch (err) {
            console.error('Error inesperado al subir producto:', err);
            toast.error("Error inesperado al subir producto: " + (err?.message || err));
        } finally {
            setSubiendo(false);
        }
    }




    //INICIO DEL COMPONETE GRAFICO EN REACT
    return (
        <div>
            <ToasterClient/>

            <div className='flex justify-end mt-20 mr-30'>
                <InfoButton informacion={'En este apartado usted podrá subir los productos y/o servicios que ofrecerá su e-commerce.\n' +
                    '\n' +
                    'Usted puede cargar hasta 4 imágenes por producto. Para una correcta visualización, las imágenes deben estar en formato PNG o JPG.\n' +
                    '\n' +
                    'Las dimensiones recomendadas para las imágenes tipo card son:\n' +
                    '\t•\tImagen principal: 1200 px\n' +
                    '\t•\tImágenes secundarias: 600 px\n' +
                    '\n' +
                    'Importante: usted debe subir primero la imagen principal y luego las imágenes secundarias, ya que la imagen principal será la referencia visible del producto dentro de la tienda.'}/>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
              <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm px-6 py-6 md:px-8 md:py-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Panel de administración
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                      Gestión de productos
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                      En este módulo usted podrá crear y administrar los productos y/o servicios que se mostrarán en su catálogo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500">Consejo</span>
                      <span className="text-[11px] text-slate-600">Suba primero la imagen principal para habilitar las secundarias.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">


                {/**CONTENEDOR PARTE SUPERIOR */}
                <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-gray-200 shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                insertarProducto();
                            }}
                        >
                            <div className="space-y-5">







                            {/* Categoría del producto */}
                            <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                    Categoria Producto
                                </label>
                                <select
                                    value={categoriaProducto}
                                    onChange={(e) => setcategoriaProducto(e.target.value)}
                                    className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 hover:border-blue-300 cursor-pointer transition"
                                >
                                    <option value="" disabled>Seleccione</option>
                                    {listadoCategorias.map((categoria) => (
                                        <option
                                            key={categoria.id_categoriaProducto}
                                            value={categoria.id_categoriaProducto}
                                        >
                                            {categoria.descripcionCategoria}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            {/* SubCategoría del producto */}
                            <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                    Subcategoria Producto
                                </label>
                                <select
                                    value={subcategorias}
                                    onChange={(e) => setsubcategorias(e.target.value)}
                                    className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 hover:border-blue-300 cursor-pointer transition"
                                >
                                    <option value="" disabled>Seleccione</option>
                                    {listaSubcategorias.map((subcategoria) => (
                                        <option
                                            key={subcategoria.id_subcategoria}
                                            value={subcategoria.id_subcategoria}
                                        >
                                            {subcategoria.descripcionCategoria}
                                        </option>
                                    ))}
                                </select>
                            </div>









                                {/* SubSubCategoría del producto */}
                                <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                    <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                    <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                     Sub-subcategoria Producto
                                    </label>
                                    <select
                                        value={subsubcategorias}
                                        onChange={(e) => setsubsubcategorias(e.target.value)}
                                        className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 hover:border-blue-300 cursor-pointer transition"
                                    >
                                        <option value="" disabled>Seleccione</option>
                                        {listaSubSubCategorias.map((subsubcategoria) => (
                                            <option
                                                key={subsubcategoria.id_subsubcategoria}
                                                value={subsubcategoria.id_subsubcategoria}
                                            >
                                                {subsubcategoria.descripcionSubSubCategoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>













                                {/* Título del producto */}
                            <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                {/* Indicador visual lateral dinámico */}
                                <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={tituloProducto}
                                    onChange={(e) => settituloProducto(e.target.value)}
                                    className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition"
                                />
                            </div>

                            {/* Descripción del producto */}
                            <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                    Descripción
                                </label>
                                <textarea
                                    value={descripcionProducto}
                                    onChange={(e) => setdescripcionProducto(e.target.value)}
                                    className="text-sm w-full min-h-[104px] mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition"
                                ></textarea>
                            </div>

                            {/* Valor del producto */}
                            <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                    Valor Actual
                                </label>
                                <input
                                    type="number"
                                    value={valorProducto}
                                    onChange={(e) => setvalorProducto(e.target.value)}
                                    name="valorProductoe"
                                    id="valorProductoe"
                                    className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition"
                                />
                            </div>




                                {/* Valor del producto */}
                                <div className="relative group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                                    <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-transparent group-focus-within:bg-blue-500 transition-colors duration-150"></span>
                                    <label className="pl-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 group-focus-within:text-blue-600 transition-colors">
                                        Valor Antiguo
                                    </label>
                                    <input
                                        type="number"
                                        value={valor_previo}
                                        onChange={(e) => setvalor_previo( e.target.value)}
                                        name="valorProductoe"
                                        id="valorProductoe"
                                        className="text-sm w-full mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition"
                                    />
                                </div>


                                {/* Imágenes del producto */}
                            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-900">Imágenes del producto</h3>
                                  <p className="text-xs text-slate-500">Sube hasta 4 imágenes. Máx. 1600px por lado.</p>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Imagen 1 */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600">Imagen principal</span>
                                    <span className="text-[11px] text-slate-400">#1</span>
                                  </div>
                                  <div className="mt-2">
                                    {preview1 ? (
                                      <img src={preview1} alt="Imagen principal" className="w-full h-40 object-cover rounded-xl ring-1 ring-slate-200" />
                                    ) : (
                                      <div className="w-full h-40 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-200">Sin imagen</div>
                                    )}
                                  </div>
                                  <label htmlFor="file1" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-dashed border-blue-400 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer transition">
                                    Subir imagen
                                  </label>
                                  <input
                                    id="file1"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleSelectImage(e, setFile)}
                                    className="hidden"
                                  />
                                </div>

                                {/* Imagen 2 */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600">Imagen 2</span>
                                    <span className="text-[11px] text-slate-400">#2</span>
                                  </div>
                                  <div className="mt-2">
                                    {preview2 ? (
                                      <img src={preview2} alt="Imagen 2" className="w-full h-28 object-cover rounded-xl ring-1 ring-slate-200" />
                                    ) : (
                                      <div className="w-full h-28 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-200">Sin imagen</div>
                                    )}
                                  </div>
                                  <label
                                    htmlFor="file2"
                                    className={`mt-3 inline-flex w-full items-center justify-center rounded-xl border border-dashed border-blue-400 px-4 py-2 text-sm font-semibold transition ${canUpload2 ? "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"}`}
                                  >
                                    Subir imagen
                                  </label>
                                  <input
                                    id="file2"
                                    type="file"
                                    accept="image/*"
                                    disabled={!canUpload2}
                                    onChange={(e) => (canUpload2 ? handleSelectImage(e, setFile2) : null)}
                                    className="hidden"
                                  />
                                  {!canUpload2 && (
                                    <p className="mt-2 text-[11px] text-slate-500">Primero debe subir la imagen principal.</p>
                                  )}
                                </div>

                                {/* Imagen 3 */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600">Imagen 3</span>
                                    <span className="text-[11px] text-slate-400">#3</span>
                                  </div>
                                  <div className="mt-2">
                                    {preview3 ? (
                                      <img src={preview3} alt="Imagen 3" className="w-full h-28 object-cover rounded-xl ring-1 ring-slate-200" />
                                    ) : (
                                      <div className="w-full h-28 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-200">Sin imagen</div>
                                    )}
                                  </div>
                                  <label
                                    htmlFor="file3"
                                    className={`mt-3 inline-flex w-full items-center justify-center rounded-xl border border-dashed border-blue-400 px-4 py-2 text-sm font-semibold transition ${canUpload3 ? "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"}`}
                                  >
                                    Subir imagen
                                  </label>
                                  <input
                                    id="file3"
                                    type="file"
                                    accept="image/*"
                                    disabled={!canUpload3}
                                    onChange={(e) => (canUpload3 ? handleSelectImage(e, setFile3) : null)}
                                    className="hidden"
                                  />
                                  {!canUpload3 && (
                                    <p className="mt-2 text-[11px] text-slate-500">Primero debe subir la imagen 2.</p>
                                  )}
                                </div>

                                {/* Imagen 4 */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600">Imagen 4</span>
                                    <span className="text-[11px] text-slate-400">#4</span>
                                  </div>
                                  <div className="mt-2">
                                    {preview4 ? (
                                      <img src={preview4} alt="Imagen 4" className="w-full h-28 object-cover rounded-xl ring-1 ring-slate-200" />
                                    ) : (
                                      <div className="w-full h-28 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-200">Sin imagen</div>
                                    )}
                                  </div>
                                  <label
                                    htmlFor="file4"
                                    className={`mt-3 inline-flex w-full items-center justify-center rounded-xl border border-dashed border-blue-400 px-4 py-2 text-sm font-semibold transition ${canUpload4 ? "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"}`}
                                  >
                                    Subir imagen
                                  </label>
                                  <input
                                    id="file4"
                                    type="file"
                                    accept="image/*"
                                    disabled={!canUpload4}
                                    onChange={(e) => (canUpload4 ? handleSelectImage(e, setFile4) : null)}
                                    className="hidden"
                                  />
                                  {!canUpload4 && (
                                    <p className="mt-2 text-[11px] text-slate-500">Primero debe subir la imagen 3.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                                type="submit"
                                disabled={subiendo}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60"
                            >
                                {subiendo ? "Subiendo..." : "Subir Producto"}
                            </button>

                            {productoSeleccionado && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <button
                                        onClick={() => handleActualizar()}
                                        type="button"
                                        disabled={subiendo}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-60"
                                        aria-label="Actualizar producto seleccionado"
                                    >
                                        {subiendo ? 'Actualizando...' : 'Actualizar'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => marcarProductoNormal(productoSeleccionado.id_producto)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
                                        aria-label="Marcar producto sin oferta"
                                    >
                                        Marcar Sin Oferta
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => marcarOfertaProductos(productoSeleccionado.id_producto)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                                        aria-label="Marcar producto como oferta"
                                    >
                                        Marcar Oferta
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => limpiarFormulario()}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-400 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                                        aria-label="Limpiar formulario"
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            )}
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white ring-1 ring-gray-200 shadow-lg p-4 flex flex-col items-center text-center min-h-[240px]">
                        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Imágenes del producto seleccionado</h2>
                        {productoSeleccionado ? (
                            <div className="flex flex-col gap-4 w-full mt-4 items-center">
                                {[
                                    cfToSrc(productoSeleccionado.imagenProducto, VARIANT_FULL),
                                    cfToSrc(productoSeleccionado.imagenProductoSegunda, VARIANT_FULL),
                                    cfToSrc(productoSeleccionado.imagenProductoTercera, VARIANT_FULL),
                                    cfToSrc(productoSeleccionado.imagenProductoCuarta, VARIANT_FULL),
                                ]
                                    .filter(Boolean)
                                    .map((src, idx) => (
                                        <div key={idx} className="aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-md">
                                            <MediaCardImage imagenProducto={src} />
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm mt-4">Sin producto seleccionado</p>
                        )}
                    </div>
                </div>






                {/*FILTRO SELECCION DE PRODUCTOS POR CATEGORIA*/}
                <div className="w-full md:max-w-sm mt-6">
                    <br/><br/>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Filtrar por categoría</label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400"
                            value={categoriaProductoSeleccion}
                            onChange={(e) => {
                                const value = e.target.value;
                                setcategoriaProductoSeleccion(value);
                                filtrarPorCategoria(value);
                            }}
                        >
                            <option value="">-- Selecciona una categoría --</option>
                            {listadoCategorias.map((categoria) => (
                                <option key={categoria.id_categoriaProducto} value={categoria.id_categoriaProducto}>
                                    {categoria.descripcionCategoria}
                                </option>
                            ))}
                        </select>
                        {/* Caret decorativo */}
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">▾</span>
                    </div>
                </div>

                <br/>

                {/* FORMULARIO PARA ENCONTRAR POR SIMILITUD DE NOMBRE EN CONSULTA A LA BASE DE DATOS*/}
                <div className="w-full md:max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700">Buscar por similitud en nombre</label>
                        <p className="mt-1 text-xs text-slate-500">Encuentra productos con títulos parecidos. Escribe al menos 3 caracteres.</p>
                        <div className="mt-3 relative flex w-full">
                            {/* Icono decorativo */}
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.93l3.288 3.289a.75.75 0 1 0 1.06-1.06l-3.288-3.29A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                  </svg>
                </span>
                            <input
                                onChange={(e) => settituloSimilar(e.target.value)}
                                type="text"
                                placeholder="Ej: anillos plata, collares..."
                                className="w-full rounded-l-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 hover:border-blue-400"
                            />
                            <button
                                onClick={() => { buscarSimilar(tituloSimilar) }}
                                type="button"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-r-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-[.99]"
                                aria-label="Buscar productos por similitud"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>




                <div className="w-full mt-10 bg-gradient-to-br from-white to-sky-50 rounded-3xl bg-white shadow-lg ring-1 ring-gray-100 p-4">
                    <Table className="text-sm">
                        <TableCaption>Listado de Productos Ingresados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center bg-gradient-to-r bg-sky-100 uppercase font-bold tracking-wide text-xs py-2">Imagen Referencia</TableHead>
                                <TableHead className="text-center bg-gradient-to-r bg-sky-100 uppercase font-bold tracking-wide text-xs py-2">Titulo</TableHead>
                                <TableHead className="text-center bg-gradient-to-r bg-sky-100 uppercase font-bold tracking-wide text-xs py-2">Valor</TableHead>
                                <TableHead className="text-center bg-gradient-to-r bg-sky-100 uppercase font-bold tracking-wide text-xs py-2"> </TableHead>
                                <TableHead className="text-center bg-gradient-to-r bg-sky-100 uppercase font-bold tracking-wide text-xs py-2"> </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.map((producto) => (
                                <TableRow key={producto.id_producto}>
                                    <TableCell className="text-center mx-auto py-2">
                                        <img className="mx-auto w-16 h-16 object-cover rounded-lg ring-1 ring-gray-200" src={cfToSrc(producto.imagenProducto, VARIANT_MINI)} alt={"Imagen"} width={100} height={100}/>
                                    </TableCell>

                                    <TableCell className="text-center font-bold py-2">{producto.tituloProducto}</TableCell>
                                    <TableCell className="text-center font-bold text-green-600 py-2">$ {producto.valorProducto}</TableCell>


                                    <TableCell className="text-center py-2">
                                        <ShadcnButton className="bg-red-600 h-8 px-3 text-xs rounded-lg" variant={"bg-red"} nombre={"Eliminar"} funcion={()=> eliminarProducto(producto.id_producto)}/>
                                    </TableCell>


                                    <TableCell className="text-center py-2">
                                        <ShadcnButton className="bg-green-600 h-8 px-3 text-xs rounded-lg" nombre={"Seleccionar"} funcion={()=> cargarProductoEspecifico(producto.id_producto)} />
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>

                <br />

            </div>
        </div>
    );
}
