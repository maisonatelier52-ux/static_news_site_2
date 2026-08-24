/**
 * Central site configuration + structured-data helpers.
 *
 * SITE_URL should be set via the SITE_URL env var in production (e.g.
 * "https://www.example.com", no trailing slash). It falls back to a
 * placeholder so metadata/JSON-LD still resolve to absolute URLs in
 * local development.
 */
export const SITE_NAME = "The Ledger Review";
export const SITE_URL = (process.env.SITE_URL ?? "https://www.theledgerreview.com").replace(
  /\/$/,
  ""
);
export const SITE_DESCRIPTION =
  "Independent reporting on business, finance, travel, investigations, law and life.";
export const SITE_LOCALE = "en_US";
export const TWITTER_HANDLE = "@ledgerreview";
export const PUBLISHER_LOGO = `${SITE_URL}/favicon.ico`;

/** Resolve a possibly-relative path against the canonical site origin. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: PUBLISHER_LOGO,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}
