import { Code2, Zap, Globe, Bot } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "APIs y Microservicios",
    description:
      "Diseñamos e implementamos APIs robustas y microservicios escalables con Node.js, Go y Spring Boot. Arquitectura orientada a la resiliencia y el rendimiento.",
    tags: ["REST", "Go", "Node.js", "Spring Boot"],
  },
  {
    icon: Globe,
    title: "Aplicaciones Web SaaS",
    description:
      "Desarrollamos productos SaaS completos: desde el backend hasta el frontend, con autenticación, multi-tenancy y observabilidad incluidos desde el diseño.",
    tags: ["Next.js", "TypeScript", "Multi-tenant", "PostgreSQL"],
  },
  {
    icon: Zap,
    title: "Integraciones y Automatizaciones",
    description:
      "Conectamos sistemas existentes y automatizamos procesos repetitivos. Eliminamos silos de información y reducimos trabajo manual en tu organización.",
    tags: ["Webhooks", "RabbitMQ", "APIs de terceros", "Workflows"],
  },
  {
    icon: Bot,
    title: "Agentes e IA Aplicada",
    description:
      "Integramos modelos de lenguaje y agentes inteligentes directamente en tus procesos. No solo chatbots — IA que ejecuta, decide y genera valor real.",
    tags: ["LLM", "Agentes", "RAG", "Automatización"],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Qué hacemos hoy
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Servicios disponibles
          </h2>
          <p className="text-gray-400 max-w-xl">
            Capacidades probadas en producción. No promesas — infraestructura
            real funcionando con clientes reales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/20 rounded-xl p-6 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <s.icon size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
