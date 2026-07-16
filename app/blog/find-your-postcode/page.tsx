import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "How to Find Your Postcode in Australia – 5 Easy Methods",
  description: "Not sure of your Australian postcode? Here are 5 fast and free ways to look it up — including our instant suburb search, geolocation, and A-Z index.",
  alternates: { canonical: "https://anzpostcode.com/blog/find-your-postcode" },
  openGraph: { locale: "en_AU", url: "https://anzpostcode.com/blog/find-your-postcode" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Find Your Postcode in Australia",
  description: "5 methods to find any Australian postcode for free.",
  step: [
    { "@type": "HowToStep", name: "Search by suburb name", text: "Type your suburb name into the search box at ANZPostcode.com to instantly find its postcode." },
    { "@type": "HowToStep", name: "Use the Near Me feature", text: "Click the location icon to find postcodes near your current GPS location." },
    { "@type": "HowToStep", name: "Browse by state", text: "Navigate to your state's page and browse all postcodes in alphabetical or numeric order." },
    { "@type": "HowToStep", name: "Use the A-Z index", text: "Browse suburbs alphabetically and find the matching postcode." },
    { "@type": "HowToStep", name: "Check a recent letter", text: "The postcode is printed on mail addressed to you — it's the 4-digit number after the state abbreviation." },
  ],
};

export default function FindYourPostcodePage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "How to Find Your Postcode" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full font-medium">How-to</span>
              <span className="text-white/50 text-sm">January 2025 · 3 min read</span>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold mb-4">
              How to Find Your Postcode in Australia
            </h1>
            <p className="text-white/70 text-lg">
              Five fast, free ways to find any Australian postcode — from instant search to GPS lookup.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 space-y-8">

            <p className="text-[#6B7280] leading-relaxed">
              Australian postcodes are 4-digit codes that go at the end of a postal address, after the state abbreviation — e.g. &ldquo;Sydney NSW 2000&rdquo;. If you don&apos;t know your postcode, here are the five fastest ways to find it.
            </p>

            {[
              {
                step: "1",
                title: "Search by suburb name",
                color: "#E8472A",
                content: (
                  <p className="text-[#6B7280] leading-relaxed">
                    The quickest method. Type your suburb or locality name into the{" "}
                    <Link href="/search" className="text-[#E8472A] hover:underline">search box</Link> and the matching postcode will appear instantly. Fuzzy matching means typos are OK — &ldquo;Melburn&rdquo; will still find Melbourne.
                  </p>
                ),
              },
              {
                step: "2",
                title: "Use the 'Near Me' feature",
                color: "#E8472A",
                content: (
                  <p className="text-[#6B7280] leading-relaxed">
                    Click the 📍 location icon in the search bar (any page on this site). Your browser will ask for permission to access your location. If granted, we use OpenStreetMap&apos;s free geocoder to look up the postcode for your current GPS coordinates and redirect you to that postcode&apos;s page — no account needed.
                  </p>
                ),
              },
              {
                step: "3",
                title: "Browse by state",
                color: "#E8472A",
                content: (
                  <div className="text-[#6B7280] leading-relaxed">
                    <p className="mb-3">If you know which state you&apos;re in, browse directly to that state page and scan the list:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "NSW", href: "/au/state/nsw" },
                        { label: "VIC", href: "/au/state/vic" },
                        { label: "QLD", href: "/au/state/qld" },
                        { label: "SA", href: "/au/state/sa" },
                        { label: "WA", href: "/au/state/wa" },
                        { label: "TAS", href: "/au/state/tas" },
                        { label: "NT", href: "/au/state/nt" },
                        { label: "ACT", href: "/au/state/act" },
                      ].map((s) => (
                        <Link key={s.label} href={s.href}
                          className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-sm font-semibold text-[#E8472A] hover:border-[#E8472A] transition-colors">
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                step: "4",
                title: "Use the A–Z suburb index",
                color: "#E8472A",
                content: (
                  <p className="text-[#6B7280] leading-relaxed">
                    The <Link href="/au/a-z" className="text-[#E8472A] hover:underline">A–Z index</Link> lists all 17,500+ Australian suburbs alphabetically. Click the starting letter and scroll to your suburb. This is useful when you know the name but aren&apos;t sure of the exact spelling.
                  </p>
                ),
              },
              {
                step: "5",
                title: "Check a letter or envelope",
                color: "#E8472A",
                content: (
                  <p className="text-[#6B7280] leading-relaxed">
                    The most reliable source is a piece of mail already addressed to your home. The postcode is the 4-digit number printed after the state abbreviation on the address line, e.g. <strong className="text-[#1A1A2E]">Melbourne VIC 3000</strong>. If you&apos;ve recently received a bill, bank statement, or government letter, it will have your correct postcode.
                  </p>
                ),
              },
            ].map((item) => (
              <section key={item.step}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#E8472A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{item.step}</div>
                  <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545]">{item.title}</h2>
                </div>
                {item.content}
              </section>
            ))}

            <section>
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-3">Tips for rural and regional postcodes</h2>
              <p className="text-[#6B7280] leading-relaxed mb-3">
                In rural and regional Australia, postcodes often cover a larger geographic area and may include several towns. If your town or locality doesn&apos;t appear in a search, try searching for the nearest larger town. Rural postcodes also tend to have higher numbers within their state range — for example, in NSW, outer rural areas use 2800–2999 while inner Sydney is 2000–2234.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                For very remote communities or stations, it&apos;s worth checking our <Link href="/au/suburbs" className="text-[#E8472A] hover:underline">full suburb directory</Link> — we include over 17,500 localities including small rural towns and outstations.
              </p>
            </section>

            <div className="bg-[#F4F6F9] rounded-xl p-5">
              <p className="text-[#0B2545] font-semibold mb-1">Find your postcode now</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/search" className="px-4 py-2 bg-[#E8472A] text-white rounded-lg text-sm font-medium hover:bg-[#d43d22] transition-colors">Search suburbs</Link>
                <Link href="/au/a-z" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#E8472A] transition-colors">Browse A–Z</Link>
                <Link href="/au/postcodes" className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm font-medium hover:border-[#E8472A] transition-colors">All AU postcodes</Link>
              </div>
            </div>
          </div>
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </main>
      <Footer />
    </>
  );
}
