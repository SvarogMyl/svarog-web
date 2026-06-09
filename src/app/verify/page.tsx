"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCode, resendVerification } from "@/lib/auth";
import { Flame, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function VerifyHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyCode(email, code);
      router.replace("/onboarding");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setError("");
    setResending(true);
    try {
      await resendVerification(email);
      setResendMsg("Código reenviado. Revisa tu bandeja de entrada.");
    } catch {
      setError("No se pudo reenviar el código. Intenta más tarde.");
    } finally {
      setResending(false);
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
          <CheckCircle2 size={32} className="text-amber-400 mb-4" />
          <h1 className="text-xl font-bold text-white mb-1">Verifica tu cuenta</h1>
          <p className="text-gray-500 text-sm mb-2">
            Ingresa el código de 6 dígitos que enviamos a
          </p>
          <p className="text-white text-sm font-medium mb-8 truncate">{email}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500/60 transition-colors"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {resendMsg && (
              <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
                {resendMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Verificando...</> : "Verificar cuenta"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-gray-500 hover:text-amber-400 transition-colors disabled:opacity-50"
            >
              {resending ? "Reenviando..." : "¿No recibiste el código? Reenviar"}
            </button>
          </div>
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

export default function VerifyPage() {
  return <Suspense><VerifyHandler /></Suspense>;
}
