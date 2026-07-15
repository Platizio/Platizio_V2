# Platizio legacy-site content inventory

Source reviewed: `C:\Users\pc\Desktop\platizio\platizio-website` (Astro site), including its page source, shared layout, product pages, Insight articles, contact flow, legal pages, assets, and bundled PRD.

This is the content brief for rebuilding the remaining pages in the Next.js iteration. It records the legacy site's claims, copy intent, routes, contact details, and content hierarchy. Legal wording must be carried across from the legacy source pages verbatim and reviewed before publishing; this document is an implementation brief, not legal advice.

## 1. Company identity and positioning

- **Legal entity:** Platizio Services LLP.
- **Platform description:** Financial Products Distribution Platform.
- **Core positioning:** “Navigate every market with confidence.”
- **Value proposition:** A disciplined approach to investing that focuses on superior returns and capital preservation through regulated, transparent frameworks.
- **What Platizio is:** A licensed and certified distributor of Mutual Funds and Specialised Investment Funds (SIFs). It provides research-backed insights and personalized guidance, aiming to make institutional-grade investing accessible through a transparent, regulated framework.
- **Audience:** Investors, prospective investors, working professionals, HNIs, and sophisticated investors depending on product suitability. The terms also reference sub-distributors, channel partners, dealers, vendors, product providers, and regulators.
- **Trust claims:** AMFI registered; operates under the SEBI regulatory framework; committed to transparency, investor protection, suitability, and disciplined risk management.
- **Mandatory mutual-fund disclaimer:** “Mutual Fund investments are subject to market risks. Please read all scheme related documents carefully before investing.”

### Brand beliefs

- **Mission:** Help investors make informed, risk-aware investment decisions through transparent, research-driven solutions across modern and traditional asset classes.
- **Vision:** Be a trusted investment platform that enables resilient, future-ready portfolios across market cycles.
- **Values:** Integrity, clarity, trust, suitability, transparency, long-term outcomes, and disciplined risk management. The legacy PRD adds that Platizio seeks lasting relationships rather than short-term transactions.

### Regulatory and business facts

- Registered office: Unit No. DGL-229, Second Floor, DLF Galleria Mall, Mayur Vihar-1, Delhi, India - 110092.
- LLPIN: **AAQ-9558**; incorporated **5 December 2019**.
- AMFI registration number: **ARN 341407** (from the legacy terms page).
- Platizio describes itself as a technology-enabled platform and distributor, not as a securities broker, investment adviser, portfolio manager, or research analyst.
- General business hours in the terms: Monday-Friday, 9:00 AM-5:00 PM IST.

## 2. Legacy site map and rebuild scope

| Route | Legacy purpose | Rebuild priority |
| --- | --- | --- |
| `/` | Homepage / landing page | Already rebuilt in the Next.js iteration |
| `/about` | Company story, founder, team, compliance | High |
| `/products/sif` | SIF detail | High |
| `/products/mutual-funds` | Mutual Funds detail | High |
| `/products/pms` | PMS detail | High |
| `/products/aif` | AIF detail | High |
| `/products/international` | International Investing detail | High |
| `/insights` | Media Insights index | High |
| `/insights/*` | Nine article routes | High |
| `/contact` | Consultation form and contact information | High |
| `/privacy-policy` | Master privacy policy | Required legal route |
| `/terms-and-condition` | Master terms | Required legal route |
| `/global-investing/privacy-policy` | Platizio Global privacy policy | Required if global-investing flow launches |
| `/global-investing/terms-and-condition` | Platizio Global terms | Required if global-investing flow launches |

The legacy navigation exposes Home, About, Products, Insights, and Book Consultation. Its footer additionally exposes all legal routes and the YouTube channel.

## 3. Homepage content retained as cross-page reference

### Hero

- Headline: **Navigate every market with confidence.**
- Supporting copy: “A disciplined approach to investing that focuses on superior returns and capital preservation through regulated, transparent frameworks.”
- CTAs: **Book a Consultation** and **Learn More**.
- Trust/data indicators: **SEBI Compliant**, **AMFI Registered**, and **Growth +24.8% YTD**. Do not create other performance statistics.

