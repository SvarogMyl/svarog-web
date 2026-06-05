"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

const links = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Productos", href: "/#productos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    setLoggedIn(isAuthenticated());
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur border-b border-white/5" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-amber-400 font-bold text-xl tracking-tight group-hover:text-amber-300 transition-colors">
            Svarog
          </span>
          <span className="text-gray-400 text-sm font-light">EcoSystem</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Mi ecosistema
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <LogIn size={14} />
                Ingresar
              </Link>
              <a
                href="/#contacto"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Hablemos
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-amber-400 text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          {loggedIn ? (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors"
            >
              Mi ecosistema
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-amber-400 text-sm transition-colors"
              >
                Ingresar
              </Link>
              <a
                href="/#contacto"
                onClick={() => setOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors"
              >
                Hablemos
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
