import Link from "next/link";
import { getSetting } from "@/lib/settings";

const platformLinks = [
  { name: "Seguidores Instagram", href: "/comprar-seguidores-instagram" },
  { name: "Curtidas Instagram",   href: "/comprar-curtidas-instagram" },
  { name: "Seguidores TikTok",    href: "/comprar-seguidores-tiktok" },
  { name: "Seguidores Kwai",      href: "/comprar-seguidores-kwai" },
  { name: "Seguidores YouTube",   href: "/comprar-seguidores-youtube" },
  { name: "Seguidores Facebook",  href: "/comprar-seguidores-facebook" },
];

const helpLinks = [
  { name: "Como Funciona",        href: "/como-funciona" },
  { name: "Meus Pedidos",         href: "/meus-pedidos" },
  { name: "Perguntas Frequentes", href: "/#faq" },
  { name: "Suporte via WhatsApp", href: "https://wa.me/5551980107363", external: true },
  { name: "Termos de Uso",        href: "/termos" },
  { name: "Política de Privacidade", href: "/privacidade" },
];

export default async function Footer() {
  const logoType = await getSetting("logo_type", "text");
  const logoUrl = await getSetting("logo_url", "");
  const websiteName = await getSetting("website_name", "SeguiFacil");
  const logoText = await getSetting("website_logo_text", websiteName);

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
                 <span className="text-2xl font-black tracking-tighter text-brand-gradient uppercase" style={{ fontFamily: "var(--font-heading)" }}>{logoText}</span>
              )}
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A plataforma mais confiável do Brasil para comprar seguidores e curtidas
              para Instagram, TikTok, Kwai, YouTube e Facebook desde 2017.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1507003211169-0a1dd7228f2d' : i === 2 ? '1494790108377-be9c29b29330' : '1599566150163-29194dcaad36'}?q=80&w=50&h=50&auto=format&fit=crop`} 
                      alt="Cliente" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold tracking-tight">
                <span className="text-[#ff1f7d]">83.327+ </span>
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
