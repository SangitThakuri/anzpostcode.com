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
import SearchBox from "@/components/ui/SearchBox";
import MapWrapper from "@/components/ui/MapWrapper";
import CopyButton from "@/components/ui/CopyButton";
import LocationCard from "@/components/ui/LocationCard";
import {
  getNZPostcodeGroups,
  getNearbyNZPostcodes,
  getNearbyNZLocalities,
} from "@/lib/data";
import { titleCase, absoluteUrl, slugify } from "@/lib/utils";

interface Props {
  params: Promise<{ postcode: string }>;
}

export async function generateStaticParams() {
  return Array.from(getNZPostcodeGroups().keys()).map((postcode) => ({ postcode }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postcode } = await params;
  const pg = getNZPostcodeGroups().get(postcode);
  if (!pg) return {};
  const primary = titleCase(pg.localities[0] ?? "");
  return {
    title: `Postcode ${postcode} – ${primary}, ${pg.state}, New Zealand`,
    description: `NZ postcode ${postcode} covers ${pg.localities.map(titleCase).join(", ")} in the ${pg.state} region. View map and nearby localities.`,
    openGraph: { title: `NZ Postcode ${postcode}`, url: absoluteUrl(`/nz/postcode/${postcode}`) },
    alternates: { canonical: absoluteUrl(`/nz/postcode/${postcode}`) },
  };
}

export default async function NZPostcodePage({ params }: Props) {
  const { postcode } = await params;
  const pg = getNZPostcodeGroups().get(postcode);
  if (!pg) notFound();

  const primary = titleCase(pg.localities[0] ?? "");
  const nearby = getNearbyNZPostcodes(pg.lat, pg.lng, postcode);
  const nearbyLocalities = getNearbyNZLocalities(pg.lat, pg.lng, "", 8);
  const hasMap = pg.lat !== 0 && pg.lng !== 0;
  const pageUrl = absoluteUrl(`/nz/postcode/${postcode}`);

  const localityLinks = pg.localities.map((loc, i) => {
    const slug = slugify(loc) + "-nz";
    return (
      <span key={loc}>
        <Link href={`/nz/locality/${encodeURIComponent(slug)}`} className="text-[#2D6A4F] hover:underline font-medium">
          {titleCase(loc)}
        </Link>
        {i < pg.localities.length - 1 ? ", " : "."}
      </span>
    );
  });

  const faqs = [
    { question: `What is NZ postcode ${postcode}?`, answer: `Postcode ${postcode} is a New Zealand postcode covering ${pg.localities.map(titleCase).join(", ")} in the ${pg.state} region.` },
    {
      question: `Which localities are in postcode ${postcode}?`,
      answer: (
        <p>
          Postcode {postcode} includes the following {pg.localities.length > 1 ? "localities" : "locality"}: {localityLinks}
        </p>
      ),
    },
    { question: `What region is postcode ${postcode} in?`, answer: `Postcode ${postcode} is in the ${pg.state} region of New Zealand.` },
    { question: `Where is postcode ${postcode} located?`, answer: `Postcode ${postcode} is in the ${pg.state} region of New Zealand${hasMap ? ` at approximately ${pg.lat.toFixed(4)}°, ${pg.lng.toFixed(4)}°` : ""}.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "New Zealand", href: "/nz" },
          { label: pg.state, href: `/nz/region/${slugify(pg.state)}` },
          { label: `Postcode ${postcode}` },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] via-[#1a3a2a] to-[#2D6A4F] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇳🇿 New Zealand</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">{pg.state}</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-5xl sm:text-7xl font-bold mb-2 tracking-tight">
                  {postcode}
                </h1>
                <p className="text-white/70 text-xl">{primary} · {pg.state}</p>
              </div>
              <div className="hidden sm:block">
                <ShareButtons url={pageUrl} title={`NZ Postcode ${postcode} – ${primary}`} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545]">Postcode Details</h2>
                  <CopyButton
                    text={`Postcode ${postcode}\n${pg.localities.map(titleCase).join(", ")}\n${pg.state}, New Zealand`}
                    label="Copy address"
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                  />
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {[
                    { label: "Postcode", value: postcode },
                    { label: "Country", value: "New Zealand 🇳🇿" },
                    { label: "Region", value: pg.state },
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
                  <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2">Localities</p>
                  <div className="flex flex-wrap gap-2">
                    {pg.localities.map((loc) => {
                      const slug = slugify(loc) + "-nz";
                      return (
                        <Link
                          key={loc}
                          href={`/nz/locality/${encodeURIComponent(slug)}`}
                          className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
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
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in OpenStreetMap ↗
                    </a>
                  </div>
                )}
              </div>

              {hasMap && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Map</h2>
                  <MapWrapper lat={pg.lat} lng={pg.lng} label={`NZ Postcode ${postcode} – ${primary}`} />
                </div>
              )}

              {nearbyLocalities.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Nearby Localities</h2>
                  <div className="flex flex-wrap gap-2">
                    {nearbyLocalities.map((l) => (
                      <Link key={l.slug} href={`/nz/locality/${l.slug}`}
                        className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                        {titleCase(l.locality)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-5">FAQs</h2>
                <FAQAccordion items={faqs} />
              </div>
              <DataDisclaimer />
            </div>

            <div className="space-y-6">
              {nearby.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Nearby Postcodes</h3>
                  <div className="flex flex-wrap gap-2">
                    {nearby.map((n) => (
                      <Link key={n.postcode} href={`/nz/postcode/${n.postcode}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors text-sm">
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
                country="nz"
                lat={hasMap ? pg.lat : undefined}
                lng={hasMap ? pg.lng : undefined}
              />

              <div className="bg-[#0B2545] rounded-2xl p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-white mb-3 text-sm">Search Another Postcode</h3>
                <SearchBox size="sm" placeholder="Search…" />
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Related Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href={`/nz/region/${slugify(pg.state)}`} className="text-[#2D6A4F] hover:underline">All {pg.state} postcodes</Link></li>
                  <li><Link href="/nz/postcodes" className="text-[#2D6A4F] hover:underline">Browse all NZ postcodes</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Place",
          name: `NZ Postcode ${postcode} – ${primary}`,
          address: { "@type": "PostalAddress", postalCode: postcode, addressRegion: pg.state, addressCountry: "NZ" },
          ...(hasMap ? { geo: { "@type": "GeoCoordinates", latitude: pg.lat, longitude: pg.lng } } : {}),
        }) }} />
      </main>
      <Footer />
    </>
  );
}
