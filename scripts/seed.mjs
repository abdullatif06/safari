/**
 * Seeds the Supabase `events` table with Saifi's original sample events.
 *
 * Run with:  npm run seed
 *
 * - Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local
 * - Uses the service-role key (bypasses RLS) — server-side only, never shipped.
 * - Upserts by `id`, so it's safe to re-run.
 * - All seeded events are inserted as status = 'approved' so the live site
 *   looks identical to before.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// --- Load .env.local manually (no dotenv dependency) -----------------------
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
  console.error(
    "✖ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

// --- The original sample events (mirrors src/lib/events.ts) ----------------
// Kept inline so the script has zero TypeScript/import dependencies.
const EVENTS = JSON.parse(
  readFileSync(join(__dirname, "seed-events.json"), "utf-8"),
);

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false },
});

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
  image_url: null,
  cover: e.cover,
  wheelchair: e.accessibility.wheelchair,
  family_friendly: e.accessibility.familyFriendly,
  sign_language: e.accessibility.signLanguage,
}));

const { error, count } = await supabase
  .from("events")
  .upsert(rows, { onConflict: "id", count: "exact" });

if (error) {
  console.error("✖ Seed failed:", error.message);
  process.exit(1);
}

console.log(`✓ Seeded ${rows.length} events into Supabase (approved).`);
