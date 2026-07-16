"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchBox from "@/components/ui/SearchBox";
import type { StateGroup, PostcodeGroup } from "@/types";
import { stateLabel, titleCase } from "@/lib/utils";

const AU_STATE_FLAGS: Record<string, string> = {
  NSW: "🏙️", VIC: "🏙️", QLD: "☀️", SA: "🌾", WA: "🏜️", TAS: "🌿", NT: "🌵", ACT: "🏛️",
};

const NZ_REGION_FLAGS: Record<string, string> = {
  "Auckland": "🏙️",
  "Wellington": "🏛️",
  "Canterbury": "⛰️",
  "Waikato": "🌿",
  "Bay of Plenty": "🌊",
  "Otago": "🏔️",
  "Southland": "❄️",
  "Manawatu-Whanganui": "🌾",
  "Hawke's Bay": "🍇",
  "Taranaki": "🌋",
  "Nelson": "☀️",
  "Tasman": "🌊",
  "Marlborough": "🍷",
  "Northland": "🌴",
  "Gisborne": "🌅",
  "West Coast": "🌧️",
};

interface Props {
  auStates: StateGroup[];
  nzRegions: StateGroup[];
  popularAU: PostcodeGroup[];
  popularNZ: PostcodeGroup[];
  auPostcodeCount: number;
  nzPostcodeCount: number;
  auSuburbCount: number;
}

