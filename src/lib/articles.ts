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
  category: ArticleCategory;
  /** Human display date, e.g. "January 2026". */
  date: string;
  /** Sortable ISO date (first of the month), newest first. */
  iso: string;
  excerpt: string;
  metaDescription: string;
  /** True for the five long-form features; false for short-form notes. */
  feature: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "why-sif-prominent-position-2026",
    title: "Why SIF Could Gain a Prominent Position in 2026",
    category: "SIF",
    date: "January 2026",
    iso: "2026-01-05",
    excerpt:
      "How Specialised Investment Funds could move from a new-launch curiosity to a mainstream allocation for strategy-led investors.",
    metaDescription:
      "Why Specialised Investment Funds (SIFs) could gain a prominent position in 2026 — the strategy-first format, early traction, and an honest look at what hedging can and cannot promise.",
    feature: true,
  },
  {
    slug: "mutual-funds-evolving-good-thing-investors",
    title: "Mutual Funds Are Evolving — And That's a Good Thing for Investors",
    category: "Mutual Fund",
    date: "January 2026",
    iso: "2026-01-04",
    excerpt:
      "The shift from broad categories to strategy-driven tools — factor investing, thematic exposure, ETFs and asset-allocation solutions.",
    metaDescription:
      "Mutual funds are evolving from broad categories into strategy-driven tools — factor investing, thematic exposure, ETFs, global diversification and hybrid strategies — and why more choice means more responsibility.",
    feature: true,
  },
  {
    slug: "aifs-india-what-why-trend",
    title:
      "Alternative Investment Funds (AIFs) in India — What They Are, Why They Matter, and Where the Trend Is Headed",
    category: "AIF",
    date: "January 2026",
    iso: "2026-01-03",
    excerpt:
      "AIFs as private pooled vehicles under SEBI regulation — the three categories, the accredited-investor framework, and the trade-offs.",
    metaDescription:
      "Alternative Investment Funds (AIFs) in India explained — private pooled vehicles under SEBI regulation, Categories I/II/III, the accredited-investor framework, and the trade-offs of liquidity, complexity and fees.",
    feature: true,
  },
  {
    slug: "why-international-investing-matters-2026",
    title: "Why International Investing Will Matter More Than Ever by 2026",
    category: "International",
    date: "January 2026",
    iso: "2026-01-02",
    excerpt:
      "Global investing as diversification for an India-centric portfolio — rotating leadership, currency effects and access to global innovation.",
    metaDescription:
      "Why international investing will matter more than ever by 2026 — diversification for an India-centric portfolio, rotating country leadership, currency effects and access to global innovation.",
    feature: true,
  },
  {
    slug: "pms-explained-taxation-target-audience",
    title:
      "Portfolio Management Services (PMS) Explained: What They Are, How They Are Taxed, and Who They Are Meant For",
    category: "PMS",
    date: "January 2026",
    iso: "2026-01-01",
    excerpt:
      "PMS as a separate, identifiable investor portfolio under SEBI regulation — discretionary vs non-discretionary, strategies, taxation and audience.",
    metaDescription:
      "Portfolio Management Services (PMS) explained — a separate investor portfolio under SEBI regulation, discretionary vs non-discretionary mandates, common strategies, how PMS is taxed, and who it is meant for.",
    feature: true,
  },
  {
    slug: "market-outlook-2025",
    title: "Market Outlook 2025: Key Trends to Watch",
    category: "Mutual Fund",
    date: "December 2024",
    iso: "2024-12-01",
    excerpt:
      "Analysis of major market trends and investment opportunities for the coming year.",
    metaDescription:
      "Market Outlook 2025 — analysis of major market trends and investment opportunities for the coming year.",
    feature: false,
  },
  {
    slug: "international-investing-guide",
    title: "International Investing: Benefits and Considerations",
    category: "International",
    date: "November 2024",
    iso: "2024-11-02",
    excerpt:
      "Why global diversification matters and how to approach international markets.",
    metaDescription:
      "International investing: benefits and considerations — why global diversification matters and how to approach international markets.",
    feature: false,
  },
  {
    slug: "power-of-asset-allocation",
    title: "The Power of Asset Allocation",
    category: "AIF",
    date: "November 2024",
    iso: "2024-11-01",
    excerpt:
      "How disciplined asset allocation can help navigate market cycles effectively.",
    metaDescription:
      "The power of asset allocation — how disciplined asset allocation can help navigate market cycles effectively.",
    feature: false,
  },
  {
    slug: "risk-management-portfolio",
    title: "Risk Management in Portfolio Construction",
    category: "PMS",
    date: "October 2024",
    iso: "2024-10-01",
    excerpt:
      "Essential principles for managing risk while building a resilient portfolio.",
    metaDescription:
      "Risk management in portfolio construction — essential principles for managing risk while building a resilient portfolio.",
    feature: false,
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
