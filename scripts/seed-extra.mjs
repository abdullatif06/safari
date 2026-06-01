/**
 * Seeds the ADDITIONAL showcase events (scripts/seed-events-extra.json) into
 * Supabase as approved events with Unsplash image URLs.
 *
 * Run with:  node scripts/seed-extra.mjs
 *
 * - Upserts by `id`, safe to re-run.
 * - Uses the service-role key (bypasses RLS) — never shipped to the browser.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#")) env[m[1]] = m[2].trim();
    }
  } catch {
    /* ignore */
  }
  return env;
}

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("✖ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const EVENTS = JSON.parse(readFileSync(join(__dirname, "seed-events-extra.json"), "utf-8"));

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const rows = EVENTS.map((e) => ({
  id: e.id,
  owner_id: null,
  status: "approved",
  title: e.title,
  title_ar: e.titleAr,
  category: e.category,
  cost: e.cost,
  price: e.price ?? null,
  description: e.description,
  description_ar: e.descriptionAr,
  city: e.city,
  city_ar: e.cityAr,
  venue: e.venue,
  venue_ar: e.venueAr,
  event_date: e.date,
  event_time: e.time,
  lat: e.lat,
  lng: e.lng,
  organizer: e.organizer,
  external_ticket_url: null,
  image_url: e.imageUrl ?? null,
  cover: e.cover,
  wheelchair: e.accessibility.wheelchair,
  family_friendly: e.accessibility.familyFriendly,
  sign_language: e.accessibility.signLanguage,
}));

const { error } = await supabase.from("events").upsert(rows, { onConflict: "id" });

if (error) {
  console.error("✖ Seed failed:", error.message);
  process.exit(1);
}

console.log(`✓ Seeded ${rows.length} extra events into Supabase (approved).`);
