import React from "react";
import HeaderClient from "./HeaderClient";
import { getActiveSocialNetworks } from "@/lib/catalog";
import { getSetting } from "@/lib/settings";

export default async function Header() {
  const networks = await getActiveSocialNetworks();
  
  const platforms = networks.map(n => ({
    name: n.name,
    href: `/comprar-seguidores-${n.urlSlug || n.name.toLowerCase()}`,
  }));

  const logoType = await getSetting("logo_type", "text");
  const logoUrl = await getSetting("logo_url", "");
  const websiteName = await getSetting("website_name", "SeguiFacil");
  const logoText = await getSetting("website_logo_text", websiteName);

  // Fallback to defaults if there are absolutely no networks active
  const finalPlatforms = platforms.length > 0 ? platforms : [
    { name: "Instagram", href: "/comprar-seguidores-instagram" },
    { name: "TikTok",    href: "/comprar-seguidores-tiktok" },
    { name: "Kwai",      href: "/comprar-seguidores-kwai" },
    { name: "Facebook",  href: "/comprar-seguidores-facebook" },
    { name: "YouTube",   href: "/comprar-seguidores-youtube" },
  ];

  return <HeaderClient platforms={finalPlatforms} settings={{ logoType, logoUrl, websiteName, logoText }} />;
}
