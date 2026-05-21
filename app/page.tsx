import { MaterialIAHome } from "@/components/probuilder-home";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Material IA",
  url: "https://materialia.ai/",
  email: "contacto@materialia.ai",
  logo: "https://materialia.ai/probuilder/favicon.png",
  image: "https://materialia.ai/probuilder/og.jpg",
  description:
    "Acero prepintado a medida para cubiertas, fachadas, canalones, caballetes, remates y piezas especiales listas para instalar.",
  areaServed: {
    "@type": "Country",
    name: "Colombia",
  },
  founder: {
    "@type": "Person",
    name: "Cesar Quevedo",
    jobTitle: "CEO",
    sameAs: "https://www.linkedin.com/in/caqrs/",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Productos de acero a medida",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Remates y molduras para fachadas",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Canalones y bajantes para aguas lluvias",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Caballetes y tapagoteros para cubiertas",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Doblez de piezas especiales a medida",
        },
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MaterialIAHome />
    </>
  );
}
