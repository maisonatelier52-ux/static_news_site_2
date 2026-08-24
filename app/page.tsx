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

  /* HERO */

  const lead = all[0];
  const centerFeature = all[1];
  const moreOnThis = all.slice(2, 4);
  const perspectives = all.slice(4, 9);

  /* TOP STORIES */

  const topFeature = all[10];
  const topList = all.slice(11, 15);

  const mostRead = [
    all[15],
    all[16],
    all[17],
    all[18],
    all[19]
  ].filter(Boolean);

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
      .map((article) => article.slug)
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
  const 
  quad = all
    .filter(
      (article) =>
        !usedArticleSlugs.has(article.slug) )
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
  ].filter(Boolean);

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
      <JsonLd
        data={[
          collectionJsonLd,
          itemListJsonLd,
        ]}
      />

      <Header />

      <main>
        {/* HERO */}

        <HeroSection
          lead={lead}
          centerFeature={centerFeature}
          moreOnThis={moreOnThis}
          perspectives={perspectives}
        />

        {/* TOP STORIES */}

        <TopStoriesRow
          feature={topFeature}
          list={topList}
          mostRead={mostRead}
        />

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
            <CategoryPair
              key={`${catA}-${catB}`}
              left={left}
              right={right}
            />
          );
        })}

        {/* NEWSLETTER */}

        <Newsletter />

        {/* EDITOR'S PICKS */}

        {quad.length > 0 && (
          <QuadRow
            title="Editor's Picks"
            articles={quad}
          />
        )}

        {/* LATEST NEWS  */}

        {river.length > 0 && (
          <LatestRiver articles={river} />
        )}
      </main>

      <Footer />
    </>
  );
}