### Homepage product cards

1. Specialised Investment Funds - “SEBI-regulated funds with advanced portfolio strategies.”
2. Mutual Funds - “Professionally managed diversified portfolios for disciplined investing.”
3. PMS - “Personalized portfolio management for HNIs.”
4. AIF - “Alternative investment funds for non-traditional asset classes and strategies.”
5. International Investing - “Global diversification through exposure to international markets and economies.”

### Credibility and testimonials

- **AMFI Registration:** Platizio Services LLP is registered with the Association of Mutual Funds in India (AMFI), ensuring adherence to the highest standards of ethical mutual fund distribution.
- **SEBI Compliance:** Platizio operates under the regulatory framework of the Securities and Exchange Board of India (SEBI), maintaining full transparency and investor protection across its offerings.
- **Amit Kumar, Investor:** “What I appreciate most about Platizio is transparency. Every recommendation is explained clearly - why it fits my goals, what risks exist, and how it behaves in different market conditions. This level of clarity is rare in financial advisory.”
- **Ashish Kumar, Working Professional:** “As a working professional, I don't have time to track markets daily. Platizio's structured process - profiling, asset allocation, and periodic reviews - allows me to stay invested with confidence without constant monitoring.”

## 4. About Platizio

### Page purpose and hero

- Page title: **About Platizio**.
- Hero message: “Your trusted partner in building resilient, future-ready portfolios.”
- Display AMFI Registered and SEBI Compliant as credibility markers.

### What is Platizio?

“Platizio is a licensed and certified distributor of Mutual Funds and Specialised Investment Funds (SIFs), helping investors access advanced strategies through a transparent, regulated framework. We combine research-backed insights with personalized guidance to make institutional-grade investing accessible to every investor.”

Label Platizio Services LLP as a **Financial Products Distribution Platform**.

### Leadership

- Role displayed: **Founder & CEO** (the legacy page does not display a founder name; it uses the asset `vivid-sir.jpg`).
- Credential: Certified Financial Planner (CFP®).
- Experience: Over 25 years across financial services and international business.
- Expertise/interests: Indian equities, bonds, commodities, equity derivatives, and algorithmic trading.

### Team

| Name | Designation |
| --- | --- |
| Deepika Agarwal | Financial Market Analyst |
| Anuj Pal | Senior Financial Market Analyst |
| Aanyaa Bhardwaj | Social Media Executive |
| Kartik Vishnani | Financial Market Analyst |
| Kavya Khatri | Social Media Executive |
| Sumit Katyal | Product Software Developer |
| Vinayak Tyagi | Product Software Developer |

Team section copy: “The research, advisory, and operations team building resilient, future-ready portfolios.”

### Compliance and ecosystem

- Reuse the AMFI and SEBI copy in section 3.
- The About page specifies that SEBI compliance covers all offerings, including Specialized Investment Funds (SIFs).
- **SIF Insights** is the education ecosystem: educational videos on Specialised Investment Funds and market strategies.
- YouTube: `https://www.youtube.com/@sifinsights`.

## 5. Investment-product pages

Every product page should end in a consultation CTA. Use suitability and risk language faithfully; do not imply returns or guarantee outcomes.

### 5.1 Specialised Investment Funds (SIF)

**Hero:** “Advanced portfolio strategies beyond traditional mutual funds, designed for sophisticated investors.”

**Definition:** A SEBI-regulated investment vehicle offering advanced portfolio strategies beyond traditional mutual funds. It gives fund managers greater flexibility to use long-short positions, derivatives, and dynamic asset allocation while operating in a regulated mutual-fund-like framework. It is aimed at investors who understand market risks and seek sophisticated, risk-managed wealth-creation approaches across market conditions.

**Highlights:**

- SEBI-regulated framework.
- Advanced strategies: long-short and derivatives.
- Dynamic asset allocation.
- Suitable for informed investors.

**Why choose SIF?**

