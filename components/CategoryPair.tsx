import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticleHref, getCategoryHref } from "@/lib/data";
import ArticleImage from "./ArticleImage";

function CategoryColumn({ category, feature, rest }: { category: string; feature: Article; rest: Article[] }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between border-b border-neutral-900 pb-1.5">
        <h2 className="font-serif text-[17px] font-bold text-neutral-900">{category}</h2>
        <Link
          href={getCategoryHref(category)}
          className="font-sans text-[11px] font-semibold uppercase tracking-wide text-neutral-500 hover:text-[#8a1f11]"
        >
          More &rsaquo;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href={getArticleHref(feature)} className="group block">
          <div className="aspect-[3/2] overflow-hidden bg-neutral-100">
            <ArticleImage
              src={feature.image}
              alt={feature.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <h3 className="mt-2.5 font-serif text-[17px] font-bold leading-[1.2] text-neutral-900 group-hover:text-[#8a1f11]">
            {feature.title}
          </h3>
        </Link>
        <ul>
          {rest.map((a) => (
            <li key={a.slug} className="border-b border-neutral-200 py-2.5 first:pt-0 last:border-b-0">
              <Link href={getArticleHref(a)} className="group block">
                <h3 className="font-serif text-[14.5px] font-semibold leading-[1.3] text-neutral-900 group-hover:text-[#8a1f11]">
                  {a.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CategoryPair({
  left,
  right,
}: {
  left: { category: string; feature: Article; rest: Article[] };
  right: { category: string; feature: Article; rest: Article[] };
}) {
  return (
    <section className="mx-auto max-w-[1180px] border-t border-neutral-900 px-4 py-6 md:px-6">
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        <CategoryColumn category={left.category} feature={left.feature} rest={left.rest} />
        <CategoryColumn category={right.category} feature={right.feature} rest={right.rest} />
      </div>
    </section>
  );
}
