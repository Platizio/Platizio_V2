import type { Metadata } from "next";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About Platizio | Regulated, Disciplined Investing",
  description:
    "Learn about Platizio Services LLP, its regulated investment-distribution approach, team, and commitment to transparent, risk-aware portfolio building.",
};

export default function About() {
  return <AboutPage />;
}
