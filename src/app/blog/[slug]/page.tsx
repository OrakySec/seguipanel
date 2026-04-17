import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";

const BASE_URL = "https://seguifacil.com";

function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany({
    where: { status: 1, publishedAt: { lte: new Date() } },
    select: { urlSlug: true },
  }).catch(() => []);
  return posts.map((p) => ({ slug: p.urlSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findFirst({
    where: { urlSlug: slug, status: 1 },
  }).catch(() => null);

  if (!post) {
    return { title: "Post não encontrado | SeguiFacil" };
  }

  const siteName = await getSetting("site_name", "SeguiFacil");
  const title = `${post.title} | ${siteName}`;
  const description = post.metaDescription || post.title;
  const canonical = `${BASE_URL}/blog/${post.urlSlug}`;

  return {
    title,
    description,
    keywords: post.metaKeywords ? post.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    authors: [{ name: siteName }],
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: "pt_BR",
      siteName,
      ...(post.image ? { images: [{ url: post.image, width: 1200, height: 630, alt: post.title }] } : {}),
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.image ? { images: [post.image] } : {}),
    },
    alternates: { canonical },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blog.findFirst({
    where: { urlSlug: slug, status: 1, publishedAt: { lte: new Date() } },
  }).catch(() => null);

  if (!post) notFound();

  const siteName = await getSetting("site_name", "SeguiFacil");

  // Posts relacionados (mesma categoria, excluindo atual)
  const related = post.category
    ? await prisma.blog.findMany({
        where: {
          category: post.category,
          status: 1,
          publishedAt: { lte: new Date() },
          id: { not: post.id },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { id: true, title: true, urlSlug: true, image: true, category: true, publishedAt: true, content: true },
      }).catch(() => [])
    : [];

  const canonical = `${BASE_URL}/blog/${post.urlSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.title,
    ...(post.image ? { image: post.image } : {}),
    author: {
      "@type": "Organization",
      name: siteName,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: BASE_URL,
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    ...(post.metaKeywords ? { keywords: post.metaKeywords } : {}),
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero com imagem */}
        {post.image && (
          <div className="w-full h-64 md:h-96 relative overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            {post.category && (
              <>
                <span>›</span>
                <Link href={`/blog?cat=${encodeURIComponent(post.category)}`} className="hover:text-primary transition-colors">
                  {post.category}
                </Link>
              </>
            )}
          </nav>

          {/* Cabeçalho do Post */}
          <header className="mb-10">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-wider mb-4">
                <Tag size={11} /> {post.category}
              </span>
            )}
            <h1
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-5 text-sm text-gray-400 font-bold border-b border-gray-100 pb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-black">S</span>
                Equipe {siteName}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {readingTime(post.content)} min de leitura
              </span>
            </div>
          </header>

          {/* Conteúdo */}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#f8f6ff] to-white border border-primary/20 text-center">
            <p className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Quer crescer agora?
            </p>
            <p className="text-gray-500 font-medium mb-6">
              Confira nossos pacotes de seguidores, curtidas e visualizações com entrega rápida e garantia.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gradient text-white font-black rounded-2xl shadow-brand hover:opacity-90 transition-opacity"
            >
              Ver serviços disponíveis <ArrowRight size={18} />
            </Link>
          </div>

          {/* Botão voltar */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Voltar ao blog
            </Link>
          </div>
        </div>

        {/* Posts Relacionados */}
        {related.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-100 py-14">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-black text-gray-900 mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                Artigos relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.urlSlug}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-[#f8f6ff] to-[#fff0fe] overflow-hidden">
                      {r.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">✍️</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-black text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      {r.publishedAt && (
                        <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(r.publishedAt).toLocaleDateString("pt-BR")}
                          <span className="ml-2 flex items-center gap-1">
                            <Clock size={10} /> {readingTime(r.content)} min
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
