import { Newspaper, ExternalLink, CheckCircle } from "lucide-react";

const products = [
  {
    icon: Newspaper,
    name: "Svarog News",
    status: "live",
    tagline: "CMS headless multi-tenant",
    description:
      "API de noticias lista para producción. Gestiona contenido de múltiples clientes con una sola instancia. Ideal para medios digitales, portales corporativos y publishers que quieren salir de WordPress.",
    features: [
      "Multi-tenant con aislamiento por API Key",
      "Storage de imágenes en Cloudflare R2",
      "Panel de administración incluido",
      "API REST documentada (OpenAPI)",
    ],
    cta: "Solicitar acceso",
    href: "#contacto",
  },
];

const coming = [
  { name: "Svarog Auth", desc: "Identidad centralizada + suscripciones", eta: "Q3 2026" },
  { name: "Svarog Booking", desc: "Reservas, agenda y disponibilidad", eta: "Q4 2026" },
  { name: "Svarog Commerce", desc: "Cotizaciones, inventario y proveedores", eta: "2027" },
  { name: "Svarog AI", desc: "Agentes, RAG y búsqueda semántica", eta: "2027" },
];

export default function Products() {
  return (
    <section id="productos" className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Productos propios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Disponible ahora
          </h2>
          <p className="text-gray-400 max-w-xl">
            Productos construidos sobre el ecosistema Svarog, disponibles para
            clientes reales hoy.
          </p>
        </div>

        {/* Live products */}
        <div className="mb-16">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-white/[0.03] border border-amber-500/20 rounded-xl p-8 md:flex gap-8"
            >
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <p.icon size={28} className="text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-amber-400/80 text-sm mb-3">{p.tagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {p.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {p.cta}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-6">
            En construcción
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {coming.map((c) => (
              <div
                key={c.name}
                className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4"
              >
                <div className="text-xs text-amber-500/60 font-mono mb-2">{c.eta}</div>
                <div className="font-semibold text-gray-200 text-sm mb-1">{c.name}</div>
                <div className="text-xs text-gray-500">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
