import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, Globe, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBox from "@/components/ui/SearchBox";
import FAQAccordion from "@/components/ui/FAQAccordion";
import {
  getAUStateGroups,
  getNZRegionGroups,
  getAUPostcodeGroups,
  getNZPostcodeGroups,
  getAULocalityGroups,
  getPopularAUPostcodes,
  getPopularNZPostcodes,
} from "@/lib/data";
import { stateLabel, titleCase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ANZ Postcode – Australia & New Zealand Postcode Directory",
  description:
    "Search and explore Australian and New Zealand postcodes, suburbs, and localities. Find any postcode instantly with our comprehensive free directory.",
  openGraph: {
    title: "ANZ Postcode – Australia & New Zealand Postcode Directory",
    description:
      "Search and explore Australian and New Zealand postcodes, suburbs, and localities.",
    url: "https://anzpostcode.com",
  },
};

const faqs = [
  {
    question: "What is ANZPostcode?",
    answer:
      "ANZPostcode is a free online directory for Australian and New Zealand postcodes, suburbs, and localities. You can search any postcode or suburb to find location details, nearby areas, and map information.",
  },
  {
    question: "How do I find a postcode in Australia?",
    answer:
      "Use the search bar above to type a suburb name or postcode. You can also browse by state — click on any Australian state card below to explore postcodes in that state.",
  },
  {
    question: "How do I find a postcode in New Zealand?",
    answer:
      "Type a New Zealand locality name or 4-digit postcode in the search box. You can also browse by region using the New Zealand section below.",
  },
  {
    question: "Is this data official?",
    answer:
      "Our data is community-sourced and updated regularly. For official postal address verification, please consult Australia Post or NZ Post directly. This directory is intended for general reference.",
  },
  {
    question: "Can I search both Australia and New Zealand at once?",
    answer:
      "Yes! The search bar covers both countries simultaneously. Results will indicate whether each postcode is in Australia (AU) or New Zealand (NZ).",
  },
  {
    question: "Are all Australian postcodes covered?",
    answer:
      "We cover over 18,000 Australian postcode entries spanning all states and territories including NSW, VIC, QLD, SA, WA, TAS, NT, and ACT.",
  },
];

const AU_STATE_FLAGS: Record<string, string> = {
  NSW: "🏙️", VIC: "🏙️", QLD: "☀️", SA: "🌾", WA: "🏜️", TAS: "🌿", NT: "🌵", ACT: "🏛️",
};

