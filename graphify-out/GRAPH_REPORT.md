# Graph Report - .  (2026-07-14)

## Corpus Check
- 45 files · ~385,926 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 206 nodes · 258 edges · 26 communities (20 shown, 6 thin omitted)
- Extraction: 89% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.86)
- Token cost: 947,768 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Platizio Business & Services|Platizio Business & Services]]
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Navigation & About Components|Navigation & About Components]]
- [[_COMMUNITY_Motion System & Home Page|Motion System & Home Page]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Next.js App Configuration|Next.js App Configuration]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_3D Market Constellation Scene|3D Market Constellation Scene]]
- [[_COMMUNITY_Trust & Credentials Section|Trust & Credentials Section]]
- [[_COMMUNITY_Anuj Pal Team Profile|Anuj Pal Team Profile]]
- [[_COMMUNITY_Color & Design Tokens|Color & Design Tokens]]
- [[_COMMUNITY_Aanyaa Bhardwaj Profile|Aanyaa Bhardwaj Profile]]
- [[_COMMUNITY_Deepika Agarwal Profile|Deepika Agarwal Profile]]
- [[_COMMUNITY_Founder Profile|Founder Profile]]
- [[_COMMUNITY_Kartik Vishnani Profile|Kartik Vishnani Profile]]
- [[_COMMUNITY_Kavya Khatri Profile|Kavya Khatri Profile]]
- [[_COMMUNITY_Sumit Katyal Profile|Sumit Katyal Profile]]
- [[_COMMUNITY_Vinayak Tyagi Profile|Vinayak Tyagi Profile]]
- [[_COMMUNITY_Platizio Brand Identity|Platizio Brand Identity]]
- [[_COMMUNITY_Vercel Scaffold Asset|Vercel Scaffold Asset]]
- [[_COMMUNITY_File Icon Scaffold Asset|File Icon Scaffold Asset]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_Window Icon Scaffold Asset|Window Icon Scaffold Asset]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Globe Icon Scaffold Asset|Globe Icon Scaffold Asset]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Platizio Services LLP` - 10 edges
3. `EXPO` - 8 edges
4. `fadeUp` - 8 edges
5. `useIntroDone()` - 7 edges
6. `RevealWords()` - 7 edges
7. `Platizio Marketing Homepage` - 6 edges
8. `scripts` - 5 edges
9. `IntroProvider()` - 5 edges
10. `Product Non-Negotiables` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Midnight Observatory Design Concept` --semantically_similar_to--> `Platizio Services LLP`  [INFERRED] [semantically similar]
  DESIGN.md → LEGACY_SITE_CONTENT.md
- `Midnight Observatory Design Concept` --rationale_for--> `MarketConstellation()`  [INFERRED]
  DESIGN.md → src/components/three/MarketConstellation.tsx
- `Motion System (Expo Ease + Lenis + Intro Gating)` --references--> `EXPO`  [EXTRACTED]
  DESIGN.md → src/components/ui/Reveal.tsx
- `Motion System (Expo Ease + Lenis + Intro Gating)` --references--> `IntroProvider()`  [EXTRACTED]
  DESIGN.md → src/components/IntroProvider.tsx
- `Motion System (Expo Ease + Lenis + Intro Gating)` --references--> `SmoothScroll()`  [EXTRACTED]
  DESIGN.md → src/components/SmoothScroll.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Platizio Product Lineup** — legacy_site_content_platizio_services_llp, legacy_site_content_sif, legacy_site_content_mutual_funds, legacy_site_content_pms, legacy_site_content_aif, legacy_site_content_international_investing [EXTRACTED 1.00]
- **Midnight Observatory Design System** — design_midnight_observatory, design_color_strategy, design_color_tokens, design_typography, design_motion_system, design_design_bans [EXTRACTED 1.00]
- **Preloader-Gated Intro and Motion Choreography** — src_components_preloader_preloader, src_components_introprovider_introprovider, src_components_smoothscroll_smoothscroll, src_components_ui_reveal_expo, design_motion_system [EXTRACTED 1.00]

## Communities (26 total, 6 thin omitted)

### Community 0 - "Platizio Business & Services"
Cohesion: 0.11
Nodes (24): Next.js Breaking-Changes Agent Rule, CLAUDE.md Project Instructions, Typography System (Fraunces + DM Sans), Alternative Investment Funds (AIF), AMFI (Association of Mutual Funds in India), Anuj Pal (Grievance Officer / Senior Financial Market Analyst), Book a Consultation Form, International Investing (+16 more)

