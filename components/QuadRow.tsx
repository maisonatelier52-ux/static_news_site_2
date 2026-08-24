import type { Article } from "@/lib/types";
import { QuadCard } from "./ArticleCards";

export default function QuadRow({ title, articles }: { title: string; articles: Article[] }) {
  return (
    <section className="mx-auto max-w-[1180px] border-t border-neutral-900 px-4 py-6 md:px-6">
      <h2 className="mb-4 font-serif text-[16px] font-bold text-neutral-900">{title}</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {articles.map((a) => (
          <QuadCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
