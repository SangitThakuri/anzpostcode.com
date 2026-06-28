import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import { getAUStateGroups, getAUPostcodeGroups, getAULocalityGroups } from "@/lib/data";
import { stateLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Australian Postcodes – Browse All States & Territories",
  description:
    "Explore Australian postcodes, suburbs, and localities across all 8 states and territories. Browse NSW, VIC, QLD, SA, WA, TAS, NT, and ACT postcodes.",
  openGraph: { title: "Australian Postcodes", url: "https://anzpostcode.com/au" },
};

const AU_STATE_FLAGS: Record<string, string> = {
  NSW: "🏙️", VIC: "🏙️", QLD: "☀️", SA: "🌾", WA: "🏜️", TAS: "🌿", NT: "🌵", ACT: "🏛️",
};

export default function AUPage() {
  const states = getAUStateGroups();
  const postcodeCount = getAUPostcodeGroups().size;
  const suburbCount = getAULocalityGroups().size;

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Australia" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] via-[#112d5e] to-[#0B2545] text-white py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
                <Link href="/au" className="px-5 py-2 rounded-full bg-[#E8472A] text-white text-sm font-semibold">
                  🇦🇺 Australia
                </Link>
                <Link href="/nz" className="px-5 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 text-sm font-semibold transition-colors">
                  🇳🇿 New Zealand
                </Link>
              </div>
            </div>
            <div className="text-4xl mb-4">🇦🇺</div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-4">
              Australian Postcodes
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              {postcodeCount.toLocaleString()} postcodes · {suburbCount.toLocaleString()} suburbs across 8 states &amp; territories
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBox placeholder="Search Australian postcodes or suburbs…" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">
              States &amp; Territories
            </h2>
            <Link href="/au/postcodes" className="text-[#E8472A] text-sm font-semibold flex items-center gap-1">
              All postcodes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {states.map((state) => (
              <Link
                key={state.state}
                href={`/au/state/${state.slug}`}
                className="group bg-white rounded-xl border border-[#E2E6ED] p-6 hover:border-[#E8472A] hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{AU_STATE_FLAGS[state.state] ?? "📍"}</div>
                <div className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] group-hover:text-[#E8472A] transition-colors">
                  {state.state}
                </div>
                <div className="text-[#6B7280] text-sm mt-0.5">{stateLabel(state.state)}</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
                  <span className="bg-[#F4F6F9] px-2 py-0.5 rounded-full font-medium">
                    {state.postcodes.length.toLocaleString()} postcodes
                  </span>
                  <span className="bg-[#F4F6F9] px-2 py-0.5 rounded-full font-medium">
                    {state.localityCount.toLocaleString()} suburbs
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
                { href: "/au/postcodes", label: "All Postcodes" },
                { href: "/au/suburbs", label: "All Suburbs" },
                { href: "/au/a-z", label: "A–Z Index" },
                { href: "/au/state/nsw", label: "NSW" },
                { href: "/au/state/vic", label: "VIC" },
                { href: "/au/state/qld", label: "QLD" },
                { href: "/au/state/wa", label: "WA" },
                { href: "/au/state/sa", label: "SA" },
                { href: "/au/state/tas", label: "TAS" },
                { href: "/au/state/nt", label: "NT" },
                { href: "/au/state/act", label: "ACT" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 bg-[#F4F6F9] hover:bg-[#0B2545] hover:text-white text-[#1A1A2E] rounded-lg text-sm font-medium border border-[#E2E6ED] transition-colors"
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
