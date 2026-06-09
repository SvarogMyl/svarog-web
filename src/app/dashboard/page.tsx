"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClaims, logout, getToken, type TokenClaims } from "@/lib/auth";
import { SERVICES, statusLabel, type ServiceStatus } from "@/lib/services";
import { Flame, LogOut, ExternalLink, ChevronRight, User } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<ServiceStatus, string> = {
  active: "text-green-400 bg-green-400/10 border-green-400/20",
  beta: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  coming_soon: "text-gray-500 bg-white/5 border-white/10",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TokenClaims | null>(null);

  useEffect(() => {
    const claims = getClaims();
    if (!claims) {
      router.replace("/login");
      return;
    }
    setUser(claims);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  const activeServices = SERVICES.filter((s) => s.status === "active");
  const otherServices = SERVICES.filter((s) => s.status !== "active");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Navbar */}
      <header className="border-b border-white/[0.06] bg-black/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" />
            <span className="text-amber-400 font-bold">Svarog</span>
            <span className="text-gray-500 text-xs">EcoSystem</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              Hola,{" "}
              <span className="text-white font-medium">{user.username}</span>
            </span>
            <Link
              href="/dashboard/perfil"
              className="flex items-center gap-1.5 text-gray-500 hover:text-amber-400 text-xs transition-colors"
            >
              <User size={13} />
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-xs transition-colors"
            >
              <LogOut size={13} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-white mb-1">
            Tu ecosistema
          </h1>
          <p className="text-gray-500 text-sm">
            Accede y gestiona tus servicios activos de Svarog.
          </p>
        </div>

        {/* Active services */}
        {activeServices.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Servicios activos
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeServices.map((s) => (
                <div
                  key={s.id}
                  className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-amber-500/25 rounded-xl p-5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <span
                      className={`text-xs border px-2 py-0.5 rounded-full ${statusStyles[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white mb-1">{s.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    {s.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-gray-600 bg-white/5 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {s.url && (
                    <button
                      onClick={() => {
                        const token = getToken();
                        const url = token
                          ? `${s.url}/sso?sso_token=${token}`
                          : s.url;
                        window.open(url, "_blank", "noopener");
                      }}
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
                    >
                      Abrir panel
                      <ExternalLink size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming soon */}
        {otherServices.length > 0 && (
          <div>
            <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Próximamente
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherServices.map((s) => (
                <div
                  key={s.id}
                  className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 opacity-60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl grayscale">{s.icon}</span>
                    <span
                      className={`text-xs border px-2 py-0.5 rounded-full ${statusStyles[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-400 mb-1">{s.name}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News shortcut */}
        <div className="mt-12 border-t border-white/[0.06] pt-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors"
          >
            Ver las noticias del ecosistema
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
