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
  blogPosts,
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
            Agendar demo
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
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <ButtonLink href="#contact" variant="orange">
              Agendar demo
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
      <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 820px) 100vw, 50vw" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-grid shell">
        <Reveal className="hero-copy">
          <SectionEyebrow>IA para materiales de construccion</SectionEyebrow>
          <h1>
            <span className="hero-line">IA para cotizar</span>
            <span className="hero-line">materiales</span>
            <span className="hero-line hero-line--accent">en minutos</span>
          </h1>
          <p>
            Material IA convierte WhatsApp, planos y croquis en solicitudes claras,
            cotizaciones y seguimiento comercial para empresas de acero, cubiertas y acabados.
          </p>
          <ButtonLink href="#contact">Agendar demo</ButtonLink>
        </Reveal>
        <Reveal className="hero-media" delay={0.12}>
          <ImageTile
            src={asset("hero.png")}
            alt="Obra con estructura y acabados metalicos"
            className="hero-image"
            priority
          />
          <div className="hero-card">
            <Image src={asset("hero-card.png")} alt="" width={196} height={142} />
          </div>
          <div className="hero-accent">
            <Image src={asset("hero-accent.png")} alt="" fill sizes="160px" />
          </div>
          <Image
            className="hero-shape"
            src={asset("hero-shape.svg")}
            alt=""
            width={118}
            height={118}
            aria-hidden="true"
            style={{ height: "auto" }}
          />
        </Reveal>
      </div>
    </section>
  );
}

