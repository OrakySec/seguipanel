/**
 * Dados de SEO centralizados por plataforma.
 * Usados nas páginas /comprar-seguidores-[slug] para Schema Markup e conteúdo rico.
 */

export interface PlatformSeoData {
  title: string;
  description: string;
  keywords: string[];
  richContent: string;
  faqs: { question: string; answer: string }[];
}

const BASE_URL = "https://seguifacil.com";

export const PLATFORM_SEO: Record<string, PlatformSeoData> = {
  instagram: {
    title: "Comprar Seguidores Instagram Brasileiros | Entrega em Minutos",
    description:
      "Compre seguidores Instagram reais e brasileiros a partir de R$2,50. Entrega automática após PIX, sem precisar de senha. Garantia de 30 dias. +83.000 clientes satisfeitos desde 2017.",
    keywords: [
      "comprar seguidores instagram",
      "comprar seguidores instagram brasileiros",
      "comprar seguidores instagram barato",
      "aumentar seguidores instagram",
      "comprar curtidas instagram",
      "seguidores reais instagram",
    ],
    richContent: `
      <p>O <strong>Instagram</strong> é a rede social mais usada no Brasil, com mais de 130 milhões de usuários ativos. Ter muitos seguidores aumenta sua credibilidade, atrai parcerias e acelera o crescimento orgânico do seu perfil.</p>
      <p>No SeguiFacil, você compra <strong>seguidores Instagram brasileiros e reais</strong> com entrega automática após o pagamento via PIX. Nosso sistema processa o pedido em menos de 5 minutos, sem precisar de senha ou acesso à sua conta.</p>
      <p>Trabalhamos com perfis reais, com fotos e publicações, que não somem após a entrega. Todos os pacotes incluem <strong>garantia de reposição por 30 dias</strong> — se houver queda, repomos gratuitamente.</p>
    `,
    faqs: [
      {
        question: "É seguro comprar seguidores no Instagram?",
        answer:
          "Sim. No SeguiFacil usamos métodos 100% externos e seguros. Nunca solicitamos sua senha ou acesso à conta. O Instagram não bloqueia perfis por receber seguidores — apenas por usar automações de login, o que não fazemos.",
      },
      {
        question: "Quanto tempo leva para os seguidores chegarem?",
        answer:
          "Após a confirmação do PIX, o pedido inicia em menos de 5 minutos. A entrega completa varia de 1 hora a 24 horas, dependendo do pacote escolhido. Pacotes menores são entregues mais rápido.",
      },
      {
        question: "Os seguidores que compro são brasileiros?",
        answer:
          "Sim. Temos pacotes específicos de seguidores brasileiros, com perfis reais que contêm fotos, publicações e atividade. Você pode escolher na hora da compra.",
      },
      {
        question: "Minha conta pode ser banida por comprar seguidores?",
        answer:
          "Não. O Instagram não bane contas por receberem seguidores — isso é algo natural que acontece com qualquer perfil. Banimentos acontecem quando o usuário usa apps terceiros com acesso à conta, o que nunca pedimos.",
      },
      {
        question: "Os seguidores vão sumir depois?",
        answer:
          "Todos os pacotes têm garantia de 30 dias. Se houver qualquer queda, repomos gratuitamente dentro do prazo. Nossos seguidores são de alta retenção e raramente somem.",
      },
      {
        question: "Preciso informar minha senha para comprar?",
        answer:
          "Não. Nunca pedimos senha. Você informa apenas o @ ou link público do seu perfil. O processo é 100% externo e seguro.",
      },
    ],
  },

  tiktok: {
    title: "Comprar Seguidores TikTok Brasileiros | Rápido e Seguro",
    description:
      "Compre seguidores TikTok reais a partir de R$2,50. Entrega automática, sem senha, com garantia. O jeito mais rápido de crescer no TikTok com seguidores brasileiros.",
    keywords: [
      "comprar seguidores tiktok",
      "comprar seguidores tiktok brasileiros",
      "aumentar seguidores tiktok",
      "comprar visualizações tiktok",
      "comprar curtidas tiktok",
      "seguidores tiktok baratos",
    ],
    richContent: `
      <p>O <strong>TikTok</strong> é a rede que mais cresce no Brasil. Com o algoritmo do TikTok, perfis com mais seguidores têm muito mais chance de viralizar — o número de seguidores influencia diretamente no alcance dos seus vídeos.</p>
      <p>Comprar <strong>seguidores TikTok brasileiros</strong> no SeguiFacil é rápido, seguro e acessível. Sem precisar de senha, sem risco para sua conta. O pagamento é via PIX e a entrega começa em minutos.</p>
      <p>Todos os nossos pacotes de seguidores TikTok incluem <strong>garantia de 30 dias</strong> e suporte humano via WhatsApp 24h por dia.</p>
    `,
    faqs: [
      {
        question: "Comprar seguidores TikTok é seguro?",
        answer:
          "Sim. Utilizamos métodos externos que não comprometem sua conta. Nunca pedimos senha ou acesso ao TikTok. É 100% seguro e dentro dos termos de uso.",
      },
      {
        question: "Quantos seguidores posso comprar no TikTok?",
        answer:
          "Temos pacotes a partir de 100 seguidores até mais de 100.000. Recomendamos começar com pacotes menores e ir aumentando gradualmente para um crescimento mais natural.",
      },
      {
        question: "Os seguidores TikTok são reais?",
        answer:
          "Sim, são perfis reais com atividade. Não usamos bots ou contas fantasmas. Nossos seguidores têm fotos de perfil, vídeos e atividade recente.",
      },
      {
        question: "Quanto tempo demora a entrega no TikTok?",
        answer:
          "Após o PIX ser confirmado, o pedido inicia em até 5 minutos. A entrega completa pode levar de 1 a 48 horas dependendo do tamanho do pacote.",
      },
    ],
  },

  kwai: {
    title: "Comprar Seguidores Kwai | Brasileiros e Reais | SeguiFacil",
    description:
      "Compre seguidores Kwai brasileiros com entrega rápida. A partir de R$2,50, sem senha, com garantia de reposição. Aumente sua audiência no Kwai hoje mesmo.",
    keywords: [
      "comprar seguidores kwai",
      "comprar seguidores kwai brasileiros",
      "aumentar seguidores kwai",
      "comprar curtidas kwai",
      "seguidores kwai baratos",
    ],
    richContent: `
      <p>O <strong>Kwai</strong> é uma das redes de vídeos curtos que mais cresce no Brasil, especialmente no interior do país. Ter mais seguidores no Kwai aumenta sua visibilidade e abre portas para monetização e parcerias.</p>
      <p>No SeguiFacil você compra <strong>seguidores Kwai brasileiros</strong> de forma rápida e segura. Pagamento via PIX, entrega automática em minutos, sem precisar de senha.</p>
    `,
    faqs: [
      {
        question: "É seguro comprar seguidores no Kwai?",
        answer:
          "Sim. Nosso método é externo e não requer acesso à sua conta. Você só precisa informar o link do seu perfil público.",
      },
      {
        question: "Os seguidores Kwai ficam permanentes?",
        answer:
          "Todos os pacotes têm garantia de 30 dias. Em caso de queda, repomos gratuitamente dentro do prazo.",
      },
      {
        question: "Como funciona o pagamento?",
        answer:
          "O pagamento é feito via PIX. Após a confirmação, o pedido é processado automaticamente em menos de 5 minutos.",
      },
    ],
  },

  youtube: {
    title: "Comprar Inscritos YouTube | Brasileiros e Reais | SeguiFacil",
    description:
      "Compre inscritos YouTube reais a partir de R$2,50. Aumente seus inscritos com segurança, sem senha e com garantia. Entrega automática após o PIX.",
    keywords: [
      "comprar inscritos youtube",
      "comprar seguidores youtube",
      "comprar inscritos youtube brasileiros",
      "aumentar inscritos youtube",
      "comprar visualizações youtube",
      "inscritos youtube baratos",
    ],
    richContent: `
      <p>Atingir <strong>1.000 inscritos no YouTube</strong> é o primeiro passo para monetizar seu canal. Com o SeguiFacil, você acelera esse processo comprando <strong>inscritos YouTube reais e brasileiros</strong> com entrega rápida.</p>
      <p>Nosso serviço é 100% seguro — sem precisar de senha ou acesso ao seu canal. Apenas o link público do seu canal é necessário. O pagamento é via PIX com processamento automático.</p>
    `,
    faqs: [
      {
        question: "Comprar inscritos YouTube pode derrubar meu canal?",
        answer:
          "Não. O YouTube não penaliza canais por receberem inscritos. Penalizações acontecem apenas por fraude de visualizações artificiais, o que não é o nosso serviço.",
      },
      {
        question: "Os inscritos contam para a monetização?",
        answer:
          "Os inscritos são reais e contam no total do canal. Para monetização, o YouTube também exige 4.000 horas assistidas, além dos inscritos.",
      },
      {
        question: "Quanto tempo para os inscritos chegarem?",
        answer:
          "A entrega inicia em menos de 5 minutos após o PIX e pode levar de algumas horas a 48 horas para completar, dependendo do pacote.",
      },
    ],
  },

  facebook: {
    title: "Comprar Seguidores Facebook | Brasileiros e Reais | SeguiFacil",
    description:
      "Compre seguidores e curtidas no Facebook com entrega rápida. A partir de R$2,50, seguidores brasileiros reais, sem precisar de senha e com garantia de 30 dias.",
    keywords: [
      "comprar seguidores facebook",
      "comprar curtidas facebook",
      "comprar likes facebook",
      "aumentar seguidores facebook",
      "comprar seguidores página facebook",
    ],
    richContent: `
      <p>Uma <strong>página do Facebook</strong> com muitos seguidores passa mais credibilidade para clientes e parceiros. Com o SeguiFacil, você compra <strong>seguidores Facebook brasileiros</strong> de forma rápida, segura e acessível.</p>
      <p>Sem precisar de senha, sem risco para sua conta. O pagamento é via PIX e a entrega começa em minutos. Todos os pacotes têm garantia de reposição por 30 dias.</p>
    `,
    faqs: [
      {
        question: "Posso comprar seguidores para página ou perfil do Facebook?",
        answer:
          "Sim, atendemos tanto páginas empresariais quanto perfis pessoais. Basta informar o link público da sua página ou perfil.",
      },
      {
        question: "Os seguidores do Facebook são reais?",
        answer:
          "Sim. São perfis reais com atividade no Facebook, não bots ou contas falsas.",
      },
      {
        question: "Quanto tempo demora?",
        answer:
          "A entrega começa em menos de 5 minutos após a confirmação do PIX e completa em até 24 horas.",
      },
    ],
  },
};

