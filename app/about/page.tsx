import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ANZ Postcode",
  description: "Learn about ANZPostcode.com – a free Australia and New Zealand postcode directory.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "About" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold mb-4">About ANZPostcode</h1>
            <p className="text-white/70 text-lg">A free, open postcode directory for Australia and New Zealand.</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545] mb-4">What We Do</h2>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              ANZPostcode is a free online directory covering postcodes, suburbs, and localities across Australia and New Zealand. Our mission is to make postcode information freely accessible to everyone — without paywalls, sign-ups, or advertising overload.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              We provide detailed pages for every postcode, including location information, nearby suburbs, and interactive maps powered by OpenStreetMap.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545] mb-4">Data Sources</h2>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              Our postcode data is sourced from community-maintained open datasets. See our <Link href="/data-sources" className="text-[#E8472A] hover:underline">Data Sources page</Link> for full details.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              This site is not affiliated with Australia Post, NZ Post, or any government agency. For official postal address verification, please use the relevant postal authority.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545] mb-4">Contact</h2>
            <p className="text-[#6B7280] leading-relaxed">
              Questions or feedback? Visit our <Link href="/contact" className="text-[#E8472A] hover:underline">Contact page</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
