import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-brand mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Marca */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <span className="text-2xl font-bold text-brand-gradient">SeguiFacil</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A plataforma mais confiável do Brasil para comprar seguidores e curtidas
              para Instagram, TikTok, Kwai, YouTube e Facebook desde 2017.
            </p>
            <p className="mt-4 text-sm text-muted">
              <span className="font-semibold text-gray-700">83.327+</span> clientes satisfeitos
            </p>
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
            © 2017–{new Date().getFullYear()} SeguiFacil. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted">
            Desenvolvido com segurança e transparência para nossos clientes.
          </p>
        </div>
      </div>
    </footer>
  );
}
