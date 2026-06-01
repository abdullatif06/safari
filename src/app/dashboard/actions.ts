"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/auth-guards";
import { createClient } from "@/lib/supabase/server";

/**
 * Build a URL-safe slug from a title, with a short random suffix to avoid
 * collisions (event ids are the primary key).
 */
function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `event-${suffix}`;
}

/** Pull the shared event fields out of the form. */
function readEventFields(formData: FormData) {
  const cost = String(formData.get("cost") ?? "free");
  const priceRaw = String(formData.get("price") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    title_ar: String(formData.get("title_ar") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    description_ar: String(formData.get("description_ar") ?? "").trim(),
    category: String(formData.get("category") ?? "cultural"),
    cost,
    price: cost === "paid" && priceRaw ? Number(priceRaw) : null,
    city: String(formData.get("city") ?? "").trim(),
    city_ar: String(formData.get("city_ar") ?? "").trim(),
    venue: String(formData.get("venue") ?? "").trim(),
    venue_ar: String(formData.get("venue_ar") ?? "").trim(),
    event_date: String(formData.get("event_date") ?? "").trim(),
    event_time: String(formData.get("event_time") ?? "").trim(),
    organizer: String(formData.get("organizer") ?? "").trim(),
    external_ticket_url:
      String(formData.get("external_ticket_url") ?? "").trim() || null,
    location_url:
      String(formData.get("location_url") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    cover: String(formData.get("cover") ?? "").trim() || "🎉",
    wheelchair: formData.get("wheelchair") === "on",
    family_friendly: formData.get("family_friendly") === "on",
    sign_language: formData.get("sign_language") === "on",
  };
}

/** Create a new event → status 'pending' (admin must approve). */
export async function createEvent(formData: FormData) {
  const me = await requireBusiness();
  const fields = readEventFields(formData);

  if (!fields.title || !fields.event_date) {
    redirect("/dashboard/events/new?error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    id: slugify(fields.title),
    owner_id: me.id,
    status: "pending",
    ...fields,
  });

  if (error) {
    console.error("[createEvent]", error);
    redirect("/dashboard/events/new?error=save");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

/**
 * Update an existing event. Per product decision, edits stay live: an already
 * approved event remains approved. Ownership is enforced by RLS (owner_id).
 */
export async function updateEvent(formData: FormData) {
  await requireBusiness();
  const eventId = String(formData.get("eventId") ?? "");
  if (!eventId) redirect("/dashboard");

  const fields = readEventFields(formData);
  if (!fields.title || !fields.event_date) {
    redirect(`/dashboard/events/${eventId}/edit?error=missing`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", eventId);

  if (error) {
    console.error("[updateEvent]", error);
    redirect(`/dashboard/events/${eventId}/edit?error=save`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  redirect("/dashboard?updated=1");
}

/** Delete an event the owner owns (RLS enforces ownership). */
export async function deleteEvent(formData: FormData) {
  await requireBusiness();
  const eventId = String(formData.get("eventId") ?? "");
  if (!eventId) redirect("/dashboard");

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", eventId);

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=1");
}
