import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQAccordion from "@/components/ui/FAQAccordion";
import DataDisclaimer from "@/components/ui/DataDisclaimer";
import ShareButtons from "@/components/ui/ShareButtons";
import SearchBox from "@/components/ui/SearchBox";
import MapWrapper from "@/components/ui/MapWrapper";
import {
  getAULocalityGroups,
  getNearbyAULocalities,
  getNearbyAUPostcodes,
} from "@/lib/data";
import { MapPin } from "lucide-react";
import { stateLabel, titleCase, absoluteUrl, haversineDistance } from "@/lib/utils";
import LocationCard from "@/components/ui/LocationCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Array.from(getAULocalityGroups().keys()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lg = getAULocalityGroups().get(slug);
  if (!lg) return {};
  const name = titleCase(lg.locality);
  const stName = stateLabel(lg.state);
  return {
    title: `${name} Postcode – ${lg.postcodes.join(", ")}, ${lg.state}`,
    description: `${name} is a suburb in ${stName}, Australia with postcode${lg.postcodes.length > 1 ? "s" : ""} ${lg.postcodes.join(", ")}. View map, nearby suburbs, and location details.`,
    openGraph: { title: `${name} Postcode`, url: absoluteUrl(`/au/suburb/${slug}`) },
    alternates: { canonical: absoluteUrl(`/au/suburb/${slug}`) },
  };
}

