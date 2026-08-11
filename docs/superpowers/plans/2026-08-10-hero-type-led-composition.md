# Type-led hero composition — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the WebGL background from the Platizio hero and rebalance the
section around type across the full container width.

**Architecture:** Two tasks. The first strips the canvas — deleting
`MarketConstellation.tsx`, the legibility scrim that only exists to fade it,
and the three three.js packages it was the sole consumer of. The second
rebuilds the hero's interior on the same 12-column / 32px grid the rest of the
site uses: headline in columns 1–6, subhead bottom-aligned in 9–12, CTAs
below-left, and the registration rail spanning the base. No copy changes, no
motion changes.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4,
Tailwind CSS v4, Motion 12.42.2.

**Spec:** `docs/superpowers/specs/2026-08-10-hero-type-led-composition-design.md`

## Global Constraints

- This project has **no test framework**. The test cycle for every task is
  `npx tsc --noEmit`, then `npm run lint`, then `npm run build`, then a
  Playwright screenshot that you actually look at.
- **Screenshot before claiming done.** The in-app Browser pane usually fails
  here with "the page is not compositing frames". Use the Playwright MCP
  (`mcp__plugin_playwright_playwright__*`) against the dev server. Wait ~3.5s
  after navigating so the intro animation settles.
- **Check 1024, 1152 and 1200 as well as 1440 / 768 / 375.** Every layout
  defect this plan shipped lived between 1024 and 1200: the band where `lg`
  has engaged, so the cells have taken their desktop spans, but the container
  is still narrow and the headline is still climbing at 8vw. 1440 is the
  widest each column ever gets and 768 is below the breakpoint entirely, so
  neither width can see it. Check 1280 and 1536 too when a span changes at
  `xl` or `2xl` — a column that drops a track at a breakpoint is at its
  tightest one pixel past it.
- **Do not change any copy.** The headline, subhead, both CTA labels and both
  registration strings keep their exact current wording. The unattributed
  `+24.8%` figure that used to lead the rail was removed on purpose — do not
  reintroduce any performance number.
- **Do not branch DOM structure or Motion `initial`/`animate`/`style` props on
  `useReducedMotion()`.** It returns `false` during SSR, so anything
  serialized into the SSR HTML diverges on hydration. Reduced motion is
  expressed through `transition` only, which is not serialized. This class of
  bug was fixed in `4d61d1d` and must not come back.
- Tailwind breakpoints are the defaults: `sm` 640px, `md` 768px, `lg` 1024px.
- Section gutters are `px-6 md:px-10 lg:px-16` **outside** the
  `max-w-[1400px]` container, never inside it.
- Run every command from the repo root:
  `C:\Users\pc\Downloads\Platizio NextGen\Platizio NextGen\platizio`
- Work on the existing branch `hero-type-led-composition`. Do not push.

---

## File Structure

| File | Change | Responsibility after the change |
| --- | --- | --- |
| `src/components/three/MarketConstellation.tsx` | Delete | — (directory becomes empty and goes too) |
| `src/components/sections/Hero.tsx` | Modify | The entire hero: type, layout, entrance motion. No background of its own. |
| `package.json` | Modify | Drops `three`, `@react-three/fiber`, `@react-three/drei` |
| `package-lock.json` | Regenerate | — |

`Hero.tsx` ends at roughly 120 lines and keeps its single responsibility, so
no split is warranted. The `HeroLine` helper stays local to it — nothing else
uses the per-word mask reveal.

---

## Task 1: Remove the WebGL background

Strips the canvas and its dependencies. The hero keeps its current
bottom-anchored layout in this task, so the intermediate result **is expected
to look wrong**: the content hugs the bottom and the top third of the section
is dead flat midnight. Task 2 fixes that. Do not "improve" the layout here.

**Files:**
- Delete: `src/components/three/MarketConstellation.tsx`
- Modify: `src/components/sections/Hero.tsx` (lines 4, 9–12, 65–67)
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: a `Hero` component whose only child is the padded content wrapper.
  Task 2 rewrites that wrapper's interior; the `section` element, its
  `id="top"`, and the `HeroLine` / `fadeIn` helpers survive unchanged.

- [ ] **Step 1: Confirm nothing else imports three**

```bash
grep -rn 'from "three"\|from "@react-three' src/
```

