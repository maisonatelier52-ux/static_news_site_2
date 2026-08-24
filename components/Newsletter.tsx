"use client";

import { useState, FormEvent } from "react";
import { SITE_NAME } from "@/lib/seo";
import { FiMail,FiArrowRight,FiCheck } from "react-icons/fi";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }

    // TODO: replace with a real subscribe API call.
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="relative overflow-hidden border-y border-neutral-200 bg-neutral-50">
      {/* top accent hairline */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#8a1f11]/40 to-transparent" />

      <div className="relative mx-auto max-w-[1180px] px-4 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Left: Newsletter identity */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Icon badge */}
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8a1f11]/20 bg-white shadow-sm sm:flex">
              <FiMail className="h-4 w-4 text-[#8a1f11]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a1f11]">
                  Newsletter
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />

                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:block">
                  Daily Brief
                </span>
              </div>

              <h2 className="mt-1 font-serif text-[20px] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[22px]">
                Subscribe to our daily newsletter for the latest news.
              </h2>
            </div>
          </div>

          {/* Center: Description */}
          <p className="hidden max-w-[300px] text-[12.5px] leading-relaxed text-neutral-500 xl:block">
            Get the day&apos;s most important headlines and analysis from{" "}
            <span className="font-semibold text-neutral-700">{SITE_NAME}</span>.
          </p>

          {/* Right: Signup */}
          <div className="shrink-0">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="relative min-w-0 sm:w-[270px]">
                <FiMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (status !== "idle") {
                      setStatus("idle");
                    }
                  }}
                  placeholder="Your email address"
                  className="h-11 w-full rounded-sm border border-neutral-300 bg-white pl-10 pr-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#8a1f11] focus:ring-1 focus:ring-[#8a1f11]/25"
                />
              </div>

              <button
                type="submit"
                className="group flex h-11 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#8a1f11] pl-6 pr-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:bg-[#711909] active:scale-[0.98]"
              >
                Subscribe
                <FiArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Status */}
            <div aria-live="polite" className="mt-2 min-h-[16px] text-[11px]">
              {status === "success" && (
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <FiCheck className="h-3.5 w-3.5" />
                  You&apos;re subscribed — check your inbox to confirm.
                </span>
              )}

              {status === "error" && (
                <span className="text-[#8a1f11]">
                  Please enter a valid email address.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Small legal line */}
        <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-3 text-[9px] uppercase tracking-[0.14em] text-neutral-400">
          <span>Daily edition</span>
          <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
          <span>Independent coverage</span>
          <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
}