import Link from "next/link";
import { getAllCategories, getCategoryHref } from "@/lib/data";

export default function Footer() {
  const categories = getAllCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-900 bg-neutral-50">
      <div className="mx-auto max-w-[1180px] px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Sections
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={getCategoryHref(cat)}
                    className="font-sans text-[13px] text-neutral-700 hover:text-[#8a1f11]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              About
            </h3>
            <ul className="space-y-2">
              {["Our Newsroom", "Careers", "Contact Us", "Advertise"].map((item) => (
                <li key={item}>
                  <Link href="/" className="font-sans text-[13px] text-neutral-700 hover:text-[#8a1f11]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Policies
            </h3>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Cookie Settings", "Corrections"].map(
                (item) => (
                  <li key={item}>
                    <Link href="/" className="font-sans text-[13px] text-neutral-700 hover:text-[#8a1f11]">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Follow
            </h3>
            <ul className="space-y-2">
              {["Newsletters", "RSS", "Mobile App"].map((item) => (
                <li key={item}>
                  <Link href="/" className="font-sans text-[13px] text-neutral-700 hover:text-[#8a1f11]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <span className="block text-center font-serif text-[20px] font-semibold text-neutral-900">
            The Ledger Review
          </span>
          <p className="mt-2 text-center font-sans text-[12px] text-neutral-500">
            &copy; {year} The Ledger Review. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
