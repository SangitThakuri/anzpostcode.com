import auRaw from "@/data/australian_postcodes.json";
import nzRaw from "@/data/newzealand_postcodes.json";
import { AUPostcode, NZPostcode, PostcodeGroup, LocalityGroup, StateGroup } from "@/types";
import { slugify, haversineDistance } from "./utils";

const auData: AUPostcode[] = (auRaw as any[]).map((r) => ({
  id: r.id,
  postcode: String(r.postcode).padStart(4, "0"),
  locality: r.locality as string,
  state: r.state as string,
  lat: Number(r.lat) || 0,
  lng: Number(r.long ?? r.lng) || 0,
  type: r.type ?? "",
  status: r.status ?? "",
})).filter((r) => r.state && r.locality);

const nzData: NZPostcode[] = (nzRaw as any[]).map((r) => ({
  id: r.id,
  postcode: String(r.postcode),
  locality: r.locality as string,
  region: r.region as string,
  lat: Number(r.lat) || 0,
  lng: Number(r.lng) || 0,
  type: r.type ?? "General",
  status: r.status ?? "Active",
})).filter((r) => r.region && r.locality);

// ─── AU ──────────────────────────────────────────────────────────────────────

export function getAUData(): AUPostcode[] {
  return auData;
}

export function getAUPostcodeGroups(): Map<string, PostcodeGroup> {
  const map = new Map<string, PostcodeGroup>();
  for (const r of auData) {
    if (!map.has(r.postcode)) {
      map.set(r.postcode, {
        postcode: r.postcode,
        localities: [],
        state: r.state,
        country: "au",
        lat: r.lat,
        lng: r.lng,
      });
    }
    const g = map.get(r.postcode)!;
    if (!g.localities.includes(r.locality)) g.localities.push(r.locality);
  }
  return map;
}

export function getAULocalityGroups(): Map<string, LocalityGroup> {
  const map = new Map<string, LocalityGroup>();
  for (const r of auData) {
    const slug = slugify(`${r.locality}-${r.state}`);
    if (!map.has(slug)) {
      map.set(slug, {
        locality: r.locality,
        slug,
        postcodes: [],
        state: r.state,
        country: "au",
        lat: r.lat,
        lng: r.lng,
      });
    }
    const g = map.get(slug)!;
    if (!g.postcodes.includes(r.postcode)) g.postcodes.push(r.postcode);
  }
  return map;
}

export function getAUStateGroups(): StateGroup[] {
  const map = new Map<string, StateGroup>();
  for (const r of auData) {
    if (!map.has(r.state)) {
      map.set(r.state, {
        state: r.state,
        slug: r.state.toLowerCase(),
        country: "au",
        postcodes: [],
        localityCount: 0,
      });
    }
    const g = map.get(r.state)!;
    if (!g.postcodes.includes(r.postcode)) g.postcodes.push(r.postcode);
    g.localityCount++;
  }
  return Array.from(map.values()).sort((a, b) => a.state.localeCompare(b.state));
}

export function getAUPostcode(postcode: string): PostcodeGroup | null {
  return getAUPostcodeGroups().get(postcode) ?? null;
}

export function getAULocality(slug: string): LocalityGroup | null {
  return getAULocalityGroups().get(slug) ?? null;
}

