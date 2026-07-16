import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Postcode vs Suburb: What's the Difference? – ANZ Postcode",
  description: "A suburb is a geographic area; a postcode is a postal delivery zone. They don't always match — one suburb can have multiple postcodes, and vice versa. Here's why.",
  alternates: { canonical: "https://anzpostcode.com/blog/postcode-vs-suburb" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Postcode vs Suburb: What's the Difference?",
  datePublished: "2025-01-01",
  dateModified: "2025-01-01",
  author: { "@type": "Organization", name: "ANZ Postcode" },
  publisher: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com" },
};

export default function PostcodeVsSuburbPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Postcode vs Suburb" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full font-medium border border-white/20">Explainer</span>
              <span className="text-white/50 text-sm">January 2025 · 4 min read</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              Postcode vs Suburb: What&apos;s the Difference?
            </h1>
            <p className="text-white/70 text-lg">
              They&apos;re not the same thing — and they don&apos;t always line up neatly. Here&apos;s what you need to know.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 space-y-8">

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">The simple definition</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F4F6F9] rounded-xl p-4">
                  <p className="font-semibold text-[#0B2545] mb-1">Suburb</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed">A geographic area — a named neighbourhood or district with defined boundaries on a map. Suburbs are maintained by local governments and have official names registered with the state.</p>
                </div>
                <div className="bg-[#F4F6F9] rounded-xl p-4">
                  <p className="font-semibold text-[#0B2545] mb-1">Postcode</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed">A postal delivery zone — a number assigned by Australia Post (or NZ Post) for sorting and delivering mail. Postcodes follow delivery routes, not geographic boundaries.</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                Because suburbs are defined geographically and postcodes are defined for mail delivery efficiency, they don&apos;t always align perfectly. This mismatch is common and completely normal.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Multiple suburbs, one postcode</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                This is the most common scenario. A single postcode can cover several neighbouring suburbs, especially in rural and regional areas where mail volumes are low. For example:
              </p>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                <li className="flex gap-2"><span className="text-[#E8472A] font-bold flex-shrink-0">→</span><span>Postcode <Link href="/au/postcode/2000" className="text-[#E8472A] hover:underline">2000</Link> covers Sydney CBD, Haymarket, and The Rocks.</span></li>
                <li className="flex gap-2"><span className="text-[#E8472A] font-bold flex-shrink-0">→</span><span>Many regional NSW postcodes cover 3–5 small towns across a wide area.</span></li>
                <li className="flex gap-2"><span className="text-[#E8472A] font-bold flex-shrink-0">→</span><span>In Tasmania, rural postcodes often span entire valleys or island groupings.</span></li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">One suburb, multiple postcodes</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Large suburbs, especially in outer metropolitan areas, are sometimes split across two postcodes. This happens when a suburb straddles a postal delivery boundary, or when it was originally designed for a smaller area and grew to cover a larger one. For example:
              </p>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                <li className="flex gap-2"><span className="text-[#E8472A] font-bold flex-shrink-0">→</span><span>Some outer Sydney suburbs have two postcodes for different streets within the same named suburb.</span></li>
                <li className="flex gap-2"><span className="text-[#E8472A] font-bold flex-shrink-0">→</span><span>In Queensland, rapidly growing new suburbs sometimes get a second postcode added before boundaries are formally redrawn.</span></li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Why does this matter?</h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                For most everyday purposes — filling in forms, buying online, receiving deliveries — either the suburb name or the postcode is enough. But there are cases where the distinction matters:
              </p>
              <ul className="space-y-3 text-[#6B7280] text-sm">
                <li className="flex gap-2">
                  <span className="text-[#E8472A] font-bold flex-shrink-0 mt-0.5">1.</span>
                  <span><strong className="text-[#1A1A2E]">Insurance and service zones:</strong> Insurance, utilities, and delivery services often use postcode (not suburb name) to determine eligibility or pricing. A suburb that spans two postcodes may fall into different risk categories.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E8472A] font-bold flex-shrink-0 mt-0.5">2.</span>
                  <span><strong className="text-[#1A1A2E]">Property searches:</strong> Real estate searches filtered by suburb may miss properties in a neighbouring suburb that actually uses the same postcode.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E8472A] font-bold flex-shrink-0 mt-0.5">3.</span>
                  <span><strong className="text-[#1A1A2E]">School catchments:</strong> School zones are defined by street address, not postcode. Don&apos;t assume that having the &quot;right&quot; postcode puts you in a school&apos;s catchment.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Looking up the right postcode</h2>
              <p className="text-[#6B7280] leading-relaxed">
                The most reliable approach is to search by suburb name — this will return the correct postcode(s) for that suburb. If you search our{" "}
                <Link href="/au/suburbs" className="text-[#E8472A] hover:underline">suburb directory</Link>, you can see which postcode(s) a suburb belongs to, and vice versa: each postcode page lists all suburbs that fall within it.
              </p>
            </section>

            <div className="bg-[#F4F6F9] rounded-xl p-5">
              <p className="text-[#0B2545] font-semibold mb-1">Search by suburb or postcode</p>
              <p className="text-[#6B7280] text-sm mb-3">Find the right postcode for any suburb — or see all suburbs in a postcode.</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/au/suburbs" className="px-4 py-2 bg-[#E8472A] text-white rounded-lg text-sm font-medium hover:bg-[#d43d22] transition-colors">Browse all suburbs</Link>
                <Link href="/search" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#E8472A] transition-colors">Search</Link>
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
