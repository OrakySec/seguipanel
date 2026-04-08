import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Em PROD: chunks têm content hashes reais no nome, immutable é correto.
      // Em DEV: Turbopack reutiliza os mesmos nomes de chunk entre rebuilds —
      // com immutable o browser cacheia o JS antigo por 1 ano e nunca busca
      // a versão nova, causando hydration mismatch persistente.
      ...(!isDev
        ? [
            {
              source: "/_next/static/(.*)",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
