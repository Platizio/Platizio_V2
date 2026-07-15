import { anchorId, type RichBlock } from "@/lib/content-types";

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
            return (
              <ul key={i} className="mt-5 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-brass-deep" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-5 space-y-3">
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
          case "table":
            return (
              <div key={i} className="mt-9 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-mist">
                      {block.columns.map((c) => (
                        <th key={c} className="px-3 pb-3 font-medium text-brass-deep first:pl-0">
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
      })}
    </div>
  );
}
