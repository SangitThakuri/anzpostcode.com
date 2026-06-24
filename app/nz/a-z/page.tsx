import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getNZLocalityGroups } from "@/lib/data";
import { titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "New Zealand Postcodes A–Z Index",
  description: "Alphabetical index of all New Zealand localities with their postcodes.",
};

export default function NZAZPage() {
  const localities = Array.from(getNZLocalityGroups().values()).sort((a, b) =>
    a.locality.localeCompare(b.locality)
  );
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "New Zealand", href: "/nz" }, { label: "A–Z Index" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] via-[#1a3a2a] to-[#2D6A4F] text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold mb-2">NZ A–Z Index</h1>
            <p className="text-white/70">Browse NZ localities alphabetically</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-1 mb-10">
            {letters.map((l) => (
              <a key={l} href={`#az-${l}`}
                className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white border border-[#E2E6ED] hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div className="space-y-8">
            {letters.map((letter) => {
              const group = localities.filter((l) => l.locality[0]?.toUpperCase() === letter);
              if (!group.length) return null;
              return (
                <section key={letter} id={`az-${letter}`}>
                  <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3 border-b border-[#E2E6ED] pb-1">{letter}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                    {group.map((lg) => (
                      <Link key={lg.slug} href={`/nz/locality/${lg.slug}`}
                        className="flex items-center justify-between px-3 py-2 bg-white border border-[#E2E6ED] rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors text-sm group">
                        <span className="text-[#1A1A2E] group-hover:text-[#2D6A4F]">{titleCase(lg.locality)}</span>
                        <span className="text-[#6B7280] text-xs ml-2">{lg.postcodes[0]}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
