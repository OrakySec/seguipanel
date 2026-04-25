import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans, Pacifico } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { getSetting } from "@/lib/settings";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const BASE_URL = "https://seguifacil.com";

export async function generateMetadata(): Promise<Metadata> {
  const [siteTitle, siteDesc, siteName] = await Promise.all([
    getSetting("website_title", "SeguiFacil – Comprar Seguidores e Curtidas | A partir de R$2,50"),
    getSetting("website_desc", "Compre seguidores e curtidas brasileiras para Instagram, TikTok, Kwai, YouTube e Facebook. Entrega em minutos, 100% seguro, sem precisar de senha. A partir de R$2,50. Mais de 83.000 clientes satisfeitos desde 2017."),
    getSetting("website_name", "SeguiFacil"),
  ]);

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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SeguiFacil",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  foundingDate: "2017",
  description: "SeguiFacil é a plataforma líder no Brasil para compra de seguidores e curtidas para Instagram, TikTok, Kwai, YouTube e Facebook. Atendemos mais de 83.000 clientes desde 2017.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Portuguese",
  },
  sameAs: [
    "https://www.instagram.com/seguifacil",
    "https://www.tiktok.com/@seguifacil",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="pt-BR" 
      className={`${geistSans.variable} ${plusJakarta.variable} ${pacifico.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Impede que browsers com dark mode do sistema apliquem cores escuras automaticamente */}
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17638838744"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17638838744');
          `}
        </Script>
      </head>
      <body 
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <NavigationProgress />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
