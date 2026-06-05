"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Reutilizamos la misma key que usa auth.ts
const TOKEN_KEY = "svarog_token";

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("sso_token");
    const error = params.get("error");

    if (error === "cancelled") {
      router.replace("/login?error=cancelled");
      return;
    }

    if (!token) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    // Limpiar el token de la URL
    window.history.replaceState({}, "", "/auth/callback");
    router.replace("/dashboard");
  }, [router, params]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/60">
        <Loader2 size={28} className="animate-spin text-amber-400" />
        <span className="text-sm">Completando inicio de sesión...</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
