import type { Metadata } from "next";
import { getLegalDoc } from "@/lib/legal";
import LegalPage from "@/components/pages/LegalPage";

const doc = getLegalDoc("global-terms-and-condition")!;

export const metadata: Metadata = {
  title: `${doc.title} | Platizio`,
  description: doc.subtitle,
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
