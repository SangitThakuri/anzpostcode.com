"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  MapPin,
  Navigation,
  Cloud,
  Clock,
  ExternalLink,
  Sun,
} from "lucide-react";
import { haversineDistance } from "@/lib/utils";

// ─── AU State Capitals ───────────────────────────────────────────────────────

const AU_CAPITALS: Record<string, { name: string; lat: number; lng: number }> = {
  NSW: { name: "Sydney CBD",    lat: -33.8688, lng: 151.2093 },
  VIC: { name: "Melbourne CBD", lat: -37.8136, lng: 144.9631 },
  QLD: { name: "Brisbane CBD",  lat: -27.4698, lng: 153.0251 },
  SA:  { name: "Adelaide CBD",  lat: -34.9285, lng: 138.6007 },
  WA:  { name: "Perth CBD",     lat: -31.9505, lng: 115.8605 },
  TAS: { name: "Hobart CBD",    lat: -42.8826, lng: 147.3257 },
  NT:  { name: "Darwin CBD",    lat: -12.4634, lng: 130.8456 },
  ACT: { name: "Canberra CBD",  lat: -35.2809, lng: 149.1300 },
};

// ─── NZ Region Centres ───────────────────────────────────────────────────────

const NZ_CENTRES: Record<string, { name: string; lat: number; lng: number }> = {
  Auckland:              { name: "Auckland CBD",      lat: -36.8485, lng: 174.7633 },
  Wellington:            { name: "Wellington CBD",    lat: -41.2865, lng: 174.7762 },
  Canterbury:            { name: "Christchurch CBD",  lat: -43.5321, lng: 172.6362 },
  Otago:                 { name: "Dunedin CBD",       lat: -45.8788, lng: 170.5028 },
  Waikato:               { name: "Hamilton CBD",      lat: -37.7870, lng: 175.2793 },
  "Bay of Plenty":       { name: "Tauranga CBD",      lat: -37.6878, lng: 176.1651 },
  Manawatu:              { name: "Palmerston North",  lat: -40.3523, lng: 175.6082 },
  "Manawatu-Whanganui":  { name: "Palmerston North",  lat: -40.3523, lng: 175.6082 },
  Northland:             { name: "Whangarei CBD",     lat: -35.7246, lng: 174.3237 },
  Southland:             { name: "Invercargill CBD",  lat: -46.4132, lng: 168.3538 },
  Taranaki:              { name: "New Plymouth CBD",  lat: -39.0556, lng: 174.0752 },
  Marlborough:           { name: "Blenheim CBD",      lat: -41.5134, lng: 173.9612 },
  Hawke: { name: "Napier CBD", lat: -39.4928, lng: 176.9120 },
  "Hawke's Bay":         { name: "Napier CBD",        lat: -39.4928, lng: 176.9120 },
  Gisborne:              { name: "Gisborne CBD",      lat: -38.6621, lng: 178.0176 },
  Nelson:                { name: "Nelson CBD",        lat: -41.2706, lng: 173.2840 },
  Tasman:                { name: "Richmond CBD",      lat: -41.3382, lng: 173.1740 },
  "West Coast":          { name: "Greymouth CBD",     lat: -42.4503, lng: 171.2088 },
};

// ─── Timezone Data ───────────────────────────────────────────────────────────

interface TzInfo {
  name: string;
  offset: string;
  dstName: string;
  dstOffset: string;
  hasDST: boolean;
}

const AU_TIMEZONES: Record<string, TzInfo> = {
  NSW: { name: "AEST", offset: "UTC+10", dstName: "AEDT", dstOffset: "UTC+11",    hasDST: true  },
  VIC: { name: "AEST", offset: "UTC+10", dstName: "AEDT", dstOffset: "UTC+11",    hasDST: true  },
  TAS: { name: "AEST", offset: "UTC+10", dstName: "AEDT", dstOffset: "UTC+11",    hasDST: true  },
  ACT: { name: "AEST", offset: "UTC+10", dstName: "AEDT", dstOffset: "UTC+11",    hasDST: true  },
  QLD: { name: "AEST", offset: "UTC+10", dstName: "AEST", dstOffset: "UTC+10",    hasDST: false },
  SA:  { name: "ACST", offset: "UTC+9:30", dstName: "ACDT", dstOffset: "UTC+10:30", hasDST: true },
  WA:  { name: "AWST", offset: "UTC+8",  dstName: "AWST", dstOffset: "UTC+8",     hasDST: false },
  NT:  { name: "ACST", offset: "UTC+9:30", dstName: "ACST", dstOffset: "UTC+9:30", hasDST: false },
};

const NZ_TIMEZONE: TzInfo = {
  name: "NZST", offset: "UTC+12",
  dstName: "NZDT", dstOffset: "UTC+13",
  hasDST: true,
};

function isDSTActive(country: "au" | "nz"): boolean {
  const m = new Date().getMonth() + 1; // 1–12
  // Southern Hemisphere: summer (DST) spans Oct → Mar/Apr
  if (country === "au") return m >= 10 || m <= 3;
  return m >= 9 || m <= 4; // NZ: Sep → Apr
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  postcode: string;
  primary: string;
  state: string;
  country: "au" | "nz";
  lat?: number;
  lng?: number;
}

