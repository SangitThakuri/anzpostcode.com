"use client";
import { useState } from "react";
import { Ruler } from "lucide-react";
import { haversineDistance } from "@/lib/utils";

interface Props {
  lat: number;
  lng: number;
  label: string;
}

export default function DistanceCalculator({ lat, lng, label }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ dist: number; to: string; country: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResult(null);

    const { getSearchIndex } = await import("@/lib/data");
    const index = getSearchIndex();
    const match = index.find(
      (i) =>
        i.postcode === q ||
        i.locality.toLowerCase() === q.toLowerCase()
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
      <form onSubmit={calculate} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Postcode or suburb name…"
          className="flex-1 border border-[#E2E6ED] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8472A]/20 focus:border-[#E8472A] transition-colors"
        />
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
