import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import EcoChat from "@/components/EcoChat";
import Picko from "@/components/Picko";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "It's where | Découvrez vos opportunités",
  description: "Plateforme Green Tech connectant la jeunesse algérienne aux opportunités des établissements ODEJ (Événements, Ateliers, Bénévolat, Centres de Jeunesse).",
  keywords: ["ODEJ", "Algérie", "Jeunesse", "Événements", "Bénévolat", "Ateliers", "Green Tech"],
  authors: [{ name: "Zaki Hachemi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable} ${arabic.variable}`}>
      <body className={`${inter.className} min-h-screen bg-[var(--color-base)] text-[var(--color-text)]`}>
        {children}
        <EcoChat />
        <Picko />
      </body>
    </html>
  );
}
