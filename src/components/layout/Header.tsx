import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { getActiveSocialNetworks } from "@/lib/catalog";
import { getSettingsBatch } from "@/lib/settings";

export default async function Header() {
  const [networks, settings] = await Promise.all([
    getActiveSocialNetworks(),
    getSettingsBatch({
      logo_type: "text",
      logo_url: "",
      website_name: "SeguiFacil",
      website_logo_text: "SeguiFacil",
    }),
  ]);

  const platforms = networks.map(n => ({
    name: n.name,
    href: `/comprar-seguidores-${n.urlSlug || n.name.toLowerCase()}`,
  }));

  const logoType = settings.logo_type;
  const logoUrl = settings.logo_url;
  const websiteName = settings.website_name;
  const logoText = settings.website_logo_text || websiteName;

  const finalPlatforms = platforms.length > 0 ? platforms : [
    { name: "Instagram", href: "/comprar-seguidores-instagram" },
    { name: "TikTok",    href: "/comprar-seguidores-tiktok" },
    { name: "Kwai",      href: "/comprar-seguidores-kwai" },
    { name: "Facebook",  href: "/comprar-seguidores-facebook" },
    { name: "YouTube",   href: "/comprar-seguidores-youtube" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 md:bg-white/80 md:backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Agora Estático (Melhora LCP) */}
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label={`${websiteName} — página inicial`}>
            {logoType === "image" && logoUrl ? (
              <img src={logoUrl} alt={websiteName} className="h-10 w-auto object-contain" fetchPriority="high" />
            ) : (
              <span className="logo-text">
                {logoText}
              </span>
            )}
          </Link>

          {/* Navegação desktop - Estática */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Plataformas">
            {finalPlatforms.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-primary transition-all"
              >
                {p.name}
              </Link>
            ))}
          </nav>

          {/* Ações desktop - Estáticas */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/blog"
              className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-primary transition-all"
            >
              Blog
            </Link>
            <Link
              href="/meus-pedidos"
              className="btn-tactile inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-brand-gradient rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <ShoppingBag size={14} aria-hidden />
              Meus Pedidos
            </Link>
          </div>

          {/* Somente a parte mobile é Client */}
          <HeaderMobileMenu platforms={finalPlatforms} />
        </div>
      </div>
    </header>
  );
}
