import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { EventItem } from "@/lib/types";

/**
 * Server-side reads for the signed-in user's account pages.
 * Each returns the joined event in the existing EventItem shape so the
 * EventCard component can render them unchanged.
 */

const EVENT_COLS =
  "id,title,title_ar,category,cost,price,description,description_ar,city,city_ar,venue,venue_ar,event_date,event_time,lat,lng,organizer,external_ticket_url,image_url,cover,wheelchair,family_friendly,sign_language,location_url";

interface JoinedEventRow {
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

function toEvent(e: JoinedEventRow): EventItem {
  return {
    id: e.id,
    title: e.title,
    titleAr: e.title_ar,
    category: e.category as EventItem["category"],
    cost: e.cost as EventItem["cost"],
    price: e.price ?? undefined,
    description: e.description,
    descriptionAr: e.description_ar,
    city: e.city,
    cityAr: e.city_ar,
    venue: e.venue,
    venueAr: e.venue_ar,
    date: e.event_date,
    time: e.event_time,
    lat: e.lat ?? 0,
    lng: e.lng ?? 0,
    organizer: e.organizer,
    accessibility: {
      wheelchair: e.wheelchair,
      familyFriendly: e.family_friendly,
      signLanguage: e.sign_language,
    },
    cover: e.cover,
    externalTicketUrl: e.external_ticket_url ?? undefined,
    imageUrl: e.image_url ?? undefined,
    locationUrl: e.location_url ?? undefined,
  };
}

export interface Ticket {
  rsvpId: string;
  createdAt: string;
  event: EventItem;
}

/** The signed-in user (or null) — convenience for account pages. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Events the user has saved (most recent first). */
export async function getSavedEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select(`created_at, events!inner(${EVENT_COLS})`)
    .order("created_at", { ascending: false });

  return ((data ?? []) as unknown as { events: JoinedEventRow }[])
    .map((r) => r.events)
    .filter(Boolean)
    .map(toEvent);
}

/** The user's RSVPs as tickets (their event joined in). */
export async function getTickets(): Promise<Ticket[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select(`id, created_at, events!inner(${EVENT_COLS})`)
    .order("created_at", { ascending: false });

  return ((data ?? []) as unknown as {
    id: string;
    created_at: string;
    events: JoinedEventRow;
  }[])
    .filter((r) => r.events)
    .map((r) => ({
      rsvpId: r.id,
      createdAt: r.created_at,
      event: toEvent(r.events),
    }));
}

/** A single ticket (RSVP) by id, scoped to the signed-in user via RLS. */
export async function getTicket(rsvpId: string): Promise<Ticket | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select(`id, created_at, events!inner(${EVENT_COLS})`)
    .eq("id", rsvpId)
    .maybeSingle();

  const row = data as unknown as {
    id: string;
    created_at: string;
    events: JoinedEventRow;
  } | null;
  if (!row || !row.events) return null;
  return { rsvpId: row.id, createdAt: row.created_at, event: toEvent(row.events) };
}

/** The user's reviews with the event joined in. */
export interface MyReview {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  event: EventItem;
}

export async function getMyReviews(): Promise<MyReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(`id, rating, body, created_at, events!inner(${EVENT_COLS})`)
    .order("created_at", { ascending: false });

  return ((data ?? []) as unknown as {
    id: string;
    rating: number;
    body: string;
    created_at: string;
    events: JoinedEventRow;
  }[])
    .filter((r) => r.events)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      createdAt: r.created_at,
      event: toEvent(r.events),
    }));
}
