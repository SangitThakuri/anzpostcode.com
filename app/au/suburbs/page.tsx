import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import { getAULocalityGroups } from "@/lib/data";
import { titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Australian Suburbs – Complete Directory",
  description: "Browse all Australian suburbs and localities. Find the postcode for any suburb in NSW, VIC, QLD, SA, WA, TAS, NT, and ACT.",
};

export default function AUSuburbsPage() {
  const map = getAULocalityGroups();
  const sorted = Array.from(map.values()).sort((a, b) =>
    a.locality.localeCompare(b.locality)
  );

  const letters = [...new Set(sorted.map((l) => l.locality[0]?.toUpperCase() ?? "#"))];

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Australia", href: "/au" }, { label: "All Suburbs" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">All Australian Suburbs</h1>
            <p className="text-white/70 mb-6">{map.size.toLocaleString()} suburbs & localities</p>
            <div className="max-w-lg"><SearchBox size="sm" placeholder="Search suburbs…" /></div>
          </div>
        </section>

        <div className="bg-white border-b border-[#E2E6ED] sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-1 overflow-x-auto">
            {letters.map((l) => (
              <a key={l} href={`#letter-${l}`}
                className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold bg-[#F4F6F9] border border-[#E2E6ED] hover:bg-[#E8472A] hover:text-white hover:border-[#E8472A] transition-colors flex-shrink-0">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {letters.map((letter) => {
            const group = sorted.filter((l) => (l.locality[0]?.toUpperCase() ?? "#") === letter);
            return (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545] mb-4 border-b border-[#E2E6ED] pb-2">
                  {letter}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {group.map((lg) => (
                    <Link key={lg.slug} href={`/au/suburb/${lg.slug}`}
                      className="bg-white border border-[#E2E6ED] rounded-lg p-2.5 hover:border-[#E8472A] hover:shadow-sm transition-all">
                      <div className="text-[#1A1A2E] font-medium text-xs">{titleCase(lg.locality)}</div>
                      <div className="text-[#E8472A] text-xs mt-0.5">{lg.postcodes[0]} · {lg.state}</div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
