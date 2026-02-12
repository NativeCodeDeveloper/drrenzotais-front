// app/page.jsx
import Portada from "@/app/(public)/portada/page";
import Catalogo from "@/app/(public)/catalogo/page";
import { Case1 } from "@/Componentes/carruselMarcas";
import Seccion1 from "@/app/(public)/seccion1/page";
import Seccion2 from "@/app/(public)/seccion2/page";
import Seccion3 from "@/app/(public)/seccion3/page";




export default function Home({ searchParams }) {


    return (
        <main>
            <Portada></Portada>
            <Seccion1 />
            <Seccion2 />
            <Seccion3 />
        </main>
    );
}