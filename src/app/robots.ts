import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOYMENT, SITE_URL } from "@/lib/site";

/**
 * robots.txt (audit finding M-02, with `sitemap.ts`). The site had none, which
 * is not itself blocking — an absent robots.txt is read as "crawl everything"
 * — but it left no place to point crawlers at the sitemap, so the sitemap
 * would only ever be found by a manual Search Console submission.
 *
 * Everything is allowed because everything here is public marketing copy and
 * public legal text: 19 routes, no accounts, no search pages, no query
 * parameters, no staging paths. There is nothing to hold back, and a
 * speculative `Disallow` would be a rule nobody could later explain.
 *
 * The absolute sitemap URL is required — the Sitemap directive is the one
 * line in robots.txt that may not be a relative path — so it is built from
 * `SITE_URL`, the same origin the canonical metadata uses. Both become wrong
 * together, or neither, which is the failure mode to prefer.
 *
 * ...but only when this build IS the real site. Any other deployment is a
 * second, complete copy of all 19 routes on a public hostname, and it must not
 * advertise production's sitemap: a sitemap is a claim to own the URLs in it,
 * and a duplicate host making that claim is the mixed signal worth avoiding.
 *
 * Note what this does NOT do: it does not `Disallow: /`. The authoritative
 * de-indexing signal is the `noindex` in `app/layout.tsx`, and a crawler that
 * is blocked here never fetches the page and so never reads it — a URL already
 * known to Google can stay indexed indefinitely on the strength of inbound
 * links alone. Blocking the crawl and asking for de-indexing are contradictory
 * instructions; this file steps aside so the other one can be obeyed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
