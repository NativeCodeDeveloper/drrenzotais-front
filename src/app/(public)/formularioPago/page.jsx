"use client";

import { useState, useEffect, useMemo } from 'react';
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {useCarritoGlobal} from "@/ContextosGlobales/CarritoContext";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import { Checkbox } from "@/components/ui/checkbox";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogActions from "@mui/material/DialogActions";

const TERMINOS_Y_CONDICIONES_TEXTO = `Santiago de chile 2025 
 
Términos y condiciones. 
Generalidades 
Este documento regula los términos y condiciones bajo los cuales Ud. tiene derecho a 
acceder y usar los servicios del sitio Web www.siluetachic.cl y de cualquier información, 
texto, video u otro material comunicado en el sitio web.  
En este sitio Web podrá usar, sin costo, el software y las aplicaciones para equipos móviles 
que le permitan navegar, visitar, comparar y si lo desea, adquirir los bienes o servicios que 
se exhiben aquí. Le recomendamos que lea detenidamente estas Condiciones e imprima o 
guarde una copia de las mismas en la unidad de disco local para su información.  
Estos Términos y Condiciones serán aplicados y se entenderán incorporados en cada uno 
de los contratos que celebre con Silueta Chic. por medio de este sitio web. El uso de este 
sitio web, la aplicación de estos Términos y Condiciones, los actos que ejecute  y los 
contratos que celebre por medio de este sitio web, se encuentran sujetos y sometidos a las 
leyes de la República de Chile y en especial a la ley 19.496 de protección de los derechos 
de los consumidores. Silueta Chic, por lo tanto, aplicará estrictamente todos los beneficios, 
garantías y derechos reconocidos en favor de los consumidores en la ley 19.496. Además, 
Silueta Chic adhiere en todas sus partes al Código de Buenas Prácticas para el Comercio 
Electrónico de la Cámara de Comercio de Santiago. 
Comunicaciones  
Para la comunicación de cualquier presentación, consulta o reclamo a propósito del uso de 
este sitio, o los contratos que en él o se lleven a cabo, Silueta Chic designa como 
representantes legales a Directorio y Gerente General. Los representantes son: Constanza 
Viviana Vargas Espinoza y Camila Belén Téllez Arias, disponible en el correo 
silueta.chic2000@gmail.com; y en el teléfono de Servicio al Cliente +56 9 77173029, 
domiciliado para estos efectos en Avenida Irarrázaval 1989, oficina 204 placa sur, comuna 
de Ñuñoa, ciudad de Santiago. 
Si una persona no desea seguir recibiendo publicidad o promociones de Silueta Chic por 
correo electrónico u otros medios equivalentes, podrá solicitarlo en cualquier momento, 
según se indica en cada envío. Silueta Chic cesará el envío a quien lo solicite.

Libertad de navegación y aceptación
La mera visita de este sitio web, en el cual se ofrecen determinados bienes y el acceso a 
determinados servicios, no impone al consumidor obligación alguna, a menos que haya 
aceptado en forma inequívoca las condiciones ofrecidas por Silueta Chic, en la forma 
indicada en estos Términos y Condiciones.  
Para aceptar estos Términos y Condiciones, el usuario deberá hacer clic donde el sitio web 
ofrezca esta opción en la frase “he leído y aceptado” o similar.

Cómo contratar
Para hacer compras o contratar servicios en este sitio web, debe seguir los siguientes pasos 
haciendo clic en el campo correspondiente: 
1. Seleccione el producto o servicio que desea comprar o contratar, y agréguelo al carro de 
compra. 
2. Confirme haber leído y aceptado estos Términos y Condiciones. 
3. Seleccione el medio de pago. 
4. Una vez hecha la orden, se desplegará en la pantalla: a. una descripción del producto o 
servicio contratado; b. precio; c. indicación del medio de pago; d. estética donde se realizará el 
tratamiento; e. demás condiciones de la orden; 
5. Se enviará la información al correo electrónico registrado. 
6. Dentro de 48 horas hábiles se enviará boleta electrónica al email del paciente. 
7. La compra será validada en el local mediante evaluación, ficha, consentimiento y consultas 
de salud. 
8. También se puede comprar por atención telefónica o presencial.

Medios de pago
Salvo que se señale un medio diferente para casos u ofertas específicas, los productos y 
servicios informados en este sitio solo pueden ser pagados por medio de: 
- Mercado Pago y Webpay.
- Tarjetas de crédito bancarias Visa, MasterCard, American Express, Diners Club, Magna y 
otras emitidas en Chile o en el extranjero, siempre que mantengan un contrato vigente para 
este efecto con el proveedor del medio de pago.
- Tarjetas de débito bancarias acogidas al sistema Redcompra, emitidas en Chile por bancos 
nacionales, que se encuentren afiliadas a Transbank.
- Efectivo en oficina.
- Transferencia bancaria (datos por correo/WhatsApp).
Los portales de pago pertenecen a terceros, por lo que su continuidad y correcto 
funcionamiento no es responsabilidad de Silueta Chic.

Derechos y garantías
Condición esencial: No se admiten cambios ni devoluciones si el cliente ya inició alguna 
sesión del tratamiento.

Ventas a distancia (web/WhatsApp/Instagram): El consumidor tiene derecho a retracto. Hasta 
30 días desde la compra: reembolso 100% (si procede conforme a comunicación escrita legal; 
si no, puede extenderse hasta 90 días).

Ventas presenciales: Hasta 10 días corridos: devolución 100%. Después de 10 días: reembolso 
70% (retención 30% por gastos administrativos permitidos).

Solicitudes: Deben enviarse a silueta.chic2000@gmail.com, presentando boleta u otro 
comprobante. El valor por reserva de box no es reembolsable salvo aviso con al menos 24 
horas.

Incompatibilidad: Si en la evaluación inicial se determina que el tratamiento es riesgoso o 
inapropiado, se cancela la venta y se reembolsa el total pagado.

Realización del servicio
La compra se realiza en línea y el tratamiento se efectúa presencialmente en Silueta Chic. 
Evaluación previa obligatoria antes de comenzar. Agendamiento dentro del horario de 
atención.

Resultados esperados y efectos adversos
Los resultados varían según factores individuales. La depilación láser conlleva riesgos; Silueta 
Chic no se responsabiliza por efectos adversos derivados de datos erróneos u omisiones en la 
declaración de salud, o por no seguir cuidados previos/posteriores.

Opciones, vigencia y evaluación
Se pueden adquirir sesiones por zonas, paquetes (3 o 6) y combos. Vigencia de tratamientos: 
12 meses desde la compra; sesiones no usadas caducan. Evaluación inicial presencial u online 
con cuestionario de salud. Silueta Chic puede suspender el servicio si detecta contraindicación, 
reembolsando las sesiones no realizadas.

Consentimiento, reservas y confirmaciones
Antes de la primera sesión se firma consentimiento informado (físico y/o digital). Intervalo 
mínimo entre sesiones: 4 a 6 semanas. Confirmación obligatoria desde 3 días antes; si no se 
confirma 24 horas antes, se cancela la reserva. Ausencia sin aviso con 24 horas: la sesión 
puede considerarse realizada y descontarse.

Comunicación con el cliente
Se podrán enviar recordatorios y confirmaciones por correo, SMS, WhatsApp y llamadas. El 
cliente autoriza expresamente estas notificaciones.

Responsabilidad
Silueta Chic no responde por uso indebido del sitio, interrupciones, errores técnicos, contenidos 
de sitios externos, ni por virus en equipos del usuario. La responsabilidad total no excederá el 
precio efectivamente pagado, sin perjuicio de lo que determinen los tribunales.

Seguridad de datos y datos personales
Se adoptan medidas de seguridad para resguardar datos. Los datos personales se usan para 
fines relacionados con la compra y comunicación con el cliente, conforme a la Ley 19.628. El 
usuario puede ejercer sus derechos de información, modificación, cancelación y bloqueo.

Documentos electrónicos (SII)
Al aprobar estos términos, el usuario autoriza la entrega del documento tributario por medios 
electrónicos y el aviso de publicación por email, conforme a normativa del SII. El receptor se 
obliga a imprimir y conservar según requisitos.

Propiedad intelectual
Los contenidos del sitio (textos, imágenes, códigos, marcas, etc.) son propiedad de Silueta Chic 
o de sus proveedores y están protegidos por leyes aplicables. Se prohíbe el uso no autorizado.

Legislación aplicable y competencia
Los presentes términos y condiciones se rigen por las leyes de la República de Chile. Cualquier 
controversia o conflicto derivado de la utilización del sitio web de Silueta Chic, sus Términos y 
Condiciones y las Políticas de Privacidad, su validez, interpretación, alcance o cumplimiento, 
será sometida a las leyes aplicables de la República de Chile.`;


