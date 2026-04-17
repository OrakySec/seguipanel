export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog SeguiFacil — Dicas para Crescer nas Redes Sociais",
  description:
    "Aprenda estratégias para crescer no Instagram, TikTok, YouTube, Kwai e Facebook. Dicas exclusivas, tutoriais e guias completos do maior SMM do Brasil.",
  keywords: [
    "blog smm", "dicas instagram", "como crescer tiktok", "comprar seguidores",
    "marketing digital redes sociais", "crescer no instagram 2026",
  ],
  openGraph: {
    title: "Blog SeguiFacil — Dicas para Crescer nas Redes Sociais",
    description: "Estratégias, tutoriais e guias para crescer no Instagram, TikTok, YouTube e mais.",
    type: "website",
    url: "https://seguifacil.com/blog",
    locale: "pt_BR",
  },
  alternates: { canonical: "https://seguifacil.com/blog" },
};

const CATEGORIES = ["Todos", "Dicas", "Instagram", "TikTok", "YouTube", "Kwai", "Facebook", "Marketing Digital", "Comprar Seguidores"];

function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function excerpt(html: string, max = 150) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page: pageParam } = await searchParams;
  const siteName = await getSetting("site_name", "SeguiFacil");

  const page = Math.max(1, parseInt(pageParam || "1"));
  const take = 12;
  const skip = (page - 1) * take;

  const where: any = {
    status: 1,
    publishedAt: { lte: new Date() },
  };
  if (cat && cat !== "Todos") where.category = cat;

  const [posts, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take,
      skip,
      select: {
        id: true, title: true, urlSlug: true, category: true,
        image: true, content: true, metaDescription: true, publishedAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#f8f6ff] to-white border-b border-gray-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <BookOpen size={12} /> Blog {siteName}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Dicas para Crescer nas<br />
              <span className="text-brand-gradient">Redes Sociais</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">
              Estratégias, tutoriais e guias para alavancar sua presença no Instagram, TikTok, YouTube e mais.
            </p>
          </div>
        </section>

        {/* Filtro de Categorias */}
        <section className="border-b border-gray-100 sticky top-20 bg-white/90 backdrop-blur-md z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => {
              const active = (!cat && c === "Todos") || cat === c;
              return (
                <Link
                  key={c}
                  href={c === "Todos" ? "/blog" : `/blog?cat=${encodeURIComponent(c)}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    active
                      ? "bg-brand-gradient text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Grid de Posts */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">✍️</div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Em breve por aqui</h2>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">
                Estamos preparando conteúdos exclusivos sobre crescimento em redes sociais. Volte em breve!
              </p>
              <Link href="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-black rounded-2xl text-sm shadow-brand">
                Ver serviços <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.urlSlug}`}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Imagem */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#f8f6ff] to-[#fff0fe] overflow-hidden">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-wider mb-3">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-base font-black text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                      {post.metaDescription || excerpt(post.content)}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(post.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {readingTime(post.content)} min de leitura
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/blog?${cat ? `cat=${encodeURIComponent(cat)}&` : ""}page=${page - 1}`}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                  ← Anterior
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={`/blog?${cat ? `cat=${encodeURIComponent(cat)}&` : ""}page=${n}`}
                  className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                    n === page
                      ? "bg-brand-gradient text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/blog?${cat ? `cat=${encodeURIComponent(cat)}&` : ""}page=${page + 1}`}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                  Próximo →
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
