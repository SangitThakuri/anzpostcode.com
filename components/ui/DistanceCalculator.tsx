"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Ruler, MapPin } from "lucide-react";
import { haversineDistance } from "@/lib/utils";
import type { SearchItem } from "@/lib/data";

interface Props {
  lat: number;
  lng: number;
  label: string;
}

export default function DistanceCalculator({ lat, lng, label }: Props) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState<{ dist: number; to: string; country: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fuseRef = useRef<any>(null);
  const indexRef = useRef<SearchItem[]>([]);

  useEffect(() => {
    import("@/lib/data").then(({ getSearchIndex }) => {
      indexRef.current = getSearchIndex();
    });
  }, []);

  const getSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    if (!fuseRef.current) {
      const [{ getSearchIndex }, { default: Fuse }] = await Promise.all([
        import("@/lib/data"),
        import("fuse.js"),
      ]);
      indexRef.current = getSearchIndex();
      fuseRef.current = new Fuse(indexRef.current, {
        keys: ["postcode", "locality", "state"],
        threshold: 0.3,
      });
    }
    const results = fuseRef.current.search(q).slice(0, 6).map((x: any) => x.item);
    setSuggestions(results);
  }, []);

  const handleChange = (val: string) => {
    setInput(val);
    setResult(null);
    setError("");
    setShowSuggestions(true);
    getSuggestions(val);
  };

  const selectSuggestion = (item: SearchItem) => {
    setInput(`${item.locality} ${item.postcode}`);
    setSuggestions([]);
    setShowSuggestions(false);
    if (item.lat && item.lng) {
      const dist = haversineDistance(lat, lng, item.lat, item.lng);
      setResult({
        dist: Math.round(dist),
        to: `${item.locality} ${item.postcode}`,
        country: item.country === "au" ? "🇦🇺 Australia" : "🇳🇿 New Zealand",
      });
    } else {
      setError(`No coordinates for ${item.locality}.`);
    }
  };

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowSuggestions(false);

    if (!indexRef.current.length) {
      const { getSearchIndex } = await import("@/lib/data");
      indexRef.current = getSearchIndex();
    }
    const match = indexRef.current.find(
      (i) => i.postcode === q || i.locality.toLowerCase() === q.toLowerCase()
    ) ?? indexRef.current.find(
      (i) => `${i.locality} ${i.postcode}`.toLowerCase() === q.toLowerCase()
    );

    if (!match || !match.lat || !match.lng) {
      setError(`"${q}" not found or has no location data.`);
      setLoading(false);
      return;
    }

    const dist = haversineDistance(lat, lng, match.lat, match.lng);
    setResult({
      dist: Math.round(dist),
      to: `${match.locality} ${match.postcode}`,
      country: match.country === "au" ? "🇦🇺 Australia" : "🇳🇿 New Zealand",
    });
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6 no-print">
      <div className="flex items-center gap-2 mb-1">
        <Ruler className="w-4 h-4 text-[#E8472A]" />
        <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545]">
          Distance Calculator
        </h2>
      </div>
      <p className="text-[#6B7280] text-sm mb-4">
        Straight-line distance from <span className="font-medium text-[#1A1A2E]">{label}</span> to another postcode or suburb.
      </p>

      <form onSubmit={calculate} className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => input.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Postcode or suburb name…"
            className="w-full border border-[#E2E6ED] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8472A]/20 focus:border-[#E8472A] transition-colors"
            autoComplete="off"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E2E6ED] z-50 overflow-hidden">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={() => selectSuggestion(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F9] text-left transition-colors border-b border-[#E2E6ED] last:border-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E8472A] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium text-[#1A1A2E] text-sm">{item.locality}</span>
                    <span className="text-[#6B7280] text-xs ml-2">
                      {item.postcode} · {item.state} · {item.country === "au" ? "🇦🇺" : "🇳🇿"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-[#E8472A] text-white rounded-xl text-sm font-semibold hover:bg-[#d43d22] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {loading ? "…" : "Calculate"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {result && (
        <div className="mt-4 bg-[#F4F6F9] rounded-xl p-4 flex items-center gap-4">
          <div className="text-3xl font-bold font-[family-name:var(--font-sora)] text-[#E8472A]">
            ~{result.dist.toLocaleString()} km
          </div>
          <div>
            <p className="text-[#1A1A2E] text-sm font-medium">to {result.to}</p>
            <p className="text-[#6B7280] text-xs">{result.country} · straight-line</p>
          </div>
        </div>
      )}
    </div>
  );
}
