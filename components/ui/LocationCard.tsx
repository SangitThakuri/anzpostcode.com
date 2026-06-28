"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  MapPin,
  Navigation,
  Clock,
  ExternalLink,
  Sun,
  Truck,
  Building2,
  Crosshair,
  Globe,
  Zap,
  ArrowRight,
  Package,
} from "lucide-react";
import { haversineDistance } from "@/lib/utils";

// ─── AU State Capitals ────────────────────────────────────────────────────────

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

const NZ_CENTRES: Record<string, { name: string; lat: number; lng: number }> = {
  Auckland:             { name: "Auckland CBD",     lat: -36.8485, lng: 174.7633 },
  Wellington:           { name: "Wellington CBD",   lat: -41.2865, lng: 174.7762 },
  Canterbury:           { name: "Christchurch CBD", lat: -43.5321, lng: 172.6362 },
  Otago:                { name: "Dunedin CBD",      lat: -45.8788, lng: 170.5028 },
  Waikato:              { name: "Hamilton CBD",     lat: -37.7870, lng: 175.2793 },
  "Bay of Plenty":      { name: "Tauranga CBD",     lat: -37.6878, lng: 176.1651 },
  "Manawatu-Whanganui": { name: "Palmerston North", lat: -40.3523, lng: 175.6082 },
  Northland:            { name: "Whangarei CBD",    lat: -35.7246, lng: 174.3237 },
  Southland:            { name: "Invercargill CBD", lat: -46.4132, lng: 168.3538 },
  Taranaki:             { name: "New Plymouth CBD", lat: -39.0556, lng: 174.0752 },
  Marlborough:          { name: "Blenheim CBD",     lat: -41.5134, lng: 173.9612 },
  "Hawke's Bay":        { name: "Napier CBD",       lat: -39.4928, lng: 176.9120 },
  Gisborne:             { name: "Gisborne CBD",     lat: -38.6621, lng: 178.0176 },
  Nelson:               { name: "Nelson CBD",       lat: -41.2706, lng: 173.2840 },
  Tasman:               { name: "Richmond CBD",     lat: -41.3382, lng: 173.1740 },
  "West Coast":         { name: "Greymouth CBD",    lat: -42.4503, lng: 171.2088 },
};

// ─── Timezone Data ────────────────────────────────────────────────────────────

