import Link from "next/link";
import type { Article } from "@/lib/types";
import { RiverRow } from "./ArticleCards";

export default function LatestRiver({ articles }: { articles: Article[] }) {
  const mid = Math.ceil(articles.length / 2);
  const colA = articles.slice(0, mid);
  const colB = articles.slice(mid);

  return (
    <section className="mx-auto max-w-[1180px] border-t border-neutral-900 px-4 py-6 md:px-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-serif text-[16px] font-bold text-neutral-900">Latest News</h2>
        <Link
          href="/"
          className="font-sans text-[11px] font-semibold uppercase tracking-wide text-neutral-500 hover:text-[#8a1f11]"
        >
          All Stories &rsaquo;
        </Link>
      </div>
      <div className="grid gap-x-10 md:grid-cols-2">
        <ul>
          {colA.map((a) => (
            <RiverRow key={a.slug} article={a} />
          ))}
        </ul>
        <ul>
          {colB.map((a) => (
            <RiverRow key={a.slug} article={a} />
          ))}
        </ul>
      </div>
    </section>
  );
}
