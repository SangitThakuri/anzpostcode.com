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

// ─── Spatial grid ─────────────────────────────────────────────────────────────

const GRID_DEG = 1.0;

function gridKey(lat: number, lng: number): string {
  return `${Math.floor(lat / GRID_DEG)},${Math.floor(lng / GRID_DEG)}`;
}

function buildGrid<T extends { lat: number; lng: number }>(items: T[]): Map<string, T[]> {
  const grid = new Map<string, T[]>();
  for (const item of items) {
    if (item.lat === 0 && item.lng === 0) continue;
    const key = gridKey(item.lat, item.lng);
    const cell = grid.get(key);
    if (cell) cell.push(item);
    else grid.set(key, [item]);
  }
  return grid;
}

function nearestInGrid<T extends { lat: number; lng: number }>(
  grid: Map<string, T[]>,
  lat: number,
  lng: number,
  exclude: (item: T) => boolean,
  limit: number
): (T & { dist: number })[] {
  const cLat = Math.floor(lat / GRID_DEG);
  const cLng = Math.floor(lng / GRID_DEG);
  const candidates: (T & { dist: number })[] = [];

  for (let r = 0; r < 8; r++) {
    if (r > 0 && candidates.length >= limit * 3) break;
    for (let dl = -r; dl <= r; dl++) {
      for (let dn = -r; dn <= r; dn++) {
        if (r > 0 && Math.abs(dl) !== r && Math.abs(dn) !== r) continue;
        const cell = grid.get(`${cLat + dl},${cLng + dn}`);
        if (!cell) continue;
        for (const item of cell) {
          if (exclude(item)) continue;
          candidates.push({ ...item, dist: haversineDistance(lat, lng, item.lat, item.lng) });
        }
      }
    }
  }

  return candidates.sort((a, b) => a.dist - b.dist).slice(0, limit);
}

// ─── Memoized group maps ───────────────────────────────────────────────────────

let _auPostcodeGroups: Map<string, PostcodeGroup> | null = null;
let _auLocalityGroups: Map<string, LocalityGroup> | null = null;
let _nzPostcodeGroups: Map<string, PostcodeGroup> | null = null;
let _nzLocalityGroups: Map<string, LocalityGroup> | null = null;

// Memoized spatial grids
let _auPostcodeGrid: Map<string, PostcodeGroup[]> | null = null;
let _auLocalityGrid: Map<string, LocalityGroup[]> | null = null;
let _nzPostcodeGrid: Map<string, PostcodeGroup[]> | null = null;
let _nzLocalityGrid: Map<string, LocalityGroup[]> | null = null;

// ─── AU ──────────────────────────────────────────────────────────────────────

export function getAUData(): AUPostcode[] {
  return auData;
}

export function getAUPostcodeGroups(): Map<string, PostcodeGroup> {
  if (_auPostcodeGroups) return _auPostcodeGroups;
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
  _auPostcodeGroups = map;
  return map;
}

export function getAULocalityGroups(): Map<string, LocalityGroup> {
  if (_auLocalityGroups) return _auLocalityGroups;
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
  _auLocalityGroups = map;
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

function getAUPostcodeGrid(): Map<string, PostcodeGroup[]> {
  if (!_auPostcodeGrid) {
    _auPostcodeGrid = buildGrid(Array.from(getAUPostcodeGroups().values())) as Map<string, PostcodeGroup[]>;
  }
  return _auPostcodeGrid;
}

function getAULocalityGrid(): Map<string, LocalityGroup[]> {
  if (!_auLocalityGrid) {
    _auLocalityGrid = buildGrid(Array.from(getAULocalityGroups().values())) as Map<string, LocalityGroup[]>;
  }
  return _auLocalityGrid;
}

export function getNearbyAUPostcodes(
  lat: number,
  lng: number,
  exclude: string,
  limit = 8
): PostcodeGroup[] {
  if (!lat && !lng) return [];
  return nearestInGrid(getAUPostcodeGrid(), lat, lng, (g) => g.postcode === exclude, limit);
}

export function getNearbyAULocalities(
  lat: number,
  lng: number,
  excludeSlug: string,
  limit = 8
): LocalityGroup[] {
  if (!lat && !lng) return [];
  return nearestInGrid(getAULocalityGrid(), lat, lng, (g) => g.slug === excludeSlug, limit);
}

// ─── NZ ──────────────────────────────────────────────────────────────────────

export function getNZData(): NZPostcode[] {
  return nzData;
}

export function getNZPostcodeGroups(): Map<string, PostcodeGroup> {
  if (_nzPostcodeGroups) return _nzPostcodeGroups;
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
  _nzPostcodeGroups = map;
  return map;
}

export function getNZLocalityGroups(): Map<string, LocalityGroup> {
  if (_nzLocalityGroups) return _nzLocalityGroups;
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
  _nzLocalityGroups = map;
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

function getNZPostcodeGrid(): Map<string, PostcodeGroup[]> {
  if (!_nzPostcodeGrid) {
    _nzPostcodeGrid = buildGrid(Array.from(getNZPostcodeGroups().values())) as Map<string, PostcodeGroup[]>;
  }
  return _nzPostcodeGrid;
}

function getNZLocalityGrid(): Map<string, LocalityGroup[]> {
  if (!_nzLocalityGrid) {
    _nzLocalityGrid = buildGrid(Array.from(getNZLocalityGroups().values())) as Map<string, LocalityGroup[]>;
  }
  return _nzLocalityGrid;
}

export function getNearbyNZPostcodes(
  lat: number,
  lng: number,
  exclude: string,
  limit = 8
): PostcodeGroup[] {
  if (!lat && !lng) return [];
  return nearestInGrid(getNZPostcodeGrid(), lat, lng, (g) => g.postcode === exclude, limit);
}

export function getNearbyNZLocalities(
  lat: number,
  lng: number,
  excludeSlug: string,
  limit = 8
): LocalityGroup[] {
  if (!lat && !lng) return [];
  return nearestInGrid(getNZLocalityGrid(), lat, lng, (g) => g.slug === excludeSlug, limit);
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
