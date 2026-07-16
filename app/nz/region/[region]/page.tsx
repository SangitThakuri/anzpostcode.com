import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getNZRegionGroups, getNZPostcodeGroups } from "@/lib/data";
import { titleCase, absoluteUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ region: string }>;
}

const NZ_REGION_DATA: Record<string, {
  largestCity: string;
  population: string;
  description: string;
  knownFor: string[];
  postcodeRange: string;
}> = {
  Auckland: {
    largestCity: "Auckland",
    population: "1.7 million",
    description: "Auckland is New Zealand's largest city and commercial hub, home to nearly a third of the country's population. Its postcodes span the city centre, North Shore, Waitākere Ranges, and Manukau, covering everything from harbour-side suburbs to rural fringes.",
    knownFor: ["Sky Tower", "Waitemata Harbour", "Hauraki Gulf", "Viaduct Basin"],
    postcodeRange: "1010–1072 and 2010–2679",
  },
  Wellington: {
    largestCity: "Wellington",
    population: "440,000",
    description: "Wellington is New Zealand's capital city and the cultural heart of the country, home to Parliament, Te Papa museum, and a thriving café and arts scene. Its compact postcodes cover the CBD, Thorndon, Karori, and the Hutt Valley.",
    knownFor: ["Beehive Parliament", "Te Papa Museum", "Cuba Street", "Wellington Harbour"],
    postcodeRange: "6011–6160",
  },
  Canterbury: {
    largestCity: "Christchurch",
    population: "600,000",
    description: "Canterbury is New Zealand's largest region by area on the South Island, anchored by Christchurch — the South Island's largest city. Its postcodes span the Canterbury Plains, Banks Peninsula, and extend west to the Southern Alps and Arthur's Pass.",
    knownFor: ["Christchurch Cathedral", "Southern Alps", "Banks Peninsula", "Akaroa"],
    postcodeRange: "7010–8971",
  },
  Waikato: {
    largestCity: "Hamilton",
    population: "490,000",
    description: "Waikato is New Zealand's agricultural heartland, dominated by the Waikato River and rolling dairy farmland. Hamilton is its main city, while the Coromandel Peninsula, Raglan surf town, and Hobbiton film set attract visitors from around the world.",
    knownFor: ["Hobbiton", "Waitomo Caves", "Raglan Beach", "Waikato River"],
    postcodeRange: "3200–3882",
  },
  "Bay of Plenty": {
    largestCity: "Tauranga",
    population: "360,000",
    description: "The Bay of Plenty is one of New Zealand's fastest-growing regions, with Tauranga among the most populated cities. The region is known for its kiwifruit orchards, Mount Maunganui beach, and the geothermal city of Rotorua.",
    knownFor: ["Mount Maunganui", "Rotorua Geothermal", "Kiwifruit Orchards", "White Island"],
    postcodeRange: "3010–3189",
  },
  Otago: {
    largestCity: "Dunedin",
    population: "240,000",
    description: "Otago occupies the southeastern corner of the South Island, ranging from Dunedin's Victorian architecture and university life to Queenstown's alpine adventure tourism and the remote Clutha River valley. Its diverse postcodes reflect this geographic range.",
    knownFor: ["Queenstown Adventure", "Dunedin Railway Station", "Milford Sound access", "Central Otago Wine"],
    postcodeRange: "9010–9391",
  },
  Southland: {
    largestCity: "Invercargill",
    population: "100,000",
    description: "Southland is New Zealand's southernmost region, encompassing Fiordland's dramatic fjords, Stewart Island, and the flat Southland Plains. Invercargill is the main city, and the region is the gateway to Milford Sound and Doubtful Sound.",
    knownFor: ["Fiordland National Park", "Stewart Island", "Bluff Oysters", "Milford Sound"],
    postcodeRange: "9710–9876",
  },
  "Manawatu-Whanganui": {
    largestCity: "Palmerston North",
    population: "240,000",
    description: "Manawatu-Whanganui covers the central North Island from the Tararua Ranges to the volcanic plateau. Palmerston North is a university city and regional hub, while Whanganui has one of New Zealand's best-preserved Victorian-era main streets.",
    knownFor: ["Palmerston North", "Whanganui River", "Tararua Ranges", "Foxton Beach"],
    postcodeRange: "4310–5573",
  },
  "Hawke's Bay": {
    largestCity: "Napier",
    population: "180,000",
    description: "Hawke's Bay is famous for its Art Deco architecture, world-class wine, and stunning coastal scenery along the eastern North Island. Napier and Hastings are the twin cities at its heart, surrounded by vineyards and orchards.",
    knownFor: ["Art Deco Napier", "Hawke's Bay Wine", "Cape Kidnappers", "Hastings"],
    postcodeRange: "4100–4294",
  },
  Taranaki: {
    largestCity: "New Plymouth",
    population: "125,000",
    description: "Taranaki juts into the Tasman Sea from the central-west North Island, dominated by the near-perfect cone of Mount Taranaki (2,518 m). New Plymouth is the main city and a centre for surf, arts, and the oil and gas industry.",
    knownFor: ["Mount Taranaki", "Surf Highway 45", "Govett-Brewster Gallery", "Len Lye Centre"],
    postcodeRange: "4310–4395",
  },
  Nelson: {
    largestCity: "Nelson",
    population: "115,000",
    description: "Nelson is the sunniest region in New Zealand at the top of the South Island. The city of Nelson is a hub for arts, craft beer, and outdoor adventure, sitting at the gateway to Abel Tasman National Park and Kahurangi National Park.",
    knownFor: ["Abel Tasman National Park", "Craft Beer", "Nelson Arts Scene", "Wearable Arts"],
    postcodeRange: "7010–7173",
  },
  Tasman: {
    largestCity: "Richmond",
    population: "57,000",
    description: "Tasman district wraps around the top of the South Island, bordering Nelson city. It is home to the Golden Bay, Motueka, and the start of the Abel Tasman Coast Track. The region produces apples, hops, and increasingly fine wines.",
    knownFor: ["Golden Bay", "Motueka", "Abel Tasman Coast Track", "Farewell Spit"],
    postcodeRange: "7173–7198",
  },
  Marlborough: {
    largestCity: "Blenheim",
    population: "50,000",
    description: "Marlborough is world-famous for its Sauvignon Blanc wine, produced in the Wairau and Awatere valleys near Blenheim. The Marlborough Sounds — a network of drowned river valleys — offer stunning scenery and the Interislander ferry route between the islands.",
    knownFor: ["Marlborough Sauvignon Blanc", "Marlborough Sounds", "Blenheim", "Queen Charlotte Track"],
    postcodeRange: "7201–7273",
  },
  Northland: {
    largestCity: "Whangārei",
    population: "195,000",
    description: "Northland is New Zealand's subtropical northernmost region, known as 'The Winterless North'. The Bay of Islands, Cape Reinga, and Ninety Mile Beach are iconic destinations, while Whangārei is the main city and commercial centre.",
    knownFor: ["Bay of Islands", "Cape Reinga", "Ninety Mile Beach", "Waitangi Treaty Grounds"],
    postcodeRange: "0110–0930",
  },
  Gisborne: {
    largestCity: "Gisborne",
    population: "52,000",
    description: "Gisborne is one of the world's first cities to see the sunrise each day, on the east coast of the North Island. It is the centre of Tairāwhiti, known for its Māori culture, Poverty Bay wine region, and spectacular East Cape coastline.",
    knownFor: ["First Sunrise City", "East Cape", "Poverty Bay Wine", "Tairāwhiti Culture"],
    postcodeRange: "4010–4099",
  },
  "West Coast": {
    largestCity: "Greymouth",
    population: "32,000",
    description: "The West Coast is one of New Zealand's most rugged and sparsely populated regions, running along the South Island's western flank between the Tasman Sea and the Southern Alps. Franz Josef Glacier, Fox Glacier, and Punakaiki Pancake Rocks are its headline attractions.",
    knownFor: ["Franz Josef Glacier", "Fox Glacier", "Pancake Rocks", "Hokitika Gorge"],
    postcodeRange: "7805–7895",
  },
};

