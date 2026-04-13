export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SOCIAL_METADATA } from "@/lib/catalog";
import { SocialIcon } from "@/components/ui/SocialIcon";
import Link from "next/link";
import { Zap, ShieldCheck, RefreshCw, Headphones, Check } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PlatformPage({ params }: Props) {
  const { slug } = await params;

  // 1. Verificar se o slug segue o padrão esperado
  if (!slug.startsWith("comprar-seguidores-")) {
    // Aqui poderíamos verificar se é uma CustomPage ou outra coisa
    // Por enquanto, se não seguir o padrão, damos 404
    return notFound();
  }

  const platformSlug = slug.replace("comprar-seguidores-", "");

  // 2. Buscar a rede social e seus serviços no banco
  const network = await prisma.socialNetwork.findUnique({
    where: { urlSlug: platformSlug, status: 1 },
    include: {
      categories: {
        where: { status: 1 },
        include: {
          services: {
            where: { status: 1 },
            orderBy: { price: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!network) {
    return notFound();
  }

  const metadata = SOCIAL_METADATA[platformSlug] || SOCIAL_METADATA.default;

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      {/* Hero da Categoria */}
      <section className="relative py-20 overflow-hidden bg-white border-b border-gray-100">
        <div className="mesh-container opacity-30">
          <div className="mesh-ball mesh-ball-1" />
          <div className="mesh-ball mesh-ball-2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
            style={{ background: metadata.gradient }}
          >
            <SocialIcon slug={platformSlug} size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Comprar Seguidores {network.name}
          </h1>
          <div
            className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-700 [&_p]:mb-2"
            dangerouslySetInnerHTML={{
              __html: network.description || `<p>Acelere seu perfil no ${network.name} com seguidores reais e brasileiros. Entrega rápida e garantida.</p>`,
            }}
          />

          {/* Navegação rápida por categoria */}
          {network.categories.length > 1 && (
            <div className="mt-10">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Serviços Disponíveis</p>
            <div className="flex flex-wrap justify-center gap-3">
              {network.categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id}`}
                  className="px-5 py-2.5 rounded-full text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                >
                  {cat.name}
                </a>
              ))}
            </div>
            </div>
          )}
        </div>
      </section>

      {/* Listagem de Serviços agrupados por Categorias */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {network.categories.map((category) => (
          <div key={category.id} id={`cat-${category.id}`} className="mb-20 last:mb-0 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                  {category.name}
                </h2>
                <div className="h-1 w-20 bg-brand-gradient rounded-full" />
                {category.description && (
                  <div 
                    className="text-gray-500 mt-4 max-w-2xl text-sm leading-relaxed prose prose-sm prose-p:my-1"
                    dangerouslySetInnerHTML={{ __html: category.description }}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {category.services.map((service) => (
                <div 
                  key={service.id}
                  className="glass-card-2026 flex flex-col bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                >
                  {service.discount > 0 && (
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      {service.discount}% OFF
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg leading-tight">
                      {service.name}
                    </h3>
                  </div>

                  <div className="pt-6 border-t border-gray-50">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-gray-900">
                        R${parseFloat(service.price.toString()).toFixed(2).replace(".", ",")}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          R${parseFloat(service.originalPrice.toString()).toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                    
                    <Link
                      href={`/checkout?service=${service.id}&name=${encodeURIComponent(service.name)}&platform=${encodeURIComponent(network.name)}&price=${service.price}&qty=${service.quantity || ""}&requiredField=${encodeURIComponent(category.requiredField || "Link do Perfil")}`}
                      className="w-full py-3.5 text-xs font-bold text-white rounded-2xl bg-brand-gradient hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-brand"
                    >
                      <Zap size={14} /> Selecionar Plano
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Diferenciais */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: "Velocidade", desc: "Início imediato após o PIX." },
            { icon: ShieldCheck, title: "Segurança", desc: "Métodos seguros e sem senha." },
            { icon: RefreshCw, title: "Reposição", desc: "30 dias de garantia contra quedas." },
            { icon: Headphones, title: "Suporte", desc: "Atendimento humano 24/7." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 text-primary shadow-sm">
                <item.icon size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
