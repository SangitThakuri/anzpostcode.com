import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import { getNZRegionGroups, getNZPostcodeGroups, getNZLocalityGroups } from "@/lib/data";

const NZ_REGION_EMOJIS: Record<string, string> = {
  Auckland: "🌆",
  Wellington: "🏛️",
  Canterbury: "🏔️",
  Otago: "🏔️",
  Waikato: "🌿",
  "Bay of Plenty": "🏖️",
  "Manawatu-Whanganui": "🌾",
  Northland: "🌴",
  Southland: "❄️",
  Taranaki: "🌋",
  Marlborough: "🍷",
  "Hawke's Bay": "🍎",
  Gisborne: "☀️",
  Nelson: "⛵",
  Tasman: "🏞️",
  "West Coast": "🌊",
};

export const metadata: Metadata = {
  title: "New Zealand Postcodes – Browse All Regions & Localities",
  description:
    "Explore New Zealand postcodes and localities across all regions including Auckland, Wellington, Canterbury, and more.",
  openGraph: { title: "New Zealand Postcodes", url: "https://anzpostcode.com/nz" },
};

export default function NZPage() {
  const regions = getNZRegionGroups();
  const postcodeCount = getNZPostcodeGroups().size;
  const localityCount = getNZLocalityGroups().size;

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "New Zealand" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
                <Link href="/au" className="px-5 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 text-sm font-semibold transition-colors">
                  🇦🇺 Australia
                </Link>
                <Link href="/nz" className="px-5 py-2 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold">
                  🇳🇿 New Zealand
                </Link>
              </div>
            </div>
            <div className="text-4xl mb-4">🇳🇿</div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-4">
              New Zealand Postcodes
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              {postcodeCount.toLocaleString()} postcodes · {localityCount.toLocaleString()} localities across all regions
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBox placeholder="Search NZ postcodes or localities…" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">Browse by Region</h2>
            <Link href="/nz/postcodes" className="text-[#2D6A4F] text-sm font-semibold flex items-center gap-1">
              All postcodes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/nz/region/${region.slug}`}
                className="group bg-white rounded-xl border border-[#E2E6ED] p-6 hover:border-[#2D6A4F] hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{NZ_REGION_EMOJIS[region.state] ?? "📍"}</div>
                <div className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] group-hover:text-[#2D6A4F] transition-colors">
                  {region.state}
                </div>
                <div className="text-[#6B7280] text-sm mt-0.5">{region.state} Region</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
                  <span className="bg-[#F4F6F9] px-2 py-0.5 rounded-full font-medium">
                    {region.postcodes.length} postcodes
                  </span>
                  <span className="bg-[#F4F6F9] px-2 py-0.5 rounded-full font-medium">
                    {region.localityCount} localities
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white border-t border-[#E2E6ED] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">Quick Browse</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/nz/postcodes", label: "All Postcodes" },
                { href: "/nz/localities", label: "All Localities" },
                { href: "/nz/a-z", label: "A–Z Index" },
                ...regions.map((r) => ({ href: `/nz/region/${r.slug}`, label: r.state })),
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 bg-[#F4F6F9] hover:bg-[#2D6A4F] hover:text-white text-[#1A1A2E] rounded-lg text-sm font-medium border border-[#E2E6ED] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
