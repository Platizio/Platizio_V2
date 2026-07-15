import type { ReactNode } from "react";
import { PRODUCT_GLYPHS } from "@/lib/productGlyphs";

/**
 * Product detail content. Copy is carried faithfully from the legacy site and
 * the content brief (LEGACY_SITE_CONTENT.md §5). Suitability and risk language
 * is preserved; nothing here implies guaranteed returns.
 */

export type ProductSlug =
  | "sif"
  | "mutual-funds"
  | "pms"
  | "aif"
  | "international";

/** A content block. The renderer alternates midnight/porcelain tones. */
export type ProductBlock =
  | { kind: "prose"; label?: string; heading?: string; accent?: string[]; body: string[] }
  | {
      kind: "highlights";
      label?: string;
      heading: string;
      accent?: string[];
      intro?: string;
      items: { title: string; body?: string }[];
    }
  | {
      kind: "reasons";
      label?: string;
      heading: string;
      accent?: string[];
      intro?: string;
      items: { title: string; body: string }[];
    }
  | {
      kind: "cards";
      label?: string;
      heading: string;
      accent?: string[];
      intro?: string;
      items: { label?: string; title: string; body: string }[];
    }
  | {
      kind: "table";
      label?: string;
      heading: string;
      accent?: string[];
      intro?: string;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "steps";
      label?: string;
      heading: string;
      accent?: string[];
      intro?: string;
      items: { title: string; body: string }[];
    }
  | { kind: "callout"; label?: string; title: string; body: string[] }
  | { kind: "note"; body: string };

export type Product = {
  slug: ProductSlug;
  tag: keyof typeof PRODUCT_GLYPHS;
  name: string;
  navName: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    label: string;
    headline: string;
    accent: string[];
    intro: string;
  };
  glyph: ReactNode;
  blocks: ProductBlock[];
};

const RISK_NOTE =
  "Investments are subject to market risks. Suitability depends on your goals, horizon and risk appetite. Nothing here guarantees returns or outcomes; please read all scheme-related documents carefully before investing.";

