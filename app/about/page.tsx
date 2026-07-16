import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MapPin, Search, Globe, Database, Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About ANZ Postcode – Australia & NZ Postcode Directory",
  description: "ANZPostcode.com is a free, ad-light postcode directory for Australia and New Zealand. Learn about our mission, data sources, and coverage.",
  alternates: { canonical: "https://anzpostcode.com/about" },
};

const stats = [
  { label: "AU postcodes", value: "3,175+" },
  { label: "AU suburbs", value: "17,500+" },
  { label: "NZ postcodes", value: "150+" },
  { label: "NZ localities", value: "160+" },
  { label: "Pages indexed", value: "21,000+" },
  { label: "Cost to use", value: "Free" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "About" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-[#E8472A] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold mb-4">About ANZ Postcode</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              A free, open postcode directory for Australia and New Zealand — no paywalls, no sign-ups, no data collection.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b border-[#E2E6ED]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#E8472A]">{s.value}</div>
                  <div className="text-[#6B7280] text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

          {/* Mission */}
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F4F6F9] rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#E8472A]" />
              </div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">Our Mission</h2>
            </div>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              ANZPostcode was built to make postcode information freely accessible to anyone in Australia and New Zealand. Whether you&apos;re filling in an online form, checking delivery zones, or just curious about your suburb&apos;s postcode — you should be able to find it instantly, for free.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              We cover every postcode and suburb across all eight Australian states and territories, plus all 16 New Zealand regions. Each page includes location details, an interactive map, nearby suburbs, and frequently asked questions tailored to that specific postcode or locality.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#F4F6F9] rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-[#E8472A]" />
              </div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">How It Works</h2>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Search", desc: "Use the search bar to type any suburb name, locality, or postcode. Results appear instantly using client-side fuzzy search — no server calls, no latency." },
                { step: "2", title: "Browse", desc: "Explore postcodes by state (Australia) or region (New Zealand) using the browse pages. Every state and region has its own dedicated page." },
                { step: "3", title: "Discover", desc: "Each postcode and suburb page shows location details, coordinates, nearby areas, an interactive OpenStreetMap embed, and a distance calculator." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-7 h-7 bg-[#E8472A] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{item.step}</div>
                  <div>
                    <p className="font-semibold text-[#0B2545] mb-1">{item.title}</p>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data */}
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F4F6F9] rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-[#E8472A]" />
              </div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">Data & Accuracy</h2>
            </div>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              Our postcode data is sourced from community-maintained open datasets. Australian data is based on the widely-used Australian Postcodes dataset, compiled from publicly available postal information. New Zealand data is compiled from publicly available NZ geographic and postal records.
            </p>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              Data was last updated in January 2025. Postcodes occasionally change — new suburbs are created, boundaries shift, and mail centres are added. If you notice an error or outdated information, please{" "}
              <Link href="/contact" className="text-[#E8472A] hover:underline">contact us</Link>.
            </p>
            <div className="bg-[#FFF8F6] border border-[#E8472A]/20 rounded-xl p-4 text-sm text-[#6B7280]">
              <strong className="text-[#0B2545]">Disclaimer:</strong> This site is not affiliated with Australia Post, NZ Post, or any government agency. For official postal address verification, use the relevant postal authority.
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F4F6F9] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#E8472A]" />
              </div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545]">Privacy & Technology</h2>
            </div>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              ANZPostcode is a fully static website. There is no user account system, no login, no tracking cookies, and no data collection. All postcode lookups happen entirely in your browser — no search queries are sent to our servers.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              The only external service used is OpenStreetMap for map tiles, and the Nominatim geocoder for the &ldquo;Near me&rdquo; feature (one anonymous request to reverse-geocode your coordinates). No personal data is stored.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/privacy-policy" className="text-[#E8472A] text-sm hover:underline">Privacy Policy</Link>
              <span className="text-[#E2E6ED]">·</span>
              <Link href="/terms" className="text-[#E8472A] text-sm hover:underline">Terms of Use</Link>
              <span className="text-[#E2E6ED]">·</span>
              <Link href="/data-sources" className="text-[#E8472A] text-sm hover:underline">Data Sources</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#0B2545] rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold">Get in Touch</h2>
            </div>
            <p className="text-white/70 leading-relaxed mb-5">
              Found an error? Have a suggestion? Want to report a missing postcode? We&apos;d love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
