export type ServiceStatus = "active" | "coming_soon" | "beta";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ServiceStatus;
  url?: string;           // URL del panel del servicio
  docsUrl?: string;
  tags: string[];
}

export const SERVICES: Service[] = [
  {
    id: "news",
    name: "Svarog News",
    description: "CMS headless multi-tenant. Publica y gestiona artículos desde un panel centralizado.",
    icon: "📰",
    status: "active",
    url: process.env.NEXT_PUBLIC_NEWS_ADMIN_URL || "#",
    tags: ["CMS", "Multi-tenant", "API"],
  },
  {
    id: "auth",
    name: "Svarog Auth",
    description: "Gestión de identidad, usuarios y suscripciones del ecosistema.",
    icon: "🔐",
    status: "coming_soon",
    tags: ["Auth", "JWT", "OAuth"],
  },
  {
    id: "booking",
    name: "Svarog Booking",
    description: "Reservas, agenda y gestión de disponibilidad para tu negocio.",
    icon: "📅",
    status: "coming_soon",
    tags: ["Reservas", "Agenda"],
  },
  {
    id: "ai",
    name: "Svarog AI",
    description: "Agentes inteligentes, RAG y búsqueda semántica integrados en tus procesos.",
    icon: "🤖",
    status: "coming_soon",
    tags: ["IA", "Agentes", "RAG"],
  },
];

export const statusLabel: Record<ServiceStatus, string> = {
  active: "Activo",
  beta: "Beta",
  coming_soon: "Próximamente",
};
