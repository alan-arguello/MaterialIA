import type {
  BlogPost,
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
  { label: "Solucion", href: "#about" },
  { label: "Servicios", href: "#services" },
  { label: "Mercado", href: "#projects" },
  { label: "Recursos", href: "#blog" },
];

export const clientLogos: ClientLogo[] = [
  { name: "Mecacivil", image: asset("client-mecacivil.avif") },
  { name: "MEISA", image: asset("client-meisa.png") },
  { name: "Arquio", image: asset("client-arquo.png") },
  { name: "Metecno", image: asset("client-metecno.jpg") },
];

export const speciality: Feature[] = [
  {
    title: "Cotizacion asistida",
    description: "Estructura fotos, planos y croquis para convertirlos en solicitudes claras y cotizables.",
    icon: asset("speciality-01.svg"),
  },
  {
    title: "WhatsApp con contexto",
    description: "Ordena conversaciones, datos del cliente, medidas, materiales y siguientes pasos comerciales.",
    icon: asset("speciality-02.svg"),
  },
  {
    title: "Seguimiento comercial",
    description: "Da visibilidad a oportunidades, pedidos, pagos pendientes y entregas sin depender de memoria.",
    icon: asset("about-mark.svg"),
  },
  {
    title: "Oferta de inventario",
    description: "Ayuda a detectar material disponible y sugerir productos que pueden venderse mas rapido.",
    icon: asset("why-icon.svg"),
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01.",
    title: "Mapeamos la operacion",
    description: "Entendemos productos, precios, calibres, medidas, canales de venta y reglas de cotizacion.",
    image: asset("process-01.webp"),
  },
  {
    number: "02.",
    title: "Configuramos el flujo",
    description: "Diseñamos la captura de datos, el seguimiento comercial y los estados de cada solicitud.",
    image: asset("process-02.webp"),
  },
  {
    number: "03.",
    title: "Acompanamos adopcion",
    description: "Lanzamos con el equipo, revisamos casos reales y ajustamos el sistema a la forma de vender.",
    image: asset("process-03.webp"),
  },
];

export const services: ServiceCard[] = [
  {
    title: "Asistente de cotizacion",
    description: "Convierte mensajes, planos y croquis en datos listos para calcular y responder.",
    image: asset("service-01.png"),
  },
  {
    title: "Pipeline comercial",
    description: "Centraliza prospectos, clientes, pedidos, pagos y proximas acciones del equipo.",
    image: asset("service-02.png"),
  },
  {
    title: "Pedidos y produccion",
    description: "Conecta la venta con estados operativos para saber que se debe fabricar o despachar.",
    image: asset("service-03.png"),
  },
  {
    title: "Inteligencia de inventario",
    description: "Sugiere oportunidades comerciales a partir de material, medidas y demanda recurrente.",
    image: asset("service-04.png"),
  },
];

export const projects: ProjectCard[] = [
  {
    title: "Acero y cubiertas",
    description: "Remates, molduras, caballetes, canalones y accesorios para cubierta.",
    image: asset("project-01.webp"),
  },
  {
    title: "Fabricacion a medida",
    description: "Productos que dependen de medidas, planos, calibres y largos variables.",
    image: asset("project-02.webp"),
  },
  {
    title: "Distribucion de materiales",
    description: "Equipos que venden por WhatsApp y necesitan ordenar clientes y cotizaciones.",
    image: asset("project-03.webp"),
  },
  {
    title: "Mantenimiento de obra",
    description: "Solicitudes urgentes con fotos, visitas, reparaciones y seguimiento de entregas.",
    image: asset("project-04.webp"),
  },
];

export const buyerProfiles: BuyerProfile[] = [
  {
    title: "Fabricantes de piezas a medida",
    description:
      "Empresas que reciben croquis, fotos o planos y necesitan cotizar rapido sin perder precision tecnica.",
    context: "Remates, molduras, canalones y accesorios",
    avatar: asset("client-01.svg"),
  },
  {
    title: "Distribuidores de acero y cubiertas",
    description:
      "Equipos comerciales que atienden muchas solicitudes por WhatsApp y necesitan visibilidad del pipeline.",
    context: "Ventas recurrentes, pedidos y seguimiento",
    avatar: asset("client-02.svg"),
  },
  {
    title: "Constructores e instaladores",
    description:
      "Clientes que piden respuestas claras, tiempos de entrega y piezas ajustadas a condiciones de obra.",
    context: "Cubiertas, fachadas, mantenimiento y obra",
    avatar: asset("client-03.jpg"),
  },
  {
    title: "Gerencias comerciales",
    description:
      "Lideres que quieren saber que se esta cotizando, que se gano, que se perdio y que falta responder.",
    context: "Control comercial sin frenar al equipo",
    avatar: asset("client-04.jpg"),
  },
];

export const blogPosts: BlogPost[] = [
  {
    category: "WhatsApp",
    title: "Como ordenar cotizaciones que llegan por mensaje",
    description: "Una guia para pasar de conversaciones sueltas a solicitudes con datos accionables.",
    image: asset("blog-01.webp"),
  },
  {
    category: "Cotizacion",
    title: "Que datos pedir para cotizar piezas a medida",
    description: "Medidas, material, calibre, largos y cantidades para evitar reprocesos comerciales.",
    image: asset("blog-02.webp"),
  },
  {
    category: "Ventas",
    title: "Como convertir material disponible en ofertas",
    description: "Ideas para detectar oportunidades comerciales a partir de inventario y demanda recurrente.",
    image: asset("blog-03.webp"),
  },
  {
    category: "Operacion",
    title: "Indicadores utiles para ventas de materiales",
    description: "Seguimiento de tiempos de respuesta, cotizaciones abiertas, pedidos y entregas.",
    image: asset("blog-04.webp"),
  },
];

export const footerGroups: FooterGroup[] = [
  {
    title: "Navegacion",
    links: [
      { label: "Inicio", href: "#home" },
      { label: "Solucion", href: "#about" },
      { label: "Servicios", href: "#services" },
      { label: "Mercado", href: "#projects" },
      { label: "Recursos", href: "#blog" },
    ],
  },
  {
    title: "Solucion",
    links: [
      { label: "Cotizacion asistida", href: "#services" },
      { label: "Pipeline comercial", href: "#services" },
      { label: "Pedidos y produccion", href: "#services" },
      { label: "Inteligencia de inventario", href: "#services" },
    ],
  },
];

export const stats = [
  { value: "1", label: "Lugar para solicitudes y seguimiento" },
  { value: "24/7", label: "Captura ordenada de nuevos requerimientos" },
  { value: "IA", label: "Apoyo para responder con mas contexto" },
];

export const comparisonRows: ComparisonRow[] = [
  { factor: "Entrada", market: "Chats dispersos", materialIa: "Solicitudes estructuradas" },
  { factor: "Cotizacion", market: "Datos incompletos", materialIa: "Campos tecnicos claros" },
  { factor: "Seguimiento", market: "Depende de memoria", materialIa: "Pipeline visible" },
  { factor: "Pedidos", market: "Estados manuales", materialIa: "Flujo trazable" },
  { factor: "Venta", market: "Reactiva", materialIa: "Oportunidades sugeridas" },
];
