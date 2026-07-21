import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import NearMeClient from "./NearMeClient";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Find My Postcode – What Postcode Am I In?",
  description: "Instantly find your current postcode using your device's GPS. Works for Australia and New Zealand.",
  alternates: { canonical: absoluteUrl("/near-me") },
};

export default function NearMePage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Find My Postcode" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://anzpostcode.com" },
          { "@type": "ListItem", position: 2, name: "Find My Postcode", item: "https://anzpostcode.com/near-me" },
        ],
      }) }} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#E8472A] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold text-[#0B2545] mb-3">
            What postcode am I in?
          </h1>
          <p className="text-[#6B7280] text-lg">
            Use your device's GPS to instantly find your current postcode in Australia or New Zealand.
          </p>
        </div>
        <NearMeClient />
      </main>
      <Footer />
    </>
  );
}
