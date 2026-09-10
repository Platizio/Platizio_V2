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
  /**
   * ISO date the document's text last changed. Required, not optional: a policy
   * with no date is one a reader cannot tell is current, and the privacy policy
   * itself promises this field — "We will post the updated Policy on our
   * website with a new effective date" — while none of the four displayed one.
   *
   * The value is the date the wording last changed in this repository, which is
   * a fact rather than an assertion. It is NOT an assurance that the document
   * was legally reviewed or came into force on that date; the registry note
   * below still stands and counsel's own effective date, once there is one,
   * should replace this.
   */
  lastUpdated: string;
  blocks: RichBlock[];
};

/**
 * Every document's current text landed in one commit on this date. Kept as one
 * constant because that is the truth — four separate literals would imply the
 * documents were revised independently, and invite them to drift apart.
 */
const TEXT_LAST_CHANGED = "2026-07-15";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "privacy-policy": {
    id: "privacy-policy",
    path: "/privacy-policy",
    title: "Privacy Policy",
    lastUpdated: TEXT_LAST_CHANGED,
    subtitle:
      "How Platizio Services LLP collects, uses, shares and protects your personal data.",
    blocks: privacyPolicy,
  },
  "terms-and-condition": {
    id: "terms-and-condition",
    path: "/terms-and-condition",
    title: "Terms & Conditions",
    lastUpdated: TEXT_LAST_CHANGED,
    subtitle:
      "The terms that govern your access to and use of the Platizio platform.",
    blocks: termsAndCondition,
  },
  "global-privacy-policy": {
    id: "global-privacy-policy",
    path: "/global-investing/privacy-policy",
    title: "Privacy Policy — Global Investing",
    lastUpdated: TEXT_LAST_CHANGED,
    subtitle:
      "How Platizio Global handles personal data for international-investing services.",
    blocks: globalPrivacyPolicy,
  },
  "global-terms-and-condition": {
    id: "global-terms-and-condition",
    path: "/global-investing/terms-and-condition",
    title: "Terms & Conditions — Global Investing",
    lastUpdated: TEXT_LAST_CHANGED,
    subtitle:
      "The terms governing Platizio Global's international-investing services.",
    blocks: globalTermsAndCondition,
  },
};

export function getLegalDoc(id: string): LegalDoc | undefined {
  return LEGAL_DOCS[id];
}
