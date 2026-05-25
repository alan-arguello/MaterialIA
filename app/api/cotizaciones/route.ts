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
  meta_event_id?: unknown;
  event_source_url?: unknown;
};

const getText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

const createFallbackEventId = (leadId: string) => `lead_${leadId}`;

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
    const { data, error } = await supabase
      .from("cotizaciones")
      .insert(cotizacion)
      .select("id")
      .single();

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
    const metaEventId =
      getText(body.meta_event_id) || createFallbackEventId(leadId);

    try {
      await sendMetaLeadEvent({
        request,
        lead: cotizacion,
        eventId: metaEventId,
        eventSourceUrl: getText(body.event_source_url),
      });
    } catch (error) {
      console.error("Meta CAPI Lead event error:", error);
    }

    return NextResponse.json({ ok: true, metaEventId }, { status: 201 });
  } catch (error) {
    console.error("Cotizacion API error:", error);
    return NextResponse.json(
      { error: "La conexión con Supabase no está configurada." },
      { status: 500 },
    );
  }
}