- **Outcome-Focused Investing:** Focuses on absolute outcomes rather than only beating market benchmarks; the stated aim is consistent wealth creation regardless of market direction.
- **All-Weather Performance:** Designed to capture opportunities across market cycles while managing downside risks through hedging and dynamic allocation.
- **Smarter Risk Management:** Diversification across strategies, exposures, and market conditions aims to avoid structural traps and reduce portfolio volatility.

**Strategy types:**

- **Equity SIF:** Active management, hedging, and long-short approaches to navigate volatility and capture upside.
- **Debt SIF:** Fixed-income strategies with flexibility to manage interest-rate risk, credit risk, and liquidity for stable returns.
- **Hybrid SIF:** Equity-plus-debt strategies intended to balance growth potential and risk management across market cycles.

**CTAs:** Visit SIF Insights / Book Portfolio Consultation.

### 5.2 Mutual Funds

**Hero:** “Professionally managed, diversified investment solutions for disciplined wealth creation.”

**Definition:** Professionally managed vehicles that pool money from multiple investors across diversified portfolios of equities, bonds, and money-market instruments. An experienced fund manager invests according to the fund’s stated objective. The page positions mutual funds as disciplined, diversified, transparent, and broadly accessible.

**Benefits:** Professional fund management; diversified portfolio; transparent and regulated framework; flexible investment amounts; SIP options.

**Fund categories:**

| Category | Description | Best suited for |
| --- | --- | --- |
| Equity Mutual Funds | Predominantly listed-company shares for long-term capital growth; can have short-term volatility. | Long horizon and higher risk tolerance. |
| Hybrid Mutual Funds | Equity and debt together to balance growth potential and relative stability; allocation varies by strategy and conditions. | Moderated risk with growth opportunities. |
| Debt Mutual Funds | Government securities, corporate bonds, and money-market instruments; aims for predictable returns and capital preservation. | Income generation and lower volatility. |
| Consumption-Focused Funds | Companies benefiting from domestic demand: FMCG, retail, automobiles, and consumer services. | Long-term consumption-driven growth themes. |
| Thematic Mutual Funds | Themes such as infrastructure, manufacturing, digital transformation, or sustainability across sectors. | Investors with conviction in structural trends. |
| Sectoral Mutual Funds | One sector, for example banking, technology, or healthcare; returns are sector-cycle sensitive. | Experienced investors who understand sectoral risk and timing. |

**Suitability:** Can support long-term wealth creation, regular income generation, diversification, and goal-based investing. Suitability differs by category: equity/sectoral funds can have higher volatility; debt/hybrid funds generally have relatively lower risk. Investors should assess risk appetite, horizon, and financial goals and seek guidance where required.

### 5.3 Portfolio Management Services (PMS)

**Hero:** “Personalized, transparent investment management for High Net-Worth Individuals.”

**Definition:** Personalized solutions in which a professional portfolio manager manages a client’s investments directly in the client’s name. Unlike pooled vehicles, PMS portfolios are customized, transparent, and tailored to objectives, risk profile, and market outlook. The format supports greater flexibility in security selection, concentration, and style.

**Key features:** Direct ownership in the investor’s name; customized strategy; transparent holdings; greater flexibility in stock selection.

**Minimum investment:** **₹50 lakh**, stated as the SEBI-prescribed minimum. The page says this requires adequate financial capacity and ability to withstand volatility in concentrated, strategy-driven portfolios.

**Themes and strategies:**

- Thematic investing for long-term structural trends.
- High-conviction equity portfolios focused on selected stocks.
- Value or growth approaches based on market conditions and opportunities.
- Opportunistic and tactical approaches for mispriced opportunities.

**Suitability:** HNIs with a long-term horizon, comfort with interim volatility, desire for personalized management, and preference for direct-ownership visibility. Higher concentration and active management require discipline and understanding of market cycles.

### 5.4 Alternative Investment Funds (AIF)

**Hero:** “Access non-traditional asset classes and advanced strategies for portfolio diversification.”

