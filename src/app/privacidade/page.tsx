export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSetting } from "@/lib/settings";

export default async function PrivacidadePage() {
  const siteName = await getSetting("site_name", "SeguiFacil");

  const sections = [
    {
      title: "1. Informações que Coletamos",
      content: `Coletamos as informações que você fornece diretamente ao utilizar nossos serviços:
• E-mail: utilizado para enviar confirmações de pedido e atualizações de status.
• Link do perfil: necessário para a entrega dos serviços contratados.
• Dados de pagamento: processamos apenas a confirmação do PIX, sem armazenar dados bancários sensíveis.
• Dados de navegação: coletamos dados de acesso (IP, navegador, páginas visitadas) para fins de segurança e melhoria da plataforma.`,
    },
    {
      title: "2. Como Usamos Suas Informações",
      content: `Utilizamos as informações coletadas para:
• Processar e entregar os serviços adquiridos.
• Enviar notificações de status dos pedidos por e-mail.
• Oferecer suporte ao cliente.
• Prevenir fraudes e garantir a segurança da plataforma.
• Melhorar continuamente nossos serviços.`,
    },
    {
      title: "3. Compartilhamento de Dados",
      content: `Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais. Podemos compartilhar dados com:
• Fornecedores de serviços: parceiros que auxiliam na entrega dos pedidos, sob obrigações de confidencialidade.
• Autoridades legais: quando exigido por lei ou ordem judicial.`,
    },
    {
      title: "4. Segurança dos Dados",
      content: `Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou divulgação indevida. No entanto, nenhum método de transmissão pela Internet é 100% seguro, e não podemos garantir segurança absoluta.`,
    },
    {
      title: "5. Retenção de Dados",
      content: `Mantemos seus dados pelo tempo necessário para a prestação dos serviços e cumprimento de obrigações legais. E-mails e histórico de pedidos são retidos por até 2 anos após a última compra.`,
    },
    {
      title: "6. Seus Direitos (LGPD)",
      content: `Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:
• Acesso: solicitar uma cópia dos seus dados pessoais.
• Correção: solicitar a correção de dados incorretos ou desatualizados.
• Exclusão: solicitar a exclusão dos seus dados, quando aplicável.
• Portabilidade: solicitar a portabilidade dos seus dados.
• Revogação de consentimento: retirar seu consentimento a qualquer momento.

Para exercer esses direitos, entre em contato pelo nosso suporte.`,
    },
    {
      title: "7. Cookies",
      content: `Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o tráfego e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.`,
    },
    {
      title: "8. Links de Terceiros",
      content: `Nossa plataforma pode conter links para sites de terceiros. Esta Política de Privacidade não se aplica a esses sites, e não nos responsabilizamos pelas práticas de privacidade de terceiros.`,
    },
    {
      title: "9. Alterações nesta Política",
      content: `Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por e-mail ou por aviso em destaque na plataforma. O uso continuado após as alterações implica aceitação da política revisada.`,
    },
    {
      title: "10. Contato",
      content: `Para dúvidas, solicitações ou exercício dos seus direitos relacionados a esta Política de Privacidade, entre em contato conosco pelo suporte disponível na plataforma.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface">
        {/* Hero */}
        <section className="bg-white border-b border-brand/10 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              Legal
            </span>
            <h1 className="text-4xl font-jakarta font-extrabold text-foreground mb-3">
              Política de Privacidade
            </h1>
            <p className="text-muted font-medium">
              Última atualização: janeiro de 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-[28px] border border-brand/10 shadow-card p-8 md:p-10">
              <p className="text-sm text-muted leading-relaxed font-medium mb-8">
                O {siteName} está comprometido com a proteção da sua privacidade.
                Esta política explica como coletamos, usamos e protegemos suas informações pessoais,
                em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
              <div className="space-y-8">
                {sections.map(({ title, content }) => (
                  <div key={title}>
                    <h2 className="text-base font-jakarta font-extrabold text-foreground mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed font-medium whitespace-pre-line">
                      {content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
