import Link from "next/link";
import { getSettingsBatch } from "@/lib/settings";
import { getActiveSocialNetworks } from "@/lib/catalog";

const FOOTER_AVATAR_GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ["#fb24b1", "#7c4dff"],
  ["#fd5949", "#fb24b1"],
  ["#1877F2", "#7c4dff"],
];

function FooterAvatar({ idx }: { idx: number }) {
  const [a, b] = FOOTER_AVATAR_GRADIENTS[idx];
  const id = `ft-av-${idx}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="12" fill={`url(#${id})`} />
      <circle cx="12" cy="10" r="3.5" fill="white" opacity="0.92" />
      <path d="M4 22c0-4 4-7 8-7s8 3 8 7z" fill="white" opacity="0.92" />
    </svg>
  );
}

const staticHelpLinks: { name: string; href: string; external?: boolean }[] = [
  { name: "Blog",                 href: "/blog" },
  { name: "Como Funciona",        href: "/como-funciona" },
  { name: "Meus Pedidos",         href: "/meus-pedidos" },
  { name: "Perguntas Frequentes", href: "/#faq" },
  { name: "Termos de Uso",        href: "/termos" },
  { name: "Política de Privacidade", href: "/privacidade" },
];

export default async function Footer() {
  const [networks, settings] = await Promise.all([
    getActiveSocialNetworks(),
    getSettingsBatch({
      logo_type: "text",
      logo_url: "",
      website_name: "SeguiFacil",
      website_logo_text: "SeguiFacil",
      whatsapp_number: "558193886173",
    }),
  ]);

  const logoType = settings.logo_type;
  const logoUrl = settings.logo_url;
  const websiteName = settings.website_name;
  const logoText = settings.website_logo_text;
  const whatsappNumber = settings.whatsapp_number;

  const platformLinks = networks.length > 0
    ? networks.map(n => ({
        name: `Seguidores ${n.name}`,
        href: `/comprar-seguidores-${n.urlSlug || n.name.toLowerCase()}`,
      }))
    : [
        { name: "Seguidores Instagram", href: "/comprar-seguidores-instagram" },
        { name: "Seguidores TikTok",    href: "/comprar-seguidores-tiktok" },
        { name: "Seguidores Kwai",      href: "/comprar-seguidores-kwai" },
        { name: "Seguidores YouTube",   href: "/comprar-seguidores-youtube" },
        { name: "Seguidores Facebook",  href: "/comprar-seguidores-facebook" },
      ];

  const helpLinks = [
    ...staticHelpLinks,
    { name: "Suporte via WhatsApp", href: `https://wa.me/${whatsappNumber}`, external: true },
  ];

  return (
    <footer className="bg-surface border-t border-brand mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Marca */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4" aria-label={websiteName}>
              {logoType === "image" && logoUrl ? (
                 <img src={logoUrl} alt={websiteName} className="h-8 w-auto object-contain" />
              ) : (
                 <span className="text-2xl font-black tracking-tighter text-primary-dark uppercase" style={{ fontFamily: "var(--font-heading)" }}>{logoText}</span>
              )}
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A plataforma mais confiável do Brasil para comprar seguidores e curtidas
              para Instagram, TikTok, Kwai, YouTube e Facebook desde 2017.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm"
                  >
                    <FooterAvatar idx={i} />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold tracking-tight">
                <span className="text-primary-dark font-bold">83.327+ </span>
                <span className="text-muted">clientes satisfeitos</span>
              </p>
            </div>
            {/* Formas de pagamento */}
            <div className="mt-4">
              <p className="text-xs text-muted mb-2 uppercase tracking-wide font-semibold">Pagamentos aceitos</p>
              <div className="flex flex-wrap gap-2">
                {["PIX", "Cartão de Crédito", "Boleto"].map((m) => (
                  <span key={m} className="px-2 py-1 text-xs font-medium bg-white border border-border rounded-md text-gray-600">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Serviços
            </h3>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Ajuda
            </h3>
            <ul className="space-y-2">
              {helpLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © 2017–{new Date().getFullYear()} {websiteName}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted">
            Desenvolvido com segurança e transparência para nossos clientes.
          </p>
        </div>
      </div>
    </footer>
  );
}
