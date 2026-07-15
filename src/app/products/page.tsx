import type { Metadata } from "next";
import ProductsIndex from "@/components/pages/ProductsIndex";

export const metadata: Metadata = {
  title: "Products | Platizio",
  description:
    "Explore Platizio's regulated product line-up — Specialised Investment Funds, Mutual Funds, Portfolio Management Services, Alternative Investment Funds and International Investing.",
};

export default function Page() {
  return <ProductsIndex />;
}
