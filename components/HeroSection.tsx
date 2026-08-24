import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticleHref } from "@/lib/data";
import ArticleImage from "./ArticleImage";
import Byline from "./Byline";
import Kicker from "./Kicker";
import { TextOnlyItem } from "./ArticleCards";

export default function HeroSection({
  lead,
  centerFeature,
  moreOnThis,
  perspectives,
}: {
  lead: Article;
  centerFeature: Article;
  moreOnThis: Article[];
  perspectives: Article[];
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
      <div className="grid gap-8 md:grid-cols-12">
        {/* Lead story + related list */}
        <div className="md:col-span-5">
          <article>
            <Kicker category={lead.category} className="mb-2" />
            <Link href={getArticleHref(lead)} className="group block">
              <h1 className="font-serif text-[28px] font-bold leading-[1.1] text-neutral-900 group-hover:text-[#8a1f11] md:text-[33px]">
                {lead.title}
              </h1>
              <p className="mt-3 font-serif text-[16px] leading-snug text-neutral-600">
                {lead.excerpt}
              </p>
            </Link>
            <Byline authorId={lead.authorId} date={lead.date} className="mt-3" />
          </article>

          {moreOnThis.length > 0 && (
            <ul className="mt-5 border-t border-neutral-900 pt-1">
              {moreOnThis.map((a) => (
                <li key={a.slug} className="border-b border-neutral-200 py-2.5 last:border-b-0">
                  <Link href={getArticleHref(a)} className="group block">
                    <h3 className="font-serif text-[15.5px] font-bold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
                      {a.title}
                    </h3>
                    <div className="mt-1 font-serif text-[14px] leading-snug text-neutral-600">
                      {a.excerpt}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Center image feature */}
        <div className="md:col-span-4">
          <Link href={getArticleHref(centerFeature)} className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
              <ArticleImage
                src={centerFeature.image}
                alt={centerFeature.title}
                eager
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          </Link>
          <Kicker category={centerFeature.category} className="mt-3 mb-1" />
          <Link href={getArticleHref(centerFeature)} className="group block">
            <h2 className="font-serif text-[19px] font-bold leading-[1.2] text-neutral-900 group-hover:text-[#8a1f11]">
              {centerFeature.title}
            </h2>
          </Link>
          <Byline
            authorId={centerFeature.authorId}
            date={centerFeature.date}
            className="mt-1.5"
          />
        </div>

        {/* Perspectives rail */}
        <div className="md:col-span-3">
          <div className="flex items-baseline justify-between border-b border-neutral-900 pb-1.5">
            <h2 className="font-serif text-[16px] font-bold text-neutral-900">
              Perspectives
            </h2>
          </div>
          <div>
            {perspectives.map((a) => (
              <TextOnlyItem key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