export default function HomePage() {
  const auStates = getAUStateGroups();
  const nzRegions = getNZRegionGroups().slice(0, 8);
  const auPostcodeCount = getAUPostcodeGroups().size;
  const nzPostcodeCount = getNZPostcodeGroups().size;
  const auSuburbCount = getAULocalityGroups().size;
  const popularAU = getPopularAUPostcodes();
  const popularNZ = getPopularNZPostcodes();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B2545] via-[#112d5e] to-[#0B2545] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[#E8472A] blur-3xl" />
            <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-[#2D6A4F] blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
                <Link href="/au" className="px-5 py-2 rounded-full bg-[#E8472A] text-white text-sm font-semibold">
                  🇦🇺 Australia
                </Link>
                <Link href="/nz" className="px-5 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 text-sm font-semibold transition-colors">
                  🇳🇿 New Zealand
                </Link>
              </div>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold text-center mb-4 leading-tight">
              Australia &amp; New Zealand<br />
              <span className="text-[#E8472A]">Postcode Directory</span>
            </h1>
            <p className="text-white/70 text-center text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Search over {(auPostcodeCount + nzPostcodeCount).toLocaleString()} postcodes, suburbs and localities across both countries
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBox size="lg" placeholder="Search postcode, suburb, or locality…" />
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["2000", "Sydney", "Melbourne", "Auckland", "3000", "Wellington"].map((hint) => (
                  <Link
                    key={hint}
                    href={`/search?q=${encodeURIComponent(hint)}`}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-full transition-colors border border-white/20"
                  >
                    {hint}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b border-[#E2E6ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2E6ED]">
              {[
                { label: "AU Postcodes", value: auPostcodeCount.toLocaleString() },
                { label: "AU Suburbs", value: auSuburbCount.toLocaleString() },
                { label: "NZ Postcodes", value: nzPostcodeCount.toLocaleString() },
                { label: "NZ Localities", value: nzPostcodeCount.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="py-5 px-4 sm:px-8 text-center">
                  <div className="font-[family-name:var(--font-sora)] font-bold text-2xl sm:text-3xl text-[#0B2545]">
                    {stat.value}
                  </div>
                  <div className="text-[#6B7280] text-xs sm:text-sm mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by State */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">Browse by State</h2>
              <p className="text-[#6B7280] text-sm mt-1">Explore postcodes across Australia</p>
            </div>
            <Link href="/au" className="text-[#E8472A] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {auStates.map((state) => (
              <Link
                key={state.state}
                href={`/au/state/${state.slug}`}
                className="group bg-white rounded-xl border border-[#E2E6ED] p-5 hover:border-[#E8472A] hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{AU_STATE_FLAGS[state.state] ?? "📍"}</div>
                <div className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] group-hover:text-[#E8472A] transition-colors">
                  {state.state}
                </div>
                <div className="text-[#6B7280] text-xs mt-0.5">{stateLabel(state.state)}</div>
                <div className="text-[#E8472A] text-xs mt-2 font-medium">
                  {state.postcodes.length.toLocaleString()} postcodes
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular AU */}
        <section className="bg-white border-y border-[#E2E6ED] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">Popular AU Postcodes</h2>
                <p className="text-[#6B7280] text-sm mt-1">Most searched Australian postcodes</p>
              </div>
              <Link href="/au/postcodes" className="text-[#E8472A] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularAU.map((pg) => (
                <Link
                  key={pg.postcode}
                  href={`/au/postcode/${pg.postcode}`}
                  className="group bg-[#F4F6F9] hover:bg-white border border-[#E2E6ED] hover:border-[#E8472A] hover:shadow-md rounded-xl p-4 transition-all"
                >
                  <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#E8472A]">{pg.postcode}</div>
                  <div className="text-[#1A1A2E] font-medium text-sm mt-1 truncate">{titleCase(pg.localities[0] ?? "")}</div>
                  <div className="text-[#6B7280] text-xs">{pg.state} · Australia</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse NZ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">Browse New Zealand</h2>
              <p className="text-[#6B7280] text-sm mt-1">Explore localities by region</p>
            </div>
            <Link href="/nz" className="text-[#2D6A4F] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {nzRegions.map((region) => (
              <Link
                key={region.slug}
                href={`/nz/region/${region.slug}`}
                className="group bg-white rounded-xl border border-[#E2E6ED] p-5 hover:border-[#2D6A4F] hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">🇳🇿</div>
                <div className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] group-hover:text-[#2D6A4F] transition-colors text-sm">
                  {region.state}
                </div>
                <div className="text-[#2D6A4F] text-xs mt-2 font-medium">{region.postcodes.length} postcodes</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular NZ */}
        {popularNZ.length > 0 && (
          <section className="bg-white border-y border-[#E2E6ED] py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">Popular NZ Postcodes</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Most searched New Zealand postcodes</p>
                </div>
                <Link href="/nz/postcodes" className="text-[#2D6A4F] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularNZ.map((pg) => (
                  <Link
                    key={pg.postcode}
                    href={`/nz/postcode/${pg.postcode}`}
                    className="group bg-[#F4F6F9] hover:bg-white border border-[#E2E6ED] hover:border-[#2D6A4F] hover:shadow-md rounded-xl p-4 transition-all"
                  >
                    <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#2D6A4F]">{pg.postcode}</div>
                    <div className="text-[#1A1A2E] font-medium text-sm mt-1 truncate">{titleCase(pg.localities[0] ?? "")}</div>
                    <div className="text-[#6B7280] text-xs">{pg.state} · NZ</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">How It Works</h2>
            <p className="text-[#6B7280] mt-2">Simple, fast, and free postcode lookups</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-6 h-6" />, title: "Search", desc: "Type any suburb, locality, or postcode number into our instant search." },
              { icon: <MapPin className="w-6 h-6" />, title: "Discover", desc: "See location details, nearby suburbs, and an interactive map." },
              { icon: <Globe className="w-6 h-6" />, title: "Explore", desc: "Browse all postcodes by state, region, or alphabetical index." },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E6ED] p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#0B2545] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-2">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white border-y border-[#E2E6ED] py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ANZ Postcode",
              url: "https://anzpostcode.com",
              description: "Australia and New Zealand postcode directory",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://anzpostcode.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
