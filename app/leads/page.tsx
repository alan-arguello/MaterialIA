import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  Mail,
  Phone,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type LeadRow = {
  id: string;
  nombre_persona: string;
  empresa: string;
  whatsapp: string;
  email: string;
  tipo_cliente: string;
  necesidad: string;
  urgencia: string;
  detalles: string;
  created_at: string;
  codigo_afiliado: string | null;
  nombre_afiliado: string | null;
  descuento_porcentaje: number | string | null;
};

type AffiliateCodeRow = {
  id: string;
  codigo: string;
  nombre_afiliado: string;
  descuento_porcentaje: number | string;
  created_at: string;
};

type LeadsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    affiliate_status?: string | string[];
  }>;
};

const leadColumns =
  "id,nombre_persona,empresa,whatsapp,email,tipo_cliente,necesidad,urgencia,detalles,created_at,codigo_afiliado,nombre_afiliado,descuento_porcentaje";
const legacyLeadColumns =
  "id,nombre_persona,empresa,whatsapp,email,tipo_cliente,necesidad,urgencia,detalles,created_at";
const affiliateColumns =
  "id,codigo,nombre_afiliado,descuento_porcentaje,created_at";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
});
const percentFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 2,
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads | Material IA",
  alternates: {
    canonical: "/leads",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const normalizeSearchParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";
const getFormText = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};
const normalizeAffiliateCode = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "");
const stripDiacritics = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const createCodeBase = (value: string) => {
  const base = stripDiacritics(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "AFILIADO";
};
const createShortSuffix = () =>
  Math.random().toString(36).slice(2, 6).toUpperCase();
const buildLeadsRedirect = (
  formData: FormData,
  status: string,
  queryKey = "return_q",
) => {
  const params = new URLSearchParams();
  const query = getFormText(formData, queryKey);

  if (query) {
    params.set("q", query);
  }

  params.set("affiliate_status", status);

  return `/leads?${params.toString()}`;
};

const formatDate = (value: string) => dateFormatter.format(new Date(value));
const getDiscountPercent = (value: LeadRow["descuento_porcentaje"]) => {
  const discountPercent = Number(value ?? 0);

  return Number.isFinite(discountPercent) && discountPercent > 0
    ? discountPercent
    : 0;
};
const formatDiscountPercent = (
  value: LeadRow["descuento_porcentaje"] | AffiliateCodeRow["descuento_porcentaje"],
) => `${percentFormatter.format(Number(value ?? 0))}%`;

const formatWhatsAppHref = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
};

const isRecentLead = (lead: LeadRow) => {
  const createdAt = new Date(lead.created_at).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return createdAt >= sevenDaysAgo;
};

