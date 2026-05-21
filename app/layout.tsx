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

const siteDescription =
  "Remates, molduras, canalones y caballetes de acero prepintado hasta 8 m para cubiertas y fachadas. Cotiza con planos o fotos y recibe en días.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Material IA",
  title: "Material IA | Acero a medida para obras en días",
  description: siteDescription,
  keywords: [
    "acero prepintado",
    "remates de cubierta",
    "canalones a medida",
    "caballetes para techo",
    "molduras para fachada",
    "doblez de lamina",
    "cubiertas industriales",
    "fachadas arquitectonicas",
  ],
  creator: "Material IA",
  publisher: "Material IA",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/probuilder/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Material IA | Acero a medida para obras en días",
    description: siteDescription,
    url: "/",
    siteName: "Material IA",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/probuilder/og.jpg",
        width: 1200,
        height: 630,
        alt: "Material IA - acero prepintado a medida para cubiertas y fachadas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Material IA | Acero a medida para obras en días",
    description: siteDescription,
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
