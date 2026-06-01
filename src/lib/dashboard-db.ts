import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-side reads for the business dashboard. Callers MUST gate access with
 * requireBusiness() first. Owner-scoped reads use the RLS client (the owner
 * can see their own pending/rejected events); counts use the admin client so
 * saves/rsvps by OTHER users are visible (those rows aren't readable under the
 * owner's RLS).
 */

export interface OwnerEvent {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  cost: string;
  price: number | null;
  city: string;
  venue: string;
  eventDate: string;
  eventTime: string;
  status: "pending" | "approved" | "rejected";
  adminNotes: string | null;
  imageUrl: string | null;
  cover: string;
  description: string;
  descriptionAr: string;
  cityAr: string;
  venueAr: string;
  organizer: string;
  externalTicketUrl: string | null;
  locationUrl: string | null;
  wheelchair: boolean;
  familyFriendly: boolean;
  signLanguage: boolean;
  saves: number;
  rsvps: number;
}

const OWNER_COLS =
  "id,title,title_ar,category,cost,price,description,description_ar,city,city_ar,venue,venue_ar,event_date,event_time,status,admin_notes,image_url,cover,organizer,external_ticket_url,location_url,wheelchair,family_friendly,sign_language";

interface OwnerRow {
  id: string;
  title: string;
  title_ar: string;
  category: string;
  cost: string;
  price: number | null;
  description: string;
  description_ar: string;
  city: string;
  city_ar: string;
  venue: string;
  venue_ar: string;
  event_date: string;
  event_time: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  image_url: string | null;
  cover: string;
  organizer: string;
  external_ticket_url: string | null;
  location_url: string | null;
  wheelchair: boolean;
  family_friendly: boolean;
  sign_language: boolean;
}

function rowToOwnerEvent(
  r: OwnerRow,
  counts: Map<string, { saves: number; rsvps: number }>,
): OwnerEvent {
  return {
    id: r.id,
    title: r.title,
    titleAr: r.title_ar,
    category: r.category,
    cost: r.cost,
    price: r.price,
    city: r.city,
    venue: r.venue,
    eventDate: r.event_date,
    eventTime: r.event_time,
    status: r.status,
    adminNotes: r.admin_notes,
    imageUrl: r.image_url,
    cover: r.cover,
    description: r.description,
    descriptionAr: r.description_ar,
    cityAr: r.city_ar,
    venueAr: r.venue_ar,
    organizer: r.organizer,
    externalTicketUrl: r.external_ticket_url,
    locationUrl: r.location_url,
    wheelchair: r.wheelchair,
    familyFriendly: r.family_friendly,
    signLanguage: r.sign_language,
    saves: counts.get(r.id)?.saves ?? 0,
    rsvps: counts.get(r.id)?.rsvps ?? 0,
  };
}

/** All of the signed-in owner's events, newest first, with demand counts. */
export async function getOwnerEvents(ownerId: string): Promise<OwnerEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(OWNER_COLS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as OwnerRow[];
  const counts = await countsForEvents(rows.map((r) => r.id));
  return rows.map((r) => rowToOwnerEvent(r, counts));
}

/** A single owner event for the edit form (must belong to the owner). */
export async function getOwnerEvent(
  ownerId: string,
  eventId: string,
): Promise<OwnerEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select(OWNER_COLS)
    .eq("id", eventId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (!data) return null;
  const row = data as OwnerRow;
  const counts = await countsForEvents([row.id]);
  return rowToOwnerEvent(row, counts);
}

/** Save + RSVP counts per event id, via the admin client (cross-user rows). */
async function countsForEvents(
  ids: string[],
): Promise<Map<string, { saves: number; rsvps: number }>> {
  const map = new Map<string, { saves: number; rsvps: number }>();
  if (ids.length === 0) return map;

  const admin = createAdminClient();
  const [{ data: saves }, { data: rsvps }] = await Promise.all([
    admin.from("saves").select("event_id").in("event_id", ids),
    admin.from("rsvps").select("event_id").in("event_id", ids),
  ]);

  for (const id of ids) map.set(id, { saves: 0, rsvps: 0 });
  for (const s of (saves ?? []) as { event_id: string }[]) {
    const c = map.get(s.event_id);
    if (c) c.saves += 1;
  }
  for (const r of (rsvps ?? []) as { event_id: string }[]) {
    const c = map.get(r.event_id);
    if (c) c.rsvps += 1;
  }
  return map;
}
