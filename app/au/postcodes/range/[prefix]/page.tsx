import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getAUPostcodeGroups } from "@/lib/data";
import { stateLabel, titleCase, absoluteUrl } from "@/lib/utils";

// Postcode first-digit ranges and their primary states
const PREFIX_META: Record<string, { label: string; primaryState: string; description: string }> = {
  "0": { label: "0xxx", primaryState: "NT/ACT", description: "Postcodes starting with 0 cover the Northern Territory (0800–0999) and the Australian Capital Territory (0200–0299). Darwin postcodes begin at 0800, Alice Springs at 0870, and the ACT's research precincts at 0200." },
  "1": { label: "1xxx", primaryState: "NSW", description: "Postcodes starting with 1 are NSW Mail Centre codes — used for PO Boxes, locked bags, and Australia Post facilities across New South Wales. These differ from standard street-delivery postcodes." },
  "2": { label: "2xxx", primaryState: "NSW/ACT", description: "Postcodes starting with 2 cover New South Wales and the Australian Capital Territory. Sydney's CBD is postcode 2000, with metropolitan postcodes covering the north shore, western suburbs, the Blue Mountains, and regional NSW." },
  "3": { label: "3xxx", primaryState: "VIC", description: "Postcodes starting with 3 cover Victoria. Melbourne's CBD is postcode 3000, with the broader metropolitan area, Geelong, Ballarat, Bendigo, and rural Victoria all using 3xxx codes." },
  "4": { label: "4xxx", primaryState: "QLD", description: "Postcodes starting with 4 cover Queensland. Brisbane's CBD is postcode 4000, with metropolitan Brisbane, the Gold Coast, Sunshine Coast, Cairns, Townsville, and the outback all in this range." },
  "5": { label: "5xxx", primaryState: "SA", description: "Postcodes starting with 5 cover South Australia. Adelaide's CBD is postcode 5000, with the Barossa Valley, Fleurieu Peninsula, Eyre Peninsula, and outback SA all using 5xxx codes." },
  "6": { label: "6xxx", primaryState: "WA", description: "Postcodes starting with 6 cover Western Australia. Perth's CBD is postcode 6000, with the broader metro area, Fremantle, Bunbury, the Margaret River region, Geraldton, and the Kimberley all in this range." },
  "7": { label: "7xxx", primaryState: "TAS", description: "Postcodes starting with 7 cover Tasmania. Hobart's CBD is postcode 7000, with Launceston, Devonport, Burnie, and regional Tasmania all using 7xxx codes." },
  "8": { label: "8xxx", primaryState: "VIC/SA/NT", description: "Postcodes starting with 8 are used for Mail Centre codes in Victoria (8xxx), South Australia, and some NT facilities — these are typically PO Box and large mail volume addresses rather than street addresses." },
  "9": { label: "9xxx", primaryState: "SA/NT/WA", description: "Postcodes starting with 9 include Mail Centre codes for South Australia, the Northern Territory, Western Australia, and external territories. These serve postal facilities rather than standard residential addresses." },
};

interface Props {
  params: Promise<{ prefix: string }>;
}

