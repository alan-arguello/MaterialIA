import type { Metadata } from "next";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  Mail,
  Phone,
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
};

type LeadsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

const leadColumns =
  "id,nombre_persona,empresa,whatsapp,email,tipo_cliente,necesidad,urgencia,detalles,created_at";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
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

const formatDate = (value: string) => dateFormatter.format(new Date(value));

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
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

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
    throw new Error(error.message);
  }

  return (data ?? []) as LeadRow[];
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
  let leads: LeadRow[] = [];
  let errorMessage = "";

  try {
    leads = await getLeads();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "No pudimos cargar los leads de Supabase.";
  }

  const filteredLeads = leads.filter((lead) => matchesSearch(lead, query));
  const hotLeads = leads.filter((lead) =>
    lead.urgencia.toLowerCase().includes("semana"),
  );
  const uniqueCompanies = new Set(leads.map((lead) => lead.empresa)).size;

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
            </div>
          </div>
          <form className="leads-search" action="/leads">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Buscar por nombre, empresa, correo o necesidad"
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
        </section>

        {errorMessage ? (
          <section className="leads-alert" role="alert">
            <strong>No se pudo cargar el dashboard.</strong>
            <span>{errorMessage}</span>
          </section>
        ) : (
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
                <div className="leads-list" aria-label="Solicitudes recientes">
                  {filteredLeads.map((lead) => {
                    const whatsappHref = formatWhatsAppHref(lead.whatsapp);

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
                          <p>{lead.detalles || "Sin detalles adicionales."}</p>
                        </div>
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
                        <th>Urgencia</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const whatsappHref = formatWhatsAppHref(lead.whatsapp);

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
                              <span className={getUrgencyClass(lead.urgencia)}>
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
        )}
      </div>
    </main>
  );
}
