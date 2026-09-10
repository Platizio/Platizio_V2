import type { RichBlock } from "@/lib/content-types";
import { ARTICLE_BODIES } from "@/content/articles";

/**
 * Media Insights article registry. Metadata is authored here; the article
 * bodies are ported verbatim from the legacy site and live in
 * `src/content/articles/<slug>.ts`, keyed into `ARTICLE_BODIES`.
 *
 * Market, tax and regulatory figures inside the article bodies are reproduced
 * from the legacy source and must be revalidated for accuracy and compliance
 * before publishing.
 */

export type ArticleCategory =
  | "SIF"
  | "Mutual Fund"
  | "AIF"
  | "PMS"
  | "International";

export const CATEGORIES: ("All" | ArticleCategory)[] = [
  "All",
  "SIF",
  "Mutual Fund",
  "AIF",
  "PMS",
  "International",
];

/** Maps an article category to the product glyph used as its cover motif. */
export const CATEGORY_GLYPH: Record<ArticleCategory, keyof typeof import("@/lib/productGlyphs").PRODUCT_GLYPHS> = {
  SIF: "SIF",
  "Mutual Fund": "MF",
  AIF: "AIF",
  PMS: "PMS",
  International: "INTL",
};

export type Article = {
  slug: string;
  title: string;
  /**
   * Short form of `title`, for the `<title>` tag only — the same split the
   * products registry already makes between `metaTitle` and the hero headline.
   *
   * These headlines are written to be read on the page, and two of them run to
   * 107 characters. With the site suffix appended, every one of the five
   * overflowed the ~60 characters a search result shows, so the SERP truncated
   * them mid-clause: "Alternative Investment Funds (AIFs) in India — What They
   * Are, Why…". Shortening the headline itself would be the wrong trade — the
   * long ones are descriptive on purpose — so the search title is authored
   * separately and the headline is left alone.
   *
   * Optional: an article whose own title already fits needs no second one, and
   * `generateMetadata` falls back to `title`.
   */
  metaTitle?: string;
  category: ArticleCategory;
  /** Human display date, e.g. "January 2026". */
  date: string;
  /** Sortable ISO date (first of the month), newest first. */
  iso: string;
  excerpt: string;
  metaDescription: string;
  /**
   * True for long-form features, false for short-form notes — it only picks
   * the card's call to action ("Read article" / "Read note").
   *
   * Every article is currently a feature: the four notes that used to sit
   * here were placeholder copy and were removed rather than written. The
   * field stays because the distinction is a real editorial one the site
   * will want again, not because anything sets it false today.
   */
  feature: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "why-sif-prominent-position-2026",
    metaTitle: "Why SIF Could Gain Ground in 2026",
    title: "Why SIF Could Gain a Prominent Position in 2026",
    category: "SIF",
    date: "January 2026",
    iso: "2026-01-05",
    excerpt:
      "How Specialised Investment Funds could move from a new-launch curiosity to a mainstream allocation for strategy-led investors.",
    metaDescription:
      "Why Specialised Investment Funds could gain ground in 2026: the strategy-first format, early traction, and an honest look at what hedging cannot promise.",
    feature: true,
  },
  {
    slug: "mutual-funds-evolving-good-thing-investors",
    metaTitle: "How Mutual Funds Are Evolving for Investors",
    title: "Mutual Funds Are Evolving — And That's a Good Thing for Investors",
    category: "Mutual Fund",
    date: "January 2026",
    iso: "2026-01-04",
    excerpt:
      "The shift from broad categories to strategy-driven tools — factor investing, thematic exposure, ETFs and asset-allocation solutions.",
    metaDescription:
      "How mutual funds are evolving from broad categories into strategy-driven tools: factor investing, thematic exposure, ETFs and hybrid strategies.",
    feature: true,
  },
  {
    slug: "aifs-india-what-why-trend",
    metaTitle: "AIFs in India: Categories, Rules and Trends",
    title:
      "Alternative Investment Funds (AIFs) in India — What They Are, Why They Matter, and Where the Trend Is Headed",
    category: "AIF",
    date: "January 2026",
    iso: "2026-01-03",
    excerpt:
      "AIFs as private pooled vehicles under SEBI regulation — the three categories, the accredited-investor framework, and the trade-offs.",
    metaDescription:
      "Alternative Investment Funds in India explained: private pooled vehicles under SEBI regulation, Categories I/II/III, and the accredited-investor rules.",
    feature: true,
  },
  {
    slug: "why-international-investing-matters-2026",
    metaTitle: "Why International Investing Matters by 2026",
    title: "Why International Investing Will Matter More Than Ever by 2026",
    category: "International",
    date: "January 2026",
    iso: "2026-01-02",
    excerpt:
      "Global investing as diversification for an India-centric portfolio — rotating leadership, currency effects and access to global innovation.",
    metaDescription:
      "Why international investing matters by 2026: diversification for an India-centric portfolio, rotating country leadership and currency effects.",
    feature: true,
  },
  {
    slug: "pms-explained-taxation-target-audience",
    metaTitle: "PMS Explained: Strategy, Taxation and Fit",
    title:
      "Portfolio Management Services (PMS) Explained: What They Are, How They Are Taxed, and Who They Are Meant For",
    category: "PMS",
    date: "January 2026",
    iso: "2026-01-01",
    excerpt:
      "PMS as a separate, identifiable investor portfolio under SEBI regulation — discretionary vs non-discretionary, strategies, taxation and audience.",
    metaDescription:
      "Portfolio Management Services explained: a separate portfolio under SEBI regulation, discretionary vs non-discretionary mandates, taxation, and fit.",
    feature: true,
  },
];

/** Newest first. */
export const ARTICLES_SORTED = [...ARTICLES].sort((a, b) =>
  b.iso.localeCompare(a.iso),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticleBody(slug: string): RichBlock[] {
  return ARTICLE_BODIES[slug] ?? [];
}