Expected: exactly two hits, both in
`src/components/three/MarketConstellation.tsx`. If anything else appears,
stop and report — the dependency removal below is unsafe.

- [ ] **Step 2: Delete the component and its directory**

```bash
git rm src/components/three/MarketConstellation.tsx
```

`src/components/three/` holds only this file, so git removes the directory
with it. Verify with `ls src/components/` — there should be no `three` entry.

- [ ] **Step 3: Remove the import and dynamic wrapper from Hero.tsx**

Delete these two blocks. Line 4:

```tsx
import dynamic from "next/dynamic";
```

Lines 9–12:

```tsx
const MarketConstellation = dynamic(
  () => import("@/components/three/MarketConstellation"),
  { ssr: false },
);
```

Leave the other imports (`motion`, `useReducedMotion`, `SPRING_ENTER`,
`MagneticButton`, `useIntroDone`) alone — all are still used.

- [ ] **Step 4: Remove the canvas and the scrim from the JSX**

Delete lines 65–67 in their entirety:

```tsx
      <MarketConstellation className="opacity-90" />
      {/* legibility scrim — canvas fades into the drenched base */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.16_0.045_288/0.72),transparent_38%,transparent_62%,oklch(0.16_0.045_288/0.92))]" />
```

The scrim goes with the canvas: its only job was fading the WebGL layer into
the page dark, and there is now nothing to fade. The section's own
`bg-midnight` is the ground.

Leave `relative z-10` on the content wrapper. It is harmless with nothing
behind it, and Task 2 does not need to touch it.

- [ ] **Step 5: Drop the three.js packages**

```bash
npm uninstall three @react-three/fiber @react-three/drei
```

There is no `@types/three` to remove — `three` ships its own types. This
rewrites `package-lock.json`; that regeneration is part of the commit.

- [ ] **Step 6: Typecheck, lint and build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all three clean. A `Cannot find module 'three'` error here means
Step 1 missed an importer.

- [ ] **Step 7: Confirm three is gone from the bundle**

```bash
grep -rl "three" .next/static/chunks/ | head
```

Expected: no chunk matches, or only incidental prose matches. The point is
that no ~600KB three.js chunk remains. If the dev server was running during
the build, clear the cache and rebuild: `rm -rf .next && npm run build`.

- [ ] **Step 8: Screenshot the intermediate state**

Start the dev server (`npm run dev`), then via the Playwright MCP navigate to
`http://localhost:3000`, wait 3500ms, and screenshot at 1440×900.

Expected: flat midnight ground, no particles, content still bunched at the
bottom with an empty upper third. Confirm the headline, both CTAs and both
registrations all still render — this screenshot exists to prove nothing broke
in the removal, not to judge the composition.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Remove the WebGL background from the hero

The particle terrain belongs to the same midnight-observatory direction that
produced the index line, and that direction was rejected. The legibility
scrim goes with it — its only job was fading the canvas into the page dark.

MarketConstellation was the sole importer of three and @react-three/fiber,
and @react-three/drei has been unused since the index line was removed, so
all three come out of package.json.

The layout is deliberately untouched here and looks wrong: the content still
hugs the bottom, leaving the top third empty. The next commit rebalances it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Recompose the hero onto the 12-column grid

**Files:**
- Modify: `src/components/sections/Hero.tsx` (the `return` block of the
  default export, everything from `<section` to `</section>`)

**Interfaces:**
- Consumes: `Hero.tsx` as Task 1 left it — canvas-free, with `HeroLine`,
  `fadeIn(delay)`, `useIntroDone()` and `useReducedMotion()` intact.
- Produces: nothing other tasks depend on. This is the last task.

- [ ] **Step 1: Replace the render body**

Replace the whole `return (...)` of the default export with the following.
Everything above it — the `"use client"` directive, the imports, `HeroLine`,
and the `ready` / `reduce` / `fadeIn` declarations — stays exactly as is.

