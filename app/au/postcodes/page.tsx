import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import { getAUPostcodeGroups, getAUStateGroups } from "@/lib/data";
import { stateLabel, titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Australian Postcodes – Complete List",
  description: "Browse the complete list of Australian postcodes. Search by postcode number, suburb name, or state.",
};

export default function AUPostcodesPage() {
  const map = getAUPostcodeGroups();
  const states = getAUStateGroups();
  const byState = new Map<string, typeof states[0]>();
  for (const s of states) byState.set(s.state, s);

  const sorted = Array.from(map.values()).sort((a, b) => a.postcode.localeCompare(b.postcode));

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Australia", href: "/au" }, { label: "All Postcodes" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              All Australian Postcodes
            </h1>
            <p className="text-white/70 mb-6">{map.size.toLocaleString()} postcodes</p>
            <div className="max-w-lg">
              <SearchBox size="sm" placeholder="Search postcodes or suburbs…" />
            </div>
          </div>
        </section>

        {/* State filters */}
        <div className="bg-white border-b border-[#E2E6ED] sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
            {states.map((s) => (
              <a key={s.state} href={`#state-${s.state}`}
                className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-xs font-medium whitespace-nowrap hover:border-[#E8472A] hover:text-[#E8472A] transition-colors">
                {s.state}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {states.map((stateGroup) => {
            const statePCs = sorted.filter((pg) => pg.state === stateGroup.state);
            if (!statePCs.length) return null;
            return (
              <section key={stateGroup.state} id={`state-${stateGroup.state}`}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">
                    {stateLabel(stateGroup.state)} ({stateGroup.state})
                  </h2>
                  <Link href={`/au/state/${stateGroup.slug}`}
                    className="text-[#E8472A] text-xs font-medium hover:underline">
                    View state page →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {statePCs.map((pg) => (
                    <Link key={pg.postcode} href={`/au/postcode/${pg.postcode}`}
                      className="group bg-white border border-[#E2E6ED] rounded-lg p-2.5 hover:border-[#E8472A] hover:shadow-sm transition-all">
                      <div className="font-[family-name:var(--font-sora)] font-bold text-[#E8472A] text-base">{pg.postcode}</div>
                      <div className="text-[#1A1A2E] text-xs mt-0.5 truncate">{titleCase(pg.localities[0] ?? "")}</div>
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
