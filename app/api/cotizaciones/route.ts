import { type NextRequest, NextResponse } from "next/server";
import { sendMetaLeadEvent } from "@/lib/meta-conversions-api";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type CotizacionBody = {
  nombre_persona?: unknown;
  empresa?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  tipo_cliente?: unknown;
  necesidad?: unknown;
  urgencia?: unknown;
  detalles?: unknown;
  codigo_afiliado?: unknown;
  meta_event_id?: unknown;
  event_source_url?: unknown;
};

type AffiliateCodeRow = {
  id: string;
  codigo: string;
  nombre_afiliado: string;
  descuento_porcentaje: number | string;
};

type UtmTags = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

const getText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

const createFallbackEventId = (leadId: string) => `lead_${leadId}`;
const normalizeAffiliateCode = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "");
const isMissingAffiliateSchemaError = (message: string) =>
  message.includes("codigos_afiliado") ||
  message.includes("codigo_afiliado") ||
  message.includes("nombre_afiliado") ||
  message.includes("descuento_porcentaje") ||
  message.includes("does not exist");
const isMissingUtmSchemaError = (message: string) =>
  message.includes("utm_source") ||
  message.includes("utm_medium") ||
  message.includes("utm_campaign") ||
  message.includes("utm_term") ||
  message.includes("utm_content");
const getSearchParam = (url: URL, key: keyof UtmTags) => {
  const value = url.searchParams.get(key)?.trim() ?? "";

  return value || null;
};
const parseUtmTags = (sourceUrl: string): UtmTags => {
  const emptyUtmTags = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };

  if (!sourceUrl) {
    return emptyUtmTags;
  }

  try {
    const url = new URL(sourceUrl);

    return {
      utm_source: getSearchParam(url, "utm_source"),
      utm_medium: getSearchParam(url, "utm_medium"),
      utm_campaign: getSearchParam(url, "utm_campaign"),
      utm_term: getSearchParam(url, "utm_term"),
      utm_content: getSearchParam(url, "utm_content"),
    };
  } catch {
    return emptyUtmTags;
  }
};
const formatQuoteCode = ({
  createdAt,
  folio,
}: {
  createdAt: string | null;
  folio: number;
}) => {
  const isoDate = createdAt?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  const datePart = (isoDate ?? new Date().toISOString().slice(0, 10)).replaceAll(
    "-",
    "",
  );

  return `${datePart}-CO-${String(folio).padStart(6, "0")}`;
};

