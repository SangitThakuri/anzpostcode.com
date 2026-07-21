import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CompareClient from "./CompareClient";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Compare Australian Postcodes – Side-by-Side Postcode Comparison",
  description: "Compare two Australian postcodes side by side. See location details, distance between them, nearby suburbs, and state information.",
  alternates: { canonical: absoluteUrl("/au/compare") },
  openGraph: { url: absoluteUrl("/au/compare"), locale: "en_AU" },
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "Australia", href: "/au" },
          { label: "Compare Postcodes" },
        ]}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold text-[#0B2545] mb-2">
            Compare Australian Postcodes
          </h1>
          <p className="text-[#6B7280]">
            Enter two postcodes to compare their details and see the distance between them.
          </p>
        </div>
        <CompareClient />
      </main>
      <Footer />
    </>
  );
}
