"use client";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

interface Props {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}

export default function MapWrapper(props: Props) {
  return <MapEmbed {...props} />;
}
