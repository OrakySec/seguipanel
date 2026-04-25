export const dynamic = "force-dynamic";

import Link from "next/link";
import { getActiveSocialNetworks, SOCIAL_METADATA } from "@/lib/catalog";
import { getSetting } from "@/lib/settings";
import GrowthFaq from "./GrowthFaq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acelere seu Crescimento nas Redes Sociais | SeguiFacil",
  description:
    "Estratégias de crescimento digital para Instagram, TikTok, Kwai, YouTube e Facebook. Aumente sua visibilidade, engajamento e presença digital com segurança. Resultado a partir de minutos.",
  robots: { index: false, follow: false },
};

const steps = [
  {
    number: "01",
    title: "Escolha sua plataforma",
    desc: "Selecione a rede social onde deseja ampliar sua presença digital e o tipo de crescimento que mais se encaixa no seu objetivo.",
  },
  {
    number: "02",
    title: "Informe seu perfil",
    desc: "Basta informar o @ ou link público do seu perfil. Nenhuma senha necessária — nossas soluções atuam 100% de forma externa.",
  },
  {
    number: "03",
    title: "Veja os resultados",
    desc: "Após confirmar via PIX, o processamento inicia automaticamente. A maioria dos clientes já vê os primeiros resultados em minutos.",
  },
];

const testimonials = [
  {
    name: "Juliana M.",
    role: "Empreendedora",
    city: "São Paulo",
    platform: "Instagram",
    text: "Minha presença digital decolou. Em menos de 6 horas meu perfil ganhou muito mais visibilidade e minha loja teve 34% mais acessos na semana seguinte.",
    stars: 5,
    initial: "J",
    color: "#E1306C",
  },
  {
    name: "Camila S.",
    role: "Criadora de Conteúdo",
    city: "Rio de Janeiro",
    platform: "TikTok",
    text: "Resultado rapidíssimo! O impulsionamento gerou um crescimento orgânico incrível — meu vídeo chegou a 48 mil visualizações nos 3 dias seguintes.",
    stars: 5,
    initial: "C",
    color: "#9b00e0",
  },
  {
    name: "Lucas R.",
    role: "Agência Digital",
    city: "Belo Horizonte",
    platform: "Instagram",
    text: "Uso para todos os meus clientes há 2 anos. Entrega confiável, suporte ágil e resultado consistente todo mês. A melhor plataforma do Brasil.",
    stars: 5,
    initial: "L",
    color: "#1877F2",
  },
  {
    name: "Renata A.",
    role: "Influenciadora",
    city: "Curitiba",
    platform: "Kwai",
    text: "Quando precisei de suporte, responderam em minutos e resolveram tudo sem custo extra. Esse nível de atendimento não existe em nenhum outro lugar.",
    stars: 5,
    initial: "R",
    color: "#FF7000",
  },
  {
    name: "Marcos T.",
    role: "Músico",
    city: "Fortaleza",
    platform: "YouTube",
    text: "Meu canal saiu do zero. O crescimento no alcance foi gradual e natural — exatamente o que eu precisava para não perder credibilidade.",
    stars: 5,
    initial: "M",
    color: "#FF0000",
  },
  {
    name: "Ana P.",
    role: "Coach",
    city: "Brasília",
    platform: "Instagram",
    text: "Processo simples, resultado real. Sem complicação, sem senha, sem risco. Recomendo para qualquer profissional que queira ser mais visto.",
    stars: 5,
    initial: "A",
    color: "#E1306C",
  },
];

const stats = [
  { value: "83 mil+", label: "Clientes atendidos" },
  { value: "847 mil+", label: "Projetos concluídos" },
  { value: "4.9/5", label: "Avaliação média" },
  { value: "7 anos", label: "No mercado" },
];

const platformIcons: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  kwai: "🎬",
  youtube: "▶️",
  facebook: "👥",
};

