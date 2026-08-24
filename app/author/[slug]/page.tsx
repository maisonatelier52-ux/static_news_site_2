import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ArticleImage from "@/components/ArticleImage";
import { FeatureCard } from "@/components/ArticleCards";
import {
  getAuthorBySlug,
  getArticlesByAuthor,
  getAuthors,
} from "@/lib/data";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { FaMedium, FaQuora, FaReddit } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function generateStaticParams() {
  return getAuthors().map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/author/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) return {};

  const path = `/author/${author.slug}`;

  return {
    title: `${author.name} | ${SITE_NAME}`,
    description: author.bio,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "profile",
      url: path,
      title: `${author.name} | ${SITE_NAME}`,
      description: author.bio,
      images: author.photo ? [{ url: author.photo }] : undefined,
    },
    twitter: {
      card: "summary",
      title: `${author.name} | ${SITE_NAME}`,
      description: author.bio,
      images: author.photo ? [author.photo] : undefined,
    },
  };
}

/* ---------------------------------------
   Social icons
--------------------------------------- */

const SOCIAL_LINKS = [
  {
    key: "twitter" as const,
    label: "X (Twitter)",
    icon: <FaXTwitter className="h-[16px] w-[16px]" />,
  },
  {
    key: "medium" as const,
    label: "Medium",
    icon: <FaMedium className="h-[16px] w-[16px]" />,
  },
  {
    key: "quora" as const,
    label: "Quora",
    icon: <FaQuora className="h-[16px] w-[16px]" />,
  },
  {
    key: "reddit" as const,
    label: "Reddit",
    icon: <FaReddit className="h-[16px] w-[16px]" />,
  },
];

export default async function AuthorPage({
  params,
}: PageProps<"/author/[slug]">) {
  const { slug } = await params;

  const author = getAuthorBySlug(slug);

  if (!author) notFound();
  const articles = getArticlesByAuthor(author.id);

  const otherAuthors = getAuthors()
    .filter((a) => a.id !== author.id)
    .map((a) => ({
      author: a,
      articleCount: getArticlesByAuthor(a.id).length,
    }))
    .filter((item) => item.articleCount > 0);

  const path = `/author/${author.slug}`;
  const socials = SOCIAL_LINKS.filter(
    (s) =>
      typeof author[s.key] === "string" &&
      (author[s.key] as string).trim().length > 0
  );
  console.log(socials)

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl(`${path}/#profile`),
    url: absoluteUrl(path),

    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.bio,
      image: author.photo
        ? absoluteUrl(author.photo)
        : undefined,
      url: absoluteUrl(path),
      sameAs: socials.map(
        (s) => author[s.key] as string
      ),
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    {
      name: "Home",
      path: "/",
    },
    {
      name: author.name,
      path,
    },
  ]);

  return (
    <>
      <JsonLd data={[personJsonLd, breadcrumb]} />
      <Header />
      <main className="mx-auto max-w-[1180px] px-4 py-8 md:px-6">
        <div className="font-sans text-[12px] text-neutral-400">
          <Link
            href="/"
            className="transition-colors hover:text-[#8a1f11]"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-600">
            {author.name}
          </span>
        </div>
        {/* AUTHOR PROFILE */}
        <section className="mt-6 border-y border-neutral-900 py-8 md:py-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center">
            <div className="h-32 w-32 flex-none overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 md:h-40 md:w-40">
              <ArticleImage
                src={author.photo}
                alt={author.name}
                eager
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a1f11]">
                Author &amp; Contributor
              </p>
              <h1 className="mt-1 font-serif text-[34px] font-bold leading-tight text-neutral-900 md:text-[42px]">
                {author.name}
              </h1>
              {author.bio && (
                <p className="mt-3 max-w-3xl font-serif text-[16px] leading-[1.65] text-neutral-600 md:text-[17px]">
                  {author.bio}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-5">

                {/* Article count */}
                <div className="font-sans text-[11px] uppercase tracking-wider text-neutral-500">
                  <span className="font-bold text-neutral-900">
                    {articles.length}
                  </span>{" "}
                  {articles.length === 1
                    ? "Article"
                    : "Articles"}
                </div>
                {socials.length > 0 && (
                  <span className="h-4 w-px bg-neutral-300" />
                )}

                {/* Social icons */}
                {socials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socials.map((s) => (
                        <a
                            key={s.key}
                            href={author[s.key] as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${author.name} on ${s.label}`}
                            title={s.label}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 transition-colors hover:border-[#8a1f11] hover:text-[#8a1f11]"
                        >
                            {s.icon}
                        </a>
                        ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ARTICLES */}
        <section className="mt-10">
          <div className="flex items-end justify-between border-b border-neutral-900 pb-3">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a1f11]">
                Latest Work
              </p>
              <h2 className="mt-1 font-serif text-[22px] font-bold text-neutral-900">
                Articles by {author.name}
              </h2>
            </div>
            <span className="hidden font-sans text-[11px] text-neutral-400 sm:block">
              {articles.length} published{" "}
              {articles.length === 1
                ? "article"
                : "articles"}
            </span>
          </div>
          {articles.length > 0 ? (
            <div className="mt-7 grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <FeatureCard
                  key={article.slug}
                  article={article}
                  eager={index === 0}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 font-sans text-[14px] text-neutral-500">
              No published articles yet.
            </p>
          )}
        </section>

        {/* MORE AUTHORS */}

        {otherAuthors.length > 0 && (
          <section className="mt-14 border-t border-neutral-900 pt-6">
            <div className="flex flex-col gap-2 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a1f11]">
                  The Editorial Team
                </p>
                <h2 className="mt-1 font-serif text-[24px] font-bold text-neutral-900">
                  More Authors
                </h2>
              </div>
              <p className="font-sans text-[12px] text-neutral-500">
                Meet more of our writers and contributors
              </p>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherAuthors.map(
                ({ author: other, articleCount }) => (
                  <Link
                    key={other.id}
                    href={`/author/${other.slug}`}
                    className="group border border-neutral-200 bg-white p-5 transition-all duration-200 hover:border-[#8a1f11] hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Author photo */}
                      <div className="h-16 w-16 flex-none overflow-hidden rounded-full bg-neutral-100">
                        <ArticleImage
                          src={other.photo}
                          alt={other.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-[17px] font-bold text-neutral-900 transition-colors group-hover:text-[#8a1f11]">
                          {other.name}
                        </h3>
                        <p className="mt-1 font-sans text-[10px] uppercase tracking-wider text-neutral-400">
                          {articleCount}{" "}
                          {articleCount === 1
                            ? "Article"
                            : "Articles"}
                        </p>
                      </div>
                    </div>
                    {other.bio && (
                      <p className="mt-4 line-clamp-3 font-serif text-[13px] leading-relaxed text-neutral-500">
                        {other.bio}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-[#8a1f11]">
                        View Profile
                      </span>
                      <span className="text-[14px] text-neutral-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#8a1f11]">
                        →
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}