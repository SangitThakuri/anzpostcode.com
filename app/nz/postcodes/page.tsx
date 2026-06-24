import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import { getNZPostcodeGroups, getNZRegionGroups } from "@/lib/data";
import { titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All New Zealand Postcodes – Complete List",
  description: "Browse all New Zealand postcodes by region. Complete NZ postcode directory.",
};

export default function NZPostcodesPage() {
  const map = getNZPostcodeGroups();
  const regions = getNZRegionGroups();
  const sorted = Array.from(map.values()).sort((a, b) => a.postcode.localeCompare(b.postcode));

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "New Zealand", href: "/nz" }, { label: "All Postcodes" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] via-[#1a3a2a] to-[#2D6A4F] text-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">All New Zealand Postcodes</h1>
            <p className="text-white/70 mb-6">{map.size.toLocaleString()} postcodes</p>
            <div className="max-w-lg"><SearchBox size="sm" placeholder="Search NZ postcodes…" /></div>
          </div>
        </section>

        <div className="bg-white border-b border-[#E2E6ED] sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
            {regions.map((r) => (
              <a key={r.slug} href={`#region-${r.slug}`}
                className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-xs font-medium whitespace-nowrap hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                {r.state}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {regions.map((rg) => {
            const rgPCs = sorted.filter((pg) => pg.state === rg.state);
            if (!rgPCs.length) return null;
            return (
              <section key={rg.slug} id={`region-${rg.slug}`}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">{rg.state}</h2>
                  <Link href={`/nz/region/${rg.slug}`} className="text-[#2D6A4F] text-xs font-medium hover:underline">View region →</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {rgPCs.map((pg) => (
                    <Link key={pg.postcode} href={`/nz/postcode/${pg.postcode}`}
                      className="bg-white border border-[#E2E6ED] rounded-lg p-2.5 hover:border-[#2D6A4F] hover:shadow-sm transition-all">
                      <div className="font-[family-name:var(--font-sora)] font-bold text-[#2D6A4F] text-base">{pg.postcode}</div>
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
