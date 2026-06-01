import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { GUIDE } from "@/lib/guide";
import { PLACES } from "@/lib/places";
import { getApprovedEvents } from "@/lib/events-db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/places`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/map`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/cities`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${SITE_URL}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDE.map((a) => ({
    url: `${SITE_URL}/guide/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const placeRoutes: MetadataRoute.Sitemap = PLACES.map((p) => ({
    url: `${SITE_URL}/places/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Events come from Supabase; tolerate failure so the sitemap never 500s.
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await getApprovedEvents();
    eventRoutes = events.map((e) => ({
      url: `${SITE_URL}/events/${e.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    eventRoutes = [];
  }

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...guideRoutes,
    ...placeRoutes,
    ...eventRoutes,
  ];
}