export async function POST(request: NextRequest) {
  let body: CotizacionBody;

  try {
    body = (await request.json()) as CotizacionBody;
  } catch {
    return NextResponse.json(
      { error: "La solicitud no tiene un formato válido." },
      { status: 400 },
    );
  }

  const cotizacion = {
    nombre_persona: getText(body.nombre_persona),
    empresa: getText(body.empresa),
    whatsapp: getText(body.whatsapp),
    email: getText(body.email).toLowerCase(),
    tipo_cliente: getText(body.tipo_cliente),
    necesidad: getText(body.necesidad),
    urgencia: getText(body.urgencia),
    detalles: getText(body.detalles),
  };
  const affiliateCode = normalizeAffiliateCode(getText(body.codigo_afiliado));
  const eventSourceUrl =
    getText(body.event_source_url) || request.headers.get("referer") || "";
  const utmTags = parseUtmTags(eventSourceUrl);

  const requiredFields = [
    cotizacion.nombre_persona,
    cotizacion.empresa,
    cotizacion.whatsapp,
    cotizacion.email,
    cotizacion.tipo_cliente,
    cotizacion.necesidad,
    cotizacion.urgencia,
    cotizacion.detalles,
  ];

  if (requiredFields.some((field) => !field)) {
    return NextResponse.json(
      { error: "Completa los campos obligatorios antes de enviar." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(cotizacion.email)) {
    return NextResponse.json(
      { error: "Escribe un correo válido." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    let affiliate: AffiliateCodeRow | null = null;

    if (affiliateCode) {
      if (!/^[A-Z0-9-]{3,32}$/.test(affiliateCode)) {
        return NextResponse.json(
          {
            error:
              "El código de descuento debe usar letras, números o guiones.",
          },
          { status: 400 },
        );
      }

      const { data: affiliateData, error: affiliateError } = await supabase
        .from("codigos_afiliado")
        .select("id,codigo,nombre_afiliado,descuento_porcentaje")
        .eq("codigo", affiliateCode)
        .maybeSingle();

      if (affiliateError) {
        console.error("Supabase affiliate lookup error:", affiliateError);
        if (isMissingAffiliateSchemaError(affiliateError.message)) {
          return NextResponse.json(
            {
              error:
                "El sistema de códigos aún no está configurado. Intenta sin código o aplica la migración en Supabase.",
            },
            { status: 500 },
          );
        }

        return NextResponse.json(
          { error: "No pudimos validar el código de descuento." },
          { status: 500 },
        );
      }

      if (!affiliateData) {
        return NextResponse.json(
          {
            error:
              "Ese código de descuento no existe. Revisa el código o borra el campo para continuar.",
          },
          { status: 400 },
        );
      }

      affiliate = affiliateData as AffiliateCodeRow;
    }

    const discountPercent = affiliate
      ? Number(affiliate.descuento_porcentaje)
      : 0;

    if (!Number.isFinite(discountPercent) || discountPercent < 0) {
      console.error("Affiliate code returned an invalid discount percent.");
      return NextResponse.json(
        { error: "No pudimos validar el descuento del código." },
        { status: 500 },
      );
    }

    const cotizacionWithAffiliate = {
      ...cotizacion,
      codigo_afiliado_id: affiliate?.id ?? null,
      codigo_afiliado: affiliate?.codigo ?? null,
      nombre_afiliado: affiliate?.nombre_afiliado ?? null,
      descuento_porcentaje: discountPercent,
    };
    const cotizacionWithAffiliateAndUtm = {
      ...cotizacionWithAffiliate,
      ...utmTags,
    };

    let { data, error } = await supabase
      .from("cotizaciones")
      .insert(cotizacionWithAffiliateAndUtm)
      .select("id,cotizacion_folio,created_at")
      .single();

    if (error && isMissingUtmSchemaError(error.message)) {
      const { data: withoutUtmData, error: withoutUtmError } = await supabase
        .from("cotizaciones")
        .insert(cotizacionWithAffiliate)
        .select("id,cotizacion_folio,created_at")
        .single();

      data = withoutUtmData;
      error = withoutUtmError;
    }

    if (
      error &&
      !affiliate &&
      isMissingAffiliateSchemaError(error.message)
    ) {
      const { data: legacyData, error: legacyError } = await supabase
        .from("cotizaciones")
        .insert(cotizacion)
        .select("id,cotizacion_folio,created_at")
        .single();

      if (legacyError) {
        console.error("Supabase legacy insert error:", legacyError);
        return NextResponse.json(
          { error: "No pudimos guardar tu solicitud. Intenta de nuevo." },
          { status: 500 },
        );
      }

      data = legacyData;
      error = null;
    }

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "No pudimos guardar tu solicitud. Intenta de nuevo." },
        { status: 500 },
      );
    }

    if (!data?.id) {
      console.error("Supabase insert did not return a lead id.");
      return NextResponse.json(
        { error: "No pudimos confirmar tu solicitud. Intenta de nuevo." },
        { status: 500 },
      );
    }

    const leadId = data.id as string;
    const quoteFolio = Number(data.cotizacion_folio);

    if (!Number.isFinite(quoteFolio) || quoteFolio < 1) {
      console.error("Supabase insert did not return a valid quote folio.");
      return NextResponse.json(
        { error: "No pudimos confirmar el consecutivo. Intenta de nuevo." },
        { status: 500 },
      );
    }

    const quoteCode = formatQuoteCode({
      createdAt: typeof data.created_at === "string" ? data.created_at : null,
      folio: quoteFolio,
    });
    const metaEventId =
      getText(body.meta_event_id) || createFallbackEventId(leadId);

    try {
      await sendMetaLeadEvent({
        request,
        lead: cotizacion,
        eventId: metaEventId,
        eventSourceUrl,
      });
    } catch (error) {
      console.error("Meta CAPI Lead event error:", error);
    }

    return NextResponse.json(
      {
        ok: true,
        leadId,
        quoteCode,
        metaEventId,
        affiliateCode: affiliate?.codigo ?? null,
        affiliateName: affiliate?.nombre_afiliado ?? null,
        discountPercent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Cotizacion API error:", error);
    return NextResponse.json(
      { error: "La conexión con Supabase no está configurada." },
      { status: 500 },
    );
  }
}
