import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchBox from "@/components/ui/SearchBox";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getNZRegionGroups, getNZPostcodeGroups } from "@/lib/data";
import { titleCase } from "@/lib/utils";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return getNZRegionGroups().map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const regions = getNZRegionGroups();
  const rg = regions.find((r) => r.slug === region);
  if (!rg) return {};
  return {
    title: `${rg.state} Postcodes – New Zealand Region`,
    description: `Browse all postcodes and localities in the ${rg.state} region of New Zealand.`,
    openGraph: { title: `${rg.state} NZ Postcodes`, url: `https://anzpostcode.com/nz/region/${region}` },
  };
}

export default async function NZRegionPage({ params }: Props) {
  const { region } = await params;
  const regions = getNZRegionGroups();
  const rg = regions.find((r) => r.slug === region);
  if (!rg) notFound();

  const postcodeMap = getNZPostcodeGroups();
  const postcodes = rg.postcodes
    .map((pc) => postcodeMap.get(pc))
    .filter(Boolean)
    .sort((a, b) => a!.postcode.localeCompare(b!.postcode));

  const faqs = [
    { question: `How many postcodes are in ${rg.state}?`, answer: `The ${rg.state} region of New Zealand has ${rg.postcodes.length} postcodes.` },
    { question: `What localities are in the ${rg.state} region?`, answer: `${rg.state} includes ${rg.localityCount} localities. Browse the full list using the postcode links below.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "New Zealand", href: "/nz" }, { label: rg.state }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="flex-1">
                <div className="text-white/50 text-sm mb-2 uppercase tracking-wider">New Zealand</div>
                <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold mb-3">
                  {rg.state}
                </h1>
                <div className="flex gap-3 text-sm text-white/70">
                  <span>{rg.postcodes.length} postcodes</span>
                  <span>·</span>
                  <span>{rg.localityCount} localities</span>
                </div>
              </div>
              <div className="sm:w-80">
                <SearchBox size="sm" placeholder={`Search ${rg.state} postcodes…`} />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">
            All {rg.state} Postcodes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {postcodes.map((pg) => pg && (
              <Link
                key={pg.postcode}
                href={`/nz/postcode/${pg.postcode}`}
                className="group bg-white border border-[#E2E6ED] rounded-lg p-3 hover:border-[#2D6A4F] hover:shadow-sm transition-all"
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

        <section className="bg-white border-t border-[#E2E6ED] py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">
              FAQs about {rg.state} Postcodes
            </h2>
            <FAQAccordion items={faqs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
