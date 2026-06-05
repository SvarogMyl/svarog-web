const API_URL = process.env.NEXT_PUBLIC_NEWS_API_URL!;
const TENANT = process.env.NEXT_PUBLIC_NEWS_TENANT!;

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string | null;
  status: "draft" | "published" | "archived";
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  published_at: string;
  created_at: string;
}

export interface PaginatedArticles {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export async function getArticles(page = 1, limit = 9): Promise<PaginatedArticles> {
  const res = await fetch(
    `${API_URL}/news?tenant=${TENANT}&page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { data: [], total: 0, page, limit };
  const json = await res.json();
  if (Array.isArray(json)) return { data: json, total: json.length, page, limit };
  return json;
}

export async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(
    `${API_URL}/news/${slug}?tenant=${TENANT}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