export function getNearbyAUPostcodes(
  lat: number,
  lng: number,
  exclude: string,
  limit = 8
): PostcodeGroup[] {
  const groups = Array.from(getAUPostcodeGroups().values());
  return groups
    .filter((g) => g.postcode !== exclude && g.lat !== 0)
    .map((g) => ({ ...g, dist: haversineDistance(lat, lng, g.lat, g.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit);
}

export function getNearbyAULocalities(
  lat: number,
  lng: number,
  excludeSlug: string,
  limit = 8
): LocalityGroup[] {
  const groups = Array.from(getAULocalityGroups().values());
  return groups
    .filter((g) => g.slug !== excludeSlug && g.lat !== 0)
    .map((g) => ({ ...g, dist: haversineDistance(lat, lng, g.lat, g.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit);
}

// ─── NZ ──────────────────────────────────────────────────────────────────────

export function getNZData(): NZPostcode[] {
  return nzData;
}

export function getNZPostcodeGroups(): Map<string, PostcodeGroup> {
  const map = new Map<string, PostcodeGroup>();
  for (const r of nzData) {
    if (!map.has(r.postcode)) {
      map.set(r.postcode, {
        postcode: r.postcode,
        localities: [],
        state: r.region,
        country: "nz",
        lat: r.lat,
        lng: r.lng,
      });
    }
    const g = map.get(r.postcode)!;
    if (!g.localities.includes(r.locality)) g.localities.push(r.locality);
  }
  return map;
}

export function getNZLocalityGroups(): Map<string, LocalityGroup> {
  const map = new Map<string, LocalityGroup>();
  for (const r of nzData) {
    const slug = slugify(`${r.locality}-${r.region}`);
    if (!map.has(slug)) {
      map.set(slug, {
        locality: r.locality,
        slug,
        postcodes: [],
        state: r.region,
        country: "nz",
        lat: r.lat,
        lng: r.lng,
      });
    }
    const g = map.get(slug)!;
    if (!g.postcodes.includes(r.postcode)) g.postcodes.push(r.postcode);
  }
  return map;
}

export function getNZRegionGroups(): StateGroup[] {
  const map = new Map<string, StateGroup>();
  for (const r of nzData) {
    if (!map.has(r.region)) {
      map.set(r.region, {
        state: r.region,
        slug: slugify(r.region),
        country: "nz",
        postcodes: [],
        localityCount: 0,
      });
    }
    const g = map.get(r.region)!;
    if (!g.postcodes.includes(r.postcode)) g.postcodes.push(r.postcode);
    g.localityCount++;
  }
  return Array.from(map.values()).sort((a, b) => a.state.localeCompare(b.state));
}

export function getNZPostcode(postcode: string): PostcodeGroup | null {
  return getNZPostcodeGroups().get(postcode) ?? null;
}

export function getNZLocality(slug: string): LocalityGroup | null {
  return getNZLocalityGroups().get(slug) ?? null;
}

export function getNearbyNZPostcodes(
  lat: number,
  lng: number,
  exclude: string,
  limit = 8
): PostcodeGroup[] {
  const groups = Array.from(getNZPostcodeGroups().values());
  return groups
    .filter((g) => g.postcode !== exclude && g.lat !== 0)
    .map((g) => ({ ...g, dist: haversineDistance(lat, lng, g.lat, g.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit);
}

export function getNearbyNZLocalities(
  lat: number,
  lng: number,
  excludeSlug: string,
  limit = 8
): LocalityGroup[] {
  const groups = Array.from(getNZLocalityGroups().values());
  return groups
    .filter((g) => g.slug !== excludeSlug && g.lat !== 0)
    .map((g) => ({ ...g, dist: haversineDistance(lat, lng, g.lat, g.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit);
}

// ─── Search index ─────────────────────────────────────────────────────────────

export interface SearchItem {
  postcode: string;
  locality: string;
  state: string;
  country: "au" | "nz";
  slug: string;
}

let _searchIndex: SearchItem[] | null = null;

export function getSearchIndex(): SearchItem[] {
  if (_searchIndex) return _searchIndex;
  const items: SearchItem[] = [];
  for (const r of auData) {
    items.push({
      postcode: r.postcode,
      locality: r.locality,
      state: r.state,
      country: "au",
      slug: slugify(`${r.locality}-${r.state}`),
    });
  }
  for (const r of nzData) {
    items.push({
      postcode: r.postcode,
      locality: r.locality,
      state: r.region,
      country: "nz",
      slug: slugify(`${r.locality}-${r.region}`),
    });
  }
  _searchIndex = items;
  return items;
}

// ─── Popular / featured ───────────────────────────────────────────────────────

const POPULAR_AU = [
  "2000", "3000", "4000", "5000", "6000", "7000", "2600", "0800",
];
const POPULAR_NZ = ["1010", "6011", "8011", "3200", "3110", "9010"];

export function getPopularAUPostcodes(): PostcodeGroup[] {
  const map = getAUPostcodeGroups();
  return POPULAR_AU.map((p) => map.get(p)).filter(Boolean) as PostcodeGroup[];
}

export function getPopularNZPostcodes(): PostcodeGroup[] {
  const map = getNZPostcodeGroups();
  return POPULAR_NZ.map((p) => map.get(p)).filter(Boolean) as PostcodeGroup[];
}
