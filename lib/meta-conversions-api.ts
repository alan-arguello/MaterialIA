import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

type LeadData = {
  nombre_persona: string;
  empresa: string;
  whatsapp: string;
  email: string;
  tipo_cliente: string;
  necesidad: string;
  urgencia: string;
  detalles: string;
};

type SendMetaLeadEventInput = {
  request: NextRequest;
  lead: LeadData;
  eventId: string;
  eventSourceUrl?: string;
};

const fallbackPixelId = "2082954105977832";
const defaultGraphApiVersion = "v24.0";

const getEnv = (name: string) => {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
};

const hashValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const normalizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");

const getNameParts = (fullName: string) => {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .map(normalizeName)
    .filter(Boolean);

  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.at(-1) : undefined,
  };
};

const getFirstHeaderValue = (value: string | null) =>
  value?.split(",")[0]?.trim() || undefined;

const getClientIpAddress = (request: NextRequest) =>
  getFirstHeaderValue(request.headers.get("x-forwarded-for")) ??
  getFirstHeaderValue(request.headers.get("x-real-ip")) ??
  getFirstHeaderValue(request.headers.get("cf-connecting-ip"));

const getValidUrl = (...values: Array<string | undefined>) => {
  for (const value of values) {
    if (!value) {
      continue;
    }

    try {
      const url = new URL(value);

      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.toString();
      }
    } catch {
      continue;
    }
  }

  return undefined;
};

const getFbcFromUrl = (eventSourceUrl?: string) => {
  if (!eventSourceUrl) {
    return undefined;
  }

  const fbclid = new URL(eventSourceUrl).searchParams.get("fbclid");

  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
};

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );

export async function sendMetaLeadEvent({
  request,
  lead,
  eventId,
  eventSourceUrl,
}: SendMetaLeadEventInput) {
  const accessToken = getEnv("META_CONVERSIONS_API_ACCESS_TOKEN");
  const pixelId =
    getEnv("META_PIXEL_ID") ??
    getEnv("NEXT_PUBLIC_META_PIXEL_ID") ??
    fallbackPixelId;

  if (!accessToken || !pixelId) {
    return { skipped: true, reason: "missing_meta_config" };
  }

  const resolvedEventSourceUrl = getValidUrl(
    eventSourceUrl,
    request.headers.get("referer") ?? undefined,
  );
  const email = normalizeEmail(lead.email);
  const phone = normalizePhone(lead.whatsapp);
  const { firstName, lastName } = getNameParts(lead.nombre_persona);
  const fbp = request.cookies.get("_fbp")?.value;
  const fbc =
    request.cookies.get("_fbc")?.value ?? getFbcFromUrl(resolvedEventSourceUrl);

  const userData = removeUndefined({
    em: email ? [hashValue(email)] : undefined,
    ph: phone ? [hashValue(phone)] : undefined,
    fn: firstName ? [hashValue(firstName)] : undefined,
    ln: lastName ? [hashValue(lastName)] : undefined,
    client_ip_address: getClientIpAddress(request),
    client_user_agent: request.headers.get("user-agent") ?? undefined,
    fbp,
    fbc,
  });

  const payload = removeUndefined({
    data: [
      removeUndefined({
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: resolvedEventSourceUrl,
        user_data: userData,
        custom_data: removeUndefined({
          content_name: "Solicitud de cotizacion",
          content_category: lead.necesidad,
          lead_type: lead.tipo_cliente,
          urgency: lead.urgencia,
        }),
      }),
    ],
    test_event_code: getEnv("META_TEST_EVENT_CODE"),
    access_token: accessToken,
  });

  const apiVersion = getEnv("META_GRAPH_API_VERSION") ?? defaultGraphApiVersion;
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${pixelId}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Meta Conversions API error ${response.status}: ${responseBody.slice(
        0,
        500,
      )}`,
    );
  }

  return { skipped: false };
}
