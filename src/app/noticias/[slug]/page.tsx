import { getArticle, getArticles, formatDate } from "@/lib/news";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: `${article.title} — Svarog EcoSystem`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_url ? [article.cover_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const { data } = await getArticles(1, 100);
  return data.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar />

      <article className="pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 text-sm transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Volver a noticias
          </Link>

          {/* Categories */}
          {article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((c) => (
                <span
                  key={c.id}
                  className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(article.published_at || article.created_at)}
            </span>
            {article.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag size={13} />
                {article.tags.map((t) => t.name).join(", ")}
              </span>
            )}
          </div>

          {/* Cover */}
          {article.cover_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-10 bg-white/5">
              <img
                src={article.cover_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-amber max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-amber-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-amber-500 prose-blockquote:text-gray-400
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      <Footer />
    </main>
  );
}
