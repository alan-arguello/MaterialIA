"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  calculateSteelPrequote,
  parseDevelopmentExpression,
  parsePositiveNumber,
  type SteelPrequotePieceResult,
} from "@/lib/steel-prequote-calculator";
import {
  quoteColorOptions,
  quotePieceTypes,
  steelGaugeOptions,
  type QuoteColorValue,
  type QuotePieceTypeValue,
  type SteelGauge,
} from "@/lib/steel-prequote-config";
import {
  buyerProfiles,
  clientLogos,
  comparisonRows,
  footerGroups,
  navItems,
  processSteps,
  projects,
  services,
  speciality,
  stats,
} from "@/lib/probuilder-data";
import {
  materialIaEmail,
  materialIaWhatsAppDigits,
  materialIaWhatsAppDisplay,
  materialIaWhatsAppHref,
} from "@/lib/contact";
import { MATERIALIA_LEAD_STORAGE_KEY } from "@/lib/quote-flow";

const asset = (name: string) => `/probuilder/${name}`;
const whatsappNumber = materialIaWhatsAppDigits;
const quoteDisclaimer =
  "Este precio es estimado y no optimiza el aprovechamiento de lámina. Al contactarnos con el despiece completo, podemos revisar si tu pedido usa mejor la hoja y darte un precio optimizado.";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const createMetaEventId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

