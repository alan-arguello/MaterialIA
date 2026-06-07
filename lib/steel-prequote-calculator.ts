import {
  STEEL_COIL_WIDTH_MM,
  STEEL_PREQUOTE_VAT_RATE,
  steelBillableWidthsMm,
  steelCoilPricesByGauge,
  type SteelGauge,
} from "./steel-prequote-config";

export type SteelPrequotePieceInput = {
  developmentMm: number;
  gauge: SteelGauge;
  linearMeters: number;
};

export type SteelPrequotePieceResult = SteelPrequotePieceInput & {
  billableDevelopmentMm: number | null;
  unitPrice: number | null;
  pieceTotal: number | null;
  requiresContact: boolean;
  contactReason: string | null;
};

export type SteelPrequoteResult = {
  pieces: SteelPrequotePieceResult[];
  subtotal: number;
  vat: number;
  total: number;
};

export function parseDevelopmentExpression(value: string) {
  const normalized = value.trim().replaceAll(",", ".");

  if (!normalized) {
    return null;
  }

  if (!/^\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)*$/.test(normalized)) {
    return null;
  }

  const developmentMm = normalized
    .split("+")
    .reduce((total, segment) => total + Number(segment.trim()), 0);

  return developmentMm > 0 ? developmentMm : null;
}

export function parsePositiveNumber(value: string) {
  const number = Number(value.trim().replace(",", "."));

  return Number.isFinite(number) && number > 0 ? number : null;
}

export function getBillableDevelopmentWidth(developmentMm: number) {
  return (
    steelBillableWidthsMm.find(
      (billableWidthMm) => developmentMm <= billableWidthMm,
    ) ?? null
  );
}

export function calculateSteelPiecePrequote({
  developmentMm,
  gauge,
  linearMeters,
}: SteelPrequotePieceInput): SteelPrequotePieceResult {
  const billableDevelopmentMm = getBillableDevelopmentWidth(developmentMm);
  const gaugeMeterPrice = steelCoilPricesByGauge[gauge];

  if (!billableDevelopmentMm) {
    return {
      developmentMm,
      gauge,
      linearMeters,
      billableDevelopmentMm,
      unitPrice: null,
      pieceTotal: null,
      requiresContact: true,
      contactReason: "Desarrollo mayor a 1200 mm",
    };
  }

  if (!gaugeMeterPrice) {
    return {
      developmentMm,
      gauge,
      linearMeters,
      billableDevelopmentMm,
      unitPrice: null,
      pieceTotal: null,
      requiresContact: true,
      contactReason: `Calibre ${gauge} pendiente por precio`,
    };
  }

  const coilConsumption = billableDevelopmentMm / STEEL_COIL_WIDTH_MM;
  const unitPrice = gaugeMeterPrice * coilConsumption;
  const pieceTotal = unitPrice * linearMeters;

  return {
    developmentMm,
    gauge,
    linearMeters,
    billableDevelopmentMm,
    unitPrice,
    pieceTotal,
    requiresContact: false,
    contactReason: null,
  };
}

export function calculateSteelPrequote(
  pieces: SteelPrequotePieceInput[],
): SteelPrequoteResult {
  const quotedPieces = pieces.map(calculateSteelPiecePrequote);
  const subtotal = quotedPieces.reduce(
    (total, piece) => total + (piece.pieceTotal ?? 0),
    0,
  );
  const vat = subtotal * STEEL_PREQUOTE_VAT_RATE;

  return {
    pieces: quotedPieces,
    subtotal,
    vat,
    total: subtotal + vat,
  };
}
