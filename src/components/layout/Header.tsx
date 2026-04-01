"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, LogIn } from "lucide-react";

const platforms = [
  { name: "Instagram", href: "/comprar-seguidores-instagram" },
  { name: "TikTok",    href: "/comprar-seguidores-tiktok" },
  { name: "Kwai",      href: "/comprar-seguidores-kwai" },
  { name: "Facebook",  href: "/comprar-seguidores-facebook" },
  { name: "YouTube",   href: "/comprar-seguidores-youtube" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="SeguiFacil — página inicial">
            <span className="text-xl font-bold text-brand-gradient">SeguiFacil</span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Plataformas">
            {platforms.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-primary hover:bg-primary-light transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </nav>

          {/* Ações desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/meus-pedidos"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary border border-border rounded-full hover:bg-primary-light transition-colors min-h-[44px]"
            >
              <ShoppingBag size={15} aria-hidden />
              Meus Pedidos
            </Link>
            <Link
              href="/entrar"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white rounded-full bg-brand-gradient hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <LogIn size={15} aria-hidden />
              Entrar
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-primary-light hover:text-primary transition-colors"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-border bg-white px-4 pb-4 pt-2"
          role="navigation"
          aria-label="Menu mobile"
        >
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 mt-2">
            Plataformas
          </p>
          <div className="flex flex-col gap-1">
            {platforms.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-light hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Link
              href="/meus-pedidos"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-primary border border-border rounded-full hover:bg-primary-light transition-colors"
            >
              <ShoppingBag size={15} aria-hidden />
              Meus Pedidos
            </Link>
            <Link
              href="/entrar"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-white rounded-full bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              <LogIn size={15} aria-hidden />
              Entrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
