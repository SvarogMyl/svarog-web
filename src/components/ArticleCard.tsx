import { Calendar, ArrowRight } from "lucide-react";
import { Article, formatDate } from "@/lib/news";
import Link from "next/link";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex flex-col bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/20 rounded-xl overflow-hidden transition-all duration-300"
    >
      {/* Cover */}
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-600/5">
        {article.cover_url ? (
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-amber-500/30 text-5xl font-bold">S</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categories */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.categories.slice(0, 2).map((c) => (
              <span
                key={c.id}
                className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-2 leading-snug line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={11} />
            {formatDate(article.published_at || article.created_at)}
          </div>
          <ArrowRight
            size={14}
            className="text-gray-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
