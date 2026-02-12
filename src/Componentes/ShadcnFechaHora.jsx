"use client"

import * as React from "react"
import {ChevronDownIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function ShadcnFechaHora({onChange}) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(undefined)
    const [hour, setHour] = React.useState("10")
    const [minute, setMinute] = React.useState("30")
    const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`

    const dateTime = React.useMemo(() => {
        if (!date) return null

        const [hh = 0, mm = 0, ss = 0] = time.split(":").map(Number)

        // Construir desde año/mes/día locales para evitar desfase por timezone
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, ss, 0)
        return d
    }, [date, time])

    // 🔔 Notificar al padre
    React.useEffect(() => {
        if (dateTime && onChange) {
            onChange(dateTime)
        }
    }, [dateTime, onChange])

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label className="px-1">Fecha</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {/* Botón de fecha: azul oscuro con texto blanco */}
                        <Button variant="outline"
                                className="w-32 justify-between font-normal bg-blue-900 text-white hover:bg-blue-800">
                            {date ? date.toLocaleDateString() : "Seleccionar"}
                            <ChevronDownIcon/>
                        </Button>
                    </PopoverTrigger>
                    {/* Contenido del popover: fondo azul y texto blanco */}
                    <PopoverContent className="w-auto p-0">
                        <div className="bg-blue-900 text-white p-3 rounded-md">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d)
                                    setOpen(false)
                                }}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Label className="px-1">Hora</Label>
                <div className="flex items-center gap-1">
                    <select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-16 h-9 bg-blue-900 text-white rounded-md px-2 py-1 text-sm border-0 cursor-pointer"
                    >
                        {Array.from({length: 24}, (_, i) => (
                            <option key={i} value={String(i)}>{String(i).padStart(2, "0")}</option>
                        ))}
                    </select>
                    <span className="text-slate-700 font-bold">:</span>
                    <select
                        value={minute}
                        onChange={(e) => setMinute(e.target.value)}
                        className="w-16 h-9 bg-blue-900 text-white rounded-md px-2 py-1 text-sm border-0 cursor-pointer"
                    >
                        {Array.from({length: 12}, (_, i) => i * 5).map((m) => (
                            <option key={m} value={String(m)}>{String(m).padStart(2, "0")}</option>
                        ))}
                    </select>
                    <span className="text-xs text-slate-500 ml-1">hrs</span>
                </div>
            </div>
        </div>
    )
}