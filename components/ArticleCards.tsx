import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticleHref, formatDate, getAuthorById } from "@/lib/data";
import ArticleImage from "./ArticleImage";
import Byline from "./Byline";
import Kicker from "./Kicker";

/**
 * Lead treatment for a category page: large image, big serif headline,
 * excerpt, and the author's photo + name + bio — visually distinct from
 * the standard grid cards below it.
 */
export function LeadFeature({ article }: { article: Article }) {
  const author = getAuthorById(article.authorId);

  return (
    <article className="group grid gap-6 border-b border-neutral-900 pb-8 md:grid-cols-2 md:gap-10">
      <Link href={getArticleHref(article)} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.image}
            alt={article.title}
            eager
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center">
        <Kicker category={article.category} className="mb-2" />
        <Link href={getArticleHref(article)} className="block">
          <h2 className="font-serif text-[28px] font-bold leading-[1.12] text-neutral-900 group-hover:text-[#8a1f11] md:text-[34px]">
            {article.title}
          </h2>
          <p className="mt-3 font-serif text-[16px] leading-snug text-neutral-600">
            {article.excerpt}
          </p>
        </Link>

        {author && (
          <div className="mt-5 flex items-center gap-3">
            <Link href={`/author/${author.slug
            }`} className="group flex gap-3">
              <div className="h-11 w-11 flex-none overflow-hidden rounded-full bg-neutral-100">
                <ArticleImage
                  src={author.photo}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-sans text-[13px] font-semibold text-neutral-900">
                  {author.name}
                </p>
                <p className="font-sans text-[12px] text-neutral-500">
                  {formatDate(article.date)}
                </p>
              </div>
            </Link>
          </div>
        )}
        {!author && (
          <Byline authorId={article.authorId} date={article.date} className="mt-5" />
        )}
      </div>
    </article>
  );
}

/**
 * Secondary feature: medium image, medium serif headline, metadata.
 */
export function FeatureCard({
  article,
  showExcerpt = true,
  eager = false,
}: {
  article: Article;
  showExcerpt?: boolean;
  eager?: boolean;
}) {
  return (
    <article className="group">
      <Link href={getArticleHref(article)} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.image}
            alt={article.title}
            eager={eager}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <Kicker category={article.category} className="mt-3 mb-1.5" />
        <h2 className="font-serif text-[19px] font-bold leading-[1.2] text-neutral-900 group-hover:text-[#8a1f11] md:text-[21px]">
          {article.title}
        </h2>
        {showExcerpt && (
          <p className="mt-1.5 font-serif text-[14px] leading-snug text-neutral-600">
            {article.excerpt}
          </p>
        )}
      </Link>
      <Byline authorId={article.authorId} date={article.date} className="mt-1.5" />
    </article>
  );
}

/**
 * Compact row: small square thumbnail + headline, used in dense lists.
 */
export function ThumbRow({ article }: { article: Article }) {
  return (
    <article className="group flex gap-3 py-3">
      <Link href={getArticleHref(article)} className="flex gap-3">
        <div className="h-16 w-16 flex-none overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="min-w-0">
          <Kicker category={article.category} className="mb-1 text-[10px]" />
          <h3 className="font-serif text-[14.5px] font-semibold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

/**
 * Text-only item: headline + category/date, no image. Used in dense
 * sidebar/opinion-style lists.
 */
export function TextOnlyItem({
  article,
  showAuthor = true,
}: {
  article: Article;
  showAuthor?: boolean;
}) {
  return (
    <article className="border-b border-neutral-200 py-3 first:pt-0 last:border-b-0">
      {showAuthor && (
        <p className="mb-1 font-sans text-[11px] font-semibold text-neutral-500">
          {article.category}
        </p>
      )}
      <Link href={getArticleHref(article)} className="group block">
        <h3 className="font-serif text-[15px] font-bold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
          {article.title}
        </h3>
      </Link>
    </article>
  );
}

/**
 * Numbered item, for Most Read-style rankings.
 */
export function NumberedItem({ article, index }: { article: Article; index: number }) {
  return (
    <li className="flex gap-3 border-b border-neutral-200 py-2.5 first:pt-0 last:border-b-0">
      <span className="font-serif text-[22px] font-bold leading-none text-neutral-300">
        {index}
      </span>
      <Link href={getArticleHref(article)} className="group">
        <h3 className="font-serif text-[14.5px] font-bold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
          {article.title}
        </h3>
      </Link>
    </li>
  );
}

/**
 * Headline + short meta row, used in horizontal "latest" rivers.
 */
export function RiverRow({ article }: { article: Article }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-2.5 last:border-b-0">
      <Link href={getArticleHref(article)} className="group min-w-0">
        <span className="mr-2 font-sans text-[10.5px] font-bold uppercase tracking-wide text-[#8a1f11]">
          {article.category}
        </span>
        <span className="font-serif text-[14.5px] font-semibold leading-snug text-neutral-900 group-hover:text-[#8a1f11]">
          {article.title}
        </span>
      </Link>
      <span className="flex-none font-sans text-[11px] text-neutral-400">
        {formatDate(article.date)}
      </span>
    </li>
  );
}

/**
 * Small quad-grid card: square thumbnail, kicker, compact headline, time.
 */
export function QuadCard({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link href={getArticleHref(article)} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <Kicker category={article.category} className="mt-2.5 mb-1 text-[10px]" />
        <h3 className="font-serif text-[15px] font-bold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
          {article.title}
        </h3>
      </Link>
      <p className="mt-1 font-sans text-[11px] text-neutral-400">
        {formatDate(article.date)}
      </p>
    </article>
  );
}
