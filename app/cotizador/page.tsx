"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import {
  SteelPrequoteCalculator,
  type SavedLead,
} from "@/components/probuilder-home";
import { materialIaWhatsAppHref } from "@/lib/contact";
import { MATERIALIA_LEAD_STORAGE_KEY } from "@/lib/quote-flow";

const isSavedLead = (value: unknown): value is SavedLead => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const lead = value as Partial<SavedLead>;

  return Boolean(
    lead.metaEventId &&
      lead.quoteCode &&
      lead.nombrePersona &&
      lead.empresa &&
      lead.whatsapp &&
      lead.email &&
      lead.tipoCliente &&
      lead.necesidad &&
      lead.urgencia &&
      lead.detalles,
  );
};

const subscribeToSavedLead = () => () => undefined;
const getServerSavedLeadSnapshot = () => null;
const getSavedLeadSnapshot = () => {
  try {
    return window.sessionStorage.getItem(MATERIALIA_LEAD_STORAGE_KEY);
  } catch {
    return null;
  }
};

const parseSavedLead = (rawLead: string | null) => {
  try {
    if (!rawLead) {
      return null;
    }

    const parsedLead = JSON.parse(rawLead) as unknown;

    return isSavedLead(parsedLead) ? parsedLead : null;
  } catch {
    return null;
  }
};

export default function CotizadorPage() {
  const rawLead = useSyncExternalStore(
    subscribeToSavedLead,
    getSavedLeadSnapshot,
    getServerSavedLeadSnapshot,
  );
  const lead = useMemo(() => parseSavedLead(rawLead), [rawLead]);

  return (
    <main className="quote-page">
      <nav className="quote-page__nav" aria-label="Navegacion del cotizador">
        <Link href="/#contact" className="quote-page__back">
          <ArrowLeft size={17} />
          Formulario
        </Link>
        <a
          className="quote-page__contact"
          href={materialIaWhatsAppHref}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} />
          WhatsApp
        </a>
      </nav>

      {lead ? <SteelPrequoteCalculator lead={lead} /> : null}

      {!lead ? (
        <section className="quote-page__empty">
          <span>Material IA</span>
          <h1>Primero guarda tus datos.</h1>
          <p>
            El pre-cotizador se abre después del formulario para poder asociar
            el cálculo con una solicitud real.
          </p>
          <Link href="/#contact">Ir al formulario</Link>
        </section>
      ) : null}
    </main>
  );
}