export async function generateStaticParams() {
  return ["0","1","2","3","4","5","6","7","8","9"].map((prefix) => ({ prefix }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefix } = await params;
  const meta = PREFIX_META[prefix];
  if (!meta) return {};
  const allPcs = Array.from(getAUPostcodeGroups().keys()).filter((pc) => pc.startsWith(prefix));
  return {
    title: `Australian Postcodes Starting With ${prefix} (${meta.label}) – ${allPcs.length} Postcodes`,
    description: `Browse all ${allPcs.length} Australian postcodes starting with ${prefix} (${meta.label}). ${meta.description.slice(0, 120)}…`,
    openGraph: {
      title: `${meta.label} Postcodes – Australia`,
      url: absoluteUrl(`/au/postcodes/range/${prefix}`),
      locale: "en_AU",
    },
    alternates: { canonical: absoluteUrl(`/au/postcodes/range/${prefix}`) },
  };
}

export default async function PostcodeRangePage({ params }: Props) {
  const { prefix } = await params;
  const meta = PREFIX_META[prefix];
  if (!meta) notFound();

  const postcodeMap = getAUPostcodeGroups();
  const postcodes = Array.from(postcodeMap.values())
    .filter((pg) => pg.postcode.startsWith(prefix))
    .sort((a, b) => a.postcode.localeCompare(b.postcode));

  if (postcodes.length === 0) notFound();

  // Group by state for the breakdown
  const byState: Record<string, typeof postcodes> = {};
  for (const pg of postcodes) {
    if (!byState[pg.state]) byState[pg.state] = [];
    byState[pg.state].push(pg);
  }

  const faqs = [
    {
      question: `What states use postcodes starting with ${prefix}?`,
      answer: `Postcodes starting with ${prefix} are primarily used in ${meta.primaryState}. ${meta.description}`,
    },
    {
      question: `How many Australian postcodes start with ${prefix}?`,
      answer: `There are ${postcodes.length} Australian postcodes starting with ${prefix} (${meta.label}), spread across ${Object.keys(byState).length} state${Object.keys(byState).length > 1 ? "s" : ""}.`,
    },
    {
      question: `What is the first postcode starting with ${prefix}?`,
      answer: `The first postcode in the ${prefix}xxx range is ${postcodes[0]?.postcode}, which covers ${postcodes[0]?.localities.map(titleCase).join(", ")} in ${stateLabel(postcodes[0]?.state ?? "")}.`,
    },
    {
      question: `What does a ${prefix}xxx postcode mean in Australia?`,
      answer: meta.description,
    },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "Australia", href: "/au" },
          { label: "All Postcodes", href: "/au/postcodes" },
          { label: `${prefix}xxx Range` },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#E8472A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇦🇺 Australia</span>
              <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">Postcode Range</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-6xl font-bold mb-3">
              {prefix}xxx Postcodes
            </h1>
            <p className="text-white/70 text-xl mb-2">
              {postcodes.length} postcodes · {meta.primaryState}
            </p>
            <p className="text-white/60 text-sm max-w-2xl">{meta.description}</p>
          </div>
        </section>

        {/* State breakdown */}
        {Object.keys(byState).length > 1 && (
          <section className="bg-white border-b border-[#E2E6ED]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-wrap gap-3">
                {Object.entries(byState).sort((a, b) => a[0].localeCompare(b[0])).map(([state, pcs]) => (
                  <Link
                    key={state}
                    href={`/au/state/${state.toLowerCase()}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors text-sm"
                  >
                    <span className="font-semibold">{state}</span>
                    <span className="text-[#6B7280]">{pcs.length} postcodes</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Postcode grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">
            All {meta.label} Postcodes ({postcodes.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {postcodes.map((pg) => (
              <Link
                key={pg.postcode}
                href={`/au/postcode/${pg.postcode}`}
                className="group bg-white border border-[#E2E6ED] rounded-lg p-3 hover:border-[#E8472A] hover:shadow-sm transition-all"
                title={`Postcode ${pg.postcode} – ${titleCase(pg.localities[0] ?? "")}, ${pg.state}`}
              >
                <div className="font-[family-name:var(--font-sora)] font-bold text-[#E8472A] text-lg">{pg.postcode}</div>
                <div className="text-[#1A1A2E] text-xs mt-0.5 truncate">{titleCase(pg.localities[0] ?? "")}</div>
                <div className="text-[#6B7280] text-xs">{pg.state}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other ranges */}
        <section className="bg-white border-y border-[#E2E6ED] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-base font-bold text-[#0B2545] mb-4">Browse Other Postcode Ranges</h2>
            <div className="flex flex-wrap gap-2">
              {["0","1","2","3","4","5","6","7","8","9"].filter((p) => p !== prefix).map((p) => (
                <Link
                  key={p}
                  href={`/au/postcodes/range/${p}`}
                  className="px-4 py-2 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-sm font-semibold hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                >
                  {p}xxx
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">
              FAQs about {meta.label} Postcodes
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
