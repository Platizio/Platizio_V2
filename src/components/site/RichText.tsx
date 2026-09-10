import { anchorId, type RichBlock } from "@/lib/content-types";

/**
 * The accessible name for a table block. A table is named by its `<caption>`
 * and nothing else, but `RichBlock`'s table variant carries only columns and
 * rows — and that type is shared with the article authoring model, so the name
 * has to be derived here rather than authored. Prose tables in these documents
 * always sit under the h2/h3 that introduces them, and that heading is already
 * the name a reader would give the table, so reusing it means the two cannot
 * drift apart the way a separately authored caption would. The ordinal fallback
 * only fires if a table opens a document with no heading above it, which no
 * current policy or article does.
 */
function tableName(blocks: RichBlock[], i: number): string {
  for (let j = i - 1; j >= 0; j--) {
    const b = blocks[j];
    if (b.kind === "h2" || b.kind === "h3") return b.text;
  }
  return `Table ${blocks.slice(0, i).filter((b) => b.kind === "table").length + 1}`;
}

/**
 * Renders long-form content blocks with Midnight Observatory prose styling on
 * a light (porcelain) surface. Used by Media Insights articles and legal pages.
 * Pure render — no client hooks — so it is cheap for long documents.
 */
export default function RichText({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="max-w-[68ch] text-ink">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={anchorId(block.text)}
                className="mt-16 scroll-mt-28 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-medium leading-tight tracking-tight text-ink first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-10 font-display text-xl tracking-tight text-ink md:text-2xl"
              >
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mt-5 text-[1.05rem] leading-[1.75] text-ink-muted">
                {block.text}
              </p>
            );
          case "ul":
            // Tailwind's Preflight sets list-style:none on every ul/ol, and
            // Safari then hands VoiceOver a plain group for any list styled
            // that way — the "list, 5 items" announcement that tells a listener
            // how much is coming never fires. The markers here are hand-drawn
            // spans, so the styling cannot simply be given back; role="list"
            // restores the semantics Preflight stripped without touching the
            // rendering.
            return (
              <ul key={i} role="list" className="mt-5 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-brass-deep" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            // Same Preflight/VoiceOver loss as the ul above — the numbers are
            // spans, so role="list" is what keeps this announced as a list.
            return (
              <ol key={i} role="list" className="mt-5 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-4 leading-relaxed text-ink-muted">
                    <span className="font-display text-sm tabular-nums text-brass-deep">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="mt-9 border-l-2 border-brass-deep pl-6 font-display text-xl italic leading-snug text-ink md:text-2xl"
              >
                {block.text}
              </blockquote>
            );
          case "note":
            return (
              <div key={i} className="mt-9 border border-mist bg-white/50 p-6 md:p-7">
                <p className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brass-deep" aria-hidden />
                  <span>{block.text}</span>
                </p>
              </div>
            );
          case "table": {
            // Three things a bare <div><table> withholds from a screen reader.
            //
            // A name: <caption> is the only element that names a table, so
            // without one this is announced as an unlabelled grid of cells.
            // It is sr-only rather than visible because the heading above
            // already names the table on screen — printing it twice would be a
            // visible change made to fix a non-visual defect. See tableName.
            //
            // Column association: scope="col" states outright that each header
            // governs the cells beneath it, instead of leaving the AT to infer
            // it from the shape of the markup.
            //
            // Keyboard reach: this wrapper scrolls as soon as a wide table
            // overruns the 68ch measure, and a scroll container with nothing
            // focusable inside cannot be panned by keyboard at all (WCAG 2.1.1)
            // — the arrow keys need something in there to focus first.
            // tabindex="0" makes the container itself that thing. Whether a
            // table overflows depends on the viewport, so static markup cannot
            // make this conditional; the cost is one extra tab stop on tables
            // that happen to fit, and role="region" with the same name is what
            // makes that stop announce what it is rather than read as a silent
            // halt.
            const name = tableName(blocks, i);
            return (
              <div
                key={i}
                role="region"
                aria-label={name}
                tabIndex={0}
                className="mt-9 overflow-x-auto"
              >
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">{name}</caption>
                  <thead>
                    <tr className="border-b border-mist">
                      {block.columns.map((c) => (
                        <th
                          key={c}
                          scope="col"
                          className="px-3 pb-3 font-medium text-brass-deep first:pl-0"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-mist align-top">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-3 py-4 first:pl-0 leading-relaxed ${
                              ci === 0 ? "font-medium text-ink" : "text-ink-muted"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
