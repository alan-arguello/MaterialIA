import type { Metadata } from "next";
import { Instrument_Serif, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const rawSiteUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "localhost:3000";
const siteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `${rawSiteUrl.includes("localhost") ? "http" : "https"}://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Material IA - IA para cotizar materiales de construccion",
  description:
    "Automatizacion de cotizaciones, seguimiento comercial y pedidos para empresas de acero, cubiertas, acabados y materiales de construccion.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/probuilder/favicon.png",
  },
  openGraph: {
    title: "Material IA - IA para cotizar materiales de construccion",
    description:
      "Automatizacion de cotizaciones, seguimiento comercial y pedidos para empresas de acero, cubiertas, acabados y materiales de construccion.",
    images: ["/probuilder/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${rubik.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
