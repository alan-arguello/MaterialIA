import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
const metaPixelId =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "27312585481765745";

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
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