function Logo() {
  return (
    <a href="#home" className="logo" aria-label="Inicio Material IA">
      <span>Material</span>
      <strong>IA</strong>
    </a>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ButtonLink({
  href,
  children,
  variant = "orange",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "orange" | "outline" | "white";
}) {
  return (
    <a href={href} className={`button-link button-link--${variant}`}>
      <span>{children}</span>
      <span className="button-link__icon" aria-hidden="true">
        <ArrowUpRight size={18} strokeWidth={2.4} />
        <ArrowUpRight size={18} strokeWidth={2.4} />
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-shell">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegacion principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ButtonLink href="#contact" variant="outline">
            Cotizar
          </ButtonLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            className="mobile-nav"
            aria-label="Navegacion movil"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink href="#contact" variant="orange">
              Cotizar
            </ButtonLink>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function ImageTile({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`image-tile ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 820px) 100vw, 50vw"
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset("materialia-hero-poster.jpg")}
        aria-hidden="true"
      >
        <source src={asset("materialia-hero.mp4")} type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content shell">
        <Reveal className="hero-copy hero-copy--center">
          <h1>
            <span className="hero-line">Acero a medida</span>
            <span className="hero-line">para tu obra en días</span>
          </h1>
          <p>
            Cortamos y doblamos láminas de acero hasta de 8 metros: remates,
            molduras, canalones y caballetes prepintados, listos para instalar
            sin reprocesos en obra.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#contact">Cotizar mi obra</ButtonLink>
            <ButtonLink href="#services" variant="white">
              Ver productos
            </ButtonLink>
          </div>
        </Reveal>
      </div>
      <div className="hero-social">
        <Reveal className="hero-social__inner" delay={0.16}>
          <p>Clientes y aliados del sector construcción</p>
          <div className="hero-logo-track">
            {clientLogos.map((client) => (
              <div className="hero-logo" key={client.name}>
                <Image
                  src={client.image}
                  alt={client.name}
                  width={180}
                  height={64}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="shell about-grid">
        <Reveal className="about-media">
          <ImageTile
            src={asset("steel.jpg")}
            alt="Rollo de acero en almacen"
            className="about-image"
          />
          <Image
            className="about-mark"
            src={asset("about-mark.svg")}
            alt=""
            width={132}
            height={132}
            aria-hidden="true"
            style={{ height: "auto" }}
          />
        </Reveal>
        <Reveal className="about-copy" delay={0.1}>
          <SectionEyebrow>Nuestra misión</SectionEyebrow>
          <h2>El acero exacto para cada esquina, fachada y cubierta.</h2>
          <p>
            Trabajamos láminas de acero prepintado en remates, molduras,
            canalones y caballetes hasta de 8 metros. Cada pieza se corta y
            dobla según los planos, fotos o croquis de tu obra.
          </p>
          <p>
            Usamos IA en el proceso para cotizar al instante y aprovechar mejor
            cada lámina. Entregamos en días lo que el mercado tarda semanas, al
            milímetro del plano.
          </p>
          <div className="about-actions">
            <ButtonLink href="#contact">Cotizar mi obra</ButtonLink>
            <a className="support-link" href="#contact">
              <span aria-hidden="true">
                <Phone size={20} />
              </span>
              <small>Para constructores e instaladores</small>
              <strong>Cotizamos por WhatsApp en minutos</strong>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section className="section founder-section">
      <div className="shell">
        <Reveal className="founder-panel">
          <div className="founder-copy">
            <Image
              className="founder-avatar"
              src={asset("cesar-quevedo.jpg")}
              alt="Cesar Quevedo, CEO de Material IA"
              width={96}
              height={96}
            />
            <div>
              <h2>Respaldada por años de experiencia real en el mercado.</h2>
              <p>
                Material IA es liderada por Cesar Quevedo, CEO con experiencia
                en estrategia, finanzas y supply chain. Ha trabajado por más de
                10 años en Metecno y combina operación, datos e IA para reducir
                reprocesos y acelerar decisiones en obra.
              </p>
              <a
                className="founder-link"
                href="https://www.linkedin.com/in/caqrs/"
                target="_blank"
                rel="noreferrer"
              >
                Ver perfil de Cesar
                <ArrowUpRight size={17} strokeWidth={2.4} />
              </a>
            </div>
          </div>
          <div className="founder-logos" aria-label="Experiencia y formación">
            <div className="founder-logo-card">
              <span className="founder-logo">
                <Image
                  src={asset("logo-egade.jpg")}
                  alt="EGADE Business School"
                  width={150}
                  height={70}
                />
              </span>
              <span>
                <small>Formación ejecutiva</small>
                <strong>EGADE Business School</strong>
              </span>
            </div>
            <div className="founder-logo-card">
              <span className="founder-logo founder-logo--seal">
                <Image
                  src={asset("logo-berkeley.png")}
                  alt="UC Berkeley Extension"
                  width={70}
                  height={70}
                />
              </span>
              <span>
                <small>Innovación y negocio</small>
                <strong>UC Berkeley Extension</strong>
              </span>
            </div>
            <div className="founder-logo-card">
              <span className="founder-logo founder-logo--seal">
                <Image
                  src={asset("logo-javeriana.jpg")}
                  alt="Pontificia Universidad Javeriana"
                  width={88}
                  height={88}
                />
              </span>
              <span>
                <small>Base profesional</small>
                <strong>Pontificia Universidad Javeriana</strong>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Speciality() {
  return (
    <section className="section speciality-section">
      <div className="shell">
        <Reveal className="section-heading section-heading--center">
          <SectionEyebrow>Especialidad</SectionEyebrow>
          <h2>Lo que nos hace distintos del mercado</h2>
        </Reveal>
        <div className="feature-grid">
          {speciality.map((item, index) => (
            <Reveal
              className="feature-card"
              key={item.title}
              delay={index * 0.06}
            >
              <span className="feature-card__marker">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkProcess() {
  return (
    <section className="section process-section">
      <div className="shell">
        <Reveal className="section-heading">
          <SectionEyebrow>Como trabajamos</SectionEyebrow>
          <h2>De la lámina al despacho, en pocos días</h2>
        </Reveal>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <Reveal
              className="process-card"
              key={step.title}
              delay={index * 0.08}
            >
              <ImageTile
                src={step.image}
                alt="Proceso de trabajo"
                className="process-card__image"
              />
              <div className="process-card__body">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="section why-section">
      <div className="shell why-shell">
        <Reveal className="why-intro">
          <div>
            <h2>
              Acero exacto, prepintado y listo en <span>días</span>.
            </h2>
          </div>
          <p>
            En cubiertas y fachadas, perder un día corta el cronograma. Por eso
            fabricamos a tu medida, prepintado y listo para instalar sin
            reprocesos en obra.
          </p>
        </Reveal>
        <Reveal className="why-stats" delay={0.08}>
          {stats.map((item) => (
            <div className="stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </Reveal>
        <Reveal className="why-comparison-card" delay={0.12}>
          <div className="why-comparison-head">
            <h3>Comparativo con el mercado</h3>
            <p>
              La diferencia se nota en medidas largas, piezas especiales,
              entrega rápida y acabado listo para instalar.
            </p>
          </div>
          <div className="comparison-list">
            <div className="comparison-row comparison-row--head">
              <span>Criterio</span>
              <span>Mercado</span>
              <span>Material IA</span>
            </div>
            {comparisonRows.map((row) => (
              <div className="comparison-row" key={row.factor}>
                <span>{row.factor}</span>
                <span>{row.market}</span>
                <strong>{row.materialIa}</strong>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="why-result" delay={0.16}>
          <div>
            <span>Resultado</span>
            <h3>Menos reprocesos, más obra avanzada</h3>
          </div>
          <p>
            Cada pieza llega doblada al milímetro del plano. Sin recortes en
            obra, sin uniones que filtren y sin sorpresas en la entrega.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="shell">
        <Reveal className="section-heading section-heading--split">
          <div>
            <SectionEyebrow>Productos</SectionEyebrow>
            <h2>Lo que fabricamos</h2>
          </div>
          <ButtonLink href="#contact" variant="outline">
            Cotizar
          </ButtonLink>
        </Reveal>
        <div className="service-grid">
          {services.map((service, index) => (
            <Reveal
              className="service-card"
              key={service.title}
              delay={index * 0.05}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 820px) 100vw, 25vw"
                style={{ objectPosition: service.imagePosition }}
              />
              <span className="service-card__shade" />
              <div className="service-card__content">
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type QuotePieceDraft = {
  id: string;
  pieceType: QuotePieceTypeValue;
  developmentInput: string;
  gauge: SteelGauge;
  color: QuoteColorValue;
  customColor: string;
  linearMetersInput: string;
};

type ParsedQuotePiece = QuotePieceDraft & {
  developmentMm: number | null;
  linearMeters: number | null;
  pieceTypeLabel: string;
  colorLabel: string;
};

type ValidParsedQuotePiece = ParsedQuotePiece & {
  developmentMm: number;
  linearMeters: number;
};

type QuotedQuotePiece = ValidParsedQuotePiece & {
  billableDevelopmentMm: SteelPrequotePieceResult["billableDevelopmentMm"];
  unitPrice: SteelPrequotePieceResult["unitPrice"];
  pieceTotal: SteelPrequotePieceResult["pieceTotal"];
  requiresContact: SteelPrequotePieceResult["requiresContact"];
  contactReason: SteelPrequotePieceResult["contactReason"];
};

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});
const measurementFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 2,
});

const formatCop = (value: number) =>
  `COP ${currencyFormatter.format(Math.round(value))}`;
const formatWhatsappCop = (value: number, suffix = "") =>
  `*${formatCop(value)}${suffix}*`;
const formatMeasurement = (value: number) => measurementFormatter.format(value);
const getPieceTypeLabel = (value: QuotePieceTypeValue) =>
  quotePieceTypes.find((type) => type.value === value)?.label ?? value;
const getColorLabel = (piece: QuotePieceDraft) =>
  piece.color === "Otro" ? piece.customColor.trim() || "Otro" : piece.color;

export type SavedLead = {
  leadId: string | null;
  quoteCode: string | null;
  metaEventId: string;
  nombrePersona: string;
  empresa: string;
  whatsapp: string;
  email: string;
  tipoCliente: string;
  necesidad: string;
  urgencia: string;
  detalles: string;
};

const createQuotePieceDraft = (id: string): QuotePieceDraft => ({
  id,
  pieceType: "molduras-remates",
  developmentInput: "450",
  gauge: "18",
  color: "Galvanizado",
  customColor: "",
  linearMetersInput: "1",
});

const isValidParsedQuotePiece = (
  piece: ParsedQuotePiece,
): piece is ValidParsedQuotePiece =>
  piece.developmentMm !== null && piece.linearMeters !== null;

function buildWhatsAppQuoteMessage({
  lead,
  pieces,
  subtotal,
  vat,
  total,
}: {
  lead: SavedLead;
  pieces: QuotedQuotePiece[];
  subtotal: number;
  vat: number;
  total: number;
}) {
  const pieceSummary = pieces
    .map((piece, index) => {
      const billableWidth = piece.billableDevelopmentMm
        ? `${formatMeasurement(piece.billableDevelopmentMm)} mm`
        : "Revisar por WhatsApp";
      const unitPrice = piece.unitPrice !== null
        ? formatWhatsappCop(piece.unitPrice, "/m")
        : "Cotizar por WhatsApp";
      const pieceTotal = piece.pieceTotal !== null
        ? formatWhatsappCop(piece.pieceTotal)
        : "Cotizar por WhatsApp";

      return [
        `Pieza ${index + 1}: ${piece.pieceTypeLabel}`,
        `Desarrollo: ${formatMeasurement(piece.developmentMm)} mm`,
        `Ancho útil cobrado: ${billableWidth}`,
        `Calibre: ${piece.gauge}`,
        `Color/acabado: ${piece.colorLabel}`,
        `Metros lineales: ${formatMeasurement(piece.linearMeters)} m`,
        `Precio unitario estimado: ${unitPrice}`,
        `Total pieza estimado: ${pieceTotal}`,
        piece.contactReason ? `Nota: ${piece.contactReason}` : "",
        piece.pieceType === "doblez-medida"
          ? "Adjunto plano, foto o croquis por WhatsApp."
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return [
    "Hola Material IA, quiero continuar con esta pre-cotización:",
    "",
    `Código de solicitud: ${lead.quoteCode ?? "Pendiente de confirmar"}`,
    `Contacto: ${lead.nombrePersona}`,
    `Empresa: ${lead.empresa}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Correo: ${lead.email}`,
    `Tipo de cliente: ${lead.tipoCliente}`,
    `Urgencia: ${lead.urgencia}`,
    `Necesidad inicial: ${lead.necesidad}`,
    `Detalles iniciales: ${lead.detalles}`,
    "",
    "Los siguientes precios no incluyen IVA.",
    "",
    pieceSummary,
    "",
    `Subtotal estimado: ${formatCop(subtotal)}`,
    `IVA 19%: ${formatCop(vat)}`,
    `Total estimado: ${formatCop(total)}`,
    "",
    quoteDisclaimer,
    "",
    "¿Quieres agendar una llamada?",
    "Opciones:",
    "- Llámame dentro de los próximos 5 minutos.",
    "- Agendar una llamada telefónica.",
  ].join("\n");
}

export function SteelPrequoteCalculator({ lead }: { lead: SavedLead }) {
  const [pieces, setPieces] = useState<QuotePieceDraft[]>([
    createQuotePieceDraft("quote-piece-1"),
  ]);

  const updatePiece = <Field extends keyof QuotePieceDraft>(
    id: string,
    field: Field,
    value: QuotePieceDraft[Field],
  ) => {
    setPieces((currentPieces) =>
      currentPieces.map((piece) =>
        piece.id === id ? { ...piece, [field]: value } : piece,
      ),
    );
  };

  const addPiece = () => {
    setPieces((currentPieces) => [
      ...currentPieces,
      createQuotePieceDraft(`quote-piece-${Date.now()}`),
    ]);
  };

  const removePiece = (id: string) => {
    setPieces((currentPieces) =>
      currentPieces.length === 1
        ? currentPieces
        : currentPieces.filter((piece) => piece.id !== id),
    );
  };

  const quoteState = useMemo(() => {
    const parsedPieces: ParsedQuotePiece[] = pieces.map((piece) => ({
      ...piece,
      developmentMm: parseDevelopmentExpression(piece.developmentInput),
      linearMeters: parsePositiveNumber(piece.linearMetersInput),
      pieceTypeLabel: getPieceTypeLabel(piece.pieceType),
      colorLabel: getColorLabel(piece),
    }));
    const validPieces = parsedPieces.filter(isValidParsedQuotePiece);
    const totals = calculateSteelPrequote(
      validPieces.map(({ developmentMm, gauge, linearMeters }) => ({
        developmentMm,
        gauge,
        linearMeters,
      })),
    );
    const quotedPieces: QuotedQuotePiece[] = validPieces.map((piece, index) => ({
      ...piece,
      billableDevelopmentMm: totals.pieces[index]?.billableDevelopmentMm ?? null,
      unitPrice: totals.pieces[index]?.unitPrice ?? null,
      pieceTotal: totals.pieces[index]?.pieceTotal ?? null,
      requiresContact: totals.pieces[index]?.requiresContact ?? true,
      contactReason: totals.pieces[index]?.contactReason ?? null,
    }));

    return {
      parsedPieces,
      quotedPieces,
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      requiresContact: quotedPieces.some((piece) => piece.requiresContact),
    };
  }, [pieces]);

  const whatsappHref =
    whatsappNumber && quoteState.quotedPieces.length
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          buildWhatsAppQuoteMessage({
            lead,
            pieces: quoteState.quotedPieces,
            subtotal: quoteState.subtotal,
            vat: quoteState.vat,
            total: quoteState.total,
          }),
        )}`
      : "";

  return (
    <section className="section quote-section" id="cotizador">
      <div className="shell quote-shell">
        <Reveal className="quote-copy">
          <SectionEyebrow>Paso 2</SectionEyebrow>
          <h2>Ahora arma tu pre-cotización.</h2>
          <p>
            Ya guardamos tus datos, {lead.nombrePersona}. Elige la pieza más
            parecida, agrega calibre, desarrollo y metros. Al final te llevamos
            a WhatsApp con el resumen listo.
          </p>
          <div className="quote-lead-card" aria-label="Datos guardados">
            <span>Datos guardados</span>
            <strong>{lead.empresa}</strong>
            <small>
              {lead.quoteCode ?? "Solicitud guardada"} · {lead.email} ·{" "}
              {lead.whatsapp}
            </small>
          </div>
        </Reveal>
        <Reveal className="quote-tool" delay={0.08}>
          <div className="quote-editor">
            <div className="quote-editor__head">
              <span aria-hidden="true">
                <Calculator size={20} />
              </span>
              <div>
                <h3>Calcula tu precio estimado</h3>
                <p>Agrega dos o tres piezas si tu pedido usa varios desarrollos.</p>
              </div>
            </div>
            <div className="quote-pieces">
              {quoteState.parsedPieces.map((piece, index) => (
                <div className="quote-piece" key={piece.id}>
                  <div className="quote-piece__head">
                    <span>Pieza {index + 1}</span>
                    {pieces.length > 1 ? (
                      <button
                        type="button"
                        aria-label={`Eliminar pieza ${index + 1}`}
                        onClick={() => removePiece(piece.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    ) : null}
                  </div>
                  <div className="quote-piece-types" role="radiogroup">
                    {quotePieceTypes.map((type) => (
                      <button
                        className="quote-type-card"
                        type="button"
                        aria-checked={piece.pieceType === type.value}
                        role="radio"
                        key={type.value}
                        onClick={() =>
                          updatePiece(piece.id, "pieceType", type.value)
                        }
                      >
                        <span className="quote-type-card__media">
                          <Image
                            src={type.image}
                            alt=""
                            fill
                            sizes="(max-width: 700px) 100vw, 180px"
                          />
                        </span>
                        <strong>{type.label}</strong>
                        <small>{type.description}</small>
                      </button>
                    ))}
                  </div>
                  {piece.pieceType === "doblez-medida" ? (
                    <p className="quote-piece-note">
                      Continúa por WhatsApp con plano, foto o croquis. No tienes
                      que subir archivo aquí.
                    </p>
                  ) : null}
                  <div className="quote-fields">
                    <label className="quote-field">
                      <span>Calibre</span>
                      <select
                        value={piece.gauge}
                        onChange={(event) =>
                          updatePiece(
                            piece.id,
                            "gauge",
                            event.target.value as SteelGauge,
                          )
                        }
                      >
                        {steelGaugeOptions.map((gauge) => (
                          <option value={gauge} key={gauge}>
                            {gauge}
                          </option>
                        ))}
                      </select>
                      {piece.gauge === "28" ? (
                        <small>Este calibre se confirma por WhatsApp.</small>
                      ) : null}
                    </label>
                    <label className="quote-field">
                      <span>Desarrollo en mm</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={piece.developmentInput}
                        placeholder="150 + 195 + 100 + 40"
                        onChange={(event) =>
                          updatePiece(
                            piece.id,
                            "developmentInput",
                            event.target.value,
                          )
                        }
                      />
                      {piece.developmentMm !== null ? (
                        <small>
                          Total desarrollo:{" "}
                          {formatMeasurement(piece.developmentMm)} mm
                        </small>
                      ) : (
                        <small className="quote-field__error">
                          Usa un total directo o tramos separados por +.
                        </small>
                      )}
                    </label>
                    <label className="quote-field">
                      <span>Color</span>
                      <select
                        value={piece.color}
                        onChange={(event) =>
                          updatePiece(
                            piece.id,
                            "color",
                            event.target.value as QuoteColorValue,
                          )
                        }
                      >
                        {quoteColorOptions.map((color) => (
                          <option value={color} key={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      {piece.color === "Otro" ? (
                        <input
                          type="text"
                          value={piece.customColor}
                          placeholder="Escribe el color"
                          onChange={(event) =>
                            updatePiece(
                              piece.id,
                              "customColor",
                              event.target.value,
                            )
                          }
                        />
                      ) : null}
                    </label>
                    <label className="quote-field">
                      <span>Metros lineales totales</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={piece.linearMetersInput}
                        placeholder="8"
                        onChange={(event) =>
                          updatePiece(
                            piece.id,
                            "linearMetersInput",
                            event.target.value,
                          )
                        }
                      />
                      {piece.linearMeters === null ? (
                        <small className="quote-field__error">
                          Ingresa metros mayores a cero.
                        </small>
                      ) : null}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button className="quote-add" type="button" onClick={addPiece}>
              <Plus size={18} />
              Agregar otra pieza
            </button>
          </div>
          <aside className="quote-summary" aria-label="Resumen de cotización">
            <div className="quote-summary__head">
              <span>
                {quoteState.requiresContact
                  ? "Revisión recomendada"
                  : "Precio unitario estimado"}
              </span>
              <strong>
                {quoteState.quotedPieces[0]?.unitPrice
                  ? `${formatCop(quoteState.quotedPieces[0].unitPrice)}/m`
                  : "Cotizar por WhatsApp"}
              </strong>
            </div>
            <div className="quote-summary__pieces">
              {quoteState.quotedPieces.length ? (
                quoteState.quotedPieces.map((piece, index) => (
                  <div className="quote-summary__piece" key={piece.id}>
                    <span>
                      {index + 1}. {piece.pieceTypeLabel}
                    </span>
                    <strong>
                      {piece.pieceTotal
                        ? formatCop(piece.pieceTotal)
                        : "WhatsApp"}
                    </strong>
                    <small>
                      {piece.unitPrice
                        ? `${formatCop(piece.unitPrice)}/m`
                        : "Precio por confirmar"}{" "}
                      · Desarrollo {formatMeasurement(piece.developmentMm)} mm ·{" "}
                      {piece.billableDevelopmentMm
                        ? `cobra ${formatMeasurement(piece.billableDevelopmentMm)} mm`
                        : "requiere revisión"}{" "}
                      · Cal. {piece.gauge} · {piece.colorLabel} ·{" "}
                      {formatMeasurement(piece.linearMeters)} m
                    </small>
                    {piece.contactReason ? (
                      <small className="quote-summary__warning">
                        {piece.contactReason}. Continúa por WhatsApp para
                        confirmar precio.
                      </small>
                    ) : null}
                    {piece.pieceType === "doblez-medida" ? (
                      <small className="quote-summary__warning">
                        Adjunta plano, foto o croquis al continuar por WhatsApp.
                      </small>
                    ) : null}
                    {piece.billableDevelopmentMm &&
                    piece.billableDevelopmentMm !== piece.developmentMm ? (
                      <small className="quote-summary__warning">
                        El cálculo cobra ancho útil de{" "}
                        {formatMeasurement(piece.billableDevelopmentMm)} mm.
                      </small>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>Completa al menos una pieza para ver la pre-cotización.</p>
              )}
            </div>
            <dl className="quote-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatCop(quoteState.subtotal)}</dd>
              </div>
              <div>
                <dt>IVA 19%</dt>
                <dd>{formatCop(quoteState.vat)}</dd>
              </div>
              <div>
                <dt>Total estimado</dt>
                <dd>{formatCop(quoteState.total)}</dd>
              </div>
            </dl>
            <p className="quote-disclaimer">{quoteDisclaimer}</p>
            {whatsappHref ? (
              <a
                className="quote-whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={19} />
                Continuar por WhatsApp
              </a>
            ) : (
              <button className="quote-whatsapp" type="button" disabled>
                <MessageCircle size={19} />
                Continuar por WhatsApp
              </button>
            )}
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Cta() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const metaEventId = createMetaEventId();
    const payload: Record<string, FormDataEntryValue | string> =
      Object.fromEntries(formData);
    const savedLeadFromForm = {
      nombrePersona: String(payload.nombre_persona ?? "").trim(),
      empresa: String(payload.empresa ?? "").trim(),
      whatsapp: String(payload.whatsapp ?? "").trim(),
      email: String(payload.email ?? "").trim(),
      tipoCliente: String(payload.tipo_cliente ?? "").trim(),
      necesidad: String(payload.necesidad ?? "").trim(),
      urgencia: String(payload.urgencia ?? "").trim(),
      detalles: String(payload.detalles ?? "").trim(),
    };

    payload.meta_event_id = metaEventId;
    payload.event_source_url = window.location.href;

    setSubmitStatus("submitting");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        leadId?: string;
        quoteCode?: string;
        metaEventId?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.error ?? "No pudimos enviar tu solicitud. Intenta de nuevo.",
        );
      }

      const savedLead: SavedLead = {
        ...savedLeadFromForm,
        leadId: data?.leadId ?? null,
        quoteCode: data?.quoteCode ?? null,
        metaEventId: data?.metaEventId ?? metaEventId,
      };

      form.reset();
      try {
        window.sessionStorage.setItem(
          MATERIALIA_LEAD_STORAGE_KEY,
          JSON.stringify(savedLead),
        );
      } catch {
        throw new Error(
          "Guardamos tu solicitud, pero no pudimos abrir el pre-cotizador. Intenta de nuevo en esta misma ventana.",
        );
      }
      window.fbq?.("track", "Lead", {}, {
        eventID: data?.metaEventId ?? metaEventId,
      });
      setSubmitStatus("success");
      setSubmitMessage(
        "Datos guardados. Te llevamos al pre-cotizador.",
      );
      window.setTimeout(() => {
        window.location.assign("/cotizador");
      }, 260);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tu solicitud. Intenta de nuevo.",
      );
    }
  };

  return (
    <section className="section cta-section" id="contact">
      <div className="shell cta-shell">
        <Reveal className="cta-copy">
          <SectionEyebrow>Solicita cotización</SectionEyebrow>
          <h2>
            Completa tus datos y abre el pre-cotizador.
          </h2>
          <p>
            Guardamos tu solicitud primero. Después te llevamos a una pantalla
            para estimar las piezas y enviar el resumen por WhatsApp.
          </p>
        </Reveal>
        <Reveal className="contact-panel" delay={0.1}>
          <div className="contact-panel__header">
            <h3>Paso 1: datos de contacto</h3>
            <p>
              Guardamos tu contacto antes del cálculo para que el equipo pueda
              dar seguimiento si el precio necesita optimización.
            </p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>Nombre de la persona</span>
              <input
                name="nombre_persona"
                type="text"
                placeholder="Nombre y apellido"
                autoComplete="name"
                required
              />
            </label>
            <label>
              <span>Empresa</span>
              <input
                name="empresa"
                type="text"
                placeholder="Constructora, empresa o proyecto"
                autoComplete="organization"
                required
              />
            </label>
            <label>
              <span>WhatsApp con lada</span>
              <input
                name="whatsapp"
                type="tel"
                placeholder={materialIaWhatsAppDisplay}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>
            <label>
              <span>Correo</span>
              <input
                name="email"
                type="email"
                placeholder="nombre@empresa.com"
                autoComplete="email"
                required
              />
            </label>
            <label>
              <span>Tipo de cliente</span>
              <select name="tipo_cliente" defaultValue="" required>
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option>Constructor o instalador</option>
                <option>Arquitecto o diseñador</option>
                <option>Empresa, colegio o industria</option>
                <option>Mantenimiento de cubierta</option>
                <option>Particular u otro</option>
              </select>
            </label>
            <label>
              <span>Qué necesitas</span>
              <select name="necesidad" defaultValue="" required>
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option>Canal</option>
                <option>Molduras/Remates</option>
                <option>Doblez a medida/Adjunta</option>
              </select>
            </label>
            <label className="contact-form__wide">
              <span>Urgencia</span>
              <select
                name="urgencia"
                defaultValue="Estoy cotizando para planear"
              >
                <option>Esta semana</option>
                <option>En 1 a 2 semanas</option>
                <option>Estoy cotizando para planear</option>
              </select>
            </label>
            <label className="contact-form__wide">
              <span>Detalles para cotizar</span>
              <textarea
                name="detalles"
                rows={4}
                placeholder="Medidas aproximadas, cantidad, largo máximo, color o calibre si lo sabes. Si tienes fotos, planos o croquis, menciónalo aquí."
                required
              />
            </label>
            {submitMessage ? (
              <p
                className={`contact-form__status contact-form__status--${submitStatus}`}
                role={submitStatus === "error" ? "alert" : "status"}
              >
                {submitMessage}
              </p>
            ) : null}
            <button type="submit" disabled={submitStatus === "submitting"}>
              {submitStatus === "submitting"
                ? "Enviando..."
                : "Guardar datos y abrir pre-cotizador"}
            </button>
          </form>
          <div className="contact-methods">
            <a href={materialIaWhatsAppHref} target="_blank" rel="noreferrer">
              <Phone size={18} />
              Hablar por WhatsApp
            </a>
            <a href={`mailto:${materialIaEmail}`}>
              <Mail size={18} />
              {materialIaEmail}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="shell">
        <Reveal className="section-heading section-heading--split">
          <div>
            <SectionEyebrow>Mercado</SectionEyebrow>
            <h2>Dónde se instala nuestro acero</h2>
          </div>
          <ButtonLink href="#contact" variant="outline">
            Hablar del proyecto
          </ButtonLink>
        </Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal
              className="project-card"
              key={project.title}
              delay={index * 0.05}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 820px) 100vw, 25vw"
              />
              <div className="project-card__title">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuyerProfiles() {
  const [active, setActive] = useState(0);
  const profile = buyerProfiles[active];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % buyerProfiles.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="section testimonials-section">
      <div className="shell testimonials-grid">
        <Reveal className="section-heading">
          <SectionEyebrow>Para quien es</SectionEyebrow>
          <h2>Para quién es nuestro acero</h2>
        </Reveal>
        <Reveal className="testimonial-card" delay={0.08}>
          <Image
            className="testimonial-mark"
            src={asset("testimonial-mark.svg")}
            alt=""
            width={82}
            height={82}
            aria-hidden="true"
            style={{ height: "auto" }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35 }}
            >
              <p>{profile.description}</p>
              <div className="testimonial-author">
                <Image src={profile.avatar} alt="" width={64} height={64} />
                <div>
                  <h3>{profile.title}</h3>
                  <span>{profile.context}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="testimonial-controls">
            <button
              type="button"
              aria-label="Perfil anterior"
              onClick={() =>
                setActive(
                  (index) =>
                    (index - 1 + buyerProfiles.length) % buyerProfiles.length,
                )
              }
            >
              <ChevronLeft size={20} />
            </button>
            <div
              className="testimonial-dots"
              aria-label="Paginacion de perfiles"
            >
              {buyerProfiles.map((item, index) => (
                <button
                  type="button"
                  aria-label={`Mostrar perfil ${item.title}`}
                  className={index === active ? "is-active" : ""}
                  key={item.title}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Perfil siguiente"
              onClick={() =>
                setActive((index) => (index + 1) % buyerProfiles.length)
              }
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Fabricamos remates, molduras, canalones y caballetes de acero
            prepintado a la medida exacta de tu obra. Entregas en días, no
            semanas.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-list" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
        <div className="footer-contact">
          <h3>Contacto</h3>
          <a href={`mailto:${materialIaEmail}`}>
            <Mail size={18} />
            {materialIaEmail}
          </a>
          <a href={materialIaWhatsAppHref} target="_blank" rel="noreferrer">
            <Phone size={18} />
            {materialIaWhatsAppDisplay}
          </a>
          <span>
            <MapPin size={18} />
            Colombia
          </span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          Copyright © 2026 Material IA. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}

export function MaterialIAHome() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Speciality />
        <WorkProcess />
        <WhyChooseUs />
        <Services />
        <Projects />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
