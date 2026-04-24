export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSetting } from "@/lib/settings";

export default async function TermosPage() {
  const siteName = await getSetting("site_name", "SeguiFacil");

  const sections = [
    {
      title: "1. Aceitação dos Termos",
      content: `Ao utilizar os serviços do ${siteName}, você concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, solicitamos que não utilize nossa plataforma.`,
    },
    {
      title: "2. Descrição dos Serviços",
      content: `O ${siteName} oferece serviços de marketing em mídias sociais (SMM), incluindo mas não se limitando a: seguidores, curtidas, visualizações e engajamento para plataformas como Instagram, TikTok, Kwai, YouTube e Facebook. Os serviços são prestados conforme descrição na página de cada produto.`,
    },
    {
      title: "3. Requisitos para Uso",
      content: `Para receber os serviços, seu perfil deve estar configurado como público no momento da entrega. Não solicitamos senhas ou acesso às suas contas. Você é responsável por fornecer o link correto do perfil no momento da compra.`,
    },
    {
      title: "4. Pagamentos",
      content: `Os pagamentos são realizados exclusivamente via PIX. Após a confirmação do pagamento pelo sistema, o pedido é processado automaticamente. Não realizamos cobranças recorrentes sem sua autorização prévia.`,
    },
    {
      title: "5. Prazo de Entrega",
      content: `Os prazos de entrega são estimados e podem variar conforme o pacote escolhido e a disponibilidade dos serviços. O início da entrega pode ocorrer em minutos ou levar até 4 dias após a confirmação do pagamento, dependendo do pacote selecionado. Após o início, a entrega total do pacote pode levar até 15 dias corridos, pois é realizada de forma gradual para garantir a naturalidade e a segurança do processo. Certifique-se de que seu perfil permaneça público durante todo o período de entrega.`,
    },
    {
      title: "6. Política de Reposição",
      content: `Oferecemos reposição para pedidos que apresentem queda nos itens entregues, dentro dos prazos e condições definidos na plataforma. A reposição pode ser solicitada diretamente em /meus-pedidos, respeitando o intervalo mínimo entre solicitações.`,
    },
    {
      title: "7. Reembolsos",
      content: `Reembolsos são avaliados caso a caso. Se o pedido não for entregue por falha do nosso sistema, o reembolso integral será processado. Não são concedidos reembolsos por motivos alheios ao nosso controle, como mudança de decisão do cliente após início da entrega.`,
    },
    {
      title: "8. Responsabilidade do Usuário",
      content: `O usuário é responsável por garantir que o uso dos nossos serviços está em conformidade com os termos de serviço das plataformas de mídia social utilizadas. O ${siteName} não se responsabiliza por penalidades aplicadas pelas plataformas decorrentes do uso dos serviços.`,
    },
    {
      title: "9. Limitação de Responsabilidade",
      content: `O ${siteName} não garante resultados específicos de crescimento orgânico ou monetização. Os serviços são fornecidos no estado em que se encontram, sem garantias além das expressamente descritas em cada produto.`,
    },
    {
      title: "10. Modificações",
      content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após sua publicação. O uso continuado da plataforma após qualquer modificação constitui aceitação dos novos termos.`,
    },
    {
      title: "11. Lei Aplicável",
      content: `Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de domicílio do usuário para dirimir eventuais conflitos.`,
    },
    {
      title: "12. Contato",
      content: `Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco pelo suporte disponível na plataforma.`,
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
              Termos de Uso
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
                Estes Termos de Uso regem o relacionamento entre o {siteName} e seus usuários.
                Leia com atenção antes de utilizar nossos serviços.
              </p>
              <div className="space-y-8">
                {sections.map(({ title, content }) => (
                  <div key={title}>
                    <h2 className="text-base font-jakarta font-extrabold text-foreground mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed font-medium">{content}</p>
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