export async function generateStaticParams() {
  return getNZRegionGroups().map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const regions = getNZRegionGroups();
  const rg = regions.find((r) => r.slug === region);
  if (!rg) return {};
  const info = NZ_REGION_DATA[rg.state];
  return {
    title: `${rg.state} Postcodes – ${rg.postcodes.length} NZ Postcodes in ${rg.state} Region`,
    description: `Browse all ${rg.postcodes.length} postcodes in the ${rg.state} region of New Zealand.${info ? ` ${info.description.slice(0, 120)}…` : ""} Find postcode details, maps, and nearby localities.`,
    openGraph: {
      title: `${rg.state} Postcodes – New Zealand`,
      url: absoluteUrl(`/nz/region/${region}`),
      locale: "en_NZ",
    },
    alternates: { canonical: absoluteUrl(`/nz/region/${region}`) },
  };
}

export default async function NZRegionPage({ params }: Props) {
  const { region } = await params;
  const regions = getNZRegionGroups();
  const rg = regions.find((r) => r.slug === region);
  if (!rg) notFound();

  const info = NZ_REGION_DATA[rg.state];
  const postcodeMap = getNZPostcodeGroups();
  const postcodes = rg.postcodes
    .map((pc) => postcodeMap.get(pc))
    .filter(Boolean)
    .sort((a, b) => a!.postcode.localeCompare(b!.postcode));

  const firstPc = postcodes[0]?.postcode ?? "—";
  const lastPc = postcodes[postcodes.length - 1]?.postcode ?? "—";

  const faqs = [
    {
      question: `How many postcodes are in ${rg.state}?`,
      answer: `The ${rg.state} region of New Zealand has ${rg.postcodes.length} postcodes covering ${rg.localityCount} localities.`,
    },
    {
      question: `What is the postcode range for ${rg.state}?`,
      answer: `${rg.state} postcodes range from ${firstPc} to ${lastPc}. ${info?.postcodeRange ? `The standard range for this region is ${info.postcodeRange}.` : ""}`,
    },
    {
      question: `What is the largest city in ${rg.state}?`,
      answer: info
        ? `The largest city in ${rg.state} is ${info.largestCity}. ${rg.state} has a population of approximately ${info.population}.`
        : `Browse the postcode list below to find major localities in ${rg.state}.`,
    },
    {
      question: `What is ${rg.state} known for?`,
      answer: info
        ? `${rg.state} is known for ${info.knownFor.join(", ")}.`
        : `${rg.state} is a region of New Zealand with ${rg.postcodes.length} postcodes.`,
    },
    {
      question: `How do I find a specific locality in ${rg.state}?`,
      answer: `Use the search box above to type the locality name or postcode. Each postcode card below links to a detail page showing all localities in that postcode, nearby areas, and a map.`,
    },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "New Zealand", href: "/nz" }, { label: rg.state }]} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B2545] via-[#1a3a2a] to-[#2D6A4F] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇳🇿 New Zealand</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">Region</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-3">{rg.state}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  <span>{rg.postcodes.length} postcodes</span>
                  <span>·</span>
                  <span>{rg.localityCount} localities</span>
                  {info && <><span>·</span><span>{info.largestCity}</span></>}
                </div>
              </div>
              <div className="sm:w-80">
                <SearchBox size="sm" placeholder={`Search ${rg.state} postcodes…`} />
              </div>
            </div>
          </div>
        </section>

        {/* Region intro */}
        {info && (
          <section className="bg-white border-b border-[#E2E6ED]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-[#1A1A2E] leading-relaxed">{info.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {info.knownFor.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Largest City", value: info.largestCity },
                    { label: "Population", value: info.population },
                    { label: "Postcodes", value: rg.postcodes.length.toString() },
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
            All {rg.state} Postcodes ({rg.postcodes.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {postcodes.map((pg) => pg && (
              <Link
                key={pg.postcode}
                href={`/nz/postcode/${pg.postcode}`}
                className="group bg-white border border-[#E2E6ED] rounded-lg p-3 hover:border-[#2D6A4F] hover:shadow-sm transition-all"
                title={`NZ Postcode ${pg.postcode} – ${titleCase(pg.localities[0] ?? "")}, ${rg.state}`}
              >
                <div className="font-[family-name:var(--font-sora)] font-bold text-[#2D6A4F] text-lg">{pg.postcode}</div>
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
              FAQs about {rg.state} Postcodes
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
