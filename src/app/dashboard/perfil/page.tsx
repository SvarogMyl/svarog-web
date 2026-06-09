"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getClaims, getProfile, updateProfile, type UserProfile } from "@/lib/auth";
import { Flame, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const claims = getClaims();
    if (!claims) { router.replace("/login"); return; }
    const token = getToken()!;
    getProfile(token)
      .then((p) => {
        setProfile(p);
        setForm({ name: p.name, phone: p.phone });
      })
      .catch(() => setError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const token = getToken()!;
      await updateProfile(token, form.name, form.phone);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-amber-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-white/[0.06] bg-black/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" />
            <span className="text-amber-400 font-bold">Svarog</span>
            <span className="text-gray-500 text-xs">EcoSystem</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-amber-400 text-xs transition-colors">
            <ArrowLeft size={13} />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-1">Mi perfil</h1>
        <p className="text-gray-500 text-sm mb-8">Edita tu información personal.</p>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nombre de usuario</label>
            <input
              type="text"
              disabled
              value={profile?.username ?? ""}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-600 mt-1">No editable</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              disabled
              value={profile?.email ?? ""}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-600 mt-1">No editable</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Teléfono</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="+56912345678"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
              <CheckCircle2 size={14} />
              Perfil actualizado correctamente.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}
