import type {
  BuyerProfile,
  ClientLogo,
  ComparisonRow,
  Feature,
  FooterGroup,
  NavItem,
  ProcessStep,
  ProjectCard,
  ServiceCard,
} from "./probuilder-types";

const asset = (name: string) => `/probuilder/${name}`;

export const navItems: NavItem[] = [
  { label: "Inicio", href: "#home" },
  { label: "Nosotros", href: "#about" },
  { label: "Productos", href: "#services" },
  { label: "Mercado", href: "#projects" },
];

export const clientLogos: ClientLogo[] = [
  { name: "Mecacivil", image: asset("client-mecacivil-social.png") },
  { name: "MEISA", image: asset("client-meisa-social.png") },
  { name: "Arquio", image: asset("client-arquo-social.png") },
  { name: "Metecno", image: asset("client-metecno-social.png") },
];

export const speciality: Feature[] = [
  {
    title: "Hasta 8 metros",
    description: "Cortamos y doblamos láminas en una sola pieza hasta de 8 metros, sin uniones que filtren agua.",
    icon: asset("speciality-01.svg"),
  },
  {
    title: "Acero prepintado",
    description: "Trabajamos lámina prepintada en colores y calibres listos para instalar, sin obra blanca de remate.",
    icon: asset("speciality-02.svg"),
  },
  {
    title: "Doblado a medida",
    description: "Cada pieza se ajusta al milímetro a tus planos, fotos o croquis. Acero, aluminio y UPVC.",
    icon: asset("about-mark.svg"),
  },
  {
    title: "Entrega en días",
    description: "Cotizamos por WhatsApp y despachamos en días, no semanas, para no frenar la obra.",
    icon: asset("why-icon.svg"),
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01.",
    title: "Cotizamos tu pedido",
    description: "Envíanos medidas, planos o fotos por WhatsApp. Calculamos calibre, metros y precio en minutos.",
    image: asset("process-01.webp"),
  },
  {
    number: "02.",
    title: "Cortamos y doblamos",
    description: "Trabajamos el rollo de acero hasta de 8 metros, cortado al milímetro y doblado a tu medida.",
    image: asset("process-02.webp"),
  },
  {
    number: "03.",
    title: "Despachamos en días",
    description: "Entregamos la pieza lista para instalar, sin rectificaciones ni reprocesos en obra.",
    image: asset("process-03.webp"),
  },
];

export const services: ServiceCard[] = [
  {
    title: "Remates y molduras",
    description: "Acabados arquitectónicos para fachadas, esquinas y muros, cortados al milímetro de tu plano.",
    image: asset("service-01.png"),
  },
  {
    title: "Canalones y bajantes",
    description: "Canales de aguas lluvias en una sola pieza hasta de 8 metros. Sin uniones, sin filtraciones.",
    image: asset("service-02.png"),
  },
  {
    title: "Caballetes y tapagoteros",
    description: "Remates de cubierta que impiden el paso de agua donde se unen láminas, muros y aleros.",
    image: asset("service-03.png"),
  },
  {
    title: "Doblez a medida",
    description: "Piezas especiales según tu plano, foto o croquis. Acero, aluminio o UPVC en varios calibres.",
    image: asset("service-04.png"),
  },
];

export const projects: ProjectCard[] = [
  {
    title: "Cubiertas industriales",
    description: "Canalones, caballetes y remates para techos de bodegas, plantas y colegios.",
    image: asset("project-01.webp"),
  },
  {
    title: "Fachadas arquitectónicas",
    description: "Molduras y acabados prepintados que dan terminación a edificios, casas y locales.",
    image: asset("project-02.webp"),
  },
  {
    title: "Mantenimiento de techos",
    description: "Reposición de canales, bajantes y remates en cubiertas existentes, sin parar la operación.",
    image: asset("project-03.webp"),
  },
  {
    title: "Obra a medida",
    description: "Piezas únicas para arquitectos con retos específicos: marcos, muros, esquinas y aleros.",
    image: asset("project-04.webp"),
  },
];

export const buyerProfiles: BuyerProfile[] = [
  {
    title: "Constructores e instaladores",
    description:
      "Empresas que instalan cubiertas para colegios, industria o residencial y necesitan piezas listas en días, no semanas.",
    context: "Cubiertas industriales y residenciales",
    avatar: asset("client-01.svg"),
  },
  {
    title: "Arquitectos con obra a medida",
    description:
      "Diseñadores que necesitan molduras y acabados en formas, calibres y colores que el mercado estándar no maneja.",
    context: "Fachadas, interiores y acabados",
    avatar: asset("client-02.svg"),
  },
  {
    title: "Mantenimiento de cubierta",
    description:
      "Equipos que reparan techos industriales o residenciales y necesitan repuestos exactos sin esperar semanas de fabricación.",
    context: "Reparación y reposición de techos",
    avatar: asset("client-03.jpg"),
  },
  {
    title: "Constructores de obra blanca",
    description:
      "Quien necesita marcos de puerta, remates o piezas de acero a medida para cerrar la obra sin retrasos.",
    context: "Marcos, esquinas y terminación",
    avatar: asset("client-04.jpg"),
  },
];

export const footerGroups: FooterGroup[] = [
  {
    title: "Navegacion",
    links: [
      { label: "Inicio", href: "#home" },
      { label: "Nosotros", href: "#about" },
      { label: "Productos", href: "#services" },
      { label: "Mercado", href: "#projects" },
    ],
  },
  {
    title: "Productos",
    links: [
      { label: "Remates y molduras", href: "#services" },
      { label: "Canalones y bajantes", href: "#services" },
      { label: "Caballetes y tapagoteros", href: "#services" },
      { label: "Doblez a medida", href: "#services" },
    ],
  },
];

export const stats = [
  { value: "8m", label: "Largo máximo en una sola pieza" },
  { value: "Días", label: "Tiempo típico de entrega" },
  { value: "100%", label: "Piezas cortadas a medida del plano" },
];

export const comparisonRows: ComparisonRow[] = [
  { factor: "Largo", market: "Hasta 2,44 m", materialIa: "Hasta 8 m" },
  { factor: "Forma", market: "Estándar", materialIa: "A tu medida" },
  { factor: "Entrega", market: "Semanas", materialIa: "Días" },
  { factor: "Acero", market: "Sin pintar", materialIa: "Prepintado" },
  { factor: "Acabado", market: "Reprocesos en obra", materialIa: "Listo para instalar" },
  { factor: "Materiales", market: "Solo acero", materialIa: "Acero, aluminio, UPVC" },
];
