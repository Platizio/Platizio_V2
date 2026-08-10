# Hero: type-led composition

**Date:** 2026-08-10
**Status:** Approved, not yet implemented
**Scope:** `src/components/sections/Hero.tsx` and the WebGL background it owns

## Why

The hero carried a brass index line drawn over a violet particle terrain in
WebGL. The line was removed because it read as clichéd and decorative — a
literal stock-chart squiggle that said nothing a distributor can honestly say.

Five replacement graphics were explored: an allocation bar, a visitor-driven
allocation control, and three progressively more abstract treatments of the
same idea (woven, typographic set, aggregate, counterweight). All five failed
the same way. Anything legible enough to read as "allocation" looks like a
chart; anything abstract enough to escape that becomes decoration. Those are
the two complaints that killed the line.

The conclusion is that the right-hand side has no job. The hero's job is the
headline, and every graphic proposed was competing with it. So the graphic is
removed and nothing replaces it — but the composition was built around a
two-thirds split, so the layout is rebalanced rather than simply emptied.

The particle terrain goes with it. It belongs to the same "midnight
observatory" direction that produced the index line, and that direction was
rejected. Removing it also drops three runtime dependencies.

## Scope

**In scope**

- Recompose the hero around type across the full container width
- Delete the WebGL background and its dependencies
- Remove the legibility scrim, which exists only to fade the canvas

**Out of scope**

- Copy changes. The headline, subhead, CTA labels and both registrations keep
  their current wording.
- The motion vocabulary. Reveal order, springs and delays are unchanged.
- Any other section. The observatory motif also appears in the CTA compass
  rose; whether that survives is a separate decision.

## The composition

### Desktop (`lg`, ≥1024px)

Two 12-column grids at `gap-x-8` (32px), matching the system Products already
uses. Products puts its heading right with the note bottom-left; the hero is
the mirror of that, which rhymes rather than repeats.

They are two grids rather than one because the registration rail is pinned to
the bottom of the section while the block above it is vertically centred — see
Vertical placement. Both grids share the same 12-column track, so cells still
line up across the seam.

Grid A, inside the centred block:

| Element | Columns | Row |
| --- | --- | --- |
| `h1` | 1–6 | 1 |
| Subhead | 9–12 | 1 |
| CTA pair | 1–6 | 2 |

Grid B, the rail at the bottom edge:

| Element | Columns |
| --- | --- |
| AMFI | 1–4 |
| SEBI | 9–12 |

Grid A uses `lg:items-end`, which bottom-aligns the subhead to the headline's
block and produces a diagonal read from "Navigate" down-right to the
supporting copy. It has no effect on row 2, whose track is exactly as tall as
the buttons.

Column placement in grid A is explicit (`lg:col-start-*`, `lg:row-start-*`)
rather than left to auto-placement. A 6-wide CTA row cannot fit the
two-column remainder of row 1, so auto-placement happens to give the right
answer — but only by accident, and it would break the moment a span changed.

Columns 1–6 measure 682px on a 1400px container, which is within a few pixels
of the current `max-w-[13ch]`. The headline therefore keeps its existing
`clamp(2.9rem, 8vw, 6rem)` and still breaks across three lines.

### Below `lg`

A single column in source order: headline, subhead, CTAs, then the two
registrations. Every cell falls back to `col-span-12`. This is the current
mobile behaviour and needs no change beyond the class names.

### Vertical placement

Today everything hugs the bottom (`justify-end`) because the terrain filled
the upper third. On flat midnight that third becomes dead space.

The section stays `min-h-[100svh]` with `pt-32` clearing the fixed nav. The
headline/subhead/CTA block becomes `flex-1 flex flex-col justify-center`, so
it centres in whatever height is left; the registration rail follows at its
natural size and lands on the bottom padding. Centred block, anchored rail —
no `mt-auto`/`my-auto` pairing, which would fight itself.

### The registration rail

The `sm:border-l sm:pl-6` divider between AMFI and SEBI is removed at every
size. The `border-t` above the row already separates the rail from the content
above it, and at four empty columns between the two cells at `lg`, a second
rule between them is redundant. Keeping it would also mean maintaining
three states across the breakpoints for a hairline nobody would miss.

### Ground

Flat `bg-midnight`. No canvas, no scrim, no texture.

This was chosen over a quieter CSS replacement (grain, soft radial). The risk
is that 100svh of one flat colour reads cheap; see Risks.

## Deletions

- `src/components/three/MarketConstellation.tsx` — delete. The directory
  becomes empty and goes with it.
- In `Hero.tsx`: the `next/dynamic` import, the `MarketConstellation` dynamic
  wrapper, its JSX, and the scrim `div` beneath it.
- From `package.json`: `three`, `@react-three/fiber`, `@react-three/drei`.
  `MarketConstellation.tsx` is the only importer of `three` and
  `@react-three/fiber`; `@react-three/drei` has been unused since the index
  line was removed. There is no `@types/three` — the package ships its own.
- Regenerate `package-lock.json`.

## Motion

Unchanged. The headline keeps its per-word mask reveal via `HeroLine`
(`SPRING_ENTER`, 0.07s stagger, line delays 0.25 / 0.42 / 0.56). The subhead,
CTAs and rail keep `fadeIn` at 0.75 / 0.9 / 1.05. Reveal order still reads
headline → subhead → CTAs → rail, which remains correct now that the subhead
sits beside the headline rather than below it.

`useIntroDone` still gates the entrance, and `useReducedMotion` still collapses
every transition to `duration: 0`. Neither branches on DOM structure, so the
hydration class of bugs fixed in `d6f4103` is not reintroduced.

## Accessibility

- The `sr-only` paragraph naming Platizio as a licensed distributor stays. It
  is the only place the company name appears in the hero.
- Removing an `aria-hidden` decorative canvas changes nothing for assistive
  technology.
- Contrast improves marginally: porcelain and lavender-dim now sit on a known
  flat `oklch(0.16 0.045 288)` rather than on that colour plus a moving
  particle field, so the measured ratios become the guaranteed ratios.

## Verification

1. `tsc --noEmit`, `eslint`, `next build` all clean.
2. Playwright screenshots at 1440×900, 768×1024 and 375×812. Judge the result
   by eye before calling it done — this hero has been signed off on geometry
   alone before and was wrong.
3. Console clean, and zero hydration errors with `prefers-reduced-motion` both
   set and unset.
4. Confirm no `three` chunk appears in the build output.

## Risks

**The hero reads bare.** With no graphic and no terrain it rests entirely on
the type and the void. The remedy is the "monumental headline" option that was
considered and not chosen: scale the headline up to claim more width. Surface
the screenshot and let the user decide rather than changing it silently.

**Bottom alignment is optical, not true baseline alignment.** `items-end`
aligns box edges. The headline's last line box and the subhead's last line box
carry different leading, so their baselines may sit a few pixels apart. If it
shows, correct it with a small `lg:pb-*` on the subhead — do not switch to
`items-baseline`, which aligns *first* baselines and would be wrong.

**Deliberate empty columns at `lg`.** Columns 7–8 in grid A and 5–8 in grid B
are intentionally blank. Below 1024px both grids collapse to one column, so
the void only exists where there is width to spare for it.
