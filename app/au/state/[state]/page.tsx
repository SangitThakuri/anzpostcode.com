import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getAUStateGroups, getAUPostcodeGroups } from "@/lib/data";
import { stateLabel, titleCase, absoluteUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ state: string }>;
}

const STATE_DATA: Record<string, {
  capital: string;
  population: string;
  area: string;
  majorCities: string[];
  description: string;
  postcodeRange: string;
}> = {
  NSW: {
    capital: "Sydney",
    population: "8.3 million",
    area: "800,628 km²",
    majorCities: ["Sydney", "Newcastle", "Wollongong", "Albury", "Wagga Wagga"],
    description: "New South Wales is Australia's most populous state, home to the iconic Sydney Opera House and Harbour Bridge. Postcodes span from metropolitan Sydney through the Blue Mountains, Hunter Valley wine region, coastal towns, and out to the vast western outback.",
    postcodeRange: "1000–2999",
  },
  VIC: {
    capital: "Melbourne",
    population: "6.7 million",
    area: "237,629 km²",
    majorCities: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
    description: "Victoria is Australia's second-most populous state, renowned for Melbourne's coffee culture, arts scene, and diverse laneways. Its postcodes cover everything from inner-city Melbourne to the Great Ocean Road, Yarra Valley wine country, and the Victorian Alps.",
    postcodeRange: "3000–3999",
  },
  QLD: {
    capital: "Brisbane",
    population: "5.4 million",
    area: "1,730,648 km²",
    majorCities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
    description: "Queensland — the Sunshine State — stretches from the subtropical Gold Coast and Brisbane up to tropical Cairns and the Cape York Peninsula. Its postcodes cover Australia's third-largest city, the Great Barrier Reef corridor, and vast outback regions.",
    postcodeRange: "4000–4999",
  },
  SA: {
    capital: "Adelaide",
    population: "1.8 million",
    area: "983,482 km²",
    majorCities: ["Adelaide", "Mount Gambier", "Whyalla", "Port Augusta", "Port Lincoln"],
    description: "South Australia is famous for its world-class wine regions including the Barossa Valley, McLaren Vale, and Clare Valley. Adelaide postcodes cluster around the Gulf St Vincent coast, while regional postcodes stretch across the Flinders Ranges, Eyre Peninsula, and outback.",
    postcodeRange: "5000–5999",
  },
  WA: {
    capital: "Perth",
    population: "2.8 million",
    area: "2,529,875 km²",
    majorCities: ["Perth", "Fremantle", "Bunbury", "Geraldton", "Kalgoorlie"],
    description: "Western Australia is Australia's largest state by area, covering a third of the continent. Perth postcodes sit along the Indian Ocean coast, while regional WA postcodes span the Margaret River wine region, the Kimberley's ancient gorges, and remote goldfields.",
    postcodeRange: "6000–6999",
  },
  TAS: {
    capital: "Hobart",
    population: "570,000",
    area: "68,401 km²",
    majorCities: ["Hobart", "Launceston", "Devonport", "Burnie", "Ulverstone"],
    description: "Tasmania is Australia's only island state, known for its pristine wilderness, rugged coastlines, and world-class food and wine scene. Postcode 7000 covers Hobart's CBD, while Tasmania's rural postcodes encompass the Huon Valley, Cradle Mountain, and the Tasmanian Wilderness World Heritage Area.",
    postcodeRange: "7000–7999",
  },
  NT: {
    capital: "Darwin",
    population: "250,000",
    area: "1,349,129 km²",
    majorCities: ["Darwin", "Alice Springs", "Katherine", "Nhulunbuy", "Tennant Creek"],
    description: "The Northern Territory covers the Top End, Red Centre, and vast stretches of outback Australia. Darwin postcodes begin at 0800, serving the tropical capital city, while Alice Springs (0870) is the gateway to Uluru and the MacDonnell Ranges.",
    postcodeRange: "0800–0999",
  },
  ACT: {
    capital: "Canberra",
    population: "460,000",
    area: "2,358 km²",
    majorCities: ["Canberra", "Belconnen", "Tuggeranong", "Gungahlin", "Woden"],
    description: "The Australian Capital Territory is home to the nation's capital, Canberra, and is entirely surrounded by New South Wales. ACT postcodes cover the parliamentary triangle, university precinct, and planned satellite towns, along with the Namadgi National Park.",
    postcodeRange: "0200–0299 and 2600–2618",
  },
};

