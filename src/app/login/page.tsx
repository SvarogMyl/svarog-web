"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, isAuthenticated } from "@/lib/auth";
import { Flame, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL!;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ identity: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
    const err = params.get("error");
    if (err === "cancelled") setError("Inicio de sesión cancelado.");
  }, [router, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.identity, form.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      if (msg.includes("verify")) {
        setError("Debes verificar tu email antes de ingresar. Revisa tu bandeja de entrada.");
      } else {
        setError("Credenciales inválidas. Verifica tu email o contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleURL = `${AUTH_URL}/auth/google?redirect_uri=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin + "/auth/callback" : "https://svasoft.cl/auth/callback"
  )}`;

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
          <h1 className="text-xl font-bold text-white mb-1">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mb-8">Accede a tus servicios del ecosistema</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Usuario o email</label>
              <input
                type="text"
                required
                autoComplete="username"
                value={form.identity}
                onChange={(e) => setForm({ ...form, identity: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="juanito o juanito@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-gray-400">Contraseña</label>
                <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-amber-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

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
              {loading ? <><Loader2 size={15} className="animate-spin" /> Ingresando...</> : "Ingresar"}
            </button>
          </form>

          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">o</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <a
            href={googleURL}
            className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </a>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 transition-colors">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