export const PRODUCTS: Product[] = [
  {
    slug: "sif",
    tag: "SIF",
    name: "Specialised Investment Funds",
    navName: "Specialised Investment Funds",
    metaTitle: "Specialised Investment Funds (SIF) | Platizio",
    metaDescription:
      "SEBI-regulated Specialised Investment Funds offering advanced portfolio strategies — long-short, derivatives and dynamic allocation — for sophisticated, risk-aware investors.",
    hero: {
      label: "Specialised Investment Funds",
      headline: "Sophisticated strategy, regulated by design.",
      accent: ["design."],
      intro:
        "Advanced portfolio strategies beyond traditional mutual funds, designed for sophisticated investors.",
    },
    glyph: PRODUCT_GLYPHS.SIF,
    blocks: [
      {
        kind: "prose",
        label: "What is a SIF?",
        heading: "A regulated home for advanced strategy.",
        accent: ["strategy."],
        body: [
          "A Specialised Investment Fund (SIF) is a SEBI-regulated investment vehicle offering advanced portfolio strategies beyond traditional mutual funds. It gives fund managers greater flexibility to use long-short positions, derivatives and dynamic asset allocation while operating within a regulated, mutual-fund-like framework.",
          "SIFs are aimed at investors who understand market risks and seek sophisticated, risk-managed approaches to wealth creation across market conditions.",
        ],
      },
      {
        kind: "highlights",
        label: "The essentials",
        heading: "Built for informed investors.",
        accent: ["investors."],
        items: [
          { title: "SEBI-regulated framework", body: "Operates under the oversight and disclosure standards of a regulated structure." },
          { title: "Advanced strategies", body: "Long-short positions and derivatives, used within defined limits." },
          { title: "Dynamic asset allocation", body: "Exposure shifts with conditions rather than staying fixed." },
          { title: "Suitable for informed investors", body: "For those who understand market risk and strategy-led investing." },
        ],
      },
      {
        kind: "reasons",
        label: "Why choose SIF?",
        heading: "Three reasons investors consider a SIF.",
        accent: ["SIF."],
        items: [
          {
            title: "Outcome-focused investing",
            body: "The focus is on absolute outcomes rather than only beating a market benchmark — with the stated aim of consistent wealth creation regardless of market direction.",
          },
          {
            title: "All-weather performance",
            body: "Designed to capture opportunities across market cycles while managing downside risk through hedging and dynamic allocation.",
          },
          {
            title: "Smarter risk management",
            body: "Diversification across strategies, exposures and market conditions aims to avoid structural traps and reduce portfolio volatility.",
          },
        ],
      },
      {
        kind: "cards",
        label: "Strategy types",
        heading: "Three ways a SIF can be built.",
        accent: ["built."],
        items: [
          {
            label: "Equity SIF",
            title: "Active, hedged equity",
            body: "Active management, hedging and long-short approaches to navigate volatility and capture upside.",
          },
          {
            label: "Debt SIF",
            title: "Flexible fixed income",
            body: "Fixed-income strategies with flexibility to manage interest-rate risk, credit risk and liquidity for stable returns.",
          },
          {
            label: "Hybrid SIF",
            title: "Equity plus debt",
            body: "Equity-plus-debt strategies intended to balance growth potential and risk management across market cycles.",
          },
        ],
      },
      {
        kind: "note",
        body: "SIFs carry market risk. Hedging and dynamic allocation aim to manage risk but do not guarantee returns, or superior performance in any market condition.",
      },
    ],
  },

  {
    slug: "mutual-funds",
    tag: "MF",
    name: "Mutual Funds",
    navName: "Mutual Funds",
    metaTitle: "Mutual Funds | Platizio",
    metaDescription:
      "Professionally managed, diversified mutual funds for disciplined wealth creation — equity, hybrid, debt, consumption, thematic and sectoral categories, with SIP options.",
    hero: {
      label: "Mutual Funds",
      headline: "Diversified by design, managed with discipline.",
      accent: ["discipline."],
      intro:
        "Professionally managed, diversified investment solutions for disciplined wealth creation.",
    },
    glyph: PRODUCT_GLYPHS.MF,
    blocks: [
      {
        kind: "prose",
        label: "What are Mutual Funds?",
        heading: "Pooled, professionally managed, transparent.",
        accent: ["transparent."],
        body: [
          "Mutual funds are professionally managed vehicles that pool money from multiple investors across diversified portfolios of equities, bonds and money-market instruments. An experienced fund manager invests according to the fund's stated objective.",
          "They remain one of the most disciplined, diversified, transparent and broadly accessible ways to participate in markets.",
        ],
      },
      {
        kind: "highlights",
        label: "The benefits",
        heading: "Why investors start here.",
        accent: ["here."],
        items: [
          { title: "Professional fund management", body: "Decisions made by experienced managers within a stated mandate." },
          { title: "Diversified portfolio", body: "Exposure spread across many holdings to reduce single-name risk." },
          { title: "Transparent, regulated framework", body: "Regular disclosure under a regulated structure." },
          { title: "Flexible amounts and SIPs", body: "Invest lump-sum or through Systematic Investment Plans." },
        ],
      },
      {
        kind: "table",
        label: "Fund categories",
        heading: "Six categories, one framework.",
        accent: ["framework."],
        columns: ["Category", "Description", "Best suited for"],
        rows: [
          [
            "Equity Mutual Funds",
            "Predominantly listed-company shares for long-term capital growth; can have short-term volatility.",
            "Long horizon and higher risk tolerance.",
          ],
          [
            "Hybrid Mutual Funds",
            "Equity and debt together to balance growth potential and relative stability; allocation varies by strategy and conditions.",
            "Moderated risk with growth opportunities.",
          ],
          [
            "Debt Mutual Funds",
            "Government securities, corporate bonds and money-market instruments; aims for predictable returns and capital preservation.",
            "Income generation and lower volatility.",
          ],
          [
            "Consumption-Focused Funds",
            "Companies benefiting from domestic demand: FMCG, retail, automobiles and consumer services.",
            "Long-term consumption-driven growth themes.",
          ],
          [
            "Thematic Mutual Funds",
            "Themes such as infrastructure, manufacturing, digital transformation or sustainability across sectors.",
            "Investors with conviction in structural trends.",
          ],
          [
            "Sectoral Mutual Funds",
            "One sector, for example banking, technology or healthcare; returns are sector-cycle sensitive.",
            "Experienced investors who understand sectoral risk and timing.",
          ],
        ],
      },
      {
        kind: "prose",
        label: "Suitability",
        heading: "Matched to goals, not to hype.",
        accent: ["hype."],
        body: [
          "Mutual funds can support long-term wealth creation, regular income generation, diversification and goal-based investing. Suitability differs by category: equity and sectoral funds can carry higher volatility, while debt and hybrid funds generally carry relatively lower risk.",
          "Investors should assess their risk appetite, horizon and financial goals — and seek guidance where required.",
        ],
      },
    ],
  },

  {
    slug: "pms",
    tag: "PMS",
    name: "Portfolio Management Services",
    navName: "Portfolio Management Services",
    metaTitle: "Portfolio Management Services (PMS) | Platizio",
    metaDescription:
      "Personalized, transparent portfolio management for High Net-Worth Individuals — direct ownership in your name, a customized strategy and a SEBI-prescribed ₹50 lakh minimum.",
    hero: {
      label: "Portfolio Management Services",
      headline: "A portfolio in your name, managed to your mandate.",
      accent: ["mandate."],
      intro:
        "Personalized, transparent investment management for High Net-Worth Individuals.",
    },
    glyph: PRODUCT_GLYPHS.PMS,
    blocks: [
      {
        kind: "prose",
        label: "What is PMS?",
        heading: "Direct ownership, managed for you.",
        accent: ["you."],
        body: [
          "Portfolio Management Services (PMS) are personalized solutions in which a professional portfolio manager manages a client's investments directly, in the client's own name. Unlike pooled vehicles, PMS portfolios are customized, transparent and tailored to your objectives, risk profile and market outlook.",
          "The format supports greater flexibility in security selection, concentration and style.",
        ],
      },
      {
        kind: "highlights",
        label: "Key features",
        heading: "What makes PMS different.",
        accent: ["different."],
        items: [
          { title: "Direct ownership", body: "Securities are held in the investor's own name." },
          { title: "Customized strategy", body: "Built around your objectives, risk profile and outlook." },
          { title: "Transparent holdings", body: "Full visibility into what the portfolio owns." },
          { title: "Flexibility in selection", body: "Greater latitude in stock selection and concentration." },
        ],
      },
      {
        kind: "callout",
        label: "Minimum investment",
        title: "₹50 lakh",
        body: [
          "PMS carries a SEBI-prescribed minimum investment of ₹50 lakh.",
          "This requires adequate financial capacity and the ability to withstand volatility in concentrated, strategy-driven portfolios.",
        ],
      },
      {
        kind: "cards",
        label: "Themes and strategies",
        heading: "How a mandate can be shaped.",
        accent: ["shaped."],
        items: [
          { title: "Thematic investing", body: "Positioned around long-term structural trends." },
          { title: "High-conviction equity", body: "Concentrated portfolios focused on selected stocks." },
          { title: "Value or growth", body: "Approaches chosen for prevailing conditions and opportunities." },
          { title: "Opportunistic and tactical", body: "Targeting mispriced opportunities as they arise." },
        ],
      },
      {
        kind: "prose",
        label: "Who it's for",
        heading: "Built for a longer horizon.",
        accent: ["horizon."],
        body: [
          "PMS suits HNIs with a long-term horizon, comfort with interim volatility, a desire for personalized management and a preference for direct-ownership visibility.",
          "Higher concentration and active management require discipline and an understanding of market cycles.",
        ],
      },
    ],
  },

  {
    slug: "aif",
    tag: "AIF",
    name: "Alternative Investment Funds",
    navName: "Alternative Investment Funds",
    metaTitle: "Alternative Investment Funds (AIF) | Platizio",
    metaDescription:
      "SEBI-regulated Alternative Investment Funds — private equity, venture capital, structured credit and long-short strategies across Categories I, II and III, with a ₹1 crore minimum.",
    hero: {
      label: "Alternative Investment Funds",
      headline: "Beyond equity and debt.",
      accent: ["debt."],
      intro:
        "Access non-traditional asset classes and advanced strategies for portfolio diversification.",
    },
    glyph: PRODUCT_GLYPHS.AIF,
    blocks: [
      {
        kind: "prose",
        label: "What is an AIF?",
        heading: "Private markets, within a regulated wrapper.",
        accent: ["wrapper."],
        body: [
          "Alternative Investment Funds (AIFs) are SEBI-regulated pooled vehicles that invest beyond conventional equity and debt — including private equity, venture capital, structured credit and long-short strategies.",
          "They are positioned for sophisticated investors with a greater risk appetite and longer horizons.",
        ],
      },
      {
        kind: "highlights",
        label: "The essentials",
        heading: "What defines an AIF.",
        accent: ["AIF."],
        items: [
          { title: "Non-traditional exposure", body: "Access to asset classes outside listed equity and debt." },
          { title: "SEBI-regulated structure", body: "Operates under the SEBI (AIF) framework." },
          { title: "Advanced-strategy access", body: "Strategies typically unavailable in liquid markets." },
          { title: "₹1 crore minimum investment", body: "A higher entry threshold reflecting the profile." },
        ],
      },
      {
        kind: "cards",
        label: "SEBI categories",
        heading: "Three categories, three risk profiles.",
        accent: ["profiles."],
        items: [
          {
            label: "Category I",
            title: "Socially or economically desirable",
            body: "Start-ups, venture capital, infrastructure and SMEs. Supports long-term capital formation and can have long gestation periods.",
          },
          {
            label: "Category II",
            title: "Private equity and credit",
            body: "Private equity, debt funds and structured credit; no leverage other than for day-to-day operations; pursues returns through strategic investments.",
          },
          {
            label: "Category III",
            title: "Complex, dynamic strategies",
            body: "Long-short equity, derivatives and leverage; more actively traded and higher-risk due to complexity.",
          },
        ],
      },
      {
        kind: "callout",
        label: "The trade-off",
        title: "Liquidity for opportunity",
        body: [
          "Lower liquidity and defined lock-ins may allow access to higher-return opportunities unavailable in liquid markets.",
          "Higher return potential can mean longer holding periods and more risk — this must be clearly acknowledged before investing.",
        ],
      },
      {
        kind: "prose",
        label: "Who it's for",
        heading: "Patient capital, clear-eyed about risk.",
        accent: ["risk."],
        body: [
          "AIFs suit HNIs able to invest ₹1 crore or more, patient over a long horizon, capable of understanding complex and illiquid strategies, and seeking alternatives to traditional assets.",
        ],
      },
    ],
  },

  {
    slug: "international",
    tag: "INTL",
    name: "International Investing",
    navName: "International Investing",
    metaTitle: "International Investing | Platizio",
    metaDescription:
      "Diversify globally through international equities, funds and market-linked instruments across developed and emerging economies — with a clear view of currency risk.",
    hero: {
      label: "International Investing",
      headline: "Diversify beyond one border.",
      accent: ["border."],
      intro:
        "Diversify globally and access opportunities beyond domestic markets.",
    },
    glyph: PRODUCT_GLYPHS.INTL,
    blocks: [
      {
        kind: "prose",
        label: "What is international investing?",
        heading: "Part of the portfolio, beyond India.",
        accent: ["India."],
        body: [
          "International investing means allocating part of a portfolio outside India — through global equities, funds or market-linked instruments across developed and emerging economies.",
          "The rationale is exposure to global businesses, innovation-led sectors and growth trends that are underrepresented domestically.",
        ],
      },
      {
        kind: "highlights",
        label: "Opportunity areas",
        heading: "Where global exposure comes from.",
        accent: ["from."],
        items: [
          { title: "US and European markets", body: "Established, deep and innovation-rich markets." },
          { title: "Emerging markets", body: "Higher-growth economies at earlier stages." },
          { title: "Technology and innovation leaders", body: "Global companies shaping their sectors." },
          { title: "Global sector themes", body: "Trends that span borders and industries." },
        ],
      },
      {
        kind: "reasons",
        label: "The benefits",
        heading: "Three reasons to look outward.",
        accent: ["outward."],
        items: [
          {
            title: "Reduce single-country dependence",
            body: "Less reliance on the fortunes of one country or economy.",
          },
          {
            title: "Smooth volatility across cycles",
            body: "Different regions lead in different market cycles, which can steady a portfolio.",
          },
          {
            title: "Access global leaders",
            body: "Exposure to international technology, healthcare, consumer and other leaders.",
          },
        ],
      },
      {
        kind: "steps",
        label: "The process",
        heading: "How we integrate global exposure.",
        accent: ["exposure."],
        items: [
          { title: "Market selection", body: "Identify the markets and instruments that fit your goals." },
          { title: "Risk and allocation assessment", body: "Size the exposure against your overall risk profile." },
          { title: "Portfolio integration", body: "Fold global holdings into your existing portfolio." },
          { title: "Periodic review", body: "Revisit and rebalance as conditions change." },
        ],
      },
      {
        kind: "callout",
        label: "Currency risk",
        title: "Returns move with exchange rates",
        body: [
          "Exchange rates affect returns in addition to underlying asset performance. Currency can add short-term volatility and possible longer-horizon diversification benefits.",
          "Evaluate currency within overall portfolio risk, not in isolation.",
        ],
      },
      {
        kind: "cards",
        label: "Markets we watch",
        heading: "Four regions, distinct strengths.",
        accent: ["strengths."],
        items: [
          { label: "United States", title: "Technology and innovation", body: "A deep market led by technology and innovation." },
          { label: "Europe", title: "Industrials and luxury", body: "Strength in industrials and global luxury brands." },
          { label: "China", title: "Growth markets", body: "Large, evolving growth markets." },
          { label: "Emerging markets", title: "High-growth potential", body: "Earlier-stage economies with high-growth potential." },
        ],
      },
    ],
  },
];

export const PRODUCT_MAP: Record<ProductSlug, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
) as Record<ProductSlug, Product>;

export function getProduct(slug: string): Product | undefined {
  return PRODUCT_MAP[slug as ProductSlug];
}

export const RISK_DISCLAIMER = RISK_NOTE;