```tsx
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-midnight text-lavender"
    >
      {/* Gutter outside the 1400 container, matching every content section.
          With the padding inside the container the hero's left rail landed
          64px right of every section below it above 1528px wide. */}
      <div className="relative z-10 flex w-full flex-1 flex-col px-6 pb-14 pt-32 md:px-10 md:pb-16 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
          <p className="sr-only">
            Platizio — licensed distributor of Mutual Funds and Specialised
            Investment Funds.
          </p>

          {/* Centred in whatever height the rail leaves. The old justify-end
              was right while the terrain filled the upper third; on flat
              midnight it just left that third dead. */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Columns are placed explicitly rather than left to
                auto-placement. A 6-wide CTA row cannot fit the two-column
                remainder of row 1, so auto-placement happens to give the
                right answer — by accident, and only until a span changes. */}
            <div className="grid grid-cols-12 gap-x-8 gap-y-10 lg:items-end">
              <h1 className="col-span-12 max-w-[13ch] font-display text-[clamp(2.9rem,8vw,6rem)] font-medium leading-[1.02] tracking-tight text-porcelain lg:col-span-6 lg:col-start-1 lg:row-start-1">
                <HeroLine words="Navigate every" ready={ready} baseDelay={0.25} />
                <HeroLine words="market with" ready={ready} baseDelay={0.42} />
                <HeroLine
                  words="confidence."
                  ready={ready}
                  baseDelay={0.56}
                  className="italic text-brass"
                />
              </h1>

              {/* lg:items-end bottom-aligns this to the headline's block,
                  which is what makes the eye run diagonally from "Navigate"
                  down to here. Below lg the max-w does the work instead —
                  twelve columns at 768px is far too wide to read. */}
              <motion.p
                {...fadeIn(0.75)}
                className="col-span-12 max-w-[46ch] text-base leading-relaxed text-lavender-dim md:text-lg lg:col-span-4 lg:col-start-9 lg:row-start-1"
              >
                Regulated products, matched to your goals, your horizon and
                your appetite for risk — and explained before you commit.
              </motion.p>

              <motion.div
                {...fadeIn(0.9)}
                className="col-span-12 flex flex-wrap gap-4 lg:col-span-6 lg:col-start-1 lg:row-start-2"
              >
                <MagneticButton href="/contact" variant="brass">
                  Book a consultation
                </MagneticButton>
                <MagneticButton href="#products" variant="outline-light">
                  See the five products
                </MagneticButton>
              </motion.div>
            </div>
          </div>

          {/* Two verifiable registrations, not three peer "facts". The YTD
              figure that used to lead this row was unattributed — a
              distributor has no performance of its own to report, and any
              return shown without a scheme, benchmark, period and the
              prescribed disclaimer is exactly what AMFI's code exists to
              prevent.

              Its own grid rather than a third row of the one above, because
              it is pinned to the bottom edge while that block is centred.
              Same 12-column track, so the cells still line up across the
              seam. The divider that used to sit between the two cells is
              gone: the border-t already separates the rail, and at four empty
              columns a second rule is noise. */}
          <motion.div
            {...fadeIn(1.05)}
            className="mt-14 grid grid-cols-12 gap-x-8 gap-y-8 border-t border-lavender/15 pt-8 md:mt-16"
          >
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-6 lg:col-span-4 lg:col-start-1">
              <span className="font-display track-caption text-2xl text-porcelain md:text-3xl">
                AMFI
              </span>
              <span className="text-sm text-lavender-dim">
                Registered distributor · ARN 341407
              </span>
            </div>
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-6 lg:col-span-4 lg:col-start-9">
              <span className="font-display track-caption text-2xl text-porcelain md:text-3xl">
                SEBI
              </span>
              <span className="text-sm text-lavender-dim">
                Regulated product frameworks
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
```

- [ ] **Step 2: Typecheck, lint and build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all three clean.

- [ ] **Step 3: Screenshot desktop and check the alignment**

With the dev server running, navigate the Playwright MCP to
`http://localhost:3000`, wait 3500ms, screenshot at 1440×900.

Check three things by eye:
1. The headline occupies the left half and the subhead sits at the right,
   level with the bottom of the headline.
2. The block is vertically centred — the space above the headline and the
   space between the CTAs and the rail are roughly balanced. It should not
   hug the bottom.
3. The AMFI and SEBI columns start directly under the headline and the
   subhead respectively.

- [ ] **Step 4: Correct the bottom alignment if it reads off**

`lg:items-end` aligns box edges, not baselines. The headline's last line box
and the subhead's last line box carry different leading, so their baselines
may land a few pixels apart.

