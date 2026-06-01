import "server-only";
import { createClient } from "@/lib/supabase/server";
import { EVENTS } from "@/lib/events";
import type { EventItem, Category, Cost } from "@/lib/types";

/**
 * Server-side event data access. Reads `approved` events from Supabase and
 * maps DB rows to the existing `EventItem` shape so all UI components work
 * unchanged. Falls back to the static EVENTS array if Supabase is
 * unreachable or returns nothing (e.g. before the seed has run).
 */

interface EventRow {
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
  lat: number | null;
  lng: number | null;
  organizer: string;
  external_ticket_url: string | null;
  image_url: string | null;
  cover: string;
  location_url: string | null;
  wheelchair: boolean;
  family_friendly: boolean;
  sign_language: boolean;
}

function rowToEvent(r: EventRow): EventItem {
  return {
    id: r.id,
    title: r.title,
    titleAr: r.title_ar,
    category: r.category as Category,
    cost: r.cost as Cost,
    price: r.price ?? undefined,
    description: r.description,
    descriptionAr: r.description_ar,
    city: r.city,
    cityAr: r.city_ar,
    venue: r.venue,
    venueAr: r.venue_ar,
    date: r.event_date,
    time: r.event_time,
    lat: r.lat ?? 0,
    lng: r.lng ?? 0,
    organizer: r.organizer,
    accessibility: {
      wheelchair: r.wheelchair,
      familyFriendly: r.family_friendly,
      signLanguage: r.sign_language,
    },
    cover: r.cover,
    // Extra platform fields (optional; ignored by existing components)
    externalTicketUrl: r.external_ticket_url ?? undefined,
    imageUrl: r.image_url ?? undefined,
    locationUrl: r.location_url ?? undefined,
  };
}

const SELECT =
  "id,title,title_ar,category,cost,price,description,description_ar,city,city_ar,venue,venue_ar,event_date,event_time,lat,lng,organizer,external_ticket_url,image_url,cover,location_url,wheelchair,family_friendly,sign_language";

/** All approved events, sorted by date. Falls back to static data. */
export async function getApprovedEvents(): Promise<EventItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(SELECT)
      .eq("status", "approved")
      .order("event_date", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
    }
    return (data as EventRow[]).map(rowToEvent);
  } catch {
    return [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  }
}

/** A single approved event by id, or null. Falls back to static data. */
export async function getApprovedEvent(id: string): Promise<EventItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(SELECT)
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      return EVENTS.find((e) => e.id === id) ?? null;
    }
    return rowToEvent(data as EventRow);
  } catch {
    return EVENTS.find((e) => e.id === id) ?? null;
  }
}
