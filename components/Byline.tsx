import { getAuthorById, formatDate } from "@/lib/data";

export default function Byline({
  authorId,
  date,
  className = "",
}: {
  authorId: number;
  date: string;
  className?: string;
}) {
  const author = getAuthorById(authorId);
  return (
    <p className={`font-sans text-[12px] text-neutral-500 ${className}`}>
      {author && <span>By {author.name}</span>}
      {author && <span className="mx-1.5">&middot;</span>}
      <span>{formatDate(date)}</span>
    </p>
  );
}
