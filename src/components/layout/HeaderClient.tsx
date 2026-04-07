"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, LogIn } from "lucide-react";

interface Platform {
  name: string;
  href: string;
}

interface SettingsContext {
  logoType: string;
  logoUrl: string;
  websiteName: string;
  logoText: string;
}

export default function HeaderClient({ 
  platforms, 
  settings 
}: { 
  platforms: Platform[], 
  settings?: SettingsContext 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label={`${settings?.websiteName || "SeguiFacil"} — página inicial`}>
            {settings?.logoType === "image" && settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.websiteName} className="h-10 w-auto object-contain" />
            ) : (
                <span className="text-xl font-black tracking-tighter text-brand-gradient uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                  {settings?.logoText || settings?.websiteName || "SeguiFacil"}
                </span>
            )}
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Plataformas">
            {platforms.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-primary transition-all"
              >
                {p.name}
              </Link>
            ))}
          </nav>

          {/* Ações desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/meus-pedidos"
              className="btn-tactile inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-brand-gradient rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <ShoppingBag size={14} aria-hidden />
              Meus Pedidos
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex items-center justify-center w-12 h-12 rounded-2xl text-gray-900 bg-gray-50 border border-gray-100 hover:bg-primary-light transition-all active:scale-95"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 pb-6 pt-4 animate-fade-in-up"
          role="navigation"
          aria-label="Menu mobile"
        >
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 px-2">
            Plataformas
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {platforms.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-4 text-xs font-bold text-gray-600 rounded-2xl bg-gray-50 border border-gray-50 hover:bg-primary-light hover:text-primary transition-all flex items-center"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              href="/meus-pedidos"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-white bg-brand-gradient rounded-2xl shadow-lg"
            >
              <ShoppingBag size={16} aria-hidden />
              Meus Pedidos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
