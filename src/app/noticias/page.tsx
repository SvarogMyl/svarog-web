import { getArticles } from "@/lib/news";
import ArticleCard from "@/components/ArticleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rss } from "lucide-react";

export const metadata = {
  title: "Noticias — Svarog EcoSystem",
  description: "Artículos sobre tecnología, IA y desarrollo de software desde el ecosistema Svarog.",
};

export default async function NoticiasPage() {
  const { data: articles, total } = await getArticles(1, 9);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar />

      <div className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Rss size={12} />
              Powered by Svarog News
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Noticias</h1>
            <p className="text-gray-400 max-w-xl">
              Tecnología, inteligencia artificial y desarrollo de software desde
              el ecosistema Svarog. {total > 0 && `${total} publicaciones.`}
            </p>
          </div>

          {/* Articles grid */}
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                <Rss size={28} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Pronto habrá contenido aquí
              </h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Estamos preparando los primeros artículos. Vuelve pronto.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
