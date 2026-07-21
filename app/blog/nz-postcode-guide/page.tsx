import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "New Zealand Postcode Guide – How NZ Postcodes Work",
  description: "New Zealand uses 4-digit postcodes introduced in 2006. Learn how NZ postcodes are structured, what the numbers mean, and how to find any NZ postcode.",
  alternates: { canonical: "https://anzpostcode.com/blog/nz-postcode-guide" },
  openGraph: { type: "article", locale: "en_NZ", url: "https://anzpostcode.com/blog/nz-postcode-guide", publishedTime: "2025-02-15T00:00:00.000Z", modifiedTime: "2025-02-15T00:00:00.000Z", authors: ["https://anzpostcode.com/about"], tags: ["postcodes", "New Zealand", "NZ Post"] },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "New Zealand Postcode Guide",
  datePublished: "2025-02-15",
  dateModified: "2025-02-15",
  author: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com" },
  publisher: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com", logo: { "@type": "ImageObject", url: "https://anzpostcode.com/og-image.svg" } },
  url: "https://anzpostcode.com/blog/nz-postcode-guide",
  mainEntityOfPage: "https://anzpostcode.com/blog/nz-postcode-guide",
  image: "https://anzpostcode.com/og-image.svg",
};

export default function NZPostcodeGuidePage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "New Zealand Postcode Guide" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] via-[#1a3a2a] to-[#2D6A4F] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-[#2D6A4F] border border-white/20 text-white px-2.5 py-1 rounded-full font-medium">🇳🇿 New Zealand</span>
              <span className="text-white/50 text-sm">January 2025 · 4 min read</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              New Zealand Postcode Guide
            </h1>
            <p className="text-white/70 text-lg">
              NZ introduced its current 4-digit postcode system in 2006. Here&apos;s how it works.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 space-y-8">

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">A relatively new system</h2>
              <p className="text-[#6B7280] leading-relaxed">
                New Zealand didn&apos;t always have postcodes. The current 4-digit system was introduced by NZ Post in July 2006, replacing the older 4-digit numeric codes that were used inconsistently. The new system was designed to be consistent, geographically logical, and compatible with international addressing standards. Before 2006, many NZ addresses simply didn&apos;t include a postcode at all.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">The 4-digit format</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                All NZ postcodes are 4 digits long, ranging from 0110 (Northland) to 9897 (Stewart Island/Rakiura). Unlike Australian postcodes, the first digit of an NZ postcode doesn&apos;t strictly map to one region — but broadly:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F9]">
                      <th className="text-left px-4 py-2.5 font-semibold text-[#0B2545] border border-[#E2E6ED]">Range</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#0B2545] border border-[#E2E6ED]">Primary area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["0110–0999", "Northland"],
                      ["1010–1072", "Auckland City (inner)"],
                      ["1500–1542", "Auckland (outer, east, west)"],
                      ["2010–2579", "Waikato, Bay of Plenty"],
                      ["3010–3999", "Gisborne, Hawke's Bay, Taranaki, Manawatu"],
                      ["4410–4999", "Wellington region"],
                      ["6011–6035", "Wellington City (inner)"],
                      ["7010–7999", "Nelson, Marlborough, West Coast"],
                      ["8011–8999", "Canterbury (Christchurch, South Canterbury)"],
                      ["9010–9897", "Otago, Southland"],
                    ].map(([range, area]) => (
                      <tr key={range} className="border-b border-[#E2E6ED] hover:bg-[#FAFBFC]">
                        <td className="px-4 py-2.5 font-bold text-[#2D6A4F] border border-[#E2E6ED]">{range}</td>
                        <td className="px-4 py-2.5 text-[#1A1A2E] border border-[#E2E6ED]">{area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Major city postcodes</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">Key postcodes for New Zealand&apos;s major cities:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { city: "Auckland CBD", pc: "1010" },
                  { city: "Wellington CBD", pc: "6011" },
                  { city: "Christchurch CBD", pc: "8011" },
                  { city: "Hamilton CBD", pc: "3204" },
                  { city: "Tauranga CBD", pc: "3110" },
                  { city: "Dunedin CBD", pc: "9016" },
                ].map(({ city, pc }) => (
                  <Link key={pc} href={`/nz/postcode/${pc}`}
                    className="bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl p-3 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                    <div className="font-bold text-[#2D6A4F] font-[family-name:var(--font-sora)] text-lg">{pc}</div>
                    <div className="text-[#6B7280] text-xs mt-0.5">{city}</div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">NZ vs AU postcodes</h2>
              <p className="text-[#6B7280] leading-relaxed">
                New Zealand postcodes differ from Australian ones in a few ways. NZ doesn&apos;t distinguish between delivery postcodes and mail centre postcodes — all NZ postcodes work for both street addresses and PO Boxes. NZ also doesn&apos;t use a state abbreviation in its postal addresses the same way Australia does; instead, NZ addresses typically include the suburb, city or town, and postcode. NZ Post recommends placing the postcode on the same line as the town or city name.
              </p>
            </section>

            <div className="bg-[#F4F6F9] rounded-xl p-5">
              <p className="text-[#0B2545] font-semibold mb-2">Browse NZ postcodes</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/nz/postcodes" className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#265f45] transition-colors">All NZ postcodes</Link>
                <Link href="/nz" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#2D6A4F] transition-colors">Browse by region</Link>
              </div>
            </div>
          </div>
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </main>
      <Footer />
    </>
  );
}
