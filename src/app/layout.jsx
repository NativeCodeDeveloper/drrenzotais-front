// src/app/layout.jsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";

// Metadata optimizada SEO para Silueta Chic – Centro de Depilación Triláser en Ñuñoa, Santiago
export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://siluetachic.cl"
);

export const metadata = {
  title: {
    default: "Silueta Chic | Centro de Depilación Triláser en Ñuñoa",
    template: "%s | Silueta Chic",
  },
  description:
    "Silueta Chic es un centro profesional de depilación triláser en Ñuñoa, Santiago. Especialistas en depilación corporal femenina y masculina, tratamientos seguros, tecnología avanzada y atención personalizada.",
  icons: {
    icon: "/silueta.ico",
    shortcut: "/silueta.ico",
    apple: "/silueta.png",
  },
  keywords: [
    "depilación triláser",
    "depilación láser Santiago",
    "depilación láser Ñuñoa",
    "centro de depilación",
    "depilación corporal",
    "depilación profesional",
    "depilación femenina",
    "depilación masculina",
    "depilación definitiva",
    "Silueta Chic",
    "depilación láser clínica estética",
    "triláser Ñuñoa",
    "centro de estética Santiago",
  ],
  authors: [{ name: "Silueta Chic", url: metadataBase.href }],
  publisher: "Silueta Chic",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: metadataBase.href,
  },
  openGraph: {
    title: "Silueta Chic | Depilación Triláser Profesional en Ñuñoa",
    description:
      "Centro especializado en depilación triláser en Ñuñoa, Santiago. Resultados efectivos, tecnología avanzada y especialistas en depilación corporal.",
    url: metadataBase.href,
    siteName: "Silueta Chic",
    images: [
      {
        url: `${metadataBase.href.replace(/\/$/, "")}/og-silueta-chic.png`,
        width: 1200,
        height: 630,
        alt: "Silueta Chic - Centro de Depilación Triláser",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silueta Chic | Depilación Triláser en Ñuñoa",
    description:
      "Depilación triláser profesional en Ñuñoa, Santiago. Especialistas en depilación corporal con tecnología avanzada.",
    images: [`${metadataBase.href.replace(/\/$/, "")}/og-silueta-chic.png`],
  },
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="es">
            <body className="min-h-screen bg-white">
            {/* Aquí usamos el componente cliente que ya maneja Motion */}
            <AnimatedLayout>
                <AgendaProvider>
                    {children}
                </AgendaProvider>
            </AnimatedLayout>
            </body>
            </html>
        </ClerkProvider>
    );
}