export default function LocationCard({ postcode, primary, state, country, lat, lng }: Props) {
  const [copied, setCopied] = useState(false);
  const [dstActive, setDstActive] = useState(false);

  useEffect(() => {
    setDstActive(isDSTActive(country));
  }, [country]);

  // ── Copy text ──────────────────────────────────────────────────────────────
  const countryLabel = country === "au" ? "Australia" : "New Zealand";
  const copyText = `${primary}, ${state} ${postcode}, ${countryLabel}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = copyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Map URLs ───────────────────────────────────────────────────────────────
  const q = encodeURIComponent(`${primary} ${state} ${postcode} ${countryLabel}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const appleMapsUrl  = `https://maps.apple.com/?q=${q}`;

  // ── Weather URL ────────────────────────────────────────────────────────────
  const weatherUrl = country === "au"
    ? `https://www.bom.gov.au/places/${encodeURIComponent(state.toLowerCase())}/${encodeURIComponent(primary.toLowerCase().replace(/\s+/g, "-"))}/`
    : `https://www.metservice.com/towns-cities/locations/${encodeURIComponent(primary.toLowerCase().replace(/\s+/g, "-"))}`;

  // ── Distance to capital / regional centre ──────────────────────────────────
  let capitalDistance: string | null = null;
  let capitalName = "";

  if (lat && lng) {
    let centre: { name: string; lat: number; lng: number } | undefined;
    if (country === "au") {
      centre = AU_CAPITALS[state];
    } else {
      // NZ state field holds the region name
      centre = NZ_CENTRES[state] ?? NZ_CENTRES["Wellington"];
    }
    if (centre) {
      capitalName = centre.name;
      const km = haversineDistance(lat, lng, centre.lat, centre.lng);
      capitalDistance = km < 1
        ? `${Math.round(km * 1000)} m`
        : `${km.toFixed(1)} km`;
    }
  }

  // ── Timezone ───────────────────────────────────────────────────────────────
  const tz = country === "au" ? (AU_TIMEZONES[state] ?? AU_TIMEZONES.NSW) : NZ_TIMEZONE;
  const activeTzName   = dstActive && tz.hasDST ? tz.dstName   : tz.name;
  const activeTzOffset = dstActive && tz.hasDST ? tz.dstOffset : tz.offset;

  // ── Accent colour per country ──────────────────────────────────────────────
  const accent = country === "au" ? "#E8472A" : "#2D6A4F";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E6ED] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#112d5e] px-5 py-4">
        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
          Location Utilities
        </p>
        <p className="text-white font-semibold text-sm">
          {primary} · {state} {postcode}
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* ── Copy Full Details ── */}
        <div>
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              copied
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-[#F4F6F9] border-[#E2E6ED] text-[#1A1A2E] hover:bg-red-50"
            }`}
            style={copied ? {} : { ["--tw-ring-color" as string]: accent }}
            onMouseEnter={(e) => {
              if (!copied) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
                (e.currentTarget as HTMLButtonElement).style.color = accent;
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "";
                (e.currentTarget as HTMLButtonElement).style.color = "";
              }
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Full Details"}
          </button>
          <p className="text-[#9CA3AF] text-[11px] mt-1.5 text-center truncate px-2">
            {copyText}
          </p>
        </div>

        {/* ── Map Links ── */}
        <div>
          <p className="text-[#6B7280] text-[10px] uppercase tracking-wider mb-2.5 font-medium">
            Open in Maps
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-xs font-medium text-[#1A1A2E] hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-blue-50 transition-all duration-200"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 flex-shrink-0" />
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-xs font-medium text-[#1A1A2E] hover:border-[#147EFB] hover:text-[#147EFB] hover:bg-blue-50 transition-all duration-200"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Apple Maps</span>
              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#E2E6ED]" />

        {/* ── Other Utilities ── */}
        <div>
          <p className="text-[#6B7280] text-[10px] uppercase tracking-wider mb-3 font-medium">
            Other Utilities
          </p>
          <div className="space-y-2.5">
            {/* Weather */}
            <a
              href={weatherUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 bg-sky-50 border border-sky-100 rounded-xl hover:border-sky-300 hover:bg-sky-100/70 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sky-900 leading-tight">Weather Lookup</p>
                <p className="text-sky-500 text-xs mt-0.5">
                  {country === "au" ? "Bureau of Meteorology" : "MetService NZ"}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0 transition-colors" />
            </a>

            {/* Distance to Capital */}
            {capitalDistance !== null && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-emerald-900 leading-tight">
                    Distance to Capital
                  </p>
                  <p className="text-emerald-600 text-xs mt-0.5 truncate">{capitalName}</p>
                </div>
                <span className="flex-shrink-0 text-sm font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  ~{capitalDistance}
                </span>
              </div>
            )}

            {/* Timezone */}
            <div className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-violet-900 leading-tight">Time Zone</p>
                <p className="text-violet-500 text-xs mt-0.5">{activeTzOffset}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[11px] font-bold text-white bg-violet-500 px-2 py-1 rounded-lg leading-none">
                  {activeTzName}
                </span>
                {tz.hasDST && (
                  <span
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg leading-none border transition-colors ${
                      dstActive
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    {dstActive ? "DST" : "STD"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