export async function generateStaticParams() {
  return getAUStateGroups().map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const label = stateLabel(stateCode);
  const info = STATE_DATA[stateCode];
  const groups = getAUStateGroups();
  const sg = groups.find((s) => s.slug === state);
  const postcodeCount = sg?.postcodes.length ?? 0;
  return {
    title: `${label} Postcodes – Complete List of ${postcodeCount.toLocaleString()} ${stateCode} Postcodes`,
    description: `Browse all ${postcodeCount.toLocaleString()} postcodes in ${label} (${stateCode}), Australia. Capital: ${info?.capital ?? label}. Postcode range: ${info?.postcodeRange ?? ""}. Find suburb details, nearby areas, and maps.`,
    openGraph: {
      title: `${label} Postcodes – ${stateCode}, Australia`,
      url: absoluteUrl(`/au/state/${state}`),
      locale: "en_AU",
    },
    alternates: { canonical: absoluteUrl(`/au/state/${state}`) },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const states = getAUStateGroups();
  const stateGroup = states.find((s) => s.slug === state || s.state === stateCode);
  if (!stateGroup) notFound();

  const label = stateLabel(stateGroup.state);
  const info = STATE_DATA[stateGroup.state];
  const postcodeMap = getAUPostcodeGroups();

  const postcodes = stateGroup.postcodes
    .map((pc) => postcodeMap.get(pc))
    .filter(Boolean)
    .sort((a, b) => a!.postcode.localeCompare(b!.postcode));

  const firstPc = postcodes[0]?.postcode ?? "—";
  const lastPc = postcodes[postcodes.length - 1]?.postcode ?? "—";

  const faqs = [
    {
      question: `How many postcodes are in ${label}?`,
      answer: `${label} has ${stateGroup.postcodes.length.toLocaleString()} postcodes covering ${stateGroup.localityCount.toLocaleString()} suburbs and localities.`,
    },
    {
      question: `What is the postcode range for ${stateGroup.state}?`,
      answer: `${label} postcodes run from ${firstPc} to ${lastPc}. ${info?.postcodeRange ? `The standard postcode range for ${stateCode} is ${info.postcodeRange}.` : ""}`,
    },
    {
      question: `What is the capital of ${label} and its postcode?`,
      answer: info
        ? `The capital of ${label} is ${info.capital}. ${info.capital} city postcodes can be found by browsing the list below or searching for "${info.capital}" in the search box.`
        : `Browse the postcode list below to find ${label}'s capital city postcodes.`,
    },
    {
      question: `What are the major cities in ${label}?`,
      answer: info
        ? `The major cities and towns in ${label} include ${info.majorCities.join(", ")}.`
        : `Browse the postcode list to explore localities across ${label}.`,
    },
    {
      question: `How do I find a specific suburb in ${stateGroup.state}?`,
      answer: `Use the search box above and type the suburb name or postcode. Each postcode card below links to a full detail page showing all suburbs in that postcode, nearby areas, and an interactive map.`,
    },
    {
      question: `What is the population of ${label}?`,
      answer: info
        ? `${label} has a population of approximately ${info.population}, making it one of Australia's key states. It covers an area of ${info.area}.`
        : `${label} is one of Australia's states and territories.`,
    },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Australia", href: "/au" }, { label: label }]} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#E8472A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇦🇺 Australia</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">{stateGroup.state}</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-3">
                  {label}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  <span>{stateGroup.postcodes.length.toLocaleString()} postcodes</span>
                  <span>·</span>
                  <span>{stateGroup.localityCount.toLocaleString()} suburbs</span>
                  {info && <><span>·</span><span>Capital: {info.capital}</span></>}
                </div>
              </div>
              <div className="sm:w-80">
                <SearchBox size="sm" placeholder={`Search ${stateGroup.state} postcodes…`} />
              </div>
            </div>
          </div>
        </section>

        {/* State intro */}
        {info && (
          <section className="bg-white border-b border-[#E2E6ED]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-[#1A1A2E] leading-relaxed">{info.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {info.majorCities.map((city) => (
                      <Link
                        key={city}
                        href={`/search?q=${encodeURIComponent(city)}`}
                        className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Capital", value: info.capital },
                    { label: "Population", value: info.population },
                    { label: "Area", value: info.area },
                    { label: "Postcode Range", value: info.postcodeRange },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#F4F6F9] rounded-xl p-3">
                      <div className="text-[#6B7280] text-xs uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="font-semibold text-[#1A1A2E] text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Postcode grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">
            All {label} Postcodes ({stateGroup.postcodes.length.toLocaleString()})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {postcodes.map((pg) => pg && (
              <Link
                key={pg.postcode}
                href={`/au/postcode/${pg.postcode}`}
                className="group bg-white border border-[#E2E6ED] rounded-lg p-3 hover:border-[#E8472A] hover:shadow-sm transition-all"
                title={`Postcode ${pg.postcode} – ${titleCase(pg.localities[0] ?? "")}, ${stateGroup.state}`}
              >
                <div className="font-[family-name:var(--font-sora)] font-bold text-[#E8472A] text-lg">{pg.postcode}</div>
                <div className="text-[#1A1A2E] text-xs mt-0.5 truncate">{titleCase(pg.localities[0] ?? "")}</div>
                {pg.localities.length > 1 && (
                  <div className="text-[#6B7280] text-xs">+{pg.localities.length - 1} more</div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border-t border-[#E2E6ED] py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">
              FAQs about {label} Postcodes
            </h2>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }) }} />
      </main>
      <Footer />
    </>
  );
}
