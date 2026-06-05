"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeOnboarding, getToken, getClaims } from "@/lib/auth";
import { Flame, Loader2 } from "lucide-react";

const TOKEN_KEY = "svarog_token";

function OnboardingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: "", phone: "", marketing: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Puede venir con sso_token en la URL (desde /auth/verify redirect)
    const ssoToken = params.get("sso_token");
    if (ssoToken) {
      localStorage.setItem(TOKEN_KEY, ssoToken);
    }
    const t = ssoToken ?? getToken();
    if (!t) {
      router.replace("/login");
      return;
    }
    setToken(t);
    const claims = getClaims();
    if (claims) setUsername(claims.username);
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es requerido."); return; }
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      await completeOnboarding(token, form.name.trim(), form.phone, form.marketing);
      router.replace("/dashboard");
    } catch {
      setError("Error al guardar el perfil. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => router.replace("/dashboard");

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Flame size={22} className="text-amber-400" />
          <span className="text-amber-400 font-bold text-xl">Svarog</span>
          <span className="text-gray-500 text-sm">EcoSystem</span>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          <div className="mb-6">
            <span className="text-xs text-amber-400/70 font-medium uppercase tracking-wider">Bienvenido</span>
            <h1 className="text-xl font-bold text-white mt-1">
              Hola, <span className="text-amber-400">{username || "..."}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Cuéntanos un poco más para personalizar tu experiencia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Teléfono <span className="text-gray-600 text-xs">(opcional)</span>
              </label>
              <input
                type="tel"
                maxLength={20}
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={form.marketing}
                  onChange={(e) => setForm({ ...form, marketing: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-colors ${
                  form.marketing
                    ? "bg-amber-500 border-amber-500"
                    : "bg-white/5 border-white/20 group-hover:border-white/40"
                }`}>
                  {form.marketing && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3 m-0.5" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-400 leading-relaxed">
                Quiero recibir novedades sobre nuevos productos y servicios de Svarog Ecosystem.
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : "Continuar al dashboard"}
            </button>
          </form>
        </div>

        <button
          onClick={handleSkip}
          className="block w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-4 transition-colors"
        >
          Saltar por ahora
        </button>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return <Suspense><OnboardingForm /></Suspense>;
}
