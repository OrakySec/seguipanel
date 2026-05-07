"use client";

const testimonials = [
  {
    name: "Juliana M.",
    role: "Empreendedora",
    city: "São Paulo",
    platform: "Instagram",
    text: "Saí de 847 para 3.200 seguidores em menos de 6 horas. Minha loja virtual teve 34% mais visitas na semana seguinte. Melhor investimento que fiz para o meu negócio.",
    stars: 5,
    initial: "J",
    color: "#E1306C",
  },
  {
    name: "Camila S.",
    role: "Digital Influencer",
    city: "Rio de Janeiro",
    platform: "TikTok",
    text: "Comprei 2.000 curtidas às 22h e às 22h47 já estava tudo entregue. Meu vídeo saiu da estagnação e chegou a 48.000 visualizações orgânicas nos 3 dias seguintes.",
    stars: 5,
    initial: "C",
    color: "#9b00e0",
  },
  {
    name: "Lucas R.",
    role: "Revendedor SMM",
    city: "Belo Horizonte",
    platform: "Instagram",
    text: "Revendo para clientes há 2 anos pelo SeguiFacil. Taxa de entrega acima de 97%, suporte responde em menos de 15 minutos. Margem de lucro consistente todo mês.",
    stars: 5,
    initial: "L",
    color: "#010101",
  },
  {
    name: "Renata A.",
    role: "Criadora de Conteúdo",
    city: "Curitiba",
    platform: "Kwai",
    text: "Tive queda de 400 seguidores após uma atualização do Kwai. Acionei a garantia e em 18 horas repuseram tudo gratuitamente. Esse suporte não existe em nenhum outro lugar.",
    stars: 5,
    initial: "R",
    color: "#FF7000",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface py-16 px-4" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
          O que nossos clientes dizem
        </h2>
        <p className="text-center text-gray-500 mb-10">Resultados reais de clientes verificados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-white rounded-2xl border border-border p-5 shadow-card flex flex-col"
              itemScope
              itemType="https://schema.org/Review"
            >
              <span itemProp="itemReviewed" itemScope itemType="https://schema.org/Organization" className="sr-only">
                <meta itemProp="name" content="SeguiFacil" />
                <meta itemProp="url" content="https://seguifacil.com" />
              </span>
              <span itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" className="sr-only">
                <meta itemProp="ratingValue" content={String(t.stars)} />
                <meta itemProp="bestRating" content="5" />
                <meta itemProp="worstRating" content="1" />
              </span>

              <div className="flex gap-0.5 mb-3" role="img" aria-label={`${t.stars} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className="text-star" style={{ fontSize: 14 }} aria-hidden>★</span>
                ))}
              </div>
              <blockquote className="text-sm text-gray-600 leading-relaxed flex-1 mb-4" itemProp="reviewBody">
                "{t.text}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: t.color }}
                  aria-hidden
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{t.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">{t.role} · {t.city} · {t.platform}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
