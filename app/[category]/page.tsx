import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { FeatureCard, LeadFeature } from "@/components/ArticleCards";
import {
  categoryFromSlug,
  getAllCategories,
  getArticleHref,
  getArticlesByCategory,
  categorySlug,
} from "@/lib/data";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return {};

  const title = `${category} News & Analysis`;
  const description = `The latest ${category.toLowerCase()} coverage from ${SITE_NAME}, updated as stories break.`;
  const path = `/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category);
  if (articles.length === 0) notFound();

  const [lead, ...rest] = articles;
  const path = `/${slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`${path}/#webpage`),
    url: absoluteUrl(path),
    name: `${category} News & Analysis | ${SITE_NAME}`,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(getArticleHref(article)),
      name: article.title,
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: category, path },
  ]);

  return (
    <>
      <JsonLd data={[collectionJsonLd, itemListJsonLd, breadcrumb]} />
      <Header />
      <main className="mx-auto max-w-[1180px] px-4 py-8 md:px-6">
        <div className="mb-6 border-b border-neutral-900 pb-3">
          <h1 className="font-serif text-[30px] font-bold text-neutral-900">{category}</h1>
        </div>

        <div className="mb-10">
          <LeadFeature article={lead} />
        </div>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          {rest.map((a) => (
            <FeatureCard key={a.slug} article={a} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