export default function HomeContent({
  auStates,
  nzRegions,
  popularAU,
  popularNZ,
  auPostcodeCount,
  nzPostcodeCount,
  auSuburbCount,
}: Props) {
  const [country, setCountry] = useState<"au" | "nz">("au");
  const isAU = country === "au";

  const auHints = ["2000", "Sydney", "Melbourne", "Brisbane", "3000", "Perth"];
  const nzHints = ["1010", "Auckland", "Wellington", "9016", "Christchurch", "Dunedin"];
  const hints = isAU ? auHints : nzHints;

  const auStats = [
    { label: "AU Postcodes", value: auPostcodeCount.toLocaleString() },
    { label: "AU Suburbs", value: auSuburbCount.toLocaleString() },
    { label: "States & Territories", value: auStates.length.toString() },
    { label: "Free & Open", value: "100%" },
  ];
  const nzStats = [
    { label: "NZ Postcodes", value: nzPostcodeCount.toLocaleString() },
    { label: "NZ Localities", value: nzPostcodeCount.toLocaleString() },
    { label: "Regions", value: nzRegions.length.toString() },
    { label: "Free & Open", value: "100%" },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0B2545] via-[#112d5e] to-[#0B2545] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
            style={{ background: isAU ? "#E8472A" : "#2D6A4F" }}
          />
          <div
            className="absolute bottom-10 left-20 w-48 h-48 rounded-full blur-3xl transition-colors duration-700"
            style={{ background: isAU ? "#2D6A4F" : "#E8472A" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          {/* Country switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
              <button
                onClick={() => setCountry("au")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isAU ? "bg-[#E8472A] text-white shadow-lg" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🇦🇺 Australia
              </button>
              <button
                onClick={() => setCountry("nz")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  !isAU ? "bg-[#2D6A4F] text-white shadow-lg" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🇳🇿 New Zealand
              </button>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-5xl font-bold text-center mb-4 leading-tight">
            {isAU ? "Australia" : "New Zealand"} &amp; Beyond
            <br />
            <span
              className="transition-colors duration-300"
              style={{ color: isAU ? "#E8472A" : "#2D6A4F" }}
            >
              Postcode Directory
            </span>
          </h1>

          <p className="text-white/70 text-center text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            {isAU
              ? `Search over ${auPostcodeCount.toLocaleString()} postcodes and ${auSuburbCount.toLocaleString()} suburbs across Australia`
              : `Search over ${nzPostcodeCount.toLocaleString()} postcodes and localities across New Zealand`}
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBox
              size="lg"
              placeholder={
                isAU
                  ? "Search Australian postcode or suburb…"
                  : "Search NZ postcode or locality…"
              }
            />
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {hints.map((hint) => (
                <Link
                  key={hint}
                  href={`/search?q=${encodeURIComponent(hint)}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-full transition-colors border border-white/20"
                >
                  {hint}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E2E6ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2E6ED]">
            {(isAU ? auStats : nzStats).map((stat) => (
              <div key={stat.label} className="py-5 px-4 sm:px-8 text-center">
                <div
                  className="font-[family-name:var(--font-sora)] font-bold text-2xl sm:text-3xl transition-colors duration-300"
                  style={{ color: isAU ? "#E8472A" : "#2D6A4F" }}
                >
                  {stat.value}
                </div>
                <div className="text-[#6B7280] text-xs sm:text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse section ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">
              {isAU ? "Browse by State" : "Browse by Region"}
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">
              {isAU ? "Explore postcodes across Australia" : "Explore localities across New Zealand"}
            </p>
          </div>
          <Link
            href={isAU ? "/au" : "/nz"}
            className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color: isAU ? "#E8472A" : "#2D6A4F" }}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isAU
            ? auStates.map((state) => (
                <Link
                  key={state.state}
                  href={`/au/state/${state.slug}`}
                  className="group bg-white rounded-xl border border-[#E2E6ED] p-5 hover:border-[#E8472A] hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-2">{AU_STATE_FLAGS[state.state] ?? "📍"}</div>
                  <div className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] group-hover:text-[#E8472A] transition-colors">
                    {state.state}
                  </div>
                  <div className="text-[#6B7280] text-xs mt-0.5">{stateLabel(state.state)}</div>
                  <div className="text-[#E8472A] text-xs mt-2 font-medium">
                    {state.postcodes.length.toLocaleString()} postcodes
                  </div>
                </Link>
              ))
            : nzRegions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/nz/region/${region.slug}`}
                  className="group bg-white rounded-xl border border-[#E2E6ED] p-5 hover:border-[#2D6A4F] hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-2">{NZ_REGION_FLAGS[region.state] ?? "🇳🇿"}</div>
                  <div className="font-[family-name:var(--font-sora)] font-bold text-[#0B2545] group-hover:text-[#2D6A4F] transition-colors text-sm">
                    {region.state}
                  </div>
                  <div className="text-[#6B7280] text-xs mt-0.5">{region.postcodes.length} postcodes</div>
                </Link>
              ))}
        </div>
      </section>

      {/* ── Popular postcodes ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E2E6ED] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#0B2545]">
                {isAU ? "Popular AU Postcodes" : "Popular NZ Postcodes"}
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                {isAU ? "Most searched Australian postcodes" : "Most searched New Zealand postcodes"}
              </p>
            </div>
            <Link
              href={isAU ? "/au/postcodes" : "/nz/postcodes"}
              className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: isAU ? "#E8472A" : "#2D6A4F" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(isAU ? popularAU : popularNZ).map((pg) => (
              <Link
                key={pg.postcode}
                href={isAU ? `/au/postcode/${pg.postcode}` : `/nz/postcode/${pg.postcode}`}
                className="group bg-[#F4F6F9] hover:bg-white border border-[#E2E6ED] rounded-xl p-4 transition-all hover:shadow-md"
                style={
                  isAU
                    ? ({ "--hover-border": "#E8472A" } as React.CSSProperties)
                    : ({ "--hover-border": "#2D6A4F" } as React.CSSProperties)
                }
              >
                <div
                  className="font-[family-name:var(--font-sora)] text-2xl font-bold"
                  style={{ color: isAU ? "#E8472A" : "#2D6A4F" }}
                >
                  {pg.postcode}
                </div>
                <div className="text-[#1A1A2E] font-medium text-sm mt-1 truncate">
                  {titleCase(pg.localities[0] ?? "")}
                </div>
                <div className="text-[#6B7280] text-xs">
                  {pg.state} · {isAU ? "Australia" : "NZ"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
