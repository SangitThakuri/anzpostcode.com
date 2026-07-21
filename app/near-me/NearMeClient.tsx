"use client";
import { useState } from "react";
import Link from "next/link";
import { Navigation, MapPin, Loader } from "lucide-react";
import { titleCase, stateLabel, haversineDistance } from "@/lib/utils";
import type { SearchItem } from "@/lib/data";

type Status = "idle" | "loading" | "found" | "error";

interface NearResult {
  item: SearchItem;
  dist: number;
  nearby: { item: SearchItem; dist: number }[];
}

export default function NearMeClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<NearResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const findMe = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { lat, longitude: lng } = coords;
        const { getSearchIndex } = await import("@/lib/data");
        const index = getSearchIndex().filter((i) => i.lat && i.lng);

        let best: SearchItem | null = null;
        let bestDist = Infinity;
        for (const item of index) {
          const d = haversineDistance(lat, lng, item.lat!, item.lng!);
          if (d < bestDist) { bestDist = d; best = item; }
        }
        if (!best) { setStatus("error"); setErrorMsg("Could not find a nearby postcode."); return; }

        const nearby = index
          .filter((i) => i !== best)
          .map((item) => ({ item, dist: haversineDistance(lat, lng, item.lat!, item.lng!) }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 6);

        setResult({ item: best, dist: Math.round(bestDist), nearby });
        setStatus("found");
      },
      (err) => {
        setStatus("error");
        setErrorMsg(
          err.code === 1
            ? "Location access was denied. Please allow location access in your browser settings."
            : "Could not get your location. Please try again."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      {/* Button */}
      <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 text-center">
        <button
          onClick={findMe}
          disabled={status === "loading"}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold text-lg rounded-2xl transition-colors disabled:opacity-60 shadow-lg shadow-[#E8472A]/20"
        >
          {status === "loading" ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
          {status === "loading" ? "Detecting location…" : "Use my location"}
        </button>
        <p className="text-[#6B7280] text-sm mt-4">
          Your location is used only on your device — nothing is sent to our servers.
        </p>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Result */}
      {status === "found" && result && (
        <>
          <div className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white rounded-2xl p-6">
            <p className="text-white/70 text-sm mb-1">Your postcode</p>
            <div className="font-[family-name:var(--font-sora)] text-5xl font-bold text-[#E8472A] mb-2">
              {result.item.postcode}
            </div>
            <div className="text-xl font-semibold mb-1">{titleCase(result.item.locality)}</div>
            <div className="text-white/70 text-sm">
              {result.item.state} · {result.item.country === "au" ? "Australia 🇦🇺" : "New Zealand 🇳🇿"}
              {result.dist === 0 ? " · exact match" : ` · within ${result.dist} km`}
            </div>
            <Link
              href={result.item.country === "au"
                ? `/au/postcode/${result.item.postcode}`
                : `/nz/postcode/${result.item.postcode}`}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <MapPin className="w-4 h-4" />
              View full postcode details
            </Link>
          </div>

          {result.nearby.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
              <h2 className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] mb-4">Nearby Postcodes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.nearby.map(({ item, dist }) => (
                  <Link
                    key={item.postcode + item.locality}
                    href={item.country === "au"
                      ? `/au/postcode/${item.postcode}`
                      : `/nz/postcode/${item.postcode}`}
                    className="flex flex-col p-3 bg-[#F4F6F9] rounded-xl hover:border-[#E8472A] border border-[#E2E6ED] transition-colors"
                  >
                    <span className="font-bold text-[#E8472A] font-[family-name:var(--font-sora)]">{item.postcode}</span>
                    <span className="text-[#1A1A2E] text-xs mt-0.5 truncate">{titleCase(item.locality)}</span>
                    <span className="text-[#6B7280] text-xs">~{Math.round(dist)} km</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