**Definition:** SEBI-regulated pooled vehicles investing beyond conventional equity and debt, including private equity, venture capital, structured credit, and long-short strategies. They are positioned for sophisticated investors with greater risk appetite and longer horizons.

**Highlights:** Non-traditional exposure; SEBI-regulated structure; advanced-strategy access; **₹1 crore minimum investment**.

**SEBI categories:**

- **Category I:** Socially/economically desirable sectors: start-ups, venture capital, infrastructure, and SMEs. Supports long-term capital formation and can have long gestation periods.
- **Category II:** Private equity, debt funds, and structured credit; no leverage other than for day-to-day operations; pursues returns through strategic investments.
- **Category III:** Complex, dynamic strategies, including long-short equity, derivatives, and leverage; more actively traded and higher-risk due to complexity.

**Liquidity trade-off:** Lower liquidity and defined lock-ins may allow access to higher-return opportunities unavailable in liquid markets. The page requires clear acknowledgement that higher return potential can mean longer holding periods and more risk.

**Suitability:** HNIs able to invest ₹1 crore or more, patient over a long horizon, capable of understanding complex/illiquid strategies, and seeking alternatives to traditional assets.

### 5.5 International Investing

**Hero:** “Diversify globally and access opportunities beyond domestic markets.”

**Definition:** Allocate part of a portfolio outside India through global equities, funds, or market-linked instruments across developed and emerging economies. The rationale is exposure to global businesses, innovation-led sectors, and growth trends underrepresented domestically.

**Opportunity areas:** US and European markets; emerging markets; technology and innovation leaders; global sector themes.

**Benefits:**

- Reduce dependence on one country/economy.
- Smooth volatility because regions lead in different market cycles.
- Gain access to international technology, healthcare, consumer, and other leaders.

**Investment process:** Market selection; risk and allocation assessment; integration into the existing portfolio; periodic review.

**Currency risk:** Exchange rates affect returns in addition to underlying asset performance. Currency can add short-term volatility and possible longer-horizon diversification benefits; evaluate it within overall portfolio risk, not alone.

**Markets called out:** United States (technology and innovation), Europe (industrials and luxury), China (growth markets), and emerging markets (high-growth potential).

## 6. Media Insights

### Index page

- Page title: **Media Insights**.
- Description: “Stay informed with our latest articles, market analysis, and educational content.”
- Categories: All, SIF, Mutual Fund, AIF, PMS, International.
- Include article category, title, date, cover asset, excerpt, and a Read More link.
- The legacy page includes a non-functional “Load More Articles” control and a subscription CTA. Treat these as future integrations unless a mailing-list provider is selected.
- Repeat the SIF Insights YouTube CTA.

### Article inventory

#### SIF - “Why SIF Could Gain a Prominent Position in 2026?” (January 2026)

Core thesis: SIF may move from a new-launch curiosity to a mainstream allocation bucket for mass-affluent investors who want strategy-led investing. The article cites the SEBI SIF framework dated 27 February 2025 and says early 2025 traction came through flows and participation.

Key sections: strategy-first format; potential fit in range-bound/bearish phases; long-short, hedging, relative-value approaches and controlled derivatives; strategy choices such as equity/hybrid long-short and ex-top-100 styles; REIT classification clarity from 1 January 2026; early AMFI November 2025 numbers of ₹2,932 crore assets, 45.8% month-on-month growth from ₹2,010 crore, and ₹902 crore net flows (₹636 crore hybrid); the aspirational ₹1 lakh crore discussion; and a caution that it is not a guaranteed forecast. The copy explicitly says hedging does **not** guarantee superior bearish-market returns.

#### Mutual Fund - “Mutual Funds Are Evolving - And That's a Good Thing for Investors” (January 2026)

Explains the shift from broad categories to strategy-driven tools. Covers factor investing (value, momentum, quality, low volatility); thematic/sectoral exposure; ETFs and passive funds; global diversification, asset-allocation solutions, and hybrid/dynamic strategies. The conclusion: more choice means more responsibility, and innovation does not remove risk; understand why a fund exists, not only what it holds.

