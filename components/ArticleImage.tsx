"use client";

import { useState } from "react";

const PALETTES = [
  ["#8a1f11", "#3f0d06"],
  ["#1f3a5f", "#0a1b30"],
  ["#2f4d3a", "#122419"],
  ["#5c4326", "#2a1e10"],
  ["#3a2f4d", "#191424"],
  ["#4d1f2f", "#240d15"],
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

function initials(title: string) {
  const words = title.split(/\s+/).filter(Boolean);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

/**
 * Renders an article's photograph, falling back to a quiet monogram
 * treatment (rather than a broken image or a generic placeholder icon)
 * whenever the underlying asset is unavailable.
 */
export default function ArticleImage({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const [c1, c2] = paletteFor(alt || src);
    return (
      <div
        className={`flex items-center justify-center select-none ${className}`}
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
        }}
        role="img"
        aria-label={alt}
      >
        <span
          className="font-serif text-white/85"
          style={{ fontSize: "clamp(1.1rem, 8%, 3rem)" }}
        >
          <span className="text-[2em] tracking-tight">{initials(alt).toUpperCase()}</span>
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
