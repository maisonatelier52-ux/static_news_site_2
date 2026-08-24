"use client";

import Link from "next/link";
import { useState } from "react";
import { getCategoryHref } from "@/lib/data";

export default function MobileMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
      >
        <span
          className={`block h-[1.5px] w-5 bg-neutral-900 transition-transform ${
            open ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-neutral-900 transition-opacity ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-neutral-900 transition-transform ${
            open ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-[var(--header-h,104px)] z-40 max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto border-t border-neutral-900 bg-white"
        >
          <ul className="divide-y divide-neutral-200">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={getCategoryHref(cat)}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3.5 font-sans text-[15px] font-medium text-neutral-900"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
