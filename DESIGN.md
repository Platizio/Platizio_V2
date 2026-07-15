# DESIGN.md — Platizio "Midnight Observatory"

## Concept

Celestial navigation for markets. The site is a private observatory: deep
violet night, brass instruments, charted constellations of market data.
Scene sentence: *an investor opens this in the evening after work, deciding
whom to trust with family wealth — the room is dark, calm, and precise.*

Interaction language borrows from landonorris.com: drenched-brand preloader
with monogram + counter, masked word reveals, marquee ticker, hover-sweep
index rows, sticky scrollytelling, expo ease `cubic-bezier(.19,1,.22,1)`.

## Color strategy

**Drenched dark base + committed light act + one violet drench.**
Page arc: midnight (hero/ticker) → porcelain (manifesto/products) → midnight
(journey/trust) → porcelain (testimonials) → violet (CTA) → midnight (footer).

Tokens (Tailwind v4 `@theme`, OKLCH — defined in `src/app/globals.css`):

| Token | Value | Role |
|---|---|---|
| `midnight` | oklch(0.16 0.045 288) | drenched page dark (violet-black, NOT neutral black) |
| `midnight-2` | oklch(0.21 0.055 286) | raised dark surface |
| `violet` | oklch(0.45 0.21 279) | brand primary, preloader + CTA drench |
| `violet-bright` | oklch(0.7 0.16 283) | interactive/highlight on dark |
| `lavender` | oklch(0.89 0.045 286) | text on dark |
| `lavender-dim` | oklch(0.71 0.045 286) | muted on dark (≥4.5:1 on midnight) |
| `brass` | oklch(0.8 0.13 85) | accent — data, ticks, CTAs (≤10% of surface) |
| `brass-deep` | oklch(0.62 0.12 75) | accent text on light |
| `porcelain` | oklch(0.975 0.006 290) | light bg |
| `ink` | oklch(0.22 0.045 288) | text on light |
| `ink-muted` | oklch(0.44 0.03 288) | muted on light |
| `mist` | oklch(0.9 0.015 290) | hairlines on light |

Hairlines on dark: `border-lavender/10` … `/15`.

## Typography

- `font-display` → **Fraunces** (variable: opsz, SOFT, WONK; + italic). The
  identity face — matches the original logo wordmark. Italic = emphasis of
  exactly one word/phrase per heading.
- `font-sans` → **DM Sans** (body, UI).
- Display ceiling: clamp max 6rem (hero only). Section headings
  `clamp(2.5rem, 5.5vw, 4.5rem)`. Letter-spacing floor −0.02em.

## Motion

- Ease: `--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)`; in motion/react:
  `ease: [0.19, 1, 0.22, 1]` (exported as `EXPO` from `ui/Reveal`).
- Durations: 0.2–0.3s micro, 0.8–1.25s reveals.
- Lenis smooth scroll (`SmoothScroll.tsx`); preloader gates hero choreography
  via `IntroProvider` context (`useIntroDone`).
- Every animation has a reduced-motion path (`useReducedMotion`).
- Marquee: `animate-marquee` keyframe, −50% translate, duplicated row.

## Bans (project-specific, on top of impeccable's)

- No gradient text, no backdrop-blur, no side accent stripes, no uppercase
  tracked eyebrow labels, no emoji icons, no icon libraries (inline SVG only).
- Brass never exceeds accent duty on light sections — use `brass-deep` for
  text there (contrast).
- Never neutral-black backgrounds; dark is always violet `midnight`.

## Component map

- `src/components/` — `Preloader`, `IntroProvider`, `SmoothScroll`, `Nav`
- `src/components/ui/` — `Reveal` (`RevealWords`, `FadeUp`, `EXPO`), `MagneticButton`
- `src/components/three/MarketConstellation.tsx` — R3F hero canvas (points
  terrain + brass index line), dynamic-imported `ssr:false`
- `src/components/sections/` — `Hero`, `Ticker`, `Manifesto`, `Products`,
  `Journey`, `Trust`, `Testimonials`, `CTA`, `Footer`
