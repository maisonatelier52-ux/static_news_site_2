"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllCategories, getArticleHref, getCategoryHref, getPublishedArticles } from "@/lib/data";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const categories = getAllCategories();
  const trending = getPublishedArticles().slice(0, 4);

  const [compact, setCompact] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll while the modal is open, and allow Escape to close it.
  useEffect(() => {
    if (!subscribeOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSubscribeOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [subscribeOpen]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className={`
        sticky top-0 z-50 border-b border-neutral-900 bg-white
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Utility bar */}
      <div
        className={`
          mx-auto flex max-w-[1180px] items-center justify-between
          overflow-hidden px-4 font-sans text-[11px] text-neutral-500
          transition-all duration-300 ease-in-out md:px-6
          ${
            compact
              ? "h-0 py-0 opacity-0"
              : "h-[30px] py-1.5 opacity-100"
          }
        `}
      >
        <span>{today}</span>

        <div className="hidden items-center md:flex">
          <button
            type="button"
            onClick={() => setSubscribeOpen(true)}
            className="rounded-sm bg-neutral-900 px-3 py-1 text-white transition-colors hover:bg-neutral-700"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Masthead */}

      <div
        className={`
          mx-auto flex max-w-[1180px] items-center justify-between
          px-4 transition-all duration-300 ease-in-out md:px-6
          ${
            compact
              ? "py-1.5"
              : "pb-3 pt-1"
          }
        `}
      >
        {/* Mobile left spacer */}
        <div className="w-9 md:hidden" aria-hidden />

        <Link href="/" className="mx-auto md:mx-0">
          <span
            className={`
              block text-center font-serif font-semibold
              leading-none tracking-tight text-neutral-900
              transition-all duration-300 ease-in-out
              ${
                compact
                  ? "text-[24px] md:text-[28px]"
                  : "text-[30px] md:text-[38px]"
              }
            `}
          >
            The Ledger Review
          </span>

          <span
            className={`
              block text-center font-serif italic text-neutral-500
              transition-all duration-300 ease-in-out
              ${
                compact
                  ? "mt-0 text-[9px] md:text-[10px]"
                  : "mt-1 text-[11px] md:text-[12px]"
              }
            `}
          >
            Clarity, first and last
          </span>
        </Link>

        <MobileMenu categories={categories} />
      </div>

      {/* Primary navigation */}

      <nav
        aria-label="Primary"
        className={`
          hidden border-t border-neutral-200 transition-all
          duration-300 ease-in-out md:block
          ${compact ? "border-t-0" : ""}
        `}
      >
        <ul
          className={`
            mx-auto flex max-w-[1180px] items-center gap-6
            px-6 font-sans text-[13px] font-medium text-neutral-800
            transition-all duration-300 ease-in-out
            ${compact ? "py-1.5" : "py-2"}
          `}
        >
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={getCategoryHref(cat)}
                className="transition-colors hover:text-[#8a1f11]"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Trending strip */}

      <div className="overflow-hidden border-t border-neutral-200 bg-neutral-50">
        <div
          className={`
            mx-auto flex max-w-[1180px] items-center
            overflow-hidden font-sans text-[12px]
            transition-all duration-300
            ${compact ? "py-1" : "py-1.5"}
          `}
        >
          {/* Fixed Trending label */}

          <div className="relative z-10 shrink-0 bg-neutral-50 px-4 md:px-6">
            <span className="font-semibold uppercase tracking-wide text-[#8a1f11]">
              Trending
            </span>
          </div>

          {/* Scrolling area */}

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="trending-track flex w-max items-center">
              {/* First copy */}

              {trending.map((a) => (
                <Link
                  key={`first-${a.slug}`}
                  href={getArticleHref(a)}
                  className="mx-5 whitespace-nowrap text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {a.title.split(":")[0].split(",")[0]}
                </Link>
              ))}

              {/* Duplicate copy for seamless scrolling */}

              {trending.map((a) => (
                <Link
                  key={`second-${a.slug}`}
                  href={getArticleHref(a)}
                  className="mx-5 whitespace-nowrap text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {a.title.split(":")[0].split(",")[0]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {subscribeOpen && (
        <SubscribeModal onClose={() => setSubscribeOpen(false)} />
      )}

      {/* Animation */}

      <style jsx>{`
        .trending-track {
          animation: trending-scroll 28s linear infinite;
          will-change: transform;
        }

        .trending-track:hover {
          animation-play-state: paused;
        }

        @keyframes trending-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trending-track {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}

type SubscribeStatus = "idle" | "loading" | "success" | "error";

interface SubscribeModalProps {
  onClose: () => void;
}

function SubscribeModal({ onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValidEmail) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      // Replace this with a real call to your newsletter provider,
      // e.g. POST /api/newsletter/subscribe with { email: trimmed }.
      await new Promise((resolve) => setTimeout(resolve, 700));

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
        className="relative w-full max-w-[420px] border border-neutral-900 bg-white p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-lg leading-none text-neutral-400 transition-colors hover:text-neutral-900"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="text-center">
            <p className="font-serif text-[13px] uppercase tracking-widest text-[#8a1f11]">
              Confirmed
            </p>
            <h2 className="mt-2 font-serif text-[26px] font-semibold leading-tight text-neutral-900">
              You&apos;re on the list.
            </h2>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-neutral-600">
              We&apos;ve sent a confirmation to <strong>{email}</strong>. Look
              out for our next dispatch.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-sm bg-neutral-900 py-2 font-sans text-[13px] font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="font-serif text-white text-[13px] uppercase tracking-widest bg-[#8a1f11] inline-block px-2">
              Newsletter
            </p>
            <h2
              id="subscribe-modal-title"
              className="mt-2 font-serif text-[26px] font-semibold leading-tight text-neutral-900"
            >
              Subscribe to The Ledger Review
            </h2>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-neutral-600">
              One dispatch a day, straight to your inbox. No noise, just the
              stories that matter.
            </p>

            <form onSubmit={handleSubmit} className="mt-6" noValidate>
              <label
                htmlFor="subscribe-email"
                className="mb-1.5 block font-sans text-[11px] font-medium uppercase tracking-wide text-neutral-500"
              >
                Email address
              </label>
              <input
                id="subscribe-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoFocus
                className="w-full border border-neutral-300 bg-white px-3 py-2 font-sans text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-900"
              />

              {status === "error" && (
                <p className="mt-2 font-sans text-[12px] text-[#8a1f11]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-4 w-full rounded-sm bg-neutral-900 py-2 font-sans text-[13px] font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>

              <p className="mt-3 font-sans text-[11px] leading-relaxed text-neutral-400">
                By subscribing you agree to receive our daily email.
                Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}