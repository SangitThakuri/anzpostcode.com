"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "lucide-react";

interface Props {
  country?: "au" | "nz" | "both";
  className?: string;
}

export default function GeoLocateButton({ country = "both", className = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();

  const handleClick = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { lat, longitude: lng } = coords;
        const { getSearchIndex } = await import("@/lib/data");
        const index = getSearchIndex();

        // Filter by country if specified
        const pool = country === "both" ? index : index.filter((i) => i.country === country);

        let best = pool[0];
        let bestDist = Infinity;
        for (const item of pool) {
          if (!item.lat || !item.lng) continue;
          const dLat = item.lat - lat;
          const dLng = item.lng - lng;
          const d = dLat * dLat + dLng * dLng;
          if (d < bestDist) { bestDist = d; best = item; }
        }

        if (!best) { setStatus("error"); return; }
        const path = best.country === "au"
          ? `/au/postcode/${best.postcode}`
          : `/nz/postcode/${best.postcode}`;
        router.push(path);
      },
      () => setStatus("error"),
      { timeout: 8000 }
    );
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60 backdrop-blur-sm"
      >
        <Navigation className={`w-4 h-4 ${status === "loading" ? "animate-pulse" : ""}`} />
        {status === "loading" ? "Finding your location…" : "Find my postcode"}
      </button>
      {status === "error" && (
        <p className="text-white/60 text-xs mt-1.5 text-center">
          Location unavailable — please allow access and try again.
        </p>
      )}
    </div>
  );
}
