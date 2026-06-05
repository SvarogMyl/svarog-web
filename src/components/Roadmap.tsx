const milestones = [
  {
    period: "Hoy",
    label: "Fundamentos",
    done: true,
    items: [
      "Infraestructura multi-servicio en Oracle Cloud",
      "Identidad centralizada (lab-auth-service)",
      "Observabilidad con Grafana + Prometheus",
      "Svarog News — primer producto SaaS",
      "CI/CD automatizado por servicio",
    ],
  },
  {
    period: "Q3 2026",
    label: "Plataforma de identidad",
    done: false,
    items: [
      "Svarog Auth — login con Google + gestión de suscripciones",
      "Dashboard admin para clientes",
      "Recuperación de contraseña",
      "Portal comercial svasoft.cl live",
    ],
  },
  {
    period: "Q4 2026",
    label: "Nuevos productos",
    done: false,
    items: [
      "Svarog Booking — reservas y agenda",
      "Primer vertical de industria (por validar)",
      "Automatizaciones con n8n + RabbitMQ",
    ],
  },
  {
    period: "2027",
    label: "Escala y agentes",
    done: false,
    items: [
      "Svarog AI — agentes especializados + RAG",
      "Svarog Commerce — cotizaciones y proveedores",
      "Equipo en crecimiento",
      "Dominio propio (dominio real)",
    ],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Transparencia total
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Roadmap</h2>
          <p className="text-gray-400 max-w-xl">
            Lo que ya está construido y hacia dónde vamos. Sin humo — solo
            compromisos reales.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10 hidden md:block" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <div key={i} className="md:flex gap-8">
                {/* Dot */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0 w-6">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                      m.done
                        ? "bg-amber-500 border-amber-500"
                        : "bg-transparent border-white/20"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        m.done
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {m.period}
                    </span>
                    <h3 className="font-semibold text-white">{m.label}</h3>
                    {m.done && (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        Completado
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {m.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                            m.done ? "bg-amber-400" : "bg-gray-600"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
