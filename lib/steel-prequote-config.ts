export const STEEL_COIL_WIDTH_MM = 1200;
export const STEEL_PREQUOTE_DISCOUNT_MULTIPLIER = 0.9;
export const STEEL_PREQUOTE_VAT_RATE = 0.19;
export const steelBillableWidthsMm = [400, 600, 1200] as const;

export const steelGaugeOptions = ["18", "20", "22", "24", "26", "28"] as const;

export type SteelGauge = (typeof steelGaugeOptions)[number];

export const steelCoilPricesByGauge: Partial<Record<SteelGauge, number>> = {
  "18": 103941.18,
  "20": 95188.24,
  "22": 81358.59,
  "24": 79566.67,
} as const;

export const quotePieceTypes = [
  {
    value: "molduras-remates",
    label: "Molduras/Remates",
    description: "Acabados para fachadas, cubiertas, muros y aleros.",
    image: "/probuilder/service-remates.jpg",
  },
  {
    value: "canal",
    label: "Canal",
    description: "Canales para lluvia en una sola pieza hasta de 8 metros.",
    image: "/probuilder/service-canalones.jpg",
  },
  {
    value: "doblez-medida",
    label: "Doblez a medida / Adjuntar",
    description: "Piezas especiales desde plano, foto o croquis por WhatsApp.",
    image: "/probuilder/service-doblez.jpg",
  },
] as const;

export type QuotePieceTypeValue = (typeof quotePieceTypes)[number]["value"];

export const quoteColorOptions = ["Galvanizado", "9002", "Otro"] as const;

export type QuoteColorValue = (typeof quoteColorOptions)[number];
