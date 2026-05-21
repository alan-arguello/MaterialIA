"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const asset = (name: string) => `/probuilder/${name}`;

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
            <div className="founder-logo">
              <Image
                src={asset("logo-metecno.png")}
                alt="Metecno"
                width={190}
                height={70}
              />
            </div>
            <div className="founder-logo">
              <Image
                src={asset("logo-egade.jpg")}
                alt="EGADE Business School"
                width={150}
                height={70}
              />
            </div>
            <div className="founder-logo">
              <Image
                src={asset("logo-berkeley.png")}
                alt="UC Berkeley Extension"
                width={70}
                height={70}
              />
            </div>
            <div className="founder-logo">
              <Image
                src={asset("logo-javeriana.jpg")}
                alt="Pontificia Universidad Javeriana"
                width={88}
                height={88}
              />
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

function Cta() {
  return (
    <section className="section cta-section" id="contact">
      <div className="shell cta-shell">
        <Reveal className="cta-copy">
          <h2>
            Cuéntanos qué necesitas para tu <span>obra</span>.
          </h2>
          <p>
            Dinos qué pieza necesitas, dónde va instalada y qué tan urgente es.
            Con fotos, medidas aproximadas o un croquis podemos empezar.
          </p>
          <ButtonLink href="mailto:contacto@materialia.ai" variant="white">
            contacto@materialia.ai
          </ButtonLink>
        </Reveal>
        <Reveal className="contact-panel" delay={0.1}>
          <div className="contact-panel__header">
            <h3>Cotiza con lo esencial</h3>
            <p>
              Con tres datos podemos pre-calificar la solicitud: quién eres,
              qué pieza necesitas y qué tan urgente es la obra.
            </p>
          </div>
          <form
            className="contact-form"
            action="mailto:contacto@materialia.ai"
            method="post"
            encType="text/plain"
          >
            <label>
              <span>Nombre o empresa</span>
              <input
                name="nombre_empresa"
                type="text"
                placeholder="Nombre, constructora o proyecto"
                autoComplete="organization"
              />
            </label>
            <label>
              <span>WhatsApp o correo</span>
              <input
                name="contacto"
                type="text"
                placeholder="Número o email"
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
                <option>Canalones, caballetes o remates</option>
                <option>Fachada o acabado arquitectónico</option>
                <option>Mantenimiento o filtración</option>
                <option>Marco, puerta o pieza especial</option>
                <option>Impermeabilización u otro</option>
              </select>
            </label>
            <label className="contact-form__wide">
              <span>Urgencia</span>
              <select name="urgencia" defaultValue="Estoy cotizando para planear">
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
            <button type="submit">Solicitar cotización</button>
          </form>
          <div className="contact-methods">
            <a href="mailto:contacto@materialia.ai">
              <Mail size={18} />
              contacto@materialia.ai
            </a>
            <span>
              <Phone size={18} />
              Respuesta por WhatsApp o correo
            </span>
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
          <a href="mailto:contacto@materialia.ai">
            <Mail size={18} />
            contacto@materialia.ai
          </a>
          <span>
            <Phone size={18} />
            WhatsApp o correo al solicitar cotización
          </span>
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
        <Founder />
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
