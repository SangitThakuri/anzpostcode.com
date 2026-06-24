import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getAUStateGroups, getAUPostcodeGroups, getAULocalityGroups } from "@/lib/data";
import { stateLabel, titleCase } from "@/lib/utils";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  const states = getAUStateGroups();
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const label = stateLabel(stateCode);
  return {
    title: `${label} (${stateCode}) Postcodes – Complete List`,
    description: `Browse all postcodes and suburbs in ${label}, Australia. Find postcode details, localities, and nearby areas.`,
    openGraph: {
      title: `${label} Postcodes`,
      url: `https://anzpostcode.com/au/state/${state}`,
    },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const states = getAUStateGroups();
  const stateGroup = states.find((s) => s.slug === state || s.state === stateCode);
  if (!stateGroup) notFound();

  const label = stateLabel(stateGroup.state);
  const postcodeMap = getAUPostcodeGroups();
  const localityMap = getAULocalityGroups();

  const postcodes = stateGroup.postcodes
    .map((pc) => postcodeMap.get(pc))
    .filter(Boolean)
    .sort((a, b) => a!.postcode.localeCompare(b!.postcode));

  const faqs = [
    { question: `How many postcodes are in ${label}?`, answer: `${label} has ${stateGroup.postcodes.length.toLocaleString()} postcodes.` },
    { question: `What is the postcode range for ${stateGroup.state}?`, answer: `${label} postcodes typically range from ${postcodes[0]?.postcode ?? "—"} to ${postcodes[postcodes.length - 1]?.postcode ?? "—"}.` },
    { question: `How do I find a specific suburb in ${stateGroup.state}?`, answer: `Use the search box above or browse the postcode list below. Each postcode links to a detail page showing all suburbs in that postcode.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Australia", href: "/au" }, { label: label }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1">
                <div className="text-white/50 text-sm mb-2 uppercase tracking-wider">Australia</div>
                <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-3">
                  {label}
                </h1>
                <div className="flex gap-3 text-sm text-white/70">
                  <span>{stateGroup.postcodes.length.toLocaleString()} postcodes</span>
                  <span>·</span>
                  <span>{stateGroup.localityCount.toLocaleString()} suburbs</span>
                </div>
              </div>
              <div className="sm:w-80">
                <SearchBox size="sm" placeholder={`Search ${stateGroup.state} postcodes…`} />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">
            All {label} Postcodes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {postcodes.map((pg) => pg && (
              <Link
                key={pg.postcode}
                href={`/au/postcode/${pg.postcode}`}
                className="group bg-white border border-[#E2E6ED] rounded-lg p-3 hover:border-[#E8472A] hover:shadow-sm transition-all"
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

        <section className="bg-white border-t border-[#E2E6ED] py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">
              FAQs about {label} Postcodes
            </h2>
            <FAQAccordion items={faqs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