### Community 1 - "Landing Page Sections"
Cohesion: 0.13
Nodes (11): TICKS, Step, STEPS, GLYPHS, Product, PRODUCTS, EXPO, fadeUp (+3 more)

### Community 2 - "Navigation & About Components"
Cohesion: 0.13
Nodes (13): IntroContext, useIntroDone(), LINKS, MotionLink, Nav(), AboutHero(), PRINCIPLES, STARS (+5 more)

### Community 3 - "Motion System & Home Page"
Cohesion: 0.11
Nodes (11): landonorris.com Interaction Language, Motion System (Expo Ease + Lenis + Intro Gating), IntroProvider(), Preloader(), PRODUCT_LINKS, QUICK_LINKS, QUOTES, Testimonials() (+3 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, lenis, motion, react, react-dom, @react-three/drei, @react-three/fiber, three (+8 more)

### Community 6 - "Next.js App Configuration"
Cohesion: 0.15
Nodes (8): nextConfig, Next.js Framework, next, Next.js Wordmark Logo (NEXT.js), metadata, dmSans, fraunces, metadata

### Community 7 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "3D Market Constellation Scene"
Cohesion: 0.29
Nodes (3): Midnight Observatory Design Concept, MarketConstellation(), subscribeReducedMotion()

### Community 9 - "Trust & Credentials Section"
Cohesion: 0.47
Nodes (3): AmfiSeal(), SebiSeal(), ticks()

### Community 10 - "Anuj Pal Team Profile"
Cohesion: 0.50
Nodes (4): Anuj Pal (Senior Financial Market Analyst), Platizio Team, Anuj Pal Portrait Photo, AboutPage()

### Community 11 - "Color & Design Tokens"
Cohesion: 0.67
Nodes (3): Color Strategy (Drenched Dark + Light Act + Violet Drench), OKLCH Color Tokens (Tailwind v4 @theme), Project-Specific Design Bans

### Community 12 - "Aanyaa Bhardwaj Profile"
Cohesion: 0.67
Nodes (3): Aanyaa Bhardwaj, Platizio Team (About Page), Aanyaa Bhardwaj Portrait

### Community 13 - "Deepika Agarwal Profile"
Cohesion: 0.67
Nodes (3): About Page Team Section, Deepika Agarwal (Person), Deepika Agarwal Portrait Photo

### Community 14 - "Founder Profile"
Cohesion: 0.67
Nodes (3): Platizio About Page, Platizio Founder, Founder Portrait Photo

### Community 15 - "Kartik Vishnani Profile"
Cohesion: 0.67
Nodes (3): About Page Team Section, Kartik Vishnani (Person), Kartik Vishnani Portrait Photo

### Community 16 - "Kavya Khatri Profile"
Cohesion: 1.00
Nodes (3): About Page Team Section, Kavya Khatri (Team Member), Kavya Khatri Portrait Photo

### Community 17 - "Sumit Katyal Profile"
Cohesion: 0.67
Nodes (3): About Page Team Photos, Sumit Katyal Headshot Portrait, Sumit Katyal (Person / Team Member)

### Community 18 - "Vinayak Tyagi Profile"
Cohesion: 1.00
Nodes (3): About Page Team Section, Vinayak Tyagi Portrait Photo, Vinayak Tyagi (Person)

### Community 19 - "Platizio Brand Identity"
Cohesion: 1.00
Nodes (3): Platizio Brand Identity (warm orange/copper serif style), Platizio Logo, Platizio Wordmark Text

## Ambiguous Edges - Review These
- `Product Non-Negotiables` → `Legacy Site Map and Rebuild Scope`  [AMBIGUOUS]
  LEGACY_SITE_CONTENT.md · relation: conceptually_related_to

## Knowledge Gaps
- **93 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Product Non-Negotiables` and `Legacy Site Map and Rebuild Scope`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Midnight Observatory Design Concept` connect `3D Market Constellation Scene` to `Platizio Business & Services`, `Motion System & Home Page`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `Motion System (Expo Ease + Lenis + Intro Gating)` connect `Motion System & Home Page` to `Landing Page Sections`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Platizio Business & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.12648221343873517 - nodes in this community are weakly interconnected._
- **Should `Navigation & About Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._