import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NavigationProgressLazy } from "@/components/ui/NavigationProgressLazy";
import { getSettingsBatch } from "@/lib/settings";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

const BASE_URL = "https://seguifacil.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsBatch({
    website_title: "SeguiFacil – Comprar Seguidores e Curtidas | A partir de R$2,50",
    website_desc: "Compre seguidores e curtidas brasileiras para Instagram, TikTok, Kwai, YouTube e Facebook. Entrega em minutos, 100% seguro, sem precisar de senha. A partir de R$2,50. Mais de 83.000 clientes satisfeitos desde 2017.",
    website_name: "SeguiFacil",
  });
  
  const siteTitle = settings.website_title;
  const siteDesc = settings.website_desc;
  const siteName = settings.website_name;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDesc,
    keywords: [
      "comprar seguidores instagram",
      "comprar curtidas instagram",
      "comprar seguidores tiktok",
      "comprar seguidores brasileiros",
      "comprar curtidas brasileiras",
      "comprar seguidores kwai",
      "comprar seguidores youtube",
      "comprar seguidores facebook",
      "aumentar seguidores instagram",
      "smm panel brasil",
      "seguifacil",
    ],
    authors: [{ name: siteName, url: BASE_URL }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: BASE_URL,
      siteName,
      title: siteTitle,
      description: siteDesc,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} – Comprar Seguidores e Curtidas`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDesc,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}#org`,
      name: "SeguiFacil",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      foundingDate: "2017",
      description:
        "SeguiFacil é a plataforma líder no Brasil para compra de seguidores e curtidas para Instagram, TikTok, Kwai, YouTube e Facebook. Atendemos mais de 83.000 clientes desde 2017.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: "Portuguese",
      },
      sameAs: [
        "https://www.instagram.com/seguifacil",
        "https://www.tiktok.com/@seguifacil",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}#site`,
      name: "SeguiFacil",
      url: BASE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/busca?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body 
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {/* Google Ads – agora no Web Worker (Partytown) para não bloquear a thread principal */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17638838744"
          strategy="worker"
        />
        <Script id="google-ads" strategy="worker">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17638838744', { 'send_page_view': true });
          `}
        </Script>

        <NavigationProgressLazy />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
