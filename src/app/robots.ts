import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
 * `SITE_URL`, the same unconfirmed origin the canonical metadata uses. Both
 * become wrong together, or neither, which is the failure mode to prefer.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
