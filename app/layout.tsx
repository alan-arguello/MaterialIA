import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
  title: "Material IA - Acero a medida para obras en días",
  description:
    "Fabricamos remates, molduras, canalones y caballetes de acero prepintado hasta 8 metros, cortados al milímetro y entregados en días.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/probuilder/favicon.png",
  },
  openGraph: {
    title: "Material IA - Acero a medida para obras en días",
    description:
      "Fabricamos remates, molduras, canalones y caballetes de acero prepintado hasta 8 metros, cortados al milímetro y entregados en días.",
    images: ["/probuilder/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
