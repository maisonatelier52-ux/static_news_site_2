// import Link from "next/link";
// import { getCategoryHref } from "@/lib/data";

// export default function Kicker({
//   category,
//   className = "",
// }: {
//   category: string;
//   className?: string;
// }) {
//   return (
//     <Link
//       href={getCategoryHref(category)}
//       className={`inline-block font-sans text-[11px] font-bold uppercase tracking-wider text-[#8a1f11] hover:underline ${className}`}
//     >
//       {category}
//     </Link>
//   );
// }

export default function Kicker({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-block font-sans text-[11px] font-bold uppercase tracking-wider text-[#8a1f11] hover:underline ${className}`}
    >
      {category}
    </div>
  );
}
