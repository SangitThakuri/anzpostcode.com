"use client";
import { useEffect } from "react";

export interface RecentItem {
  label: string;
  url: string;
  postcode: string;
  country: "au" | "nz";
}

const KEY = "anz_recents";
const MAX = 10;

export function saveToRecents(item: RecentItem): void {
  try {
    const stored = localStorage.getItem(KEY);
    const recents: RecentItem[] = stored ? JSON.parse(stored) : [];
    const filtered = recents.filter((r) => r.url !== item.url);
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)));
  } catch {}
}

export function getRecents(): RecentItem[] {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export default function SaveToRecents(props: RecentItem) {
  useEffect(() => {
    saveToRecents(props);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url]);
  return null;
}