export default async function CrescimentoPage() {
  const [networks, whatsappNumber, logoType, logoUrl, websiteName, logoText] =
    await Promise.all([
      getActiveSocialNetworks(),
      getSetting("whatsapp_number", "558193886173"),
      getSetting("logo_type", "text"),
      getSetting("logo_url", ""),
      getSetting("website_name", "SeguiFacil"),
      getSetting("website_logo_text", "SeguiFacil"),
    ]);

  const waLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" aria-label={websiteName}>
            {logoType === "image" && logoUrl ? (
              <img src={logoUrl} alt={websiteName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500 uppercase">
                {logoText}
              </span>
            )}
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-gray-900 transition-colors">
              Como Funciona
            </a>
            <a href="#plataformas" className="hover:text-gray-900 transition-colors">
              Plataformas
            </a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">
              Dúvidas
            </a>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-bold shadow hover:opacity-90 transition-opacity"
          >
            Começar Agora
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 pt-16 pb-20 px-4">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white border border-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              +83.000 perfis impulsionados
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-5">
            Acelere seu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
              crescimento digital
            </span>
            <br className="hidden sm:block" /> nas redes sociais
          </h1>

          <p className="text-center text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Estratégias de visibilidade e engajamento para Instagram, TikTok,
            Kwai, YouTube e Facebook. Resultado rápido, seguro e sem complicação.
          </p>

          {/* Platform grid */}
          <div id="plataformas" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto mb-10">
            {networks.length > 0
              ? networks.map((n) => {
                  const slug = (n.urlSlug || n.name).toLowerCase();
                  const icon = platformIcons[slug] ?? "🌐";
                  return (
                    <Link
                      key={n.id}
                      href={`/comprar-seguidores-${n.urlSlug || n.name.toLowerCase()}`}
                      className="group flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">
                        {n.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        a partir de {n.fromPrice}
                      </span>
                    </Link>
                  );
                })
              : [
                  { name: "Instagram", slug: "instagram", icon: "📸" },
                  { name: "TikTok", slug: "tiktok", icon: "🎵" },
                  { name: "Kwai", slug: "kwai", icon: "🎬" },
                  { name: "YouTube", slug: "youtube", icon: "▶️" },
                  { name: "Facebook", slug: "facebook", icon: "👥" },
                ].map((p) => (
                  <Link
                    key={p.slug}
                    href={`/comprar-seguidores-${p.slug}`}
                    className="group flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">
                      {p.name}
                    </span>
                  </Link>
                ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white text-base font-black shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Ver estratégias disponíveis →
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 text-base font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar com consultor
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                {s.value}
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              Simples assim
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              Como funciona em 3 passos
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Do pedido à entrega em minutos. Sem complicação, sem burocracia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(100%-1rem)] w-8 border-t-2 border-dashed border-violet-200 z-10" />
                )}
                <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl p-6 h-full border border-violet-100/50">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white font-black text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-base font-black text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
            >
              Começar agora →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-violet-600 to-pink-500">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "⚡",
              title: "Resultado rápido",
              desc: "Primeiros resultados visíveis em minutos após a confirmação.",
            },
            {
              icon: "🔒",
              title: "100% seguro",
              desc: "Nunca pedimos sua senha. Atuamos de forma totalmente externa.",
            },
            {
              icon: "💳",
              title: "PIX instantâneo",
              desc: "Pagamento rápido via PIX. Sem cartão, sem cadastro complicado.",
            },
            {
              icon: "🛡️",
              title: "Garantia inclusa",
              desc: "Reposição gratuita se houver variação dentro do período de garantia.",
            },
          ].map((d) => (
            <div
              key={d.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white"
            >
              <div className="text-3xl mb-3">{d.icon}</div>
              <h3 className="font-black text-sm mb-1">{d.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              Depoimentos
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              O que nossos clientes dizem
            </h2>
            <p className="mt-3 text-gray-500">
              Mais de 12.400 avaliações verificadas com nota média 4.9/5
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">
                      {t.role} · {t.platform}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              Dúvidas frequentes
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              Tem alguma dúvida?
            </h2>
            <p className="mt-3 text-gray-500">Veja as respostas para as perguntas mais comuns.</p>
          </div>
          <GrowthFaq />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Pronto para acelerar seu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              crescimento digital?
            </span>
          </h2>
          <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
            Mais de 83.000 clientes já impulsionaram sua presença nas redes sociais.
            Comece agora — resultado em minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-base shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Ver estratégias disponíveis →
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-400" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar com consultor
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-white text-base">
            {logoType === "image" && logoUrl ? (
              <img src={logoUrl} alt={websiteName} className="h-6 w-auto object-contain inline" />
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 font-black uppercase">
                {logoText}
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/como-funciona" className="hover:text-white transition-colors">
              Como Funciona
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Suporte
            </a>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {websiteName}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:bg-green-600 hover:scale-110 transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