function BrandStrip() {
  return (
    <section className="brand-strip" aria-label="Clientes de Material IA">
      <p className="brand-strip__label">Clientes y aliados del sector construccion</p>
      <div className="brand-track shell">
        {clientLogos.map((client) => (
          <div className="brand-item" key={client.name}>
            <Image src={client.image} alt={client.name} width={220} height={78} />
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="shell about-grid">
        <Reveal className="about-media">
          <ImageTile src={asset("about.webp")} alt="Proceso de fabricacion metalica" className="about-image" />
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
          <SectionEyebrow>Solucion</SectionEyebrow>
          <h2>Una capa de IA para vender materiales complejos.</h2>
          <p>
            Las empresas de acero, cubiertas y acabados venden productos con medidas variables,
            calibres, planos, fotos y tiempos de entrega que cambian por proyecto.
          </p>
          <p>
            Material IA ayuda a capturar esa informacion, convertirla en datos comerciales y dar
            seguimiento desde la primera conversacion hasta el pedido.
          </p>
          <div className="about-actions">
            <ButtonLink href="#contact">Agendar demo</ButtonLink>
            <a className="support-link" href="#contact">
              <span aria-hidden="true">
                <Phone size={20} />
              </span>
              <small>Para equipos que venden por chat</small>
              <strong>Sin perder el contexto tecnico</strong>
            </a>
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
          <h2>Donde Material IA aporta valor</h2>
        </Reveal>
        <div className="feature-grid">
          {speciality.map((item, index) => (
            <Reveal className="feature-card" key={item.title} delay={index * 0.06}>
              <div className="feature-card__icon">
                <Image src={item.icon} alt="" width={42} height={42} />
              </div>
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
          <h2>De conversaciones sueltas a un flujo comercial claro</h2>
        </Reveal>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <Reveal className="process-card" key={step.title} delay={index * 0.08}>
              <ImageTile src={step.image} alt="Proceso de trabajo" className="process-card__image" />
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
      <div className="shell why-grid">
        <Reveal className="why-copy">
          <SectionEyebrow>Por que Material IA</SectionEyebrow>
          <h2>
            Tu equipo ya vende por WhatsApp. Material IA lo vuelve <span>operable</span>.
          </h2>
        </Reveal>
        <Reveal className="why-panel" delay={0.1}>
          <div className="why-feature">
            <Image src={asset("why-icon.svg")} alt="" width={50} height={50} />
            <div>
              <h3>Comparativo operativo</h3>
              <p>
                En materiales de construccion, vender rapido no significa responder cualquier cosa:
                significa pedir los datos correctos, cotizar con contexto y no perder seguimiento.
              </p>
            </div>
          </div>
          <div className="comparison-list">
            <div className="comparison-row comparison-row--head">
              <span>Criterio</span>
              <span>Operacion manual</span>
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
          <div className="stat-row">
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="why-feature">
            <Image src={asset("process-icon.svg")} alt="" width={50} height={50} />
            <div>
              <h3>Menos friccion entre ventas y operacion</h3>
              <p>
                Cada solicitud queda con contexto comercial y tecnico para avanzar sin volver a
                reconstruir la historia del cliente.
              </p>
            </div>
          </div>
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
            <SectionEyebrow>Servicios</SectionEyebrow>
            <h2>Lo que implementamos</h2>
          </div>
          <ButtonLink href="#contact" variant="outline">
            Agendar demo
          </ButtonLink>
        </Reveal>
        <div className="service-grid">
          {services.map((service, index) => (
            <Reveal className="service-card" key={service.title} delay={index * 0.05}>
              <Image src={service.image} alt={service.title} fill sizes="(max-width: 820px) 100vw, 25vw" />
              <span className="service-card__shade" />
              <div className="service-card__content">
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span aria-hidden="true">
                  <ArrowUpRight size={24} />
                </span>
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
            Veamos como cotiza hoy tu equipo <span>comercial</span>.
          </h2>
          <p>
            Revisamos tus conversaciones, productos y reglas comerciales para proponer un flujo de
            IA que respete como ya vendes.
          </p>
          <ButtonLink href="mailto:contacto@materialia.ai" variant="white">
            contacto@materialia.ai
          </ButtonLink>
        </Reveal>
        <Reveal className="contact-panel" delay={0.1}>
          <form
            className="contact-form"
            action="mailto:contacto@materialia.ai"
            method="post"
            encType="text/plain"
          >
            <label>
              <span>Nombre</span>
              <input name="nombre" type="text" placeholder="Tu nombre" />
            </label>
            <label>
              <span>Empresa</span>
              <input name="empresa" type="text" placeholder="Constructora o proyecto" />
            </label>
            <label>
              <span>Telefono o correo</span>
              <input name="contacto" type="text" placeholder="+57 000 000 0000" />
            </label>
            <label>
              <span>Tipo de empresa</span>
              <select name="tipo">
                <option>Fabricante de materiales</option>
                <option>Distribuidor de acero o cubiertas</option>
                <option>Constructora o instalador</option>
                <option>Otro equipo comercial</option>
              </select>
            </label>
            <label className="contact-form__wide">
              <span>Que quieres automatizar</span>
              <textarea
                name="descripcion"
                rows={4}
                placeholder="Cotizaciones por WhatsApp, seguimiento comercial, pedidos, inventario u otro flujo"
              />
            </label>
            <button type="submit">Enviar solicitud de demo</button>
          </form>
          <div className="contact-methods">
            <a href="mailto:contacto@materialia.ai">
              <Mail size={18} />
              contacto@materialia.ai
            </a>
            <a href="tel:+570000000000">
              <Phone size={18} />
              +57 000 000 0000
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
            <h2>Casos donde el flujo comercial se vuelve complejo</h2>
          </div>
          <ButtonLink href="#contact" variant="outline">
            Hablar del caso
          </ButtonLink>
        </Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal className="project-card" key={project.title} delay={index * 0.05}>
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 820px) 100vw, 25vw" />
              <div className="project-card__title">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <ArrowUpRight size={22} />
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
          <h2>Equipos que necesitan responder mejor sin perder precision</h2>
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
              onClick={() => setActive((index) => (index - 1 + buyerProfiles.length) % buyerProfiles.length)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="testimonial-dots" aria-label="Paginacion de perfiles">
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
              onClick={() => setActive((index) => (index + 1) % buyerProfiles.length)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section className="section blog-section" id="blog">
      <div className="shell">
        <Reveal className="section-heading section-heading--split">
          <div>
            <SectionEyebrow>Recursos</SectionEyebrow>
            <h2>Guias para vender materiales con menos friccion</h2>
          </div>
          <ButtonLink href="#blog" variant="outline">
            Ver recursos
          </ButtonLink>
        </Reveal>
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <Reveal className="blog-card" key={post.title} delay={index * 0.05}>
              <ImageTile src={post.image} alt={post.title} className="blog-card__image" />
              <div className="blog-card__body">
                <span className="blog-category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <a href="#contact">Cotizar con esta guia</a>
              </div>
            </Reveal>
          ))}
        </div>
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
            IA aplicada a cotizacion, seguimiento y operacion comercial para empresas de materiales
            de construccion.
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
          <a href="tel:+570000000000">
            <Phone size={18} />
            +57 000 000 0000
          </a>
          <span>
            <MapPin size={18} />
            Colombia
          </span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Copyright © 2026 Material IA. Todos los derechos reservados.</span>
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
        <BrandStrip />
        <About />
        <Speciality />
        <WorkProcess />
        <WhyChooseUs />
        <Services />
        <Cta />
        <Projects />
        <BuyerProfiles />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
