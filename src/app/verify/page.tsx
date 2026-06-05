"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

const TOKEN_KEY = "svarog_token";
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL!;

function VerifyHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setErrorMsg("Token de verificación no encontrado en la URL.");
      setStatus("error");
      return;
    }

    // El auth-service redirige al /onboarding directamente via 302
    // Si el usuario llega aquí es porque algo falló en el redirect
    // Intentamos la verificación llamando al backend y manejamos la respuesta
    fetch(`${AUTH_URL}/auth/verify?token=${encodeURIComponent(token)}`, {
      redirect: "manual",
    })
      .then((res) => {
        if (res.type === "opaqueredirect" || res.status === 302 || res.ok) {
          // El servidor redirige al onboarding — el browser no lo siguió en manual mode
          // Leer el Location header no es posible desde opaqueredirect, así que redirigimos nosotros
          // directamente al onboarding (el JWT viene en el redirect del servidor)
          // En este caso vamos a pedir el token explícitamente
          return fetch(`${AUTH_URL}/auth/verify?token=${encodeURIComponent(token)}`);
        }
        throw new Error("Token inválido");
      })
      .then(async (res) => {
        if (res.redirected) {
          // El browser siguió el redirect — extraer sso_token de la URL final
          const url = new URL(res.url);
          const ssoToken = url.searchParams.get("sso_token");
          if (ssoToken) {
            localStorage.setItem(TOKEN_KEY, ssoToken);
            router.replace("/onboarding");
          } else {
            router.replace("/dashboard");
          }
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Token inválido o expirado");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "El enlace de verificación es inválido o ya fue usado.");
        setStatus("error");
      });
  }, [params, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Verificando tu cuenta...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Error de verificación</h1>
        <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
        <Link href="/login" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
          Volver al login
        </Link>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return <Suspense><VerifyHandler /></Suspense>;
}