#### AIF - “Alternative Investment Funds (AIFs) in India - What They Are, Why They Matter, and Where the Trend Is Headed” (January 2026)

Explains AIFs as private pooled vehicles under SEBI (AIF) Regulations, 2012, used for unlisted equity, private debt, structured credit, venture capital, and long-short strategies. It explains Category I/II/III, the Accredited Investor framework, and the trade-offs of liquidity, complexity, fees, and manager selection.

Facts cited in the article: as of 30 June 2025, SEBI cumulative net figures were commitments ₹14,17,961 crore, funds raised ₹5,91,383 crore, and investments ₹5,72,246 crore. It also lists individual Accredited Investor thresholds cited from SEBI’s 26 August 2021 framework: annual income ≥₹2 crore; or net worth ≥₹7.5 crore with ≥₹3.75 crore financial assets; or income ≥₹1 crore plus net worth ≥₹5 crore with ≥₹2.5 crore financial assets.

#### International - “Why International Investing Will Matter More Than Ever by 2026” (January 2026)

Positions global investing as diversification for an India-centric portfolio, not a rejection of India. Covers rotating country leadership, global economic interconnection, distributed growth, currency effects, and access to global innovation. It cites rupee movement from ₹3.32/USD in 1947 to close to ₹90/USD and estimates roughly 4.2% annual long-term depreciation. It also cites an illustrative since-2011 comparison: an India mutual fund tracking Nasdaq at approximately 23% INR CAGR vs Nifty at roughly 12% CAGR. These are article-specific claims and must be revalidated before reuse.

#### PMS - “Portfolio Management Services (PMS) Explained: What They Are, How They Are Taxed, and Who They Are Meant For” (January 2026)

Explains PMS as a separate, identifiable investor portfolio under the SEBI (Portfolio Managers) Regulations, 2020; distinguishes discretionary from non-discretionary PMS; describes concentrated 10-20-stock, value/growth, thematic, special-situation, and long-term compounding approaches; and identifies HNIs, family offices, and ultra-HNIs as the core audience.

Tax points presented in the article: investor-level rather than fund-level taxation; equity STCG within 12 months at 20% plus surcharge/cess; equity LTCG after 12 months at 12.5% on gains above ₹1.25 lakh in a financial year; dividends at the investor’s applicable slab. These figures should be revalidated by a qualified tax professional before publishing.

#### Short-form legacy articles

| Title | Category | Date | Legacy description |
| --- | --- | --- | --- |
| International Investing: Benefits and Considerations | International | November 2024 | Why global diversification matters and how to approach international markets. |
| Market Outlook 2025: Key Trends to Watch | Mutual Fund | December 2024 | Analysis of major market trends and investment opportunities for the coming year. |
| The Power of Asset Allocation | AIF | November 2024 | How disciplined asset allocation can help navigate market cycles effectively. |
| Risk Management in Portfolio Construction | PMS | October 2024 | Essential principles for managing risk while building a resilient portfolio. |

## 7. Consultation and contact page

### Page framing

- Title: **Book a Consultation**.
- Supporting copy: “Let's discuss your investment goals and find the right strategy for you.”
- Form heading: **Get in Touch**.

### Form specification

| Field | Type | Required | Details |
| --- | --- | --- | --- |
| Full Name | Text | Yes | Placeholder: “Enter your full name” |
| Email Address | Email | Yes | Placeholder: “Enter your email address” |
| Phone Number | Tel | Yes | Placeholder: “Enter your phone number” |
| Product of Interest | Select | No | SIF, Mutual Funds, PMS, AIF, International Investing, or Not sure / Need guidance |
| Message | Textarea | No | Placeholder: “Tell us about your investment goals...” |

- Submit label: **Submit Request**.
- Consent copy: “By submitting, you agree to be contacted by our team regarding your investment inquiry.”
- Legacy endpoint: `https://formspree.io/f/YOUR_FORM_ID` - this is a placeholder, not a configured production endpoint. A real server action/CRM/Formspree endpoint and privacy-consent review are needed.

