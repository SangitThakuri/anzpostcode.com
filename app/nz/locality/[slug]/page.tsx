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
import { MapPin } from "lucide-react";
import LocationCard from "@/components/ui/LocationCard";
import { getNZLocalityGroups, getNearbyNZLocalities, getNearbyNZPostcodes } from "@/lib/data";
import { titleCase, absoluteUrl, slugify, haversineDistance } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Array.from(getNZLocalityGroups().keys()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lg = getNZLocalityGroups().get(slug);
  if (!lg) return {};
  const name = titleCase(lg.locality);
  return {
    title: `${name} Postcode – ${lg.postcodes.join(", ")}, ${lg.state}, New Zealand`,
    description: `${name} is a locality in the ${lg.state} region of New Zealand with postcode ${lg.postcodes.join(", ")}.`,
    openGraph: { title: `${name} NZ Postcode`, url: absoluteUrl(`/nz/locality/${slug}`) },
    alternates: { canonical: absoluteUrl(`/nz/locality/${slug}`) },
  };
}

export default async function NZLocalityPage({ params }: Props) {
  const { slug } = await params;
  const lg = getNZLocalityGroups().get(slug);
  if (!lg) notFound();

  const name = titleCase(lg.locality);
  const hasMap = lg.lat !== 0 && lg.lng !== 0;
  const nearbyLocalities = getNearbyNZLocalities(lg.lat, lg.lng, slug);
  const nearbyPostcodes = getNearbyNZPostcodes(lg.lat, lg.lng, lg.postcodes[0] ?? "");
  const pageUrl = absoluteUrl(`/nz/locality/${slug}`);

  const faqs = [
    { question: `What is the postcode of ${name}?`, answer: `${name} has postcode ${lg.postcodes.join(", ")}.` },
    { question: `Which region is ${name} in?`, answer: `${name} is in the ${lg.state} region of New Zealand.` },
    { question: `What localities are near ${name}?`, answer: nearbyLocalities.length > 0 ? `Nearby localities include ${nearbyLocalities.slice(0, 5).map((l) => titleCase(l.locality)).join(", ")}.` : `Use the search to find localities near ${name}.` },
    { question: `Where is ${name} located?`, answer: `${name} is located in the ${lg.state} region of New Zealand${hasMap ? ` at approximately ${lg.lat.toFixed(4)}°, ${lg.lng.toFixed(4)}°` : ""}.` },
    { question: `Is this postcode information official?`, answer: `This data is community-sourced. For official verification, please check NZ Post.` },
  ];

  return (
    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "New Zealand", href: "/nz" },
          { label: lg.state, href: `/nz/region/${slugify(lg.state)}` },
          { label: name },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇳🇿 Locality</span>
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full">{lg.state}</span>
                </div>
                <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-6xl font-bold mb-2">{name}</h1>
                <p className="text-white/70 text-xl">Postcode: {lg.postcodes.join(", ")} · {lg.state}, NZ</p>
              </div>
              <div className="hidden sm:block">
                <ShareButtons url={pageUrl} title={`${name} NZ Postcode – ${lg.postcodes.join(", ")}`} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-5">Locality Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Locality", value: name },
                    { label: "Country", value: "New Zealand 🇳🇿" },
                    { label: "Region", value: lg.state },
                    { label: "Postcode", value: lg.postcodes.join(", ") },
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

              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Postcode for {name}</h2>
                <div className="flex flex-wrap gap-3">
                  {lg.postcodes.map((pc) => (
                    <Link key={pc} href={`/nz/postcode/${pc}`}
                      className="px-4 py-2 bg-[#2D6A4F] text-white rounded-xl font-bold font-[family-name:var(--font-sora)] hover:bg-[#235539] transition-colors">
                      {pc}
                    </Link>
                  ))}
                </div>
              </div>

              {hasMap && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-4">Map of {name}</h2>
                  <MapWrapper lat={lg.lat} lng={lg.lng} label={`${name}, ${lg.state}, NZ`} />
                  <div className="mt-4 pt-4 border-t border-[#E2E6ED]">
                    <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2.5 font-medium">Open in Maps</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${lg.state} New Zealand`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-blue-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Google Maps ↗
                      </a>
                      <a
                        href={`https://maps.apple.com/?q=${encodeURIComponent(`${name} ${lg.state} New Zealand`)}`}
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
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#1A1A2E] hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
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
              {nearbyPostcodes.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Nearby Postcodes</h3>
                  <div className="flex flex-wrap gap-2">
                    {nearbyPostcodes.map((n) => (
                      <Link key={n.postcode} href={`/nz/postcode/${n.postcode}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors text-sm">
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
                country="nz"
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
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-white mb-3 text-sm">Search NZ Localities</h3>
                <SearchBox size="sm" placeholder="Search…" />
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E6ED] p-5">
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4 text-sm">Related Links</h3>
                <ul className="space-y-2 text-sm">
                  {lg.postcodes.map((pc) => (
                    <li key={pc}>
                      <Link href={`/nz/postcode/${pc}`} className="text-[#2D6A4F] hover:underline">Postcode {pc} details</Link>
                    </li>
                  ))}
                  <li><Link href={`/nz/region/${slugify(lg.state)}`} className="text-[#2D6A4F] hover:underline">All {lg.state} postcodes</Link></li>
                  <li><Link href="/nz/localities" className="text-[#2D6A4F] hover:underline">Browse all NZ localities</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Place",
          name, address: { "@type": "PostalAddress", postalCode: lg.postcodes[0], addressRegion: lg.state, addressCountry: "NZ" },
          ...(hasMap ? { geo: { "@type": "GeoCoordinates", latitude: lg.lat, longitude: lg.lng } } : {}),
        }) }} />
      </main>
      <Footer />
    </>
  );
}
