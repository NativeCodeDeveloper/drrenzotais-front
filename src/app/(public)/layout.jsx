'use client'

import { ShadcnNavBar } from "@/Componentes/shadcnNavBar";
import FooterPremiumMedico from "@/Componentes/Footer";
import ToasterClient from "@/Componentes/ToasterClient";

export default function PublicLayout({ children }) {
  return (
    <div className="relative z-0 mt-0 min-h-screen bg-[#f6f7fb]">
      <ToasterClient />
      <nav className="fixed inset-x-0 top-0 z-50">
        <ShadcnNavBar />
      </nav>
      <main className="relative z-0 pt-[86px] md:pt-[94px]">{children}</main>
      <div className="mt-0">
        <FooterPremiumMedico />
      </div>
    </div>
  );
}
