"use client";

import { useRef } from "react";
import Odontograma from "@/Componentes/Odontograma";

export default function PruebasPage() {
    const odRef = useRef();

    const handleExport = () => {
        const data = odRef.current.exportOdontograma();
        console.log("Odontograma JSON:", JSON.stringify(data, null, 2));
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prueba Odontograma</h1>
                    <p className="mt-1 text-sm text-slate-500">Selecciona una herramienta y haz click en las caras o el centro del diente.</p>
                </div>

                <Odontograma
                    ref={odRef}
                    patientId="test-001"
                    onChange={(data) => console.log("onChange:", data)}
                />

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleExport}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                        Exportar JSON (ver consola)
                    </button>
                    <button
                        onClick={() => odRef.current.resetOdontograma()}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
