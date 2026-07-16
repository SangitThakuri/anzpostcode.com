"use client";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-64 sm:h-80 rounded-xl bg-[#F4F6F9] border border-[#E2E6ED] flex items-center justify-center"
      aria-label="Map loading"
    >
      <span className="text-[#6B7280] text-sm">Loading map…</span>
    </div>
  ),
});

interface Props {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}

export default function MapWrapper(props: Props) {
  return (
    <figure aria-label={`Map of ${props.label}`}>
      <MapEmbed {...props} />
      <figcaption className="text-[#6B7280] text-xs mt-2">
        Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0B2545]">OpenStreetMap</a> contributors · {props.label}
      </figcaption>
    </figure>
  );
}
