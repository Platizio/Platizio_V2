import type { RichBlock } from "@/lib/content-types";

const body: RichBlock[] = [
  { kind: "p", text: "As investors progress in their wealth journey, their expectations from investments also evolve. Beyond a point, the focus shifts from simply participating in market returns to customisation, concentration, and active decision-making." },
  { kind: "p", text: "This is where Portfolio Management Services (PMS) come into the picture." },
  { kind: "p", text: "In India, PMS represents a structured, regulated way for high-net-worth investors to have their capital managed in a discretionary or non-discretionary format, with portfolios-built security-by-security rather than through pooled units." },

  { kind: "h2", text: "What is PMS?" },
  { kind: "p", text: "Portfolio Management Services (PMS) is an investment service offered by SEBI-registered portfolio managers, where an investor's money is managed as a separate, identifiable portfolio." },
  { kind: "p", text: "Unlike mutual funds or AIFs:" },
  { kind: "ul", items: [
    "PMS does not pool investor money into a single fund",
    "Each investor holds direct ownership of securities in their own demat account",
    "Portfolio construction, trades, and holdings are visible at the individual investor level",
  ] },
  { kind: "p", text: "SEBI regulates PMS under the SEBI (Portfolio Managers) Regulations, 2020, and mandates minimum investment thresholds, disclosure norms, and reporting standards." },
  { kind: "p", text: "The minimum investment amount for PMS is currently ₹50 lakh per investor, which itself defines the target audience." },

  { kind: "h2", text: "How PMS Works (in simple terms)" },
  { kind: "p", text: "When an investor invests in a PMS:" },
  { kind: "ul", items: [
    "A dedicated portfolio is created in the investor's name",
    "Securities (equities, debt instruments, or other permitted assets) are bought and sold directly in that account",
    "Performance is tracked at the portfolio level, not at a scheme level",
  ] },
  { kind: "p", text: "Depending on the mandate, the PMS can operate in two broad formats:" },
  { kind: "ul", items: [
    "Discretionary PMS: The portfolio manager takes investment decisions on behalf of the investor",
    "Non-discretionary PMS: The manager provides advice, but execution requires investor approval",
  ] },
  { kind: "p", text: "Most equity PMS offerings in India are discretionary in nature." },

  { kind: "h2", text: "What Kind of Strategies Do PMS Typically Run?" },
  { kind: "p", text: "PMS strategies are usually more concentrated and high-conviction compared to mutual funds. This is possible because:" },
  { kind: "ul", items: [
    "There are fewer regulatory constraints on diversification",
    "Investors are assumed to be financially sophisticated",
    "Portfolios are tailored rather than standardised",
  ] },
  { kind: "p", text: "Common PMS strategy styles include:" },
  { kind: "ul", items: [
    "Concentrated equity portfolios (10–20 stocks)",
    "Value or growth-oriented strategies",
    "Thematic or special situation investing",
    "Long-term compounding portfolios with low churn",
  ] },
  { kind: "p", text: "The key distinction is that PMS focuses on portfolio construction, not product categorisation." },

  { kind: "h2", text: "Who is PMS Meant For? (Target Audience)" },
  { kind: "p", text: "PMS is designed primarily for:" },
  { kind: "ul", items: [
    "High Net-Worth Individuals (HNIs)",
    "Family offices",
    "Ultra-HNI investors seeking personalised portfolio management",
  ] },
  { kind: "p", text: "Typically, PMS suits investors who:" },
  { kind: "ul", items: [
    "Have surplus capital beyond core financial goals",
    "Are comfortable with higher portfolio concentration",
    "Can tolerate periods of underperformance relative to indices",
    "Want transparency and control over individual stock holdings",
    "Prefer direct equity ownership rather than pooled vehicles",
  ] },
  { kind: "p", text: "PMS is not designed for first-time investors or those seeking low-volatility, short-term solutions." },

  { kind: "h2", text: "Taxation of PMS: How It Actually Works" },
  { kind: "p", text: "One of the most important aspects of PMS—often misunderstood—is taxation." },

  { kind: "h3", text: "Key principle:" },
  { kind: "note", text: "There is no fund-level taxation in PMS." },
  { kind: "p", text: "Since the investor directly owns the securities:" },
  { kind: "ul", items: [
    "All taxes are levied at the investor level",
    "Tax treatment depends on the nature of income and holding period of each transaction",
  ] },

  { kind: "h3", text: "Equity taxation in PMS:" },
  { kind: "ul", items: [
    "Short-Term Capital Gains (STCG): If an equity share is sold within 12 months → taxed at 20% (plus surcharge and cess)",
    "Long-Term Capital Gains (LTCG): If held for more than 12 months → 12.5% tax on gains exceeding ₹1.25 lakh in a financial year (as per current equity LTCG rules)",
  ] },

  { kind: "h3", text: "Other income:" },
  { kind: "ul", items: [
    "Dividends are taxed as per the investor's applicable slab rate",
    "If the PMS invests in non-equity instruments, taxation follows the respective asset-specific rules",
  ] },

  { kind: "h3", text: "Important implication:" },
  { kind: "p", text: "Because every buy and sell creates a taxable event, portfolio churn directly impacts post-tax returns. This makes strategy design and turnover discipline extremely important in PMS." },

  { kind: "h2", text: "PMS vs Mutual Funds vs AIFs (at a conceptual level)" },
  { kind: "ul", items: [
    "Mutual Funds: Pooled, unit-based, mass-market, fund-level taxation, standardised portfolios",
    "PMS: Individual portfolios, direct security ownership, investor-level taxation, high customisation",
    "AIFs: Pooled but private structures, often illiquid, strategy-specific, typically for sophisticated or accredited investors",
  ] },
  { kind: "p", text: "PMS sits in the middle—offering customisation without pooling, but with higher responsibility placed on the investor to understand risks." },

  { kind: "h2", text: "Why PMS Has Gained Relevance Among HNIs" },
  { kind: "p", text: "The growing interest in PMS is driven by:" },
  { kind: "ul", items: [
    "Rising number of HNIs in India",
    "Desire for bespoke portfolios rather than one-size-fits-all products",
    "Preference for direct equity exposure",
    "Ability to align portfolios with personal views and liquidity needs",
  ] },
  { kind: "p", text: "For many investors, PMS acts as a satellite allocation alongside mutual funds, AIFs, and other assets." },

  { kind: "h2", text: "Final Takeaway" },
  { kind: "p", text: "Portfolio Management Services are not about convenience—they are about control and conviction." },
  { kind: "p", text: "PMS makes sense for investors who:" },
  { kind: "ul", items: [
    "Understand market cycles",
    "Can handle portfolio concentration",
    "Are focused on long-term wealth creation rather than short-term performance comparisons",
  ] },
  { kind: "p", text: "When used appropriately, PMS can be a powerful tool in an HNI's investment framework—but it demands clarity on risk, taxation, and expectations." },
];

export default body;
