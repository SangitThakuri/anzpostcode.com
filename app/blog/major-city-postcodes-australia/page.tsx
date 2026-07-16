import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Major City Postcodes in Australia – CBD Postcodes for Every Capital",
  description: "Quick reference for Australian CBD postcodes: Sydney 2000, Melbourne 3000, Brisbane 4000, Adelaide 5000, Perth 6000, Hobart 7000, Darwin 0800, Canberra 2601.",
  alternates: { canonical: "https://anzpostcode.com/blog/major-city-postcodes-australia" },
  openGraph: { locale: "en_AU", url: "https://anzpostcode.com/blog/major-city-postcodes-australia" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Major City Postcodes in Australia",
  datePublished: "2025-01-01",
  dateModified: "2025-01-01",
  author: { "@type": "Organization", name: "ANZ Postcode" },
  publisher: { "@type": "Organization", name: "ANZ Postcode", url: "https://anzpostcode.com" },
};

const cities = [
  {
    city: "Sydney",
    state: "NSW",
    cbdPostcode: "2000",
    description: "Sydney CBD, including the central business district, The Rocks, and Haymarket. The Greater Sydney metro area spans postcodes 2000–2234.",
    nearbyPostcodes: ["2010", "2011", "2006", "2007"],
    stateSlug: "nsw",
    population: "5.3 million",
  },
  {
    city: "Melbourne",
    state: "VIC",
    cbdPostcode: "3000",
    description: "Melbourne CBD and Docklands. The greater Melbourne metro area covers postcodes 3000–3207 and 3800–3978.",
    nearbyPostcodes: ["3004", "3006", "3008", "3053"],
    stateSlug: "vic",
    population: "5.2 million",
  },
  {
    city: "Brisbane",
    state: "QLD",
    cbdPostcode: "4000",
    description: "Brisbane CBD and the inner-city area. The Brisbane LGA spans postcodes 4000–4179.",
    nearbyPostcodes: ["4006", "4007", "4101", "4059"],
    stateSlug: "qld",
    population: "2.6 million",
  },
  {
    city: "Adelaide",
    state: "SA",
    cbdPostcode: "5000",
    description: "Adelaide CBD, including the city of Adelaide. Greater Adelaide spans postcodes 5000–5168.",
    nearbyPostcodes: ["5006", "5007", "5034", "5067"],
    stateSlug: "sa",
    population: "1.4 million",
  },
  {
    city: "Perth",
    state: "WA",
    cbdPostcode: "6000",
    description: "Perth CBD and the inner city. Greater Perth spans postcodes 6000–6215.",
    nearbyPostcodes: ["6003", "6004", "6005", "6008"],
    stateSlug: "wa",
    population: "2.2 million",
  },
  {
    city: "Hobart",
    state: "TAS",
    cbdPostcode: "7000",
    description: "Hobart CBD and the central Hobart area. Greater Hobart covers postcodes 7000–7054.",
    nearbyPostcodes: ["7004", "7005", "7007", "7008"],
    stateSlug: "tas",
    population: "240,000",
  },
  {
    city: "Darwin",
    state: "NT",
    cbdPostcode: "0800",
    description: "Darwin CBD. Darwin and the surrounding area spans postcodes 0800–0835.",
    nearbyPostcodes: ["0810", "0812", "0820", "0828"],
    stateSlug: "nt",
    population: "148,000",
  },
  {
    city: "Canberra",
    state: "ACT",
    cbdPostcode: "2601",
    description: "Canberra CBD (Civic). The ACT spans postcodes 2600–2617 and 2900–2920. Note: 0200 is used for the ANU campus.",
    nearbyPostcodes: ["2600", "2602", "2603", "2604"],
    stateSlug: "act",
    population: "470,000",
  },
];

export default function MajorCityPostcodesPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Major City Postcodes in Australia" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-[#E8472A] text-white px-2.5 py-1 rounded-full font-medium">🇦🇺 Australia</span>
              <span className="text-white/50 text-sm">January 2025 · 3 min read</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              Major City Postcodes in Australia
            </h1>
            <p className="text-white/70 text-lg">
              CBD postcodes for every Australian capital city — your quick reference guide.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
            <p className="text-[#6B7280] leading-relaxed">
              Each Australian capital city&apos;s CBD has a well-known postcode, and the same pattern repeats nationally: capital CBDs start at x000 (e.g. 3000 for Melbourne). Here&apos;s a detailed breakdown for every state and territory capital.
            </p>
          </div>

          {cities.map((c) => (
            <div key={c.city} className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Link href={`/au/postcode/${c.cbdPostcode}`}>
                    <div className="w-16 h-16 bg-[#E8472A] rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold font-[family-name:var(--font-sora)] text-lg">{c.cbdPostcode}</span>
                    </div>
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">{c.city}</h2>
                    <span className="text-xs bg-[#F4F6F9] text-[#6B7280] px-2 py-0.5 rounded-full font-medium">{c.state}</span>
                  </div>
                  <p className="text-[#6B7280] text-sm">Population: ~{c.population}</p>
                </div>
              </div>
              <p className="text-[#6B7280] leading-relaxed text-sm mb-4">{c.description}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[#6B7280] text-xs">Nearby postcodes:</span>
                {c.nearbyPostcodes.map((pc) => (
                  <Link key={pc} href={`/au/postcode/${pc}`}
                    className="px-2.5 py-1 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-xs font-semibold text-[#E8472A] hover:border-[#E8472A] transition-colors">
                    {pc}
                  </Link>
                ))}
                <Link href={`/au/state/${c.stateSlug}`} className="text-[#E8472A] text-xs hover:underline ml-auto">
                  All {c.state} postcodes →
                </Link>
              </div>
            </div>
          ))}

          <div className="bg-[#F4F6F9] rounded-2xl p-6">
            <p className="text-[#0B2545] font-semibold mb-2">Looking for a specific postcode?</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link href="/au/postcodes" className="px-4 py-2 bg-[#E8472A] text-white rounded-lg text-sm font-medium hover:bg-[#d43d22] transition-colors">Browse all postcodes</Link>
              <Link href="/search" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#E8472A] transition-colors">Search by suburb</Link>
            </div>
          </div>
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </main>
      <Footer />
    </>
  );
}