export default function FormularioPago() {

    /*

LOQUE SE DEBE ENVIAR EN EL BODY

nombre_comprador
apellidosComprador
telefono_comprador
email_Comprador
identificacion_comprador
direccion_despacho
comuna
regionPais
comentarios
totalPagado

    * */

    // Estados del formulario y de carga
    const [nombre_comprador, setnombre_comprador] = useState('');
    const [apellidosComprador, setapellidosComprador] = useState('');
    const [telefono_comprador, settelefono_comprador] = useState('');
    const [email_Comprador, setemail_Comprador] = useState('');
    const [identificacion_comprador, setidentificacion_comprador] = useState('');
    const [direccion_despacho, setdireccion_despacho] = useState('');
    const [comuna, setComuna] = useState('');
    const [regionPais, setRegionPais] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [totalPagado, settotalPagado] = useState(0);

    const [carrito] = useCarritoGlobal();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [codigoVerificadorCupon,setcodigoVerificadorCupon] = useState('');
    const [porcentajeDescuento, setporcentajeDescuento] = useState(0);
    const [valorDescuento, setvalorDescuento] = useState(0);
    const [dataCupon, setDataCupon] = useState([]);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [checked, setchecked] = useState(false);
    const [mounted, setMounted] = useState(false);


    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        setMounted(true);
    }, []);


    async function verificacionCupon(codigoVerificadorCupon) {
        try {

            if (!codigoVerificadorCupon) {
                return toast.error('Debe ingresar un codigo para aplicar descuento');
            }

            const res = await fetch(`${API}/cupon/seleccionarCuponesCodigo`,{
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({codigoVerificadorCupon}),
                mode: 'cors',
                cache: 'no-cache'
            })

            if(!res.ok) {
                return toast.error('El cupon ingresado es Invalido');
            }

            const respuestaQuery = await res.json();
            if (respuestaQuery) {
                setDataCupon(respuestaQuery)
                return toast.success('Se ha encontrado cupon');

            }else if (respuestaQuery.message === false) {
                return toast.error('Debe ingresar un cupon valido para aplicar descuento');
            }


        }catch(error) {
            console.log(error)
            return toast.error('Ha ocurrido un error, intentelo mas tarde.');
        }
    }


    useEffect(() => {
        let porcentaje = 0;

        if (dataCupon.length > 0) {
            dataCupon.forEach(element => {
                porcentaje = element.porcentajeDescuento;
                return porcentaje;
            })
            setporcentajeDescuento(porcentaje);
            setvalorDescuento(porcentaje / 100)
        }
    },[dataCupon])

    const productoCatidades = {};

    for (const productos of carrito) {
        if (productoCatidades[productos.id_producto]) {
            productoCatidades[productos.id_producto].cantidadVendida += 1;
        }else{
            productoCatidades[productos.id_producto]= {...productos, cantidadVendida: 1};
        }
    }



    const productosDelCarrito = Object.values(productoCatidades);
    const productosFiltrados = productosDelCarrito.map((p) => ({
        id_producto: p.id_producto ?? p.id ?? p.producto_id ?? p.idProducto ?? null,
        tituloProducto: p.tituloProducto ?? p.titulo ?? p.nombre ?? p.nombreProducto ?? "Producto",
        nombre: p.nombre ?? p.nombreProducto ?? p.titulo ?? "Producto",
        precio: Number(p.precio ?? p.valorProducto ?? p.unit_price ?? 0),
        cantidad: Number(p.cantidadVendida ?? p.cantidad ?? p.quantity ?? 1),
    }));

    const totalCarrito = useMemo(() => {
        return productosFiltrados.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);
    }, [productosFiltrados]);



