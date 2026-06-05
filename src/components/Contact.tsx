"use client";

import { useState } from "react";
import { Send, Mail, GitBranch } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Por ahora abre el cliente de email — en v2 conectamos a lab-mail-service
    const subject = encodeURIComponent(`Contacto desde svasoft.cl — ${form.name}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.open(`mailto:yannickvalderasm@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
              Trabajemos juntos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Hablemos de tu proyecto
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              ¿Tienes una idea, un proceso que automatizar o un producto que
              construir? Cuéntanos. Respondemos en menos de 24 horas.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:yannickvalderasm@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors text-sm group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                  <Mail size={15} />
                </div>
                yannickvalderasm@gmail.com
              </a>
              <a
                href="https://github.com/SvarogMyl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors text-sm group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                  <GitBranch size={15} />
                </div>
                github.com/SvarogMyl
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                  <Send size={24} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">¡Listo!</h3>
                <p className="text-gray-400 text-sm">
                  Se abrió tu cliente de email con el mensaje. Nos vemos pronto.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-xs text-gray-500 hover:text-amber-400 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Tu nombre o empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Mensaje</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                    placeholder="Cuéntanos tu proyecto o idea..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
                >
                  Enviar mensaje
                  <Send size={14} />
                </button>
                <p className="text-xs text-gray-600 text-center">
                  Respondemos en menos de 24 horas.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
