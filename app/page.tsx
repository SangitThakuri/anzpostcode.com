import type { Metadata } from "next";
import { MapPin, Search, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQAccordion from "@/components/ui/FAQAccordion";
import HomeContent from "@/components/ui/HomeContent";
import {
  getAUStateGroups,
  getNZRegionGroups,
  getAUPostcodeGroups,
  getNZPostcodeGroups,
  getAULocalityGroups,
  getPopularAUPostcodes,
  getPopularNZPostcodes,
} from "@/lib/data";

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
      "Type a New Zealand locality name or 4-digit postcode in the search box. You can also browse by region using the New Zealand section.",
  },
  {
    question: "Is this data official?",
    answer:
      "Our data is community-sourced and updated regularly. For official postal address verification, please consult the relevant postal authority. This directory is intended for general reference.",
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

export default function HomePage() {
  const auStates = getAUStateGroups();
  const nzRegions = getNZRegionGroups().slice(0, 16);
  const auPostcodeCount = getAUPostcodeGroups().size;
  const nzPostcodeCount = getNZPostcodeGroups().size;
  const auSuburbCount = getAULocalityGroups().size;
  const popularAU = getPopularAUPostcodes();
  const popularNZ = getPopularNZPostcodes();

  return (
    <>
      <Header />
      <main>
        {/* Dynamic hero + browse + popular — all country-aware */}
        <HomeContent
          auStates={auStates}
          nzRegions={nzRegions}
          popularAU={popularAU}
          popularNZ={popularNZ}
          auPostcodeCount={auPostcodeCount}
          nzPostcodeCount={nzPostcodeCount}
          auSuburbCount={auSuburbCount}
        />

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