### Supporting contact blocks

- **Schedule a Meeting:** Calendar/Google Calendar integration was only a placeholder, labelled “coming soon”; “View Available Slots” has no destination. Treat as a future integration.
- **WhatsApp:** `https://wa.me/919205523100?text=Hi%2C%20I%20am%20interested%20in%20learning%20about%20Platizio%20investment%20services.`
- **Email:** `vc@platizio.com`.
- **Phone:** `+91 92055 23100`.
- **Noida office:** Unit No. 415, Tower-B, KLJ Noida One, Plot #B-8, Sector-62, Noida, UP 201309, India.
- **Delhi office:** Unit DGL-229, Second Floor, DLF Galleria Mall, Mayur Vihar-1, Delhi, India - 110092.
- **YouTube:** SIF Insights, `https://youtube.com/@sifinsights?si=yGwhL8Mu_hJ9Zpw6`.

## 8. Footer and universal elements

- Company summary: “Platizio Services LLP is a licensed and certified distributor of Mutual Funds and Specialised Investment Funds (SIFs), helping investors access advanced strategies through a transparent, regulated framework.”
- Quick links: About Us, Media Insights, Contact Us, Terms & Condition, Privacy Policy, Privacy Policy - Global Investing, Terms & Condition - Global Investing.
- Product links: SIF, Mutual Funds, PMS, AIF, International.
- Footer trust chips: AMFI Registered and SEBI Compliant.
- Copyright: `© [current year] Platizio Services LLP. All rights reserved.`

## 9. Legal content requirements

The full legal copy is in the legacy routes below. Preserve it verbatim when recreating the legal pages, subject to review by Platizio’s counsel/compliance owner. The following is a navigable scope inventory, not a substitute for that copy.

### Master Privacy Policy (`/privacy-policy`)

The policy covers: scope; definitions under India’s DPDP Act; user categories; identity/contact/KYC/financial/risk-profile/regulatory/transaction/device/communications data; data sources; operational, KYC/AML, transaction, suitability, fraud-prevention, regulatory, analytics, and agreement-enforcement uses; legal bases; sharing with providers, intermediaries, banks, KYC/technology vendors, advisers, affiliates, and regulators; cross-border transfers; cookies; marketing; retention; security; AI and analytics; minors; data-principal rights; consent withdrawal; account closure/deletion; third parties; breach response; updates; and grievance redressal.

Important stated retention periods: KYC/AML/account-opening records at least 8 years after closure/relationship termination; transactions/statements at least 10 years; partner records at least 8 years after termination; communications/call recordings/support logs 5 years; cookie/analytics data up to 24 months. The policy names **Anuj Pal, Operations and Compliance Officer** as Grievance Officer, `grievances@platizio.com`, and says grievances are acknowledged within 24 hours and targeted for resolution within 15 business days. General support: `support@platizio.com`.

### Master Terms and Conditions (`/terms-and-condition`)

The terms govern access to Platizio’s web/mobile/digital/distributor/support platform. They cover acceptance, the legal entity, definitions, platform nature, product-specific terms, no-investment-advice position, eligibility, account/KYC/security, partner access, third-party execution, fees/commission disclosure, investment risks, electronic consent, privacy, platform availability, IP, suspension/termination, indemnity, liability limits, force majeure, Delhi-law/dispute resolution, miscellaneous terms, and grievances.

Key implementation positions to retain: product providers execute/control their own products; Platizio does not guarantee investment outcomes; users are responsible for decisions, credentials, eligibility, taxes and fees; electronic communications/records are binding; disputes are first addressed with the grievance officer, then arbitration under the Arbitration and Conciliation Act, 1996, seated in Delhi, with Delhi courts retaining stated jurisdiction.

### Platizio Global Privacy Policy (`/global-investing/privacy-policy`)

The global-investing policy separately covers: scope and terms; personal-data categories/sources; processing purposes and legal bases; disclosures; international transfers; retention/security; cookies; marketing; rights and withdrawal; minors; third parties; incidents; policy changes; and grievance contact. It is necessary when any global-investing onboarding, remittance, or brokerage flow is available.

