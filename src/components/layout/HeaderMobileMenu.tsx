"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";

interface Platform {
  name: string;
  href: string;
}

export default function HeaderMobileMenu({ platforms }: { platforms: Platform[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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

      {/* Menu mobile */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 sm:hidden border-t border-gray-100 bg-white/95 md:backdrop-blur-xl px-4 pb-6 pt-4 animate-fade-in-up"
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
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 py-4 px-5 text-xs font-black uppercase tracking-widest text-primary bg-primary/10 rounded-2xl"
            >
              Blog
            </Link>
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
    </>
  );
}
