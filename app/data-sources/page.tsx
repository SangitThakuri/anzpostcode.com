import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Sources – ANZ Postcode",
  description: "Information about the datasets used to power ANZPostcode.com.",
};

export default function DataSourcesPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Data Sources" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold mb-4">Data Sources</h1>
            <p className="text-white/70">Where our postcode data comes from.</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {[
            {
              country: "🇦🇺 Australia",
              title: "Australian Postcodes Dataset",
              description: "Our Australian postcode data is sourced from the community-maintained Australian Postcodes dataset by Matthew Proctor, licensed under MIT. This dataset compiles publicly available postcode data from multiple sources including information originally published by Australia Post.",
              note: "For official address and delivery verification, use Australia Post's official postcode finder.",
              color: "#E8472A",
            },
            {
              country: "🇳🇿 New Zealand",
              title: "New Zealand Postcodes",
              description: "New Zealand postcode data is compiled from publicly available NZ geographic and postal data. This includes locality, regional, and coordinate information for NZ postcodes.",
              note: "For official NZ address verification, use NZ Post's official address checker.",
              color: "#2D6A4F",
            },
            {
              country: "🗺️ Maps",
              title: "OpenStreetMap",
              description: "All maps on this site use OpenStreetMap tiles and the Leaflet.js library. OpenStreetMap data is © OpenStreetMap contributors, licensed under the Open Database License (ODbL).",
              note: "OpenStreetMap attribution is displayed on all map instances.",
              color: "#0B2545",
            },
          ].map((src) => (
            <div key={src.title} className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
              <div className="text-xl mb-1">{src.country}</div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">{src.title}</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">{src.description}</p>
              <div className="bg-[#F4F6F9] rounded-xl p-4 text-sm text-[#6B7280] border-l-4" style={{ borderColor: src.color }}>
                ⚠️ {src.note}
              </div>
            </div>
          ))}

          <div className="bg-[#F4F6F9] rounded-2xl border border-[#E2E6ED] p-6">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-3">Reporting Data Issues</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              If you notice incorrect or outdated postcode data, please contact us via our <a href="/contact" className="text-[#E8472A] hover:underline">Contact page</a>. We review and correct issues as quickly as possible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
