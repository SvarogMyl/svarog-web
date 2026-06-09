"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth";
import { Flame, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <Flame size={22} className="text-amber-400" />
          <span className="text-amber-400 font-bold text-xl">Svarog</span>
          <span className="text-gray-500 text-sm">EcoSystem</span>
        </Link>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-2">
              <CheckCircle2 size={40} className="text-amber-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">Revisa tu correo</h1>
              <p className="text-gray-400 text-sm">
                Si ese email está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white mb-1">¿Olvidaste tu contraseña?</h1>
              <p className="text-gray-500 text-sm mb-8">
                Ingresa tu email y te enviaremos un enlace para restablecerla.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : "Enviar enlace"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Volver al login
          </Link>
        </p>
      </div>
    </main>
  );
}
