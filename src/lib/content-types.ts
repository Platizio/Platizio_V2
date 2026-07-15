/**
 * Rich long-form content model shared by Media Insights articles and the legal
 * pages. Content is authored as an ordered list of typed blocks so it can be
 * rendered consistently with the Midnight Observatory prose styling. `h2`
 * blocks double as section anchors for a table of contents.
 */
export type RichBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string }
  /** Highlighted callout — disclaimers, cautions, key figures. */
  | { kind: "note"; text: string }
  | { kind: "table"; columns: string[]; rows: string[][] };

/** Slugify a heading for use as an in-page anchor id. */
export function anchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Extract top-level (h2) headings for a table of contents. */
export function buildToc(blocks: RichBlock[]): { id: string; text: string }[] {
  return blocks
    .filter((b): b is Extract<RichBlock, { kind: "h2" }> => b.kind === "h2")
    .map((b) => ({ id: anchorId(b.text), text: b.text }));
}

/** Estimate reading time in minutes from the prose blocks. */
export function readingMinutes(blocks: RichBlock[]): number {
  const words = blocks.reduce((n, b) => {
    if ("text" in b) return n + b.text.split(/\s+/).length;
    if ("items" in b) return n + b.items.join(" ").split(/\s+/).length;
    if (b.kind === "table")
      return n + b.rows.flat().join(" ").split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}
