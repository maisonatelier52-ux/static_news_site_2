import type { MetadataRoute } from "next";
import { categorySlug, getAllCategories, getPublishedArticles } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const categories = getAllCategories();
  const latest = articles[0]?.date ? new Date(articles[0].date) : new Date();

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: latest,
    changeFrequency: "hourly",
    priority: 1,
  };

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => {
    const items = articles.filter((a) => a.category === category);
    return {
      url: `${SITE_URL}/${categorySlug(category)}`,
      lastModified: items[0]?.date ? new Date(items[0].date) : latest,
      changeFrequency: "hourly",
      priority: 0.8,
    };
  });

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/${categorySlug(article.category)}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [homeEntry, ...categoryEntries, ...articleEntries];
}
