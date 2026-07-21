"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, MapPin, Ruler } from "lucide-react";
import { titleCase, stateLabel, haversineDistance } from "@/lib/utils";
import type { PostcodeGroup } from "@/types";

function PostcodeInput({
  label,
  value,
  onChange,
  result,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  result: PostcodeGroup | null | undefined;
  color: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="e.g. 2000"
        maxLength={4}
        className="w-full border border-[#E2E6ED] rounded-xl px-4 py-3 text-xl font-bold font-[family-name:var(--font-sora)] focus:outline-none focus:ring-2 focus:ring-[#E8472A]/20 focus:border-[#E8472A] transition-colors tracking-widest"
        style={{ color }}
      />
      {result === undefined && value.length === 4 && (
        <p className="text-red-500 text-xs mt-1">Postcode not found</p>
      )}
    </div>
  );
}

function DetailCard({ pg, color, href }: { pg: PostcodeGroup; color: string; href: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-[family-name:var(--font-sora)] text-3xl font-bold" style={{ color }}>
          {pg.postcode}
        </div>
        <Link
          href={href}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
          style={{ color, borderColor: color }}
        >
          View full page ↗
        </Link>
      </div>
      <dl className="space-y-3">
        {[
          { label: "Primary suburb", value: titleCase(pg.localities[0] ?? "") },
          { label: "All suburbs", value: pg.localities.map(titleCase).join(", ") },
          { label: "State", value: stateLabel(pg.state) },
          { label: "Country", value: "Australia 🇦🇺" },
          ...(pg.lat ? [
            { label: "Latitude", value: pg.lat.toFixed(5) },
            { label: "Longitude", value: pg.lng.toFixed(5) },
          ] : []),
        ].map((row) => (
          <div key={row.label} className="flex justify-between gap-2 text-sm border-b border-[#F4F6F9] pb-2 last:border-0 last:pb-0">
            <dt className="text-[#6B7280] shrink-0">{row.label}</dt>
            <dd className="font-medium text-[#1A1A2E] text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function CompareClient() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [pgA, setPgA] = useState<PostcodeGroup | null | undefined>(null);
  const [pgB, setPgB] = useState<PostcodeGroup | null | undefined>(null);

  const lookup = async (postcode: string, setter: (v: PostcodeGroup | null | undefined) => void) => {
    if (postcode.length !== 4) { setter(null); return; }
    const { getAUPostcodeGroups } = await import("@/lib/data");
    const pg = getAUPostcodeGroups().get(postcode);
    setter(pg ?? undefined);
  };

  const handleA = (v: string) => { setA(v); lookup(v, setPgA); };
  const handleB = (v: string) => { setB(v); lookup(v, setPgB); };

  const distance =
    pgA && pgB && pgA.lat && pgB.lat
      ? Math.round(haversineDistance(pgA.lat, pgA.lng, pgB.lat, pgB.lng))
      : null;

  const sameState = pgA && pgB && pgA.state === pgB.state;

  return (
    <div className="space-y-8">
      {/* Input row */}
      <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
        <div className="flex items-end gap-4">
          <PostcodeInput label="Postcode A" value={a} onChange={handleA} result={pgA} color="#E8472A" />
          <div className="pb-3">
            <ArrowLeftRight className="w-5 h-5 text-[#6B7280]" />
          </div>
          <PostcodeInput label="Postcode B" value={b} onChange={handleB} result={pgB} color="#0B2545" />
        </div>
      </div>

      {/* Distance banner */}
      {pgA && pgB && (
        <div className="bg-gradient-to-r from-[#0B2545] to-[#112d5e] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-[#E8472A]" />
            <div>
              <p className="text-white/70 text-sm">Straight-line distance</p>
              <p className="font-[family-name:var(--font-sora)] text-3xl font-bold">
                {distance !== null ? `~${distance.toLocaleString()} km` : "No coordinates"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#E8472A]" />
            <div className="text-right">
              <p className="text-white/70 text-sm">Same state?</p>
              <p className="font-semibold text-lg">{sameState ? `Yes — ${stateLabel(pgA.state)}` : "No"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side cards */}
      {(pgA || pgB) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pgA ? (
            <DetailCard pg={pgA} color="#E8472A" href={`/au/postcode/${pgA.postcode}`} />
          ) : (
            <div className="bg-[#F4F6F9] rounded-2xl border-2 border-dashed border-[#E2E6ED] p-6 flex items-center justify-center text-[#6B7280] text-sm">
              Enter postcode A
            </div>
          )}
          {pgB ? (
            <DetailCard pg={pgB} color="#0B2545" href={`/au/postcode/${pgB.postcode}`} />
          ) : (
            <div className="bg-[#F4F6F9] rounded-2xl border-2 border-dashed border-[#E2E6ED] p-6 flex items-center justify-center text-[#6B7280] text-sm">
              Enter postcode B
            </div>
          )}
        </div>
      )}

      {!pgA && !pgB && (
        <div className="text-center py-16 text-[#6B7280]">
          <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Enter two postcodes above to compare them</p>
          <p className="text-sm mt-1">Try <button onClick={() => { handleA("2000"); handleB("3000"); }} className="text-[#E8472A] underline">2000 vs 3000</button></p>
        </div>
      )}
    </div>
  );
}
