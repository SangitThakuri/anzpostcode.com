import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "How Australian Postcodes Work – Format, History & State Guide",
  description: "Australia uses a 4-digit postcode system. The first digit maps to a state or territory — 2 for NSW, 3 for VIC, 4 for QLD, and so on. Full explainer inside.",
  alternates: { canonical: "https://anzpostcode.com/blog/how-australian-postcodes-work" },
  openGraph: {
    type: "article",
    locale: "en_AU",
    url: "https://anzpostcode.com/blog/how-australian-postcodes-work",
    publishedTime: "2025-01-15T00:00:00.000Z",
    modifiedTime: "2025-01-15T00:00:00.000Z",
    authors: ["https://anzpostcode.com/about"],
    tags: ["postcodes", "Australia", "mail", "state guide"],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Australian Postcodes Work",
  description: "Australia uses a 4-digit postcode system where the first digit maps to a state or territory.",
  datePublished: "2025-01-15",
  dateModified: "2025-01-15",
  author: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com" },
  publisher: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com", logo: { "@type": "ImageObject", url: "https://anzpostcode.com/og-image.svg" } },
  url: "https://anzpostcode.com/blog/how-australian-postcodes-work",
  mainEntityOfPage: "https://anzpostcode.com/blog/how-australian-postcodes-work",
  image: "https://anzpostcode.com/og-image.svg",
};

export default function HowAUPostcodesWorkPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "How Australian Postcodes Work" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-[#E8472A] text-white px-2.5 py-1 rounded-full font-medium">🇦🇺 Australia</span>
              <span className="text-white/50 text-sm">January 2025 · 5 min read</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              How Australian Postcodes Work
            </h1>
            <p className="text-white/70 text-lg">
              The first digit of an Australian postcode tells you the state. Here&apos;s everything you need to know about the AU postcode system.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose-custom">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 space-y-8">

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">The 4-digit format</h2>
              <p className="text-[#6B7280] leading-relaxed">
                All Australian postcodes are exactly 4 digits long — for example, <Link href="/au/postcode/2000" className="text-[#E8472A] hover:underline">2000</Link> (Sydney CBD) or <Link href="/au/postcode/3000" className="text-[#E8472A] hover:underline">3000</Link> (Melbourne CBD). The system was introduced in 1967 by the then-Postmaster-General&apos;s Department to speed up mail sorting, at a time when the volume of letters was growing rapidly and manual sorting by town name alone was becoming impractical.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">First digit = state or territory</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                The first digit of an Australian postcode identifies the state or territory. This makes it easy to determine the general location of any postcode at a glance:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F9]">
                      <th className="text-left px-4 py-2.5 font-semibold text-[#0B2545] border border-[#E2E6ED]">First digit</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#0B2545] border border-[#E2E6ED]">State / Territory</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#0B2545] border border-[#E2E6ED]">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["0", "Northern Territory (0800–0999) & ACT (0200–0299)", "0800 = Darwin"],
                      ["1", "NSW Mail Centre codes (PO Boxes only)", "1000 = Sydney Mail Centre"],
                      ["2", "New South Wales & ACT", "2000 = Sydney CBD"],
                      ["3", "Victoria", "3000 = Melbourne CBD"],
                      ["4", "Queensland", "4000 = Brisbane CBD"],
                      ["5", "South Australia", "5000 = Adelaide CBD"],
                      ["6", "Western Australia", "6000 = Perth CBD"],
                      ["7", "Tasmania", "7000 = Hobart CBD"],
                      ["8", "VIC & SA Mail Centre codes", "8011 = Melbourne Mail Centre"],
                      ["9", "WA & NT Mail Centre codes", "9000 = Perth Mail Centre"],
                    ].map(([digit, state, ex]) => (
                      <tr key={digit} className="border-b border-[#E2E6ED] hover:bg-[#FAFBFC]">
                        <td className="px-4 py-2.5 font-bold text-[#E8472A] border border-[#E2E6ED]">{digit}xxx</td>
                        <td className="px-4 py-2.5 text-[#1A1A2E] border border-[#E2E6ED]">{state}</td>
                        <td className="px-4 py-2.5 text-[#6B7280] border border-[#E2E6ED]">{ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#6B7280] text-sm mt-3">
                Browse all postcodes by range: {["0","1","2","3","4","5","6","7","8","9"].map((d, i) => (
                  <span key={d}>{i > 0 && ", "}<Link href={`/au/postcodes/range/${d}`} className="text-[#E8472A] hover:underline">{d}xxx</Link></span>
                ))}
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Delivery vs. mail centre postcodes</h2>
              <p className="text-[#6B7280] leading-relaxed">
                Standard postcodes (starting with 2, 3, 4, 5, 6, 7) are used for street addresses — residential homes, businesses, and institutions. Mail centre postcodes (starting with 1, 8, 9) are reserved for PO Boxes and bulk mail facilities. If you&apos;re filling in a form with a home address, you&apos;ll always use a standard delivery postcode.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">One postcode, multiple suburbs</h2>
              <p className="text-[#6B7280] leading-relaxed">
                A single postcode can cover multiple suburbs. For example, postcode <Link href="/au/postcode/2000" className="text-[#E8472A] hover:underline">2000</Link> covers both Sydney CBD and Haymarket. Conversely, some large suburbs are split across multiple postcodes — especially in outer metropolitan areas. This is why you should always look up the specific suburb name, not just assume a postcode.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">How postcodes are assigned</h2>
              <p className="text-[#6B7280] leading-relaxed">
                Postcodes are assigned by Australia Post and follow geographic and delivery route logic — nearby areas generally have similar numbers. Within a state, lower-numbered postcodes tend to be closer to the capital city. For example, in NSW, the 2000s cover inner Sydney, while the 2800–2999 range covers rural and regional areas. New postcodes are occasionally created when large new suburbs are established.
              </p>
            </section>

            <div className="bg-[#F4F6F9] rounded-xl p-5">
              <p className="text-[#0B2545] font-semibold mb-2">Find any Australian postcode</p>
              <p className="text-[#6B7280] text-sm mb-3">Search by suburb name, postcode number, or browse by state.</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/au/postcodes" className="px-4 py-2 bg-[#E8472A] text-white rounded-lg text-sm font-medium hover:bg-[#d43d22] transition-colors">Browse all AU postcodes</Link>
                <Link href="/search" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#E8472A] transition-colors">Search postcodes</Link>
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