// Evitar setState durante el render -> actualizar totalPagado solo cuando cambie totalCarrito
    useEffect(() => {
        if (!valorDescuento || valorDescuento === 0 ){
            settotalPagado(totalCarrito);
        }else {
            let montoAdescontar = totalCarrito * valorDescuento;
            settotalPagado(totalCarrito - montoAdescontar);
        }

    }, [totalCarrito, valorDescuento]);

// Aplicar descuento a los productos antes de enviarlos
    const productosConDescuento = useMemo(() => {
        return productosFiltrados.map(p => ({
            ...p,
            precio: valorDescuento > 0
                ? Number(p.precio) * (1 - valorDescuento)
                : Number(p.precio)
        }));
    }, [productosFiltrados, valorDescuento]);



    const formatCLP = (n) => Number(n).toLocaleString('es-CL');




    // handleSubmit: se ejecuta al enviar el formulario
    // Envía los datos al backend que crea la preferencia de Mercado Pago
    const handleSubmit = async (e) => {
        e.preventDefault(); // evita que la página se recargue
        if (loading) return; // evita doble submit
        setLoading(true);
        setError('');
        if (!checked) {
            setLoading(false);
            return toast.error("Debes aceptar los términos y condiciones para continuar");
        }

        if (!checked){
            return toast.error('Para proceder con la compra debe aceptar terminos y condiciones.')
        }

        try {
            // Llamada al endpoint del backend que crea la preferencia
            // NOTA: el backend en este proyecto expone POST / create-order en API
            const res = await fetch(`${API}/pagosMercadoPago/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                // Enviamos el payload tal cual lo espera el backend (title, unit_price, quantity)
                body: JSON.stringify({
                    productosDelCarrito: productosConDescuento,
                    comprador: {
                        nombre_comprador,
                        apellidosComprador,
                        telefono_comprador,
                        email_Comprador,
                        identificacion_comprador,
                        direccion_despacho : '---',
                        comuna : '---',
                        regionPais : '---',
                        comentarios : '---',
                        totalPagado,
                    },
                    notification_url: "https://eric-tepid-claretha.ngrok-free.dev/pagosMercadoPago/notificacionPago"
                }),
            });

            if (!res.ok) {
                setLoading(false);
                return toast.error("No se puede procesar el pago porfavor evalue otro medio de pago contactandonos por WhatsApp")
            }

            const data = await res.json();

            // El backend devuelve init_point / sandbox_init_point
            // Usamos sandbox_init_point si está disponible para pruebas

            const checkoutUrl = data.init_point;
            if (!checkoutUrl) {
                setLoading(false);
                return toast.error("No se puede procesar el pago porfavor evalue otro medio de pago contactandonos por WhatsApp")
            }
            // Redirigimos al usuario al Checkout Pro de Mercado Pago
            window.location.href = checkoutUrl;

        } catch (err) {
            console.error(err);
            setError(err.message || 'Error inesperado');
            setLoading(false);
            return toast.error("No se puede procesar el pago porfavor evalue otro medio de pago contactandonos por WhatsApp")

        }
    };

    return (
        <div className="mt-14 md:mt-15 min-h-screen bg-gray-50">
            <main className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-10">
                <ToasterClient />

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                        Completa tus datos para continuar con la compra
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Tus datos se usarán solo para procesar el pedido y generar el comprobante.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card: Formulario */}
                    <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-gray-200">
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Nombre</span>
                                    <input
                                        type="text"
                                        value={nombre_comprador}
                                        onChange={(e) => setnombre_comprador(e.target.value)}
                                        required
                                        className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej.: María"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Apellidos</span>
                                    <input
                                        type="text"
                                        value={apellidosComprador}
                                        onChange={(e) => setapellidosComprador(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej.: López Gonzalez"
                                    />
                                </label>




                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-gray-700">Telefono</span>
                                    <input
                                        type="text"
                                        value={telefono_comprador}
                                        onChange={(e) => settelefono_comprador(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="+56 912345678"
                                    />
                                </label>



                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Email</span>
                                    <input
                                        type="text"
                                        value={email_Comprador}
                                        onChange={(e) => setemail_Comprador(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej.: tucorreo@gmail.com"
                                    />
                                </label>



                                <label className="block ">
                                    <span className="text-sm font-medium text-gray-700"> RUT/DNI</span>
                                    <input
                                        type="text"
                                        value={identificacion_comprador}
                                        onChange={(e) => setidentificacion_comprador(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej.: 11.111.111-1"
                                    />
                                </label>

                                {/*
                                                                    <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Direccion</span>
                                    <input
                                        type="text"
                                        value={direccion_despacho}
                                        onChange={(e) => setdireccion_despacho(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej: Santiago Centro / Alameda 123"
                                    />
                                </label>
                                    * */}
                                {/*
                                            <label className="block">
                                    <span className="text-sm font-medium text-gray-700"> Region / Pais </span>
                                    <input
                                        type="text"
                                        value={regionPais}
                                        onChange={(e) => setRegionPais(e.target.value)}
                                        required
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="Ej: Metropolitana / Chile"
                                    />
                                </label>
                                */}
                                {/*
                                                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700"> Comentarios </span>
                                    <textarea
                                        value={comentarios}
                                        onChange={(e) => setComentarios(e.target.value)}
                                        className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                        placeholder="(Opcional)"
                                    />
                                </label>
                                */}

       <div>
           <>
               <Button type="button" variant="outlined" onClick={handleOpen} className="font-sans tracking-tight">
                   Términos y condiciones
               </Button>

               <Dialog open={open} onClose={handleClose} aria-labelledby="titulo-terminos">
                   <DialogTitle id="titulo-terminos" className="font-sans font-semibold tracking-tight text-gray-900">
                       Términos y condiciones
                   </DialogTitle>
                   <DialogContent dividers>
                       <DialogContentText component="div">
                           <pre className="whitespace-pre-wrap text-[13px] sm:text-sm leading-6 text-gray-800 font-sans">
                               {TERMINOS_Y_CONDICIONES_TEXTO}
                           </pre>
                       </DialogContentText>
                   </DialogContent>
                   <DialogActions>
                       <Button type="button" onClick={handleClose}>Cerrar</Button>
                       <Button type="button" onClick={handleClose} variant="contained">
                           Entendido
                       </Button>
                   </DialogActions>
               </Dialog>
           </>
       </div>

                                <div className="md:col-span-2 flex items-start gap-3 pt-2">
                                    <Checkbox
                                        id="acepto"
                                        checked={checked}
                                        onCheckedChange={(v) => setchecked(v === true)}
                                        className="mt-0.5 h-4 w-4 rounded border-2 border-blue-600 bg-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600"
                                    />
                                    <label
                                        htmlFor="acepto"
                                        className="text-sm text-gray-700 leading-5 select-none"
                                    >
                                        Acepto los términos y condiciones
                                    </label>
                                </div>



                            </div>

                            {error && (
                                <div className=" p-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Redirigiendo…' : 'Continuar con Pago'}
                                </button>

                                <span className="text-xs text-gray-500 hidden sm:inline">
                      Serás redirigido al portal de pago seguro.
                    </span>
                            </div>
                        </form>
                    </section>

                    {/* Card: Resumen del pedido */}
                    <aside className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 h-fit">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg font-semibold text-gray-900">Resumen del pedido</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Revisa los productos antes de continuar.
                            </p>

                            <div className="mt-6 space-y-4">
                                {!mounted || productosFiltrados.length === 0 ? (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                                        Tu carrito está vacío.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {productosDelCarrito.map((p, idx) => (
                                            <li key={idx} className="py-2.5 flex items-start justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {p.tituloProducto}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        Sesiones: <span className="font-medium text-gray-700">{p.cantidadVendida}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-700">
                                                        ${formatCLP(p.valorProducto)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Subtotal: ${formatCLP(Number(p.valorProducto) * Number(p.cantidadVendida))}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between text-sm sm:text-base">

                            </div>
                            <span className="text-sm font-medium text-gray-700">Total a Pagar :</span><br/>
                            <span className="text-lg font-semibold text-gray-900">
                      ${formatCLP(totalCarrito)}
                    </span>

                            <br/><br/>

                            <span className="text-sm font-medium text-gray-700">Total con Descuento Aplicado :</span> <br/>
                            <span className="text-lg font-semibold text-green-600">
                           ${formatCLP(totalPagado)}
                      </span>

                            <br/><br/>

                            <span className="text-xs text-gray-400 font-extralight">Descuento aplicado : {porcentajeDescuento} % </span>

                            <div className="mt-3 text-xs text-gray-500">
                                Los precios están expresados en CLP.
                            </div>


                        </div>


                    </aside>


                    <div className="rounded-2xl shadow-sm  md:w-185 ring-gray-200  ring-1 bg-white">
                        <div className="p-4 gap-6">


                            <div className="flex items-center gap-2 w-70 md:w-100">
                                <span className="text-sm font-bold text-gray-700">Cupon</span> <br/>
                                <input
                                    type="text"
                                    value={codigoVerificadorCupon}
                                    onChange={(e) => setcodigoVerificadorCupon(e.target.value)}
                                    required
                                    className=" p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-gray-900 placeholder:text-gray-400 py-2"
                                    placeholder="(Opcional)"
                                />
                            </div>
                            <br/>


                            <ShadcnButton className="bg-green-700"
                                          funcion={()=> verificacionCupon(codigoVerificadorCupon)}
                                          nombre={"Aplicar Cupon Descuento"}/>

                        </div>
                    </div>


                </div>
            </main>
        </div>
    );
}