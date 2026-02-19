"use client"
import {useState, useEffect, createContext, useContext} from "react";
const ObjetoPagarContext = createContext([[], () => {}]);

export default function ObjetoPagarProvider({ children }) {
    const [objetoDePago, setObjetoDePago] = useState([]);

    function agregarObjetosDePago(objetoNuevo) {
        setObjetoDePago((objetosPrevios) => [...objetosPrevios, objetoNuevo]);
    }
    return (
        <ObjetoPagarContext.Provider value={[objetoDePago, setObjetoDePago]}>
            {children}
        </ObjetoPagarContext.Provider>
    )
}

export const useObjetosPagosGlobales = () => {
    return useContext(ObjetoPagarContext);
}
