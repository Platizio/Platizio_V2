import type { RichBlock } from "@/lib/content-types";

import privacyPolicy from "@/content/legal/privacy-policy";
import termsAndCondition from "@/content/legal/terms-and-condition";
import globalPrivacyPolicy from "@/content/legal/global-privacy-policy";
import globalTermsAndCondition from "@/content/legal/global-terms-and-condition";

/**
 * Legal document registry. Bodies are ported verbatim from the legacy site and
 * live under `src/content/legal/`. This content must be reviewed by Platizio's
 * counsel / compliance owner before publishing.
 */
export type LegalDoc = {
  id: string;
  /** Public route path. */
  path: string;
  title: string;
  subtitle?: string;
  blocks: RichBlock[];
};

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "privacy-policy": {
    id: "privacy-policy",
    path: "/privacy-policy",
    title: "Privacy Policy",
    subtitle:
      "How Platizio Services LLP collects, uses, shares and protects your personal data.",
    blocks: privacyPolicy,
  },
  "terms-and-condition": {
    id: "terms-and-condition",
    path: "/terms-and-condition",
    title: "Terms & Conditions",
    subtitle:
      "The terms that govern your access to and use of the Platizio platform.",
    blocks: termsAndCondition,
  },
  "global-privacy-policy": {
    id: "global-privacy-policy",
    path: "/global-investing/privacy-policy",
    title: "Privacy Policy — Global Investing",
    subtitle:
      "How Platizio Global handles personal data for international-investing services.",
    blocks: globalPrivacyPolicy,
  },
  "global-terms-and-condition": {
    id: "global-terms-and-condition",
    path: "/global-investing/terms-and-condition",
    title: "Terms & Conditions — Global Investing",
    subtitle:
      "The terms governing Platizio Global's international-investing services.",
    blocks: globalTermsAndCondition,
  },
};

export function getLegalDoc(id: string): LegalDoc | undefined {
  return LEGAL_DOCS[id];
}
