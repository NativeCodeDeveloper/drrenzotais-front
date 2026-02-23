import "./globals.css";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";
import CarritoProvider from "@/ContextosGlobales/CarritoContext";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.drtais.com"
);

export const metadata = {
  title: {
    default: "Dr. Renzo Tais | Medicina Estética Regenerativa y No Invasiva",
    template: "%s | Dr. Renzo Tais",
  },
  description:
    "Sitio oficial del Dr. Renzo Tais. Medicina estética regenerativa y no invasiva con enfoque personalizado, tecnología avanzada y resultados naturales.",
  keywords: [
    "Dr. Renzo Tais",
    "medicina estética regenerativa",
    "medicina estética",
    "tratamientos no invasivos",
    "rejuvenecimiento facial",
    "contorno corporal",
    "ultraformer",
    "scizer",
    "emsculpt neo",
    "volnewmer",
    "láser co2",
  ],
  authors: [{ name: "Dr. Renzo Tais", url: metadataBase.href }],
  publisher: "Dr. Renzo Tais",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: metadataBase.href,
  },
  openGraph: {
    title: "Dr. Renzo Tais | Medicina Estética Regenerativa y No Invasiva",
    description:
      "Atención médica personalizada en medicina estética regenerativa facial y corporal.",
    url: metadataBase.href,
    siteName: "Dr. Renzo Tais",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Renzo Tais | Medicina Estética Regenerativa",
    description:
      "Sitio oficial con información de procedimientos, evaluación y contacto.",
  },
  icons: {
    icon: "/dr1.png",
    shortcut: "/dr1.png",
    apple: "/dr1.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-white">
        <AnimatedLayout>
          <AgendaProvider>
            <CarritoProvider>{children}</CarritoProvider>
          </AgendaProvider>
        </AnimatedLayout>
      </body>
    </html>
  );
}