export function getPlatformSeoData(slug: string): PlatformSeoData {
  return (
    PLATFORM_SEO[slug.toLowerCase()] ?? {
      title: `Comprar Seguidores ${slug.charAt(0).toUpperCase() + slug.slice(1)} | SeguiFacil`,
      description: `Compre seguidores para ${slug} com entrega rápida e segura. A partir de R$2,50, sem senha, com garantia de 30 dias.`,
      keywords: [`comprar seguidores ${slug}`, `aumentar seguidores ${slug}`],
      richContent: `<p>Aumente sua presença no ${slug} com seguidores reais e brasileiros. Entrega rápida após o PIX, sem precisar de senha.</p>`,
      faqs: [
        {
          question: `É seguro comprar seguidores no ${slug}?`,
          answer: "Sim. Usamos métodos externos e seguros. Nunca pedimos senha ou acesso à sua conta.",
        },
        {
          question: "Qual é o prazo de entrega?",
          answer: "A entrega inicia em menos de 5 minutos após a confirmação do PIX.",
        },
      ],
    }
  );
}

export function buildProductSchema(
  platformName: string,
  platformSlug: string,
  minPrice: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Seguidores ${platformName} Brasileiros`,
    description: `Compre seguidores ${platformName} reais e brasileiros com entrega automática. Sem precisar de senha, com garantia de 30 dias.`,
    brand: { "@type": "Brand", name: "SeguiFacil" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: minPrice.toFixed(2),
      offerCount: "10",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/comprar-seguidores-${platformSlug}`,
      seller: { "@type": "Organization", name: "SeguiFacil" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "83000",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(platformName: string, platformSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Comprar Seguidores ${platformName}`,
        item: `${BASE_URL}/comprar-seguidores-${platformSlug}`,
      },
    ],
  };
}

// FAQs globais da home
export const HOME_FAQS = [
  {
    question: "Comprar seguidores é seguro?",
    answer:
      "Sim. No SeguiFacil usamos métodos 100% externos — nunca pedimos senha ou acesso à sua conta. Mais de 83.000 clientes usam nossos serviços desde 2017 sem qualquer problema.",
  },
  {
    question: "Quanto tempo leva para os seguidores chegarem?",
    answer:
      "Após a confirmação do PIX, o pedido inicia em menos de 5 minutos. A entrega completa varia de 1 hora a 48 horas dependendo do pacote e da rede social escolhida.",
  },
  {
    question: "Os seguidores que compro são brasileiros?",
    answer:
      "Sim. Temos pacotes específicos de seguidores brasileiros para Instagram, TikTok, Kwai, YouTube e Facebook. São perfis reais com fotos e atividade.",
  },
  {
    question: "Minha conta pode ser banida?",
    answer:
      "Não. Redes sociais não baniam contas por receberem seguidores — isso é algo natural. Banimentos acontecem por automações de login, o que nunca fazemos.",
  },
  {
    question: "Tem garantia se os seguidores sumirem?",
    answer:
      "Sim. Todos os pacotes têm garantia de reposição por 30 dias. Se houver queda, repomos gratuitamente e sem burocracia.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é feito via PIX. É instantâneo — assim que o PIX é confirmado, o pedido já entra em processamento automático.",
  },
  {
    question: "Preciso informar minha senha?",
    answer:
      "Nunca. Você informa apenas o @ ou link público do seu perfil. Sem acesso à conta, sem risco.",
  },
  {
    question: "O SeguiFacil é confiável?",
    answer:
      "Sim. Operamos desde 2017 com mais de 83.000 clientes atendidos e nota 4.9/5 de avaliação. Somos referência no mercado SMM brasileiro.",
  },
];
