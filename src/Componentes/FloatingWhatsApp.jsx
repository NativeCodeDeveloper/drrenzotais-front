"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsAppButton() {
    return (
        <FloatingWhatsApp
            phoneNumber="+56977173029" // tu número con código de país
            accountName="Silueta Chic"
            avatar="/silueta.png" // opcional: logo o imagen en public/
            statusMessage=""
            chatMessage="¡Hola! 👋 ¿Como podemos ayudarte?"
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}