const matchesSearch = (lead: LeadRow, query: string) => {
  if (!query) {
    return true;
  }

  const haystack = [
    lead.nombre_persona,
    lead.empresa,
    lead.whatsapp,
    lead.email,
    lead.tipo_cliente,
    lead.necesidad,
    lead.urgencia,
    lead.detalles,
    lead.codigo_afiliado ?? "",
    lead.nombre_afiliado ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

const getAffiliateStatusMessage = (status: string) => {
  switch (status) {
    case "created":
      return "Código creado correctamente.";
    case "deleted-code":
      return "Código eliminado.";
    case "deleted-lead":
      return "Lead eliminado.";
    case "missing-name":
      return "Escribe el nombre del afiliado.";
    case "invalid-code":
      return "El código debe usar letras, números o guiones, de 3 a 32 caracteres.";
    case "invalid-discount":
      return "El descuento debe ser mayor a 0% y máximo 50%.";
    case "duplicate-code":
      return "Ese código ya existe. Usa otro código o deja el campo vacío para generarlo.";
    case "save-error":
      return "No pudimos guardar el código. Revisa Supabase e intenta de nuevo.";
    case "delete-code-error":
      return "No pudimos eliminar el código.";
    case "delete-lead-error":
      return "No pudimos eliminar el lead.";
    default:
      return "";
  }
};

const isAffiliateErrorStatus = (status: string) =>
  [
    "missing-name",
    "invalid-code",
    "invalid-discount",
    "duplicate-code",
    "save-error",
    "delete-code-error",
    "delete-lead-error",
  ].includes(status);
const isMissingAffiliateSchemaError = (message: string) =>
  message.includes("cotizaciones.codigo_afiliado") ||
  message.includes("cotizaciones.nombre_afiliado") ||
  message.includes("cotizaciones.descuento_porcentaje") ||
  message.includes("codigos_afiliado") ||
  message.includes("does not exist");

const normalizeLegacyLead = (
  lead: Omit<
    LeadRow,
    "codigo_afiliado" | "nombre_afiliado" | "descuento_porcentaje"
  >,
): LeadRow => ({
  ...lead,
  codigo_afiliado: null,
  nombre_afiliado: null,
  descuento_porcentaje: 0,
});

async function resolveAffiliateCode({
  supabase,
  preferredCode,
  affiliateName,
}: {
  supabase: ReturnType<typeof createSupabaseServerClient>;
  preferredCode: string;
  affiliateName: string;
}) {
  const normalizedPreferredCode = normalizeAffiliateCode(preferredCode);

  if (normalizedPreferredCode) {
    return normalizedPreferredCode;
  }

  const base = createCodeBase(affiliateName);

  for (let index = 0; index < 6; index += 1) {
    const suffix = createShortSuffix();
    const availableBase = base.slice(0, 31 - suffix.length);
    const candidate = `${availableBase}-${suffix}`;
    const { data, error } = await supabase
      .from("codigos_afiliado")
      .select("id")
      .eq("codigo", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  return `${base.slice(0, 23)}-${Date.now().toString(36).toUpperCase()}`.slice(
    0,
    32,
  );
}

async function createAffiliateCode(formData: FormData) {
  "use server";

  const supabase = createSupabaseServerClient();
  const affiliateName = getFormText(formData, "nombre_afiliado");
  const preferredCode = getFormText(formData, "codigo");
  const discountPercent = Number(
    getFormText(formData, "descuento_porcentaje").replace(",", "."),
  );

  if (!affiliateName) {
    redirect(buildLeadsRedirect(formData, "missing-name"));
  }

  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 50) {
    redirect(buildLeadsRedirect(formData, "invalid-discount"));
  }

  let affiliateCode = "";

  try {
    affiliateCode = await resolveAffiliateCode({
      supabase,
      preferredCode,
      affiliateName,
    });
  } catch {
    redirect(buildLeadsRedirect(formData, "save-error"));
  }

  if (!/^[A-Z0-9-]{3,32}$/.test(affiliateCode)) {
    redirect(buildLeadsRedirect(formData, "invalid-code"));
  }

  const { error } = await supabase.from("codigos_afiliado").insert({
    codigo: affiliateCode,
    nombre_afiliado: affiliateName,
    descuento_porcentaje: discountPercent,
  });

  if (error) {
    redirect(
      buildLeadsRedirect(
        formData,
        error.code === "23505" ? "duplicate-code" : "save-error",
      ),
    );
  }

  revalidatePath("/leads");
  redirect(buildLeadsRedirect(formData, "created"));
}

async function deleteAffiliateCode(formData: FormData) {
  "use server";

  const id = getFormText(formData, "id");

  if (!id) {
    redirect(buildLeadsRedirect(formData, "delete-code-error"));
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("codigos_afiliado").delete().eq("id", id);

  if (error) {
    redirect(buildLeadsRedirect(formData, "delete-code-error"));
  }

  revalidatePath("/leads");
  redirect(buildLeadsRedirect(formData, "deleted-code"));
}

async function deleteLead(formData: FormData) {
  "use server";

  const id = getFormText(formData, "id");

  if (!id) {
    redirect(buildLeadsRedirect(formData, "delete-lead-error"));
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("cotizaciones").delete().eq("id", id);

  if (error) {
    redirect(buildLeadsRedirect(formData, "delete-lead-error"));
  }

  revalidatePath("/leads");
  redirect(buildLeadsRedirect(formData, "deleted-lead"));
}

const getUrgencyClass = (urgency: string) => {
  if (urgency.toLowerCase().includes("semana")) {
    return "leads-pill leads-pill--hot";
  }

  if (urgency.toLowerCase().includes("1 a 2")) {
    return "leads-pill leads-pill--soon";
  }

  return "leads-pill";
};

async function getLeads() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(leadColumns)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    if (isMissingAffiliateSchemaError(error.message)) {
      const { data: legacyData, error: legacyError } = await supabase
        .from("cotizaciones")
        .select(legacyLeadColumns)
        .order("created_at", { ascending: false })
        .limit(200);

      if (legacyError) {
        throw new Error(legacyError.message);
      }

      return {
        leads: (legacyData ?? []).map((lead) =>
          normalizeLegacyLead(
            lead as Omit<
              LeadRow,
              "codigo_afiliado" | "nombre_afiliado" | "descuento_porcentaje"
            >,
          ),
        ),
        affiliateSchemaReady: false,
      };
    }

    throw new Error(error.message);
  }

  return {
    leads: (data ?? []) as LeadRow[],
    affiliateSchemaReady: true,
  };
}

async function getAffiliateCodes() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("codigos_afiliado")
    .select(affiliateColumns)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    if (isMissingAffiliateSchemaError(error.message)) {
      return {
        affiliateCodes: [],
        affiliateSchemaReady: false,
      };
    }

    throw new Error(error.message);
  }

  return {
    affiliateCodes: (data ?? []) as AffiliateCodeRow[],
    affiliateSchemaReady: true,
  };
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "hot";
}) {
  return (
    <div className={`leads-stat leads-stat--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const query = normalizeSearchParam(params?.q).trim();
  const affiliateStatus = normalizeSearchParam(params?.affiliate_status).trim();
  const affiliateStatusMessage = getAffiliateStatusMessage(affiliateStatus);
  let leads: LeadRow[] = [];
  let affiliateCodes: AffiliateCodeRow[] = [];
  let affiliateSchemaReady = true;
  let errorMessage = "";

  try {
    const [leadsResult, affiliateCodesResult] = await Promise.all([
      getLeads(),
      getAffiliateCodes(),
    ]);
    leads = leadsResult.leads;
    affiliateCodes = affiliateCodesResult.affiliateCodes;
    affiliateSchemaReady =
      leadsResult.affiliateSchemaReady &&
      affiliateCodesResult.affiliateSchemaReady;
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "No pudimos cargar los datos de Supabase.";
  }

  const filteredLeads = leads.filter((lead) => matchesSearch(lead, query));
  const hotLeads = leads.filter((lead) =>
    lead.urgencia.toLowerCase().includes("semana"),
  );
  const uniqueCompanies = new Set(leads.map((lead) => lead.empresa)).size;
  const referredLeads = leads.filter(
    (lead) => lead.codigo_afiliado && getDiscountPercent(lead.descuento_porcentaje),
  );

  return (
    <main className="leads-page">
      <div className="leads-shell">
        <header className="leads-header">
          <div className="leads-header__copy">
            <p className="leads-eyebrow">Panel privado</p>
            <h1>Leads de cotizaciones</h1>
            <p>
              Solicitudes guardadas desde la página. Esta vista se mantiene
              fuera de indexación y está pensada para revisar, filtrar y
              contactar rápido.
            </p>
            <div className="leads-header__badges" aria-label="Estado del panel">
              <span>No indexable</span>
              <span>Supabase</span>
              <span>Últimas 200</span>
              <span>Códigos</span>
            </div>
          </div>
          <form className="leads-search" action="/leads">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Buscar por nombre, empresa, correo, necesidad o afiliado"
              defaultValue={query}
            />
          </form>
        </header>

        <section className="leads-stats" aria-label="Resumen de leads">
          <Stat label="Leads cargados" value={leads.length} />
          <Stat
            label="Últimos 7 días"
            value={leads.filter(isRecentLead).length}
          />
          <Stat label="Urgentes" value={hotLeads.length} tone="hot" />
          <Stat label="Empresas" value={uniqueCompanies} />
          <Stat label="Referidos" value={referredLeads.length} />
        </section>

        {errorMessage ? (
          <section className="leads-alert" role="alert">
            <strong>No se pudo cargar el dashboard.</strong>
            <span>{errorMessage}</span>
          </section>
        ) : (
          <>
            <section className="leads-panel affiliate-panel">
              <div className="leads-panel__head">
                <div>
                  <h2>Códigos de afiliado</h2>
                  <p>
                    Crea un código con nombre de afiliado y porcentaje de
                    descuento para el cliente.
                  </p>
                </div>
              </div>
              {affiliateStatusMessage ? (
                <p
                  className={`affiliate-message affiliate-message--${
                    isAffiliateErrorStatus(affiliateStatus) ? "error" : "success"
                  }`}
                  role={
                    isAffiliateErrorStatus(affiliateStatus) ? "alert" : "status"
                  }
                >
                  {affiliateStatusMessage}
                </p>
              ) : null}
              {!affiliateSchemaReady ? (
                <p className="affiliate-message affiliate-message--error">
                  Falta aplicar la migración de afiliados en Supabase. Mientras
                  tanto, los leads antiguos cargan normalmente, pero la creación
                  de códigos y el cruce de referidos quedan desactivados.
                </p>
              ) : null}
              <form className="affiliate-form" action={createAffiliateCode}>
                <input type="hidden" name="return_q" value={query} />
                <label>
                  <span>Nombre del afiliado</span>
                  <input
                    name="nombre_afiliado"
                    type="text"
                    placeholder="Nombre o empresa"
                    disabled={!affiliateSchemaReady}
                    required
                  />
                </label>
                <label>
                  <span>Código</span>
                  <input
                    name="codigo"
                    type="text"
                    placeholder="ARQUO-10"
                    pattern="[A-Za-z0-9-]{3,32}"
                    disabled={!affiliateSchemaReady}
                  />
                </label>
                <label>
                  <span>% descuento cliente</span>
                  <input
                    name="descuento_porcentaje"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    max="50"
                    step="0.01"
                    placeholder="10"
                    disabled={!affiliateSchemaReady}
                    required
                  />
                </label>
                <button type="submit" disabled={!affiliateSchemaReady}>
                  <Plus size={17} aria-hidden="true" />
                  Crear código
                </button>
              </form>

              <div className="affiliate-codes" aria-label="Códigos existentes">
                {affiliateCodes.length ? (
                  affiliateCodes.map((code) => (
                    <article className="affiliate-code-card" key={code.id}>
                      <div>
                        <div className="affiliate-code-card__head">
                          <strong>{code.codigo}</strong>
                          <span className="affiliate-status">
                            {formatDiscountPercent(code.descuento_porcentaje)}
                          </span>
                        </div>
                        <p>{code.nombre_afiliado}</p>
                        <small>
                          Código activo para aplicar descuento en la cotización.
                        </small>
                      </div>
                      <form action={deleteAffiliateCode}>
                        <input type="hidden" name="return_q" value={query} />
                        <input type="hidden" name="id" value={code.id} />
                        <button
                          className="affiliate-delete-button"
                          type="submit"
                          aria-label={`Eliminar código ${code.codigo}`}
                        >
                          Eliminar
                        </button>
                      </form>
                    </article>
                  ))
                ) : (
                  <div className="affiliate-empty">
                    <strong>Sin códigos todavía</strong>
                    <span>
                      Crea el primer código para que aparezca en esta lista.
                    </span>
                  </div>
                )}
              </div>
            </section>

            <section className="leads-panel">
              <div className="leads-panel__head">
                <div>
                  <h2>Solicitudes recientes</h2>
                  <p>
                    {query
                      ? `${filteredLeads.length} resultados para "${query}"`
                      : "Mostrando las últimas 200 solicitudes"}
                  </p>
                </div>
              </div>

              {filteredLeads.length ? (
                <>
                  <div
                    className="leads-list"
                    aria-label="Solicitudes recientes"
                  >
                    {filteredLeads.map((lead) => {
                      const whatsappHref = formatWhatsAppHref(lead.whatsapp);
                      const discountPercent = getDiscountPercent(
                        lead.descuento_porcentaje,
                      );

                      return (
                        <article className="lead-card" key={lead.id}>
                          <div className="lead-card__head">
                            <div>
                              <span>{lead.tipo_cliente}</span>
                              <h3>{lead.nombre_persona}</h3>
                              <p>{lead.empresa}</p>
                            </div>
                            <span className={getUrgencyClass(lead.urgencia)}>
                              {lead.urgencia}
                            </span>
                          </div>
                          <div className="lead-card__need">
                            <strong>{lead.necesidad}</strong>
                            <p>
                              {lead.detalles || "Sin detalles adicionales."}
                            </p>
                          </div>
                          {lead.codigo_afiliado && discountPercent ? (
                            <div className="lead-referral">
                              <span>Referido</span>
                              <strong>{lead.codigo_afiliado}</strong>
                              <small>
                                {lead.nombre_afiliado ?? "Afiliado"} ·{" "}
                                {formatDiscountPercent(discountPercent)} desc.
                              </small>
                            </div>
                          ) : null}
                          <div className="lead-card__meta">
                            <span>
                              <CalendarClock size={14} aria-hidden="true" />
                              {formatDate(lead.created_at)}
                            </span>
                            <a href={`mailto:${lead.email}`}>
                              <Mail size={14} aria-hidden="true" />
                              {lead.email}
                            </a>
                            {whatsappHref ? (
                              <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Phone size={14} aria-hidden="true" />
                                {lead.whatsapp}
                              </a>
                            ) : (
                              <span>
                                <Phone size={14} aria-hidden="true" />
                                {lead.whatsapp}
                              </span>
                            )}
                          </div>
                          <div className="lead-card__actions">
                            <a href={`mailto:${lead.email}`}>
                              Correo
                              <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                            {whatsappHref ? (
                              <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                WhatsApp
                                <ArrowUpRight size={14} aria-hidden="true" />
                              </a>
                            ) : null}
                            <form action={deleteLead}>
                              <input type="hidden" name="return_q" value={query} />
                              <input type="hidden" name="id" value={lead.id} />
                              <button
                                className="leads-delete-button"
                                type="submit"
                                aria-label={`Eliminar lead de ${lead.nombre_persona}`}
                              >
                                Eliminar
                              </button>
                            </form>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="leads-table-wrap">
                    <table className="leads-table">
                      <thead>
                        <tr>
                          <th>Contacto</th>
                          <th>Empresa</th>
                          <th>Necesidad</th>
                          <th>Referido</th>
                          <th>Urgencia</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => {
                          const whatsappHref = formatWhatsAppHref(
                            lead.whatsapp,
                          );
                          const discountPercent = getDiscountPercent(
                            lead.descuento_porcentaje,
                          );

                          return (
                            <tr key={lead.id}>
                              <td>
                                <div className="leads-contact">
                                  <strong>{lead.nombre_persona}</strong>
                                  <span>{lead.tipo_cliente}</span>
                                  <a href={`mailto:${lead.email}`}>
                                    <Mail size={14} aria-hidden="true" />
                                    {lead.email}
                                  </a>
                                  {whatsappHref ? (
                                    <a
                                      href={whatsappHref}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Phone size={14} aria-hidden="true" />
                                      {lead.whatsapp}
                                    </a>
                                  ) : (
                                    <span>{lead.whatsapp}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="leads-company">
                                  <Building2 size={16} aria-hidden="true" />
                                  <span>{lead.empresa}</span>
                                </div>
                              </td>
                              <td>
                                <div className="leads-need">
                                  <strong>{lead.necesidad}</strong>
                                  <span>{lead.detalles}</span>
                                </div>
                              </td>
                              <td>
                                {lead.codigo_afiliado && discountPercent ? (
                                  <div className="leads-referral">
                                    <strong>{lead.codigo_afiliado}</strong>
                                    <span>
                                      {lead.nombre_afiliado ?? "Afiliado"} ·{" "}
                                      {formatDiscountPercent(discountPercent)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="leads-muted">Sin referido</span>
                                )}
                              </td>
                              <td>
                                <span
                                  className={getUrgencyClass(lead.urgencia)}
                                >
                                  {lead.urgencia}
                                </span>
                              </td>
                              <td>
                                <span className="leads-date">
                                  <CalendarClock size={15} aria-hidden="true" />
                                  {formatDate(lead.created_at)}
                                </span>
                              </td>
                              <td>
                                <div className="leads-actions">
                                  <a href={`mailto:${lead.email}`}>Correo</a>
                                  {whatsappHref ? (
                                    <a
                                      href={whatsappHref}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      WhatsApp
                                    </a>
                                  ) : null}
                                  <form action={deleteLead}>
                                    <input
                                      type="hidden"
                                      name="return_q"
                                      value={query}
                                    />
                                    <input
                                      type="hidden"
                                      name="id"
                                      value={lead.id}
                                    />
                                    <button
                                      className="leads-delete-button"
                                      type="submit"
                                      aria-label={`Eliminar lead de ${lead.nombre_persona}`}
                                    >
                                      Eliminar
                                    </button>
                                  </form>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="leads-empty">
                  <UserRound size={28} aria-hidden="true" />
                  <h2>No hay leads para mostrar</h2>
                  <p>
                    {query
                      ? "Prueba con otra búsqueda o limpia el filtro."
                      : "Cuando llegue una cotización, aparecerá aquí."}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
