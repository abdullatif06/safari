import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-side reads for the admin panel. Uses the service-role client so the
 * admin sees every pending row regardless of RLS. Callers MUST gate access
 * with requireAdmin() first.
 */

export interface PendingEvent {
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
  organizer: string;
  description: string;
  imageUrl: string | null;
  cover: string;
  createdAt: string;
  ownerEmail: string | null;
  ownerName: string | null;
}

export interface OrganizerRequest {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  description: string;
  status: string;
  createdAt: string;
  requesterEmail: string | null;
  requesterName: string | null;
}

/** All events awaiting review, oldest first (FIFO queue). */
export async function getPendingEvents(): Promise<PendingEvent[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("events")
    .select(
      "id,title,title_ar,category,cost,price,city,venue,event_date,event_time,organizer,description,image_url,cover,created_at,owner_id,profiles:owner_id(full_name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  // Owner email lives in auth.users — fetch via the Admin API and map.
  const ownerIds = [...new Set(data.map((r) => r.owner_id).filter(Boolean))] as string[];
  const emailById = await emailsForUsers(admin, ownerIds);

  return data.map((r) => {
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
      organizer: r.organizer,
      description: r.description,
      imageUrl: r.image_url,
      cover: r.cover,
      createdAt: r.created_at,
      ownerEmail: r.owner_id ? emailById.get(r.owner_id) ?? null : null,
      ownerName: nameFromJoin(r.profiles),
    };
  });
}

/** All pending organizer requests, oldest first. */
export async function getPendingOrganizerRequests(): Promise<OrganizerRequest[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organizer_requests")
    .select(
      "id,user_id,business_name,phone,description,status,created_at,profiles:user_id(full_name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  const userIds = [...new Set(data.map((r) => r.user_id).filter(Boolean))] as string[];
  const emailById = await emailsForUsers(admin, userIds);

  return data.map((r) => {
    return {
      id: r.id,
      userId: r.user_id,
      businessName: r.business_name,
      phone: r.phone,
      description: r.description,
      status: r.status,
      createdAt: r.created_at,
      requesterEmail: emailById.get(r.user_id) ?? null,
      requesterName: nameFromJoin(r.profiles),
    };
  });
}

/** Counts for the nav badge — pending events + pending organizer requests. */
export async function getPendingCounts(): Promise<{ events: number; organizers: number }> {
  const admin = createAdminClient();
  const [{ count: events }, { count: organizers }] = await Promise.all([
    admin.from("events").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin
      .from("organizer_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);
  return { events: events ?? 0, organizers: organizers ?? 0 };
}

/**
 * A PostgREST embedded relation can be typed as an object or an array depending
 * on the inferred cardinality. Normalize either shape to the full_name string.
 */
function nameFromJoin(
  profiles: unknown,
): string | null {
  const rel = Array.isArray(profiles) ? profiles[0] : profiles;
  const name = (rel as { full_name?: string | null } | null | undefined)?.full_name;
  return name ?? null;
}

/** Resolve a set of user ids to their email addresses via the Admin API. */
async function emailsForUsers(
  admin: ReturnType<typeof createAdminClient>,
  ids: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    ids.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      if (data?.user?.email) map.set(id, data.user.email);
    }),
  );
  return map;
}
