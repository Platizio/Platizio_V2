import type { RichBlock } from "@/lib/content-types";

import whySif2026 from "./why-sif-prominent-position-2026";
import mutualFundsEvolving from "./mutual-funds-evolving-good-thing-investors";
import aifsIndia from "./aifs-india-what-why-trend";
import whyInternational2026 from "./why-international-investing-matters-2026";
import pmsExplained from "./pms-explained-taxation-target-audience";
import marketOutlook2025 from "./market-outlook-2025";
import internationalGuide from "./international-investing-guide";
import powerOfAssetAllocation from "./power-of-asset-allocation";
import riskManagement from "./risk-management-portfolio";

/** Article body content keyed by slug. Bodies are ported from the legacy site. */
export const ARTICLE_BODIES: Record<string, RichBlock[]> = {
  "why-sif-prominent-position-2026": whySif2026,
  "mutual-funds-evolving-good-thing-investors": mutualFundsEvolving,
  "aifs-india-what-why-trend": aifsIndia,
  "why-international-investing-matters-2026": whyInternational2026,
  "pms-explained-taxation-target-audience": pmsExplained,
  "market-outlook-2025": marketOutlook2025,
  "international-investing-guide": internationalGuide,
  "power-of-asset-allocation": powerOfAssetAllocation,
  "risk-management-portfolio": riskManagement,
};
