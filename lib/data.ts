import rawData from "@/data/data.json";
import type { Article, Author, Data } from "./types";

const data = rawData as Data;

/** All authors, as stored. */
export function getAuthors(): Author[] {
  return data.authors;
}

/** Look up an author by their numeric id. */
export function getAuthorById(authorId: number): Author | undefined {
  return data.authors.find((a) => a.id === authorId);
}

/** Slugify a category name for use in URLs, e.g. "Business" -> "business". */
export function categorySlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Reverse lookup: find the canonical category name for a URL slug. */
export function categoryFromSlug(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}

/** Every distinct category present in the dataset, in dataset order. */
export function getAllCategories(): string[] {
  const seen = new Set<string>();
  const categories: string[] = [];
  for (const article of data.articles) {
    if (!seen.has(article.category)) {
      seen.add(article.category);
      categories.push(article.category);
    }
  }
  return categories;
}

/** All published articles, sorted newest-first by article.date. */
export function getPublishedArticles(): Article[] {
  return data.articles
    .filter((a) => a.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Published articles belonging to a single category, newest-first. */
export function getArticlesByCategory(category: string): Article[] {
  return getPublishedArticles().filter((a) => a.category === category);
}

/** Look up a single published article by its category + slug. */
export function getArticleBySlug(
  category: string,
  slug: string
): Article | undefined {
  return getPublishedArticles().find(
    (a) => a.slug === slug && categorySlug(a.category) === categorySlug(category)
  );
}

/** Canonical article URL: /[category]/[slug] */
export function getArticleHref(article: Article): string {
  return `/${categorySlug(article.category)}/${article.slug}`;
}

/** Canonical category URL: /[category] */
export function getCategoryHref(category: string): string {
  return `/${categorySlug(category)}`;
}

/**
 * Editorial-style relative/absolute date formatting.
 * Recent items read as "Today" / "Yesterday" / "N days ago";
 * older items fall back to a compact calendar date.
 */
export function formatDate(dateStr: string, now: Date = new Date()): string {
  const date = new Date(dateStr + "T00:00:00");
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = startOfNow.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 6) return `${diffDays} days ago`;

  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}

/** Full, unabbreviated date for article detail pages. */
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getAuthorArticles(authorId: number): Article[] {
  return getPublishedArticles().filter((a) => a.authorId === authorId);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return data.authors.find((a) => a.slug === slug);
}

export function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticlesByAuthor(authorId: number): Article[] {
  return sortByDateDesc(
    getPublishedArticles().filter((a) => a.authorId === authorId)
  );
}