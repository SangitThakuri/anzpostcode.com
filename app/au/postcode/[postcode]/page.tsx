import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQAccordion from "@/components/ui/FAQAccordion";
import DataDisclaimer from "@/components/ui/DataDisclaimer";
import ShareButtons from "@/components/ui/ShareButtons";
import MapWrapper from "@/components/ui/MapWrapper";
import SearchBox from "@/components/ui/SearchBox";
import CopyButton from "@/components/ui/CopyButton";
import LocationCard from "@/components/ui/LocationCard";
import {
  getAUPostcodeGroups,
  getNearbyAUPostcodes,
  getNearbyAULocalities,
} from "@/lib/data";
import { stateLabel, titleCase, absoluteUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ postcode: string }>;
}

export async function generateStaticParams() {
  const map = getAUPostcodeGroups();
  return Array.from(map.keys()).map((postcode) => ({ postcode }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postcode } = await params;
  const pg = getAUPostcodeGroups().get(postcode);
  if (!pg) return {};
  const primary = titleCase(pg.localities[0] ?? "");
  const stName = stateLabel(pg.state);
  return {
    title: `Postcode ${postcode} – ${primary}, ${pg.state}`,
    description: `Postcode ${postcode} covers ${pg.localities.map(titleCase).join(", ")} in ${stName}, Australia. View map, nearby postcodes, and local suburbs.`,
    openGraph: {
      title: `Postcode ${postcode} – ${primary}, ${pg.state}`,
      url: absoluteUrl(`/au/postcode/${postcode}`),
    },
    alternates: { canonical: absoluteUrl(`/au/postcode/${postcode}`) },
  };
}

export default async function AUPostcodePage({ params }: Props) {
  const { postcode } = await params;
  const map = getAUPostcodeGroups();
  const pg = map.get(postcode);
  if (!pg) notFound();

  const primary = titleCase(pg.localities[0] ?? "");
  const stName = stateLabel(pg.state);
  const nearby = getNearbyAUPostcodes(pg.lat, pg.lng, postcode);
  const nearbyLocalities = getNearbyAULocalities(pg.lat, pg.lng, "", 8);
  const hasMap = pg.lat !== 0 && pg.lng !== 0;
  const pageUrl = absoluteUrl(`/au/postcode/${postcode}`);

  const suburbLinks = pg.localities.map((loc, i) => {
    const slug = `${loc.toLowerCase().replace(/\s+/g, "-")}-${pg.state.toLowerCase()}`;
    return (
      <span key={loc}>
        <Link href={`/au/suburb/${encodeURIComponent(slug)}`} className="text-[#E8472A] hover:underline font-medium">
          {titleCase(loc)}
        </Link>
        {i < pg.localities.length - 1 ? ", " : "."}
      </span>
    );
  });

  const faqs = [
    { question: `What is postcode ${postcode}?`, answer: `Postcode ${postcode} is an Australian postcode covering ${pg.localities.map(titleCase).join(", ")} in ${stName}.` },
    {
      question: `Which suburbs are in postcode ${postcode}?`,
      answer: (
        <p>
          Postcode {postcode} includes the following {pg.localities.length > 1 ? "suburbs" : "suburb"}: {suburbLinks}
        </p>
      ),
    },
    { question: `What state is postcode ${postcode} in?`, answer: `Postcode ${postcode} is in ${stName} (${pg.state}), Australia.` },
    { question: `Where is postcode ${postcode} located?`, answer: `Postcode ${postcode} is located in ${stName}${hasMap ? ` at approximately ${pg.lat.toFixed(4)}°, ${pg.lng.toFixed(4)}°` : ""}.` },
    { question: `How can I find nearby postcodes?`, answer: `Nearby postcodes include ${nearby.slice(0, 4).map((n) => n.postcode).join(", ")}. You can also use the search box to find other postcodes in ${stName}.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "Australia", href: "/au" },
          { label: stName, href: `/au/state/${pg.state.toLowerCase()}` },
          { label: `Postcode ${postcode}` },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#E8472A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇦🇺 Australia</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">{pg.state}</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-5xl sm:text-7xl font-bold mb-2 tracking-tight">
                  {postcode}
                </h1>
                <p className="text-white/70 text-xl">{primary} · {stName}</p>
              </div>
              <div className="hidden sm:block">
                <ShareButtons url={pageUrl} title={`Postcode ${postcode} – ${primary}, ${pg.state}`} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Details card */}
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545]">
                    Postcode Details
                  </h2>
                  <CopyButton
                    text={`Postcode ${postcode}\n${pg.localities.map(titleCase).join(", ")}\n${stName} (${pg.state}), Australia`}
                    label="Copy address"
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                  />
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {[
                    { label: "Postcode", value: postcode },
                    { label: "Country", value: "Australia 🇦🇺" },
                    { label: "State / Territory", value: `${stName} (${pg.state})` },
                    ...(hasMap ? [
                      { label: "Latitude", value: pg.lat.toFixed(6) },
                      { label: "Longitude", value: pg.lng.toFixed(6) },
                    ] : []),
                  ].map((row) => (
                    <div key={row.label} className="bg-[#F4F6F9] rounded-xl p-4">
                      <dt className="text-[#6B7280] text-xs uppercase tracking-wider mb-1">{row.label}</dt>
                      <dd className="font-semibold text-[#1A1A2E] text-sm">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mb-5">
                  <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Suburbs / Localities</p>
                  <div className="flex flex-wrap gap-2">
                    {pg.localities.map((loc) => {
                      const slug = `${loc.toLowerCase().replace(/\s+/g, "-")}-${pg.state.toLowerCase()}`;
                      return (
                        <Link
                          key={loc}
                          href={`/au/suburb/${encodeURIComponent(slug)}`}
                          className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                        >
                          {titleCase(loc)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {hasMap && (
                  <div className="pt-4 border-t border-[#E2E6ED]">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${pg.lat}&mlon=${pg.lng}&zoom=14&layers=M`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in OpenStreetMap ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Suburbs list */}
              {pg.localities.length > 1 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">
                    Suburbs in Postcode {postcode}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pg.localities.map((loc) => (
                      <Link
                        key={loc}
                        href={`/au/suburb/${encodeURIComponent(loc.toLowerCase().replace(/\s+/g, "-"))}-${pg.state.toLowerCase()}`}
                        className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                      >
                        {titleCase(loc)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {hasMap && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">
                    Map of Postcode {postcode}
                  </h2>
                  <MapWrapper lat={pg.lat} lng={pg.lng} label={`Postcode ${postcode} – ${primary}`} />
                </div>
              )}

              {/* Nearby localities */}
              {nearbyLocalities.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">
                    Nearby Suburbs
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {nearbyLocalities.map((l) => (
                      <Link
                        key={l.slug}
                        href={`/au/suburb/${l.slug}`}
                        className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                      >
                        {titleCase(l.locality)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div>
                <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-5">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion items={faqs} />
              </div>

              {/* Share (mobile) */}
              <div className="sm:hidden">
                <ShareButtons url={pageUrl} title={`Postcode ${postcode} – ${primary}, ${pg.state}`} />
              </div>

              <DataDisclaimer />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nearby postcodes */}
              {nearby.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">
                    Nearby Postcodes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {nearby.map((n) => (
                      <Link
                        key={n.postcode}
                        href={`/au/postcode/${n.postcode}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors text-sm"
                      >
                        <span className="font-semibold">{n.postcode}</span>
                        <span className="text-[#6B7280] text-xs">{titleCase(n.localities[0] ?? "")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Location utilities */}
              <LocationCard
                postcode={postcode}
                primary={primary}
                state={pg.state}
                country="au"
                lat={hasMap ? pg.lat : undefined}
                lng={hasMap ? pg.lng : undefined}
              />

              {/* Quick search */}
              <div className="bg-[#0B2545] rounded-2xl p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-white mb-3 text-sm">
                  Search Another Postcode
                </h3>
                <SearchBox size="sm" placeholder="Search…" />
              </div>

              {/* Related links */}
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">
                  Related Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href={`/au/state/${pg.state.toLowerCase()}`} className="text-[#E8472A] hover:underline">
                      All {stName} postcodes
                    </Link>
                  </li>
                  <li>
                    <Link href="/au/postcodes" className="text-[#E8472A] hover:underline">
                      Browse all AU postcodes
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="text-[#E8472A] hover:underline">
                      Postcode search
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Place",
              name: `Postcode ${postcode} – ${primary}`,
              address: {
                "@type": "PostalAddress",
                postalCode: postcode,
                addressRegion: pg.state,
                addressCountry: "AU",
              },
              ...(hasMap ? { geo: { "@type": "GeoCoordinates", latitude: pg.lat, longitude: pg.lng } } : {}),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
