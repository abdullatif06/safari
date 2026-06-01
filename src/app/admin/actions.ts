"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendEventApproved,
  sendEventRejected,
  sendOrganizerApproved,
  sendOrganizerRejected,
} from "@/lib/email";

/** Look up a user's email by id (for notifications). */
async function emailFor(
  admin: ReturnType<typeof createAdminClient>,
  userId: string | null,
): Promise<string | null> {
  if (!userId) return null;
  const { data } = await admin.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function approveEvent(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("eventId") ?? "");
  if (!eventId) return;

  const admin = createAdminClient();
  const { data: event } = await admin
    .from("events")
    .update({ status: "approved", admin_notes: null, updated_at: new Date().toISOString() })
    .eq("id", eventId)
    .select("title, owner_id")
    .maybeSingle();

  if (event) {
    const to = await emailFor(admin, event.owner_id);
    if (to) await sendEventApproved(to, event.title, eventId);
  }

  revalidatePath("/admin");
  revalidatePath("/events");
}

export async function rejectEvent(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("eventId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!eventId) return;

  const admin = createAdminClient();
  const { data: event } = await admin
    .from("events")
    .update({ status: "rejected", admin_notes: reason, updated_at: new Date().toISOString() })
    .eq("id", eventId)
    .select("title, owner_id")
    .maybeSingle();

  if (event) {
    const to = await emailFor(admin, event.owner_id);
    if (to) await sendEventRejected(to, event.title, reason);
  }

  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// Organizer requests
// ---------------------------------------------------------------------------

export async function approveOrganizer(formData: FormData) {
  await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return;

  const admin = createAdminClient();

  // Mark the request approved and capture who it belongs to.
  const { data: req } = await admin
    .from("organizer_requests")
    .update({ status: "approved", admin_notes: null, reviewed_at: new Date().toISOString() })
    .eq("id", requestId)
    .select("user_id, business_name")
    .maybeSingle();

  if (req) {
    // Flip the user's role and stamp their business details onto the profile.
    await admin
      .from("profiles")
      .update({ role: "business", business_name: req.business_name })
      .eq("id", req.user_id);

    const to = await emailFor(admin, req.user_id);
    if (to) await sendOrganizerApproved(to, req.business_name);
  }

  revalidatePath("/admin");
}

export async function rejectOrganizer(formData: FormData) {
  await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!requestId) return;

  const admin = createAdminClient();
  const { data: req } = await admin
    .from("organizer_requests")
    .update({ status: "rejected", admin_notes: reason, reviewed_at: new Date().toISOString() })
    .eq("id", requestId)
    .select("user_id, business_name")
    .maybeSingle();

  if (req) {
    const to = await emailFor(admin, req.user_id);
    if (to) await sendOrganizerRejected(to, req.business_name, reason);
  }

  revalidatePath("/admin");
}