interface TzInfo {
  name: string; offset: string;
  dstName: string; dstOffset: string;
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

// ─── Shipping Data ────────────────────────────────────────────────────────────

interface ShipRoute { from: string; days: string; icon: "zap" | "truck" | "globe" }

const AU_SHIPPING: Record<string, ShipRoute[]> = {
  NSW: [
    { from: "Sydney Hub",      days: "Same day – 1 business day", icon: "zap"   },
    { from: "Melbourne DC",    days: "2–3 business days",         icon: "truck" },
    { from: "Brisbane Hub",    days: "3–4 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  VIC: [
    { from: "Melbourne Hub",   days: "Same day – 1 business day", icon: "zap"   },
    { from: "Sydney DC",       days: "2–3 business days",         icon: "truck" },
    { from: "Brisbane Hub",    days: "3–4 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  QLD: [
    { from: "Brisbane Hub",    days: "Same day – 1 business day", icon: "zap"   },
    { from: "Sydney DC",       days: "2–3 business days",         icon: "truck" },
    { from: "Melbourne Hub",   days: "3–4 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  SA: [
    { from: "Adelaide Hub",    days: "Same day – 1 business day", icon: "zap"   },
    { from: "Melbourne DC",    days: "2–3 business days",         icon: "truck" },
    { from: "Sydney Hub",      days: "3–4 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  WA: [
    { from: "Perth Hub",       days: "Same day – 1 business day", icon: "zap"   },
    { from: "Melbourne DC",    days: "4–5 business days",         icon: "truck" },
    { from: "Sydney Hub",      days: "5–7 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  TAS: [
    { from: "Hobart Hub",      days: "Same day – 1 business day", icon: "zap"   },
    { from: "Melbourne DC",    days: "2–3 business days",         icon: "truck" },
    { from: "Sydney Hub",      days: "3–5 business days",         icon: "truck" },
    { from: "International",   days: "10–18 business days",       icon: "globe" },
  ],
  NT: [
    { from: "Darwin Hub",      days: "Same day – 1 business day", icon: "zap"   },
    { from: "Brisbane DC",     days: "4–5 business days",         icon: "truck" },
    { from: "Melbourne Hub",   days: "5–7 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
  ACT: [
    { from: "Canberra Hub",    days: "Same day – 1 business day", icon: "zap"   },
    { from: "Sydney DC",       days: "1–2 business days",         icon: "truck" },
    { from: "Melbourne Hub",   days: "2–3 business days",         icon: "truck" },
    { from: "International",   days: "7–14 business days",        icon: "globe" },
  ],
};

const NZ_SHIPPING: Record<string, ShipRoute[]> = {
  Auckland: [
    { from: "Auckland DC",       days: "Same day – 1 business day", icon: "zap"   },
    { from: "Wellington Hub",    days: "1–2 business days",         icon: "truck" },
    { from: "Christchurch DC",   days: "2–3 business days",         icon: "truck" },
    { from: "International",     days: "7–14 business days",        icon: "globe" },
  ],
  Wellington: [
    { from: "Wellington Hub",    days: "Same day – 1 business day", icon: "zap"   },
    { from: "Auckland DC",       days: "1–2 business days",         icon: "truck" },
    { from: "Christchurch DC",   days: "2–3 business days",         icon: "truck" },
    { from: "International",     days: "7–14 business days",        icon: "globe" },
  ],
  Canterbury: [
    { from: "Christchurch Hub",  days: "Same day – 1 business day", icon: "zap"   },
    { from: "Wellington DC",     days: "2–3 business days",         icon: "truck" },
    { from: "Auckland Hub",      days: "3–4 business days",         icon: "truck" },
    { from: "International",     days: "7–14 business days",        icon: "globe" },
  ],
};

const NZ_SHIPPING_DEFAULT: ShipRoute[] = [
  { from: "Auckland DC",       days: "1–3 business days",  icon: "truck" },
  { from: "Wellington Hub",    days: "1–3 business days",  icon: "truck" },
  { from: "Christchurch DC",   days: "2–4 business days",  icon: "truck" },
  { from: "International",     days: "7–14 business days", icon: "globe" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDSTActive(country: "au" | "nz"): boolean {
  const m = new Date().getMonth() + 1;
  if (country === "au") return m >= 10 || m <= 3;
  return m >= 9 || m <= 4;
}

function getAreaType(distKm: number): { label: string; bg: string; text: string } {
  if (distKm < 5)   return { label: "CBD / Inner City",   bg: "bg-purple-100", text: "text-purple-700" };
  if (distKm < 20)  return { label: "Metro Urban",        bg: "bg-blue-100",   text: "text-blue-700"   };
  if (distKm < 50)  return { label: "Outer Suburban",     bg: "bg-teal-100",   text: "text-teal-700"   };
  if (distKm < 150) return { label: "Regional",           bg: "bg-orange-100", text: "text-orange-700" };
  return                   { label: "Rural / Remote",      bg: "bg-stone-100",  text: "text-stone-600"  };
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NearbySuburb {
  name: string;
  slug: string;
  postcode: string;
  distanceKm: number;
}

interface Props {
  postcode: string;
  primary: string;
  state: string;
  country: "au" | "nz";
  lat?: number;
  lng?: number;
  nearbySuburbs?: NearbySuburb[];
  lga?: string;
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#6B7280] text-[10px] font-semibold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
      {children}
    </p>
  );
}

// ─── ShipIcon ────────────────────────────────────────────────────────────────

function ShipIcon({ type }: { type: ShipRoute["icon"] }) {
  if (type === "zap")   return <Zap   className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
  if (type === "globe") return <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />;
  return                       <Truck className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LocationCard({
  postcode,
  primary,
  state,
  country,
  lat,
  lng,
  nearbySuburbs = [],
  lga,
}: Props) {
  const [copiedField, setCopiedField] = useState<"full" | "suburb" | "postcode" | null>(null);
  const [dstActive, setDstActive]     = useState(false);

  useEffect(() => {
    setDstActive(isDSTActive(country));
  }, [country]);

  const countryLabel = country === "au" ? "Australia" : "New Zealand";
  const accent       = country === "au" ? "#E8472A"   : "#2D6A4F";

  // ── Copy helpers ────────────────────────────────────────────────────────────
  const copyFull     = `${primary}, ${state} ${postcode}, ${countryLabel}`;
  const copySuburb   = primary;
  const copyPostcode = postcode;

  function handleCopy(field: "full" | "suburb" | "postcode") {
    const text = field === "full" ? copyFull : field === "suburb" ? copySuburb : copyPostcode;
    copyText(text).then((ok) => {
      if (!ok) return;
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  }

  // ── Map URLs ────────────────────────────────────────────────────────────────
  const q             = encodeURIComponent(`${primary} ${state} ${postcode} ${countryLabel}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const appleMapsUrl  = `https://maps.apple.com/?q=${q}`;

  // ── Capital distance ────────────────────────────────────────────────────────
  let capitalDistance: number | null = null;
  let capitalName = "";

  if (lat && lng) {
    const centre = country === "au"
      ? AU_CAPITALS[state]
      : (NZ_CENTRES[state] ?? NZ_CENTRES["Wellington"]);
    if (centre) {
      capitalName     = centre.name;
      capitalDistance = haversineDistance(lat, lng, centre.lat, centre.lng);
    }
  }

  // ── Timezone ────────────────────────────────────────────────────────────────
  const tz            = country === "au" ? (AU_TIMEZONES[state] ?? AU_TIMEZONES.NSW) : NZ_TIMEZONE;
  const activeTzName  = dstActive && tz.hasDST ? tz.dstName   : tz.name;
  const activeTzOffset= dstActive && tz.hasDST ? tz.dstOffset : tz.offset;

  // ── Shipping ────────────────────────────────────────────────────────────────
  const shipping: ShipRoute[] = country === "au"
    ? (AU_SHIPPING[state] ?? [])
    : (NZ_SHIPPING[state] ?? NZ_SHIPPING_DEFAULT);

  // ── Area type ───────────────────────────────────────────────────────────────
  const areaType = capitalDistance !== null ? getAreaType(capitalDistance) : null;

  // ── Suburb link base ────────────────────────────────────────────────────────
  const suburbBase = country === "au" ? "/au/suburb" : "/nz/locality";
  const postcodeBase = country === "au" ? "/au/postcode" : "/nz/postcode";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E6ED] overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#112d5e] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
              Location Hub
            </p>
            <p className="text-white font-bold text-base leading-tight">{primary}</p>
            <p className="text-white/60 text-xs mt-0.5">{state} {postcode} · {countryLabel}</p>
          </div>
          <span
            className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg mt-0.5"
            style={{ background: `${accent}30`, color: accent }}
          >
            {country === "au" ? "🇦🇺 AU" : "🇳🇿 NZ"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* ── 1. Copy Address Matrix ── */}
        <div>
          <SectionLabel>Copy Address</SectionLabel>
          <div className="space-y-2">
            {/* Full address */}
            <button
              onClick={() => handleCopy("full")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                copiedField === "full"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-[#F4F6F9] border-[#E2E6ED] text-[#1A1A2E] hover:border-[#0B2545] hover:bg-white"
              }`}
            >
              {copiedField === "full"
                ? <Check className="w-3.5 h-3.5 flex-shrink-0" />
                : <Copy  className="w-3.5 h-3.5 flex-shrink-0 text-[#6B7280]" />}
              <span className="flex-1 text-left truncate">
                {copiedField === "full" ? "Copied!" : copyFull}
              </span>
            </button>

            {/* Suburb + postcode side by side */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCopy("suburb")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  copiedField === "suburb"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-[#F4F6F9] border-[#E2E6ED] text-[#1A1A2E] hover:border-[#0B2545] hover:bg-white"
                }`}
              >
                {copiedField === "suburb"
                  ? <Check className="w-3 h-3 flex-shrink-0" />
                  : <Copy  className="w-3 h-3 flex-shrink-0 text-[#6B7280]" />}
                {copiedField === "suburb" ? "Copied!" : `Suburb`}
              </button>

              <button
                onClick={() => handleCopy("postcode")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  copiedField === "postcode"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-[#F4F6F9] border-[#E2E6ED] text-[#1A1A2E] hover:border-[#0B2545] hover:bg-white"
                }`}
              >
                {copiedField === "postcode"
                  ? <Check className="w-3 h-3 flex-shrink-0" />
                  : <Copy  className="w-3 h-3 flex-shrink-0 text-[#6B7280]" />}
                {copiedField === "postcode" ? "Copied!" : `Postcode`}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E6ED]" />

        {/* ── 2. Map Navigation ── */}
        <div>
          <SectionLabel>Open in Maps</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-xs font-medium text-[#1A1A2E] hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-blue-50 transition-all duration-200"
            >
              <MapPin       className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80 flex-shrink-0" />
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl text-xs font-medium text-[#1A1A2E] hover:border-[#147EFB] hover:text-[#147EFB] hover:bg-blue-50 transition-all duration-200"
            >
              <MapPin       className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Apple Maps</span>
              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#E2E6ED]" />

        {/* ── 3. Local Profile ── */}
        <div>
          <SectionLabel>Local Profile</SectionLabel>
          <div className="space-y-2">

            {/* Timezone row */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#F4F6F9]">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Clock className="w-3.5 h-3.5" />
                <span>Time Zone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white bg-violet-500 px-1.5 py-0.5 rounded-md">
                  {activeTzName}
                </span>
                <span className="text-[11px] text-violet-500 font-medium">{activeTzOffset}</span>
                {tz.hasDST && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                    dstActive
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}>
                    <Sun className="w-2.5 h-2.5" />
                    {dstActive ? "DST" : "STD"}
                  </span>
                )}
              </div>
            </div>

            {/* Area type */}
            {areaType && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#F4F6F9]">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Area Type</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${areaType.bg} ${areaType.text}`}>
                  {areaType.label}
                </span>
              </div>
            )}

            {/* Distance to capital */}
            {capitalDistance !== null && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#F4F6F9]">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="truncate max-w-28">{capitalName}</span>
                </div>
                <span className="text-xs font-bold text-[#1A1A2E]">
                  ~{capitalDistance < 1
                    ? `${Math.round(capitalDistance * 1000)} m`
                    : `${capitalDistance.toFixed(1)} km`}
                </span>
              </div>
            )}

            {/* Coordinates */}
            {lat && lng && (
              <div className="flex items-center justify-between py-1.5 border-b border-[#F4F6F9]">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Coordinates</span>
                </div>
                <span className="text-[11px] font-mono text-[#1A1A2E]">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>
            )}

            {/* LGA / Council */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Building2 className="w-3.5 h-3.5" />
                <span>LGA / Council</span>
              </div>
              <span className="text-xs text-[#1A1A2E] font-medium text-right max-w-32 truncate">
                {lga ?? "See council website"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E6ED]" />

        {/* ── 4. Shipping & Logistics Guide ── */}
        {shipping.length > 0 && (
          <div>
            <SectionLabel>
              <Package className="w-3 h-3" />
              Shipping Guide
            </SectionLabel>
            <div className="rounded-xl border border-[#E2E6ED] overflow-hidden">
              {shipping.map((row, i) => (
                <div
                  key={row.from}
                  className={`flex items-center gap-2.5 px-3 py-2.5 ${
                    i < shipping.length - 1 ? "border-b border-[#F4F6F9]" : ""
                  } ${i % 2 === 0 ? "bg-white" : "bg-[#FAFBFC]"}`}
                >
                  <ShipIcon type={row.icon} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1A1A2E] truncate">{row.from}</p>
                  </div>
                  <p className="text-[11px] text-[#6B7280] text-right flex-shrink-0 whitespace-nowrap">
                    {row.days}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-[10px] mt-1.5">
              Estimates only · varies by carrier &amp; service level
            </p>
          </div>
        )}

        {/* ── 5. Surrounding Suburbs ── */}
        {nearbySuburbs.length > 0 && (
          <>
            <div className="border-t border-[#E2E6ED]" />
            <div>
              <SectionLabel>Surrounding Suburbs</SectionLabel>
              <div className="grid grid-cols-2 gap-1.5">
                {nearbySuburbs.slice(0, 6).map((s) => (
                  <Link
                    key={s.slug}
                    href={`${suburbBase}/${s.slug}`}
                    className="group flex items-center justify-between gap-1 px-2.5 py-2 bg-[#F4F6F9] border border-[#E2E6ED] rounded-lg hover:border-current transition-all duration-200 text-[#1A1A2E]"
                    style={{ ["--tw-border-opacity" as string]: "1" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.color = ""; }}
                  >
                    <span className="text-xs font-medium truncate">{s.name}</span>
                    <span className="text-[10px] text-[#9CA3AF] flex-shrink-0 group-hover:text-inherit">
                      {s.distanceKm < 1
                        ? `${Math.round(s.distanceKm * 1000)} m`
                        : `${s.distanceKm.toFixed(1)} km`}
                    </span>
                  </Link>
                ))}
              </div>
              {nearbySuburbs.length > 6 && (
                <Link
                  href={`${postcodeBase}/${postcode}`}
                  className="mt-2 flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: accent }}
                >
                  View all nearby <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
