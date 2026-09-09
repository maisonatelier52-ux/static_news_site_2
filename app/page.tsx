import type { Metadata } from "next";
import {
  getAllCategories,
  getArticleHref,
  getArticlesByCategory,
  getPublishedArticles,
} from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TopStoriesRow from "@/components/TopStoriesRow";
import CategoryPair from "@/components/CategoryPair";
import QuadRow from "@/components/QuadRow";
import LatestRiver from "@/components/LatestRiver";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Independent News & Analysis`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${SITE_NAME} | Independent News & Analysis`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Independent News & Analysis`,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  const all = getPublishedArticles();
  const categories = getAllCategories();

  /*
   * CURSOR-BASED SLICING
   *
   * Instead of hard-coded indices (all[10], all.slice(15, 20)...),
   * `take(n)` pulls the next `n` available articles and moves the
   * cursor forward. If fewer than `n` remain, it just returns what's
   * left (never undefined-filled gaps). This means the page degrades
   * gracefully with a small dataset and automatically uses more
   * content as you add it — no index math to update by hand.
   *
   * Feel free to tune these counts up as your article count grows.
   */
  let cursor = 0;
  const take = (count: number) => {
    const slice = all.slice(cursor, cursor + count);
    cursor += slice.length;
    return slice;
  };

  /* HERO */

  const [lead] = take(1);
  const [centerFeature] = take(1);
  const moreOnThis = take(2);
  const perspectives = take(5);

  /* TOP STORIES */

  const [topFeature] = take(1);
  const topList = take(4);
  const mostRead = take(5);

  /*
   * ARTICLES ALREADY DISPLAYED ABOVE CATEGORY PAIRS
   *
   * These articles should NOT appear again in CategoryPair.
   */

  const usedArticleSlugs = new Set(
    [
      lead,
      centerFeature,
      ...moreOnThis,
      ...perspectives,
      topFeature,
      ...topList,
      ...mostRead,
    ]
      .filter(Boolean)
      .map((article) => article!.slug)
  );

  /* CATEGORY PAIRS */

  const pairs: [string, string][] = [];

  for (let i = 0; i < categories.length; i += 2) {
    if (categories[i + 1]) {
      pairs.push([categories[i], categories[i + 1]]);
    }
  }

  const buildColumn = (category: string) => {
    /*
     * Get articles for this category.
     *
     * Remove anything already displayed in:
     * - Hero
     * - Perspectives
     * - Top Stories
     * - Most Read
     */
    const items = getArticlesByCategory(category)
      .filter((article) => !usedArticleSlugs.has(article.slug))
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

    return {
      category,
      feature: items[0],
      rest: items.slice(1, 4),
    };
  };

  /* REMAINING NEWS AFTER CATEGORY PAIRS */

  const categoryArticles = categories.flatMap((category) =>
    getArticlesByCategory(category)
      .filter((article) => !usedArticleSlugs.has(article.slug))
      .map((article) => article.slug)
  );

  /*
   * Articles already used by category sections.
   * This allows later sections to avoid repeating them.
   */
  const categoryUsedSlugs = new Set(categoryArticles);

  /*
   * Editor's Picks
   *
   * Take articles that have not already appeared above.
   */
  const quad = all
    .filter((article) => !usedArticleSlugs.has(article.slug))
    .slice(0, 4);

  /* Latest News */
  const quadSlugs = new Set(quad.map((article) => article.slug));

  const river = all
    .filter(
      (article) =>
        !usedArticleSlugs.has(article.slug) &&
        !quadSlugs.has(article.slug)
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 16);

  /* JSON-LD */

  const frontPageItems = [
    lead,
    centerFeature,
    ...moreOnThis,
    topFeature,
    ...topList,
  ].filter(Boolean) as typeof all;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/#webpage"),
    url: absoluteUrl("/"),
    name: `${SITE_NAME} | Independent News & Analysis`,
    description: SITE_DESCRIPTION,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    about: {
      "@id": absoluteUrl("/#organization"),
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: frontPageItems.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(getArticleHref(article)),
      name: article.title,
    })),
  };

  return (
    <>
      <JsonLd data={[collectionJsonLd, itemListJsonLd]} />

      <Header />

      <main>
        {/* HERO — only render once we actually have a lead + center feature */}

        {lead && centerFeature && (
          <HeroSection
            lead={lead}
            centerFeature={centerFeature}
            moreOnThis={moreOnThis}
            perspectives={perspectives}
          />
        )}

        {/* TOP STORIES — only render once we have a feature article */}

        {topFeature && (
          <TopStoriesRow
            feature={topFeature}
            list={topList}
            mostRead={mostRead}
          />
        )}

        {/* CATEGORY PAIRS */}

        {pairs.map(([catA, catB]) => {
          const left = buildColumn(catA);
          const right = buildColumn(catB);

          /*
           * Don't render an empty category pair.
           */
          if (!left.feature && !right.feature) {
            return null;
          }

          return (
            <CategoryPair key={`${catA}-${catB}`} left={left} right={right} />
          );
        })}

        {/* NEWSLETTER */}

        <Newsletter />

        {/* EDITOR'S PICKS */}

        {quad.length > 0 && <QuadRow title="Editor's Picks" articles={quad} />}

        {/* LATEST NEWS  */}

        {river.length > 0 && <LatestRiver articles={river} />}
      </main>

      <Footer />
    </>
  );
}