Only if the offset is visible in the Step 3 screenshot, nudge the subhead:

```tsx
className="col-span-12 max-w-[46ch] text-base leading-relaxed text-lavender-dim md:text-lg lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:pb-2"
```

Do **not** switch to `items-baseline` — it aligns *first* baselines, which
would hang the subhead off the top of the headline. Re-screenshot after any
nudge.

- [ ] **Step 5: Screenshot the narrow desktop band, tablet and mobile**

Resize to 1024×800, reload, wait 3500ms, screenshot. Then 1152 and 1200, then
768×1024, then 375×812.

Expected at 1024–1200: the headline still breaks across exactly three lines.
This is the band the plan as first written never looked at, and where it was
wrong — see the Global Constraints.

Expected at 768: two rows, headline across the top, then the subhead left and
the CTA pair right, bottom-aligned to each other. At 375: a single column in
the order headline, subhead, CTAs, AMFI, SEBI. The subhead is capped by
`max-w-[46ch]` rather than running the full measure. Both CTA pills are fully
visible and not clipped.

- [ ] **Step 6: Check the console and hydration in both motion modes**

Read console messages via the Playwright MCP. Expected: no errors, and in
particular no "hydration failed" or "server rendered HTML didn't match".

Then emulate `prefers-reduced-motion: reduce`, reload, and read the console
again. Expected: still clean, and the hero content is visible immediately
rather than staying at `opacity: 0`.

- [ ] **Step 7: Judge whether it reads bare, and say so**

This is the risk the spec flagged. With no graphic and no terrain the hero
rests entirely on the type and the void.

Look at the 1440×900 screenshot and decide honestly. If it reads thin, the
remedy is scaling the headline up to claim more width — the "monumental
headline" option that was considered and not chosen. **Do not apply that
change.** Surface the screenshot and the recommendation to the user and let
them decide.

- [ ] **Step 8: Clean up stray screenshots**

Playwright drops PNGs in the repo root and `.playwright-mcp/`. Copy anything
worth keeping to the scratchpad, then:

```bash
rm -rf .playwright-mcp
git status --short
```

Expected: only `src/components/sections/Hero.tsx` is modified.

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "Rebalance the hero around type

With the graphic gone the two-thirds split had nothing to hold, so the
interior moves onto the same 12-column / 32px grid the rest of the site
uses: headline in columns 1-6, subhead bottom-aligned in 9-12, CTAs
below-left, registrations spanning the base.

The block also centres vertically. justify-end was right while the terrain
filled the upper third; without it that third was simply empty.

The rail is its own grid rather than a third row, because it stays pinned to
the bottom while the block above it centres. Its internal divider is gone —
four empty columns already separate the two cells.

No copy and no motion changes: same words, same reveal order, same springs.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Self-review notes

Checked against the spec, section by section:

- **The composition / desktop** — Task 2 Step 1. Grid A and grid B both
  present, both on `grid-cols-12 gap-x-8`, all placements explicit at `lg`.
- **Below `lg`** — Task 2 Step 1 (`col-span-12` fallbacks) and Step 5
  (verification at 768 and 375).
- **Vertical placement** — Task 2 Step 1, `flex flex-1 flex-col justify-center`
  on the block with the rail following at natural height. Verified in Step 3.
- **The registration rail** — Task 2 Step 1; `sm:border-l sm:pl-6` is absent
  from the new markup at every breakpoint.
- **Ground** — Task 1 Steps 4 and 8. Flat `bg-midnight`, scrim deleted.
- **Deletions** — Task 1 Steps 2–5, including the lockfile regeneration.
- **Motion** — unchanged by construction; delays 0.25 / 0.42 / 0.56 / 0.75 /
  0.9 / 1.05 are carried verbatim into the Step 1 code block.
- **Accessibility** — the `sr-only` paragraph is preserved in the Step 1 code
  block.
- **Verification** — Task 1 Steps 6–8 and Task 2 Steps 2–6.
- **Risks** — bare hero is Task 2 Step 7; baseline alignment is Step 4;
  the empty columns are intentional and need no task.

One deliberate deviation from the plan template: there are no failing-test
steps, because the project has no test framework. The typecheck / lint /
build / screenshot cycle in the Global Constraints is the substitute, and
every task runs it before committing.
