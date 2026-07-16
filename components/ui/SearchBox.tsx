"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, X, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/lib/data";
import { getRecents, type RecentItem } from "@/components/ui/SaveToRecents";

interface Props {
  placeholder?: string;
  size?: "sm" | "lg";
}

export default function SearchBox({ placeholder = "Search postcode or suburb…", size = "lg" }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const fuseRef = useRef<any>(null);
  const indexRef = useRef<SearchItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    import("@/lib/data").then(({ getSearchIndex }) => {
      indexRef.current = getSearchIndex();
    });
    import("fuse.js").then(({ default: Fuse }) => {
      if (indexRef.current.length > 0) {
        fuseRef.current = new Fuse(indexRef.current, {
          keys: ["postcode", "locality", "state"],
          threshold: 0.3,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (focused && !query) {
      setRecents(getRecents().slice(0, 5));
    }
  }, [focused, query]);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    if (!fuseRef.current && indexRef.current.length > 0) {
      import("fuse.js").then(({ default: Fuse }) => {
        fuseRef.current = new Fuse(indexRef.current, {
          keys: ["postcode", "locality", "state"],
          threshold: 0.3,
        });
        const r = fuseRef.current.search(q).slice(0, 8).map((x: any) => x.item);
        setResults(r);
        setLoading(false);
      });
    } else if (fuseRef.current) {
      const r = fuseRef.current.search(q).slice(0, 8).map((x: any) => x.item);
      setResults(r);
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const selectResult = (item: SearchItem) => {
    const url = item.country === "au" ? `/au/suburb/${item.slug}` : `/nz/locality/${item.slug}`;
    router.push(url);
    setQuery("");
    setResults([]);
    setFocused(false);
  };

  const handleNearMe = async () => {
    if (!navigator.geolocation) return;
    setNearMeLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const postcode = data?.address?.postcode?.replace(/\s/g, "");
          const cc = data?.address?.country_code;
          if (postcode && cc === "au") {
            router.push(`/au/postcode/${postcode.slice(0, 4)}`);
          } else if (postcode && cc === "nz") {
            router.push(`/nz/postcode/${postcode}`);
          }
        } catch {}
        setNearMeLoading(false);
      },
      () => setNearMeLoading(false),
      { timeout: 8000 }
    );
  };

  const showDropdown = focused && (results.length > 0 || (query.length >= 2 && !loading) || (!query && recents.length > 0));

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center bg-white rounded-xl shadow-lg border border-[#E2E6ED] focus-within:border-[#E8472A] focus-within:ring-2 focus-within:ring-[#E8472A]/20 transition-all ${size === "lg" ? "h-14 sm:h-16" : "h-10"}`}>
          <Search className={`flex-shrink-0 text-[#6B7280] ${size === "lg" ? "w-5 h-5 ml-4 sm:ml-5" : "w-4 h-4 ml-3"}`} />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); doSearch(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent border-none outline-none text-[#1A1A2E] placeholder:text-[#6B7280] ${size === "lg" ? "px-3 text-base sm:text-lg" : "px-2 text-sm"}`}
            autoComplete="off"
            aria-label="Search postcodes and suburbs"
          />
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); }}
              className="p-2 text-[#6B7280] hover:text-[#1A1A2E]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNearMe}
              disabled={nearMeLoading}
              title="Find postcodes near me"
              aria-label="Find my location"
              className={`text-[#6B7280] hover:text-[#E8472A] transition-colors disabled:opacity-40 ${size === "lg" ? "p-2.5 mr-1" : "p-1.5 mr-0.5"}`}
            >
              <Navigation className={`${size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} ${nearMeLoading ? "animate-pulse" : ""}`} />
            </button>
          )}
          <button
            type="submit"
            className={`flex-shrink-0 bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold rounded-lg transition-colors ${size === "lg" ? "px-5 sm:px-7 py-2.5 sm:py-3 mr-1.5 text-sm sm:text-base" : "px-4 py-1.5 mr-1 text-sm"}`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E2E6ED] z-50 overflow-hidden">

          {/* Recently viewed (when query is empty) */}
          {!query && recents.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-[#E2E6ED]">
                <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">Recently Viewed</span>
              </div>
              {recents.map((item, i) => (
                <button
                  key={i}
                  onMouseDown={() => { router.push(item.url); setFocused(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F9] text-left transition-colors border-b border-[#E2E6ED] last:border-0"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${item.country === "au" ? "bg-[#E8472A]" : "bg-[#2D6A4F]"}`}>
                    {item.postcode.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-[#1A1A2E] text-sm block truncate">{item.label}</span>
                    <span className="text-[#6B7280] text-xs">{item.country === "au" ? "🇦🇺 AU" : "🇳🇿 NZ"} · {item.postcode}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Search results */}
          {results.length > 0 && results.map((item, i) => (
            <button
              key={i}
              onMouseDown={() => selectResult(item)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F9] text-left transition-colors border-b border-[#E2E6ED] last:border-0"
            >
              <MapPin className="w-4 h-4 text-[#E8472A] flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-[#1A1A2E] text-sm">{item.locality}</span>
                <span className="text-[#6B7280] text-xs ml-2">
                  {item.postcode} · {item.state} · {item.country === "au" ? "🇦🇺 AU" : "🇳🇿 NZ"}
                </span>
              </div>
            </button>
          ))}

          {/* No results */}
          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="px-4 py-4 text-center">
              <p className="text-[#6B7280] text-sm">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[#6B7280] text-xs mt-1">Try a suburb name, postcode, or state abbreviation</p>
            </div>
          )}

          {/* See all results */}
          {results.length > 0 && (
            <button
              onMouseDown={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
              className="w-full flex items-center gap-2 px-4 py-3 text-[#E8472A] text-sm font-medium hover:bg-[#F4F6F9] transition-colors"
            >
              <Search className="w-4 h-4" />
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
