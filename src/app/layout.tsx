import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Svarog EcoSystem — Forjando soluciones con Inteligencia Artificial",
  description:
    "Fábrica de software moderna impulsada por IA. Construimos APIs, microservicios y aplicaciones SaaS escalables para empresas que quieren moverse rápido.",
  keywords: ["software", "inteligencia artificial", "desarrollo web", "microservicios", "SaaS", "Chile"],
  openGraph: {
    title: "Svarog EcoSystem",
    description: "Forjando soluciones con Inteligencia Artificial",
    url: "https://svasoft.cl",
    siteName: "Svarog EcoSystem",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
