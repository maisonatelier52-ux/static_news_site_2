import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ArticleImage from "@/components/ArticleImage";
import Kicker from "@/components/Kicker";

import {
  getAuthorById,
  getArticleBySlug,
  getArticlesByCategory,
  getPublishedArticles,
  formatFullDate,
  categorySlug,
} from "@/lib/data";

import { TWITTER_HANDLE, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    category: categorySlug(article.category),
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticleBySlug(category, slug);

  if (!article) return {};

  const author = getAuthorById(article.authorId);
  const path = `/${categorySlug(article.category)}/${article.slug}`;
  const publishedTime = new Date(article.date).toISOString();

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: path },
    authors: author ? [{ name: author.name }] : undefined,

    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.excerpt,
      publishedTime,
      modifiedTime: publishedTime,
      authors: author ? [author.name] : undefined,
      section: article.category,
      tags: article.keywords,
      images: article.image ? [{ url: article.image }] : undefined,
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[category]/[slug]">) {
  const { category, slug } = await params;

  const article = getArticleBySlug(category, slug);

  if (!article) notFound();

  const author = getAuthorById(article.authorId);

  /*
   * Related articles from the same category.
   * 6 items -> 3 rows x 2 columns.
   */
  const related = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 6);

  /*
   * Latest articles for the desktop sticky sidebar.
   * Exclude the current article.
   */
  const latestNews = getPublishedArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 6);

  const path = `/${categorySlug(article.category)}/${article.slug}`;
  const isoDate = new Date(article.date).toISOString();

  /*
   * NewsArticle JSON-LD
   */
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": absoluteUrl(`${path}/#article`),

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },

    headline: article.title,
    description: article.excerpt,

    image: article.image
      ? [absoluteUrl(article.image)]
      : undefined,

    datePublished: isoDate,
    dateModified: isoDate,

    articleSection: article.category,

    keywords: article.keywords?.length
      ? article.keywords.join(", ")
      : undefined,

    author: author
      ? {
          "@type": "Person",
          name: author.name,
        }
      : undefined,

    publisher: {
      "@id": absoluteUrl("/#organization"),
    },

    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };

  /*
   * Breadcrumb JSON-LD
   */
  const breadcrumb = breadcrumbJsonLd([
    {
      name: "Home",
      path: "/",
    },
    {
      name: article.category,
      path: `/${categorySlug(article.category)}`,
    },
    {
      name: article.title,
      path,
    },
  ]);

  return (
    <>
      <JsonLd data={[newsArticleJsonLd, breadcrumb]} />

      <Header />

      <main className="mx-auto max-w-[1180px] px-4 py-8 md:px-6 lg:py-10">

        {/*
         * The sticky sidebar's containing block is this grid. Because the
         * "More in {category}" section now lives OUTSIDE the grid (below
         * it), the sidebar's sticky travel is bounded by the grid's bottom
         * edge — i.e. it stops right above "More in {category}" instead of
         * scrolling past it.
         */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,760px)_300px] lg:items-start lg:justify-center">

          {/* MAIN ARTICLE */}

          <article>

            {/* Breadcrumb */}
            <p className="font-sans text-[12px] text-neutral-400">
              <Link
                href="/"
                className="transition-colors hover:text-neutral-700"
              >
                Home
              </Link>

              <span className="mx-1.5">/</span>

              <Link
                href={`/${categorySlug(article.category)}`}
                className="transition-colors hover:text-neutral-700"
              >
                {article.category}
              </Link>
            </p>

            {/* Category */}
            <Kicker
              category={article.category}
              className="mt-4 mb-2"
            />

            {/* Headline */}
            <h1 className="font-serif text-[32px] font-bold leading-[1.15] text-neutral-900 md:text-[40px]">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-3 font-serif text-[18px] leading-snug text-neutral-600">
              {article.excerpt}
            </p>

            {/* Author / Date */}
            <Link href={`/author/${author?.slug}`} className="mt-5 flex items-center gap-3 border-y border-neutral-200 py-3">
              {author && (
                <div className="h-10 w-10 flex-none overflow-hidden rounded-full bg-neutral-100">
                  <ArticleImage
                    src={author.photo}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                {author && (
                  <p className="font-sans text-[13px] font-semibold text-neutral-900">
                    By {author.name}
                  </p>
                )}
                <p className="font-sans text-[12px] text-neutral-500">
                  {formatFullDate(article.date)}
                </p>
              </div>
            </Link>

            {/* Hero image */}
            <div className="mt-6 aspect-[16/9] overflow-hidden bg-neutral-100">
              <ArticleImage
                src={article.image}
                alt={article.title}
                eager
                className="h-full w-full object-cover"
              />
            </div>

            {/* Article content */}
            <div
              className="article-body mt-8 font-serif text-[18px] leading-[1.7] text-neutral-800"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            />

            {/* AUTHOR BOX */}

            {author && (
              <div className="mt-10 border-t border-neutral-200 pt-6">
                <Link href={`/author/${author.slug}`} className="flex gap-4">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-full bg-neutral-100">
                  <ArticleImage
                    src={author.photo}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-serif text-[16px] font-bold text-neutral-900">
                    {author.name}
                  </p>

                  <p className="mt-1 font-sans text-[13px] leading-snug text-neutral-600">
                    {author.bio}
                  </p>
                </div>
              </Link>
              </ div>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {/* Sidebar heading */}
              <div className="border-t-2 border-neutral-900 pt-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[18px] font-bold text-neutral-900">
                    Latest News
                  </h2>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    News
                  </span>
                </div>

                {/* Latest news */}
                <div className="mt-3 divide-y divide-neutral-200">
                  {latestNews.map((a, index) => (
                    <Link
                      key={a.slug}
                      href={`/${categorySlug(a.category)}/${a.slug}`}
                      className="group block py-4"
                    >
                      <div className="flex gap-3">
                        {/* Number */}
                        <span className="w-5 flex-none pt-0.5 font-serif text-[18px] font-bold text-neutral-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <Kicker
                            category={a.category}
                            className="mb-1"
                          />
                          <h3 className="font-serif text-[15px] font-bold leading-[1.25] text-neutral-900 transition-colors group-hover:text-[#8a1f11]">
                            {a.title}
                          </h3>
                          <p className="mt-1 font-sans text-[10px] uppercase tracking-wide text-neutral-400">
                            {formatFullDate(a.date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 block border-t border-neutral-900" />
              </div>
            </div>
          </aside>
        </div>

        {/* MORE IN {CATEGORY} — full width, below the grid */}
        {related.length > 0 && (
          <section className="mt-10 border-t border-neutral-900 pt-4">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-serif text-[18px] font-bold text-neutral-900">
                More in {article.category}
              </h2>
              <Link
                href={`/${categorySlug(article.category)}`}
                className="font-sans text-[11px] font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-[#8a1f11]"
              >
                View all
              </Link>
            </div>

            {/* 2-column layout, 6 items -> 3 rows */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${categorySlug(a.category)}/${a.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    <ArticleImage
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Content */}
                  <div className="pt-3">
                    <Kicker
                      category={a.category}
                      className="mb-1"
                    />
                    <h3 className="font-serif text-[17px] font-bold leading-[1.2] text-neutral-900 transition-colors group-hover:text-[#8a1f11]">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 font-serif text-[13.5px] leading-snug text-neutral-600">
                      {a.excerpt}
                    </p>
                    <p className="mt-2 font-sans text-[11px] text-neutral-400">
                      {formatFullDate(a.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}