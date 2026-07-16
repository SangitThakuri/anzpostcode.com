import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Postcode Guides – ANZ Postcode Blog",
  description: "Guides and explainers about Australian and New Zealand postcodes. Learn how the postcode system works, find major city postcodes, and more.",
  alternates: { canonical: "https://anzpostcode.com/blog" },
};

const articles = [
  {
    slug: "how-australian-postcodes-work",
    title: "How Australian Postcodes Work",
    excerpt: "Australia uses a 4-digit postcode system where the first digit tells you which state or territory. Learn the history, format, and rules behind AU postcodes.",
    tag: "🇦🇺 Australia",
    date: "January 2025",
    readTime: "5 min read",
  },
  {
    slug: "major-city-postcodes-australia",
    title: "Major City Postcodes in Australia",
    excerpt: "Quick reference guide for CBD postcodes in every Australian capital city — Sydney 2000, Melbourne 3000, Brisbane 4000, and more.",
    tag: "🇦🇺 Australia",
    date: "January 2025",
    readTime: "3 min read",
  },
  {
    slug: "nz-postcode-guide",
    title: "New Zealand Postcode Guide",
    excerpt: "New Zealand introduced its 4-digit postcode system in 2006. Here's how NZ postcodes are structured and what the numbers mean.",
    tag: "🇳🇿 New Zealand",
    date: "January 2025",
    readTime: "4 min read",
  },
  {
    slug: "postcode-vs-suburb",
    title: "Postcode vs Suburb: What's the Difference?",
    excerpt: "A suburb is a geographic area; a postcode is a postal delivery zone. They don't always match 1:1. Here's what you need to know.",
    tag: "Explainer",
    date: "January 2025",
    readTime: "4 min read",
  },
  {
    slug: "find-your-postcode",
    title: "How to Find Your Postcode in Australia",
    excerpt: "Not sure of your postcode? Here are the fastest and most reliable ways to look it up — including our free search tool.",
    tag: "How-to",
    date: "January 2025",
    readTime: "3 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold mb-3">Postcode Guides</h1>
            <p className="text-white/70 text-lg">Explainers, how-tos, and reference guides about AU and NZ postcodes.</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="block bg-white rounded-2xl border border-[#E2E6ED] p-6 hover:border-[#E8472A] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-[#6B7280] bg-[#F4F6F9] px-2.5 py-1 rounded-full">{a.tag}</span>
                  <span className="text-[#6B7280] text-xs">{a.date}</span>
                  <span className="text-[#6B7280] text-xs">· {a.readTime}</span>
                </div>
                <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] group-hover:text-[#E8472A] transition-colors mb-2">
                  {a.title}
                </h2>
                <p className="text-[#6B7280] leading-relaxed">{a.excerpt}</p>
                <span className="inline-block mt-3 text-[#E8472A] text-sm font-medium">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
