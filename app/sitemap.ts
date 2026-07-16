import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import {
  getAUPostcodeGroups,
  getAULocalityGroups,
  getAUStateGroups,
  getNZPostcodeGroups,
  getNZLocalityGroups,
  getNZRegionGroups,
} from "@/lib/data";

const BASE = "https://anzpostcode.com";

// Fixed data snapshot date — update when dataset is refreshed
const DATA_DATE = "2025-01-01T00:00:00.000Z";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = DATA_DATE;

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/au`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/nz`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/au/postcodes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/au/suburbs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/au/a-z`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/nz/postcodes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/nz/localities`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/nz/a-z`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/data-sources`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const au_states = getAUStateGroups().map((s) => ({
    url: `${BASE}/au/state/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const au_postcodes = Array.from(getAUPostcodeGroups().keys()).map((pc) => ({
    url: `${BASE}/au/postcode/${pc}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const au_suburbs = Array.from(getAULocalityGroups().keys()).map((slug) => ({
    url: `${BASE}/au/suburb/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const nz_regions = getNZRegionGroups().map((r) => ({
    url: `${BASE}/nz/region/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const nz_postcodes = Array.from(getNZPostcodeGroups().keys()).map((pc) => ({
    url: `${BASE}/nz/postcode/${pc}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const nz_localities = Array.from(getNZLocalityGroups().keys()).map((slug) => ({
    url: `${BASE}/nz/locality/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const au_ranges = ["0","1","2","3","4","5","6","7","8","9"].map((prefix) => ({
    url: `${BASE}/au/postcodes/range/${prefix}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blog_pages = [
    "/blog",
    "/blog/how-australian-postcodes-work",
    "/blog/major-city-postcodes-australia",
    "/blog/nz-postcode-guide",
    "/blog/postcode-vs-suburb",
    "/blog/find-your-postcode",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [
    ...static_pages,
    ...blog_pages,
    ...au_states,
    ...au_ranges,
    ...au_postcodes,
    ...au_suburbs,
    ...nz_regions,
    ...nz_postcodes,
    ...nz_localities,
  ];
}
