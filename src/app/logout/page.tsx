"use client";

import { useEffect } from "react";
import { logout } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  useEffect(() => {
    logout();
    window.location.replace("/");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/60">
        <Loader2 size={28} className="animate-spin text-amber-400" />
        <span className="text-sm">Cerrando sesión...</span>
      </div>
    </div>
  );
}
