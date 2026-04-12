import type { MetadataRoute } from "next";

const BASE_URL = "https://seguifacil.com"; // v150a3de

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/checkout/",
          "/pedidos/",
          "/perfil/",
          "/login",
          "/cadastro",
          "/recuperar-senha",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
