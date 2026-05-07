import React from "react";
import HeaderClient from "./HeaderClient";
import { getActiveSocialNetworks } from "@/lib/catalog";
import { getSettingsBatch } from "@/lib/settings";

export default async function Header() {
  const networks = await getActiveSocialNetworks();
  
  const platforms = networks.map(n => ({
    name: n.name,
    href: `/comprar-seguidores-${n.urlSlug || n.name.toLowerCase()}`,
  }));

  const settings = await getSettingsBatch({
    logo_type: "text",
    logo_url: "",
    website_name: "SeguiFacil",
  });
  
  const logoType = settings.logo_type;
  const logoUrl = settings.logo_url;
  const websiteName = settings.website_name;
  // website_logo_text can fall back to websiteName
  const settingsLogoText = await getSettingsBatch({ website_logo_text: websiteName });
  const logoText = settingsLogoText.website_logo_text;

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
