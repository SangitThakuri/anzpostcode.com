"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBox from "@/components/ui/SearchBox";
import { MapPin, Filter } from "lucide-react";
import type { SearchItem } from "@/lib/data";
import { titleCase } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const countryFilter = searchParams.get("country") ?? "all";

  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    setPage(1);

    Promise.all([
      import("@/lib/data").then((m) => m.getSearchIndex()),
      import("fuse.js"),
    ]).then(([index, { default: Fuse }]) => {
      const filtered = countryFilter === "all" ? index : index.filter((i) => i.country === countryFilter);
      const fuse = new Fuse(filtered, { keys: ["postcode", "locality", "state"], threshold: 0.35 });
      const r = fuse.search(query).map((x: any) => x.item);
      setResults(r);
      setLoading(false);
    });
  }, [query, countryFilter]);

  const paged = results.slice(0, page * PER_PAGE);
  const hasMore = paged.length < results.length;

  const setCountry = (c: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (c === "all") params.delete("country"); else params.set("country", c);
    router.replace(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-[#6B7280]" />
        <span className="text-sm text-[#6B7280]">Filter:</span>
        {[
          { value: "all", label: "All countries" },
          { value: "au", label: "🇦🇺 Australia" },
          { value: "nz", label: "🇳🇿 New Zealand" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setCountry(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              countryFilter === opt.value
                ? "bg-[#0B2545] text-white border-[#0B2545]"
                : "bg-white text-[#1A1A2E] border-[#E2E6ED] hover:border-[#0B2545]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {query && !loading && (
        <p className="text-[#6B7280] text-sm mb-5">
          {results.length === 0 ? "No results" : `${results.length.toLocaleString()} results`} for &ldquo;{query}&rdquo;
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E6ED] p-4 animate-pulse">
              <div className="h-4 bg-[#E2E6ED] rounded w-32 mb-2" />
              <div className="h-3 bg-[#E2E6ED] rounded w-48" />
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-16">
          <MapPin className="w-12 h-12 text-[#E2E6ED] mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-2">
            No results found
          </h2>
          <p className="text-[#6B7280] mb-6">
            Try a different postcode, suburb, or spelling.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Sydney", "Melbourne", "Auckland", "2000", "3000", "1010"].map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="px-4 py-2 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg text-sm hover:border-[#E8472A] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && paged.length > 0 && (
        <div className="space-y-3">
          {paged.map((item, i) => (
            <Link
              key={i}
              href={item.country === "au" ? `/au/suburb/${item.slug}` : `/nz/locality/${item.slug}`}
              className="flex items-center gap-4 bg-white border border-[#E2E6ED] rounded-xl p-4 hover:border-[#E8472A] hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm font-[family-name:var(--font-sora)] flex-shrink-0 ${item.country === "au" ? "bg-[#E8472A]" : "bg-[#2D6A4F]"}`}>
                {item.postcode}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#1A1A2E] group-hover:text-[#E8472A] transition-colors">
                  {titleCase(item.locality)}
                </div>
                <div className="text-[#6B7280] text-xs mt-0.5">
                  {item.state} · {item.country === "au" ? "🇦🇺 Australia" : "🇳🇿 New Zealand"}
                </div>
              </div>
              <MapPin className="w-4 h-4 text-[#E2E6ED] group-hover:text-[#E8472A] transition-colors flex-shrink-0" />
            </Link>
          ))}

          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 bg-white border border-[#E2E6ED] rounded-xl text-sm font-medium text-[#0B2545] hover:border-[#E8472A] hover:text-[#E8472A] transition-colors"
            >
              Load more ({results.length - paged.length} remaining)
            </button>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-[#6B7280] mb-4">Type a postcode or suburb name to search</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Sydney", "Melbourne", "Brisbane", "Auckland", "Wellington", "2000"].map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                className="px-4 py-2 bg-white border border-[#E2E6ED] rounded-lg text-sm hover:border-[#E8472A] transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold text-center mb-6">
              Search Postcodes &amp; Suburbs
            </h1>
            <SearchBox size="lg" placeholder="Search postcode, suburb, or locality…" />
          </div>
        </section>
        <Suspense fallback={<div className="text-center py-16 text-[#6B7280]">Loading…</div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
