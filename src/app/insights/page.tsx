import type { Metadata } from "next";
import InsightsIndex from "@/components/pages/InsightsIndex";

export const metadata: Metadata = {
  title: "Media Insights | Platizio",
  description:
    "Stay informed with Platizio's latest articles, market analysis and educational content across SIF, mutual funds, AIF, PMS and international investing.",
};

export default function Page() {
  return <InsightsIndex />;
}
