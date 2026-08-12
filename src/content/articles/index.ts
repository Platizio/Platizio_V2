import type { RichBlock } from "@/lib/content-types";

import whySif2026 from "./why-sif-prominent-position-2026";
import mutualFundsEvolving from "./mutual-funds-evolving-good-thing-investors";
import aifsIndia from "./aifs-india-what-why-trend";
import whyInternational2026 from "./why-international-investing-matters-2026";
import pmsExplained from "./pms-explained-taxation-target-audience";

/** Article body content keyed by slug. Bodies are ported from the legacy site. */
export const ARTICLE_BODIES: Record<string, RichBlock[]> = {
  "why-sif-prominent-position-2026": whySif2026,
  "mutual-funds-evolving-good-thing-investors": mutualFundsEvolving,
  "aifs-india-what-why-trend": aifsIndia,
  "why-international-investing-matters-2026": whyInternational2026,
  "pms-explained-taxation-target-audience": pmsExplained,
};