export default async function AUSuburbPage({ params }: Props) {
  const { slug } = await params;
  const lg = getAULocalityGroups().get(slug);
  if (!lg) notFound();

  const name = titleCase(lg.locality);
  const stName = stateLabel(lg.state);
  const hasMap = lg.lat !== 0 && lg.lng !== 0;
  const nearbyLocalities = getNearbyAULocalities(lg.lat, lg.lng, slug);
  const nearbyPostcodes = getNearbyAUPostcodes(lg.lat, lg.lng, lg.postcodes[0] ?? "");
  const pageUrl = absoluteUrl(`/au/suburb/${slug}`);

  const faqs = [
    { question: `What is the postcode of ${name}?`, answer: `${name} has postcode${lg.postcodes.length > 1 ? "s" : ""} ${lg.postcodes.join(", ")}.` },
    { question: `Which state is ${name} in?`, answer: `${name} is in ${stName} (${lg.state}), Australia.` },
    { question: `What suburbs are near ${name}?`, answer: nearbyLocalities.length > 0 ? `Nearby suburbs include ${nearbyLocalities.slice(0, 5).map((l) => titleCase(l.locality)).join(", ")}.` : `Use the search to find suburbs near ${name}.` },
    { question: `Where is ${name} located?`, answer: `${name} is a suburb located in ${stName}, Australia${hasMap ? ` at approximately ${lg.lat.toFixed(4)}°, ${lg.lng.toFixed(4)}°` : ""}.` },
    { question: `Is this postcode information official?`, answer: `This data is community-sourced for general reference. For official delivery verification, please check Australia Post.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "Australia", href: "/au" },
          { label: stName, href: `/au/state/${lg.state.toLowerCase()}` },
          { label: name },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#E8472A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇦🇺 Suburb</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">{lg.state}</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-6xl font-bold mb-2">{name}</h1>
                <p className="text-white/70 text-xl">
                  Postcode{lg.postcodes.length > 1 ? "s" : ""}: {lg.postcodes.join(", ")} · {stName}
                </p>
              </div>
              <div className="hidden sm:block">
                <ShareButtons url={pageUrl} title={`${name} Postcode – ${lg.postcodes.join(", ")}, ${lg.state}`} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">Suburb Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Suburb / Locality", value: name },
                    { label: "Country", value: "Australia 🇦🇺" },
                    { label: "State / Territory", value: `${stName} (${lg.state})` },
                    { label: `Postcode${lg.postcodes.length > 1 ? "s" : ""}`, value: lg.postcodes.join(", ") },
                    ...(hasMap ? [
                      { label: "Latitude", value: lg.lat.toFixed(6) },
                      { label: "Longitude", value: lg.lng.toFixed(6) },
                    ] : []),
                  ].map((row) => (
                    <div key={row.label} className="bg-[#F4F6F9] rounded-xl p-4">
                      <dt className="text-[#6B7280] text-xs uppercase tracking-wider mb-1">{row.label}</dt>
                      <dd className="font-semibold text-[#1A1A2E] text-sm">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Postcode links */}
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">
                  Postcode{lg.postcodes.length > 1 ? "s" : ""} for {name}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {lg.postcodes.map((pc) => (
                    <Link
                      key={pc}
                      href={`/au/postcode/${pc}`}
                      className="px-4 py-2 bg-[#E8472A] text-white rounded-xl font-bold font-[family-name:var(--font-sora)] hover:bg-[#d43d22] transition-colors"
                    >
                      {pc}
                    </Link>
                  ))}
                </div>
              </div>

              {hasMap && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Map of {name}</h2>
                  <MapWrapper lat={lg.lat} lng={lg.lng} label={`${name}, ${lg.state}`} />
                  <div className="mt-4 pt-4 border-t border-[#E2E6ED]">
                    <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2.5 font-medium">Open in Maps</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${lg.state} Australia`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-blue-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Google Maps ↗
                      </a>
                      <a
                        href={`https://maps.apple.com/?q=${encodeURIComponent(`${name} ${lg.state} Australia`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#147EFB] hover:text-[#147EFB] hover:bg-blue-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Apple Maps ↗
                      </a>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${lg.lat}&mlon=${lg.lng}&zoom=14&layers=M`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        OpenStreetMap ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {nearbyLocalities.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Nearby Suburbs</h2>
                  <div className="flex flex-wrap gap-2">
                    {nearbyLocalities.map((l) => (
                      <Link key={l.slug} href={`/au/suburb/${l.slug}`}
                        className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] text-sm rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors">
                        {titleCase(l.locality)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-5">Frequently Asked Questions</h2>
                <FAQAccordion items={faqs} />
              </div>
              <DataDisclaimer />
            </div>

            <div className="space-y-6">
              {nearbyPostcodes.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Nearby Postcodes</h3>
                  <div className="flex flex-wrap gap-2">
                    {nearbyPostcodes.map((n) => (
                      <Link key={n.postcode} href={`/au/postcode/${n.postcode}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-[#E8472A] hover:text-[#E8472A] transition-colors text-sm">
                        <span className="font-semibold">{n.postcode}</span>
                        <span className="text-[#6B7280] text-xs truncate max-w-16">{titleCase(n.localities[0] ?? "")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <LocationCard
                postcode={lg.postcodes[0] ?? ""}
                primary={name}
                state={lg.state}
                country="au"
                lat={hasMap ? lg.lat : undefined}
                lng={hasMap ? lg.lng : undefined}
                nearbySuburbs={nearbyLocalities.slice(0, 6).map((l) => ({
                  name: titleCase(l.locality),
                  slug: l.slug,
                  postcode: l.postcodes[0] ?? "",
                  distanceKm: haversineDistance(lg.lat, lg.lng, l.lat, l.lng),
                }))}
              />

              <div className="bg-[#0B2545] rounded-2xl p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-white mb-3 text-sm">Search Suburbs</h3>
                <SearchBox size="sm" placeholder="Search…" />
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Related Links</h3>
                <ul className="space-y-2 text-sm">
                  {lg.postcodes.map((pc) => (
                    <li key={pc}>
                      <Link href={`/au/postcode/${pc}`} className="text-[#E8472A] hover:underline">Postcode {pc} details</Link>
                    </li>
                  ))}
                  <li><Link href={`/au/state/${lg.state.toLowerCase()}`} className="text-[#E8472A] hover:underline">All {stName} postcodes</Link></li>
                  <li><Link href="/au/suburbs" className="text-[#E8472A] hover:underline">Browse all suburbs</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Place",
          name, address: { "@type": "PostalAddress", postalCode: lg.postcodes[0], addressRegion: lg.state, addressCountry: "AU" },
          ...(hasMap ? { geo: { "@type": "GeoCoordinates", latitude: lg.lat, longitude: lg.lng } } : {}),
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }) }} />
      </main>
      <Footer />
    </>
  );
}
