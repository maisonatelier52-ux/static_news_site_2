import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticleHref } from "@/lib/data";
import ArticleImage from "./ArticleImage";
import Kicker from "./Kicker";
import { NumberedItem } from "./ArticleCards";

export default function TopStoriesRow({
  feature,
  list,
  mostRead,
}: {
  feature: Article;
  list: Article[];
  mostRead: Article[];
}) {
  return (
    <section className="mx-auto max-w-[1180px] border-t border-neutral-900 px-4 py-6 md:px-6">
      <h2 className="mb-4 font-serif text-[16px] font-bold text-neutral-900">
        More Top Stories
      </h2>
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link href={getArticleHref(feature)} className="group block">
            <div className="aspect-[3/2] overflow-hidden bg-neutral-100">
              <ArticleImage
                src={feature.image}
                alt={feature.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <Kicker category={feature.category} className="mt-3 mb-1" />
            <h3 className="font-serif text-[18px] font-bold leading-[1.2] text-neutral-900 group-hover:text-[#8a1f11]">
              {feature.title}
            </h3>
          </Link>
        </div>

        <div className="md:col-span-5">
          <ul>
            {list.map((a) => (
              <li key={a.slug} className="border-b border-neutral-200 py-3 first:pt-0 last:border-b-0">
                <Link href={getArticleHref(a)} className="group block">
                  <Kicker category={a.category} className="mb-1 text-[10px]" />
                  <h3 className="font-serif text-[16px] font-bold leading-[1.25] text-neutral-900 group-hover:text-[#8a1f11]">
                    {a.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="mb-1.5 border-b border-neutral-900 pb-1.5 font-serif text-[16px] font-bold text-neutral-900">
            Most Read
          </h2>
          <ol>
            {mostRead.map((a, i) => (
              <NumberedItem key={a.slug} article={a} index={i + 1} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