### Platizio Global Terms (`/global-investing/terms-and-condition`)

The terms define Platizio Global as a service/distribution/technology layer connected to **ViewTrade** for eligible international products. They explicitly state that Platizio does not execute orders, hold client funds, or custody securities. Required content scope: no-advice position; eligibility; KYC and declarations; U.S.-listed stocks, ETFs and fractional shares where enabled; LRS/FEMA and funding responsibility; fees/taxes/remuneration; ViewTrade order execution, settlement and statements; custody/ownership; dividends/taxes/reporting; risk disclosures; user security; availability; electronic communications; privacy; suspension/closure; IP; indemnity; liability limitation; force majeure; Delhi-law/arbitration; updates; and contact details.

Global support: `supportglobal@platizio.com`. The terms name **Anuj Pal, Operations and Compliance Head** as Grievance Officer and list `grievances@platizio.com`, phone `+91 9289837100`, acknowledgement within 24 hours, and response within 15 working days. They say the user is responsible for LRS limits, tax reporting, foreign-asset reporting, and understanding market, currency, country, regulatory, tax, remittance, custody, settlement, fractional-share, technology, cybersecurity, and third-party risks.

## 10. Reusable assets from the legacy site

Use the actual assets only if their use is approved for the new visual direction.

- Brand/logo: `public/Platizio Logo.png`, `public/logo.jpeg`, `public/brand-theme.jpeg`.
- Founder image: `public/vivid-sir.jpg`.
- Team portraits: `Deepika Agarwal.png`, `Anuj Pal.jpeg`, `Aanyaa_Bhardwaj.jpg`, `Kartik_Vishnani.jpg`, `Kavya Khatri.png`, `Sumit Katyal.jpg`, `Vinayak Tyagi.jpeg`.
- Compliance art: `public/amfi.jpg`, `public/sebi.gif`.
- Journey graphic: `public/Your Investment Journey with Platizio.png`.
- Insight covers: `Article 1-SIF.png`, `Article 2-International.png`, `Article 3-Mutual Funds.png`, `Article 4_AIF.png`, `Article 5_PMS.png` (filenames in the legacy project include spaces/underscores; preserve exact paths when copying).

## 11. Implementation notes and content checks

- The legacy site uses Astro, React for the team carousel, Tailwind, and a static Formspree placeholder. The new site is Next.js; this brief is content-only and does not prescribe a technical migration.
- The legacy PRD lists calculators, product comparison, WhatsApp automation, explainer videos, a mini dashboard/login, and calendar integration as future features. They are not implemented in the legacy public website.
- The homepage’s `+24.8% YTD` is the only performance statistic placed in the current Next.js product brief. The Insight articles contain additional dated market/tax/regulatory figures; validate each one for current accuracy and compliance before reuse.
- Use `Specialised` consistently for the official product name. The legacy source occasionally uses `Specialized` in compliance copy; preserve legal/source wording where it appears.
- Before launch, compliance should validate AMFI/SEBI claims, ARN, LLP/address/contact data, testimonials, product thresholds, legal documents, data-processing practices, form consent, marketing opt-in, WhatsApp text, global-investing/ViewTrade relationship, and all market/tax/regulatory statements.

## 12. Legacy source map

| Content | Legacy source |
| --- | --- |
| Shared navigation/footer | `src/layouts/MainLayout.astro` |
| Home | `src/pages/index.astro` |
| About/team | `src/pages/about.astro`, `src/components/TeamCarousel.tsx` |
| Products | `src/pages/products/*.astro` |
| Media index/articles | `src/pages/insights/*.astro` |
| Contact | `src/pages/contact.astro` |
| Master legal | `src/pages/privacy-policy.astro`, `src/pages/terms-and-condition.astro` |
| Global legal | `src/pages/global-investing/*.astro` |
| Original requirements | `PRD- PLATIZIO.pdf` |
