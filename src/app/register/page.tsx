"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { Flame, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import Link from "next/link";

function passwordRules(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[!@#$%^&*()\-_=+\[\]{}|;':",.<>/?]/.test(password),
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rules = passwordRules(form.password);
  const allRulesMet = Object.values(rules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!allRulesMet) {
      setError("La contraseña no cumple con los requisitos.");
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear la cuenta";
      if (msg.includes("already")) {
        setError("El email o nombre de usuario ya está registrado.");
      } else {
        setError(msg);
      }
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
          <h1 className="text-xl font-bold text-white mb-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mb-8">Es gratis. Verifica tu email para activarla.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Nombre de usuario</label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_]+$"
                title="Solo letras, números y guión bajo"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="juanito"
              />
              <p className="text-xs text-gray-600 mt-1">3-30 caracteres, solo letras, números y _</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {form.password.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {[
                    { ok: rules.length, label: "Mínimo 8 caracteres" },
                    { ok: rules.upper, label: "Al menos 1 mayúscula" },
                    { ok: rules.digit, label: "Al menos 1 número" },
                    { ok: rules.special, label: "Al menos 1 carácter especial (!@#$%...)" },
                  ].map(({ ok, label }) => (
                    <li key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-400" : "text-gray-500"}`}>
                      {ok ? <Check size={11} /> : <X size={11} />}
                      {label}
                    </li>
                  ))}
                </ul>
              )}
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
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creando cuenta...</> : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
