import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Book a Consultation | Platizio",
  description:
    "Book a consultation with Platizio. Tell us about your investment goals and reach our team on WhatsApp, by email or by phone.",
};

export default function Page() {
  return <ContactPage />;
}
