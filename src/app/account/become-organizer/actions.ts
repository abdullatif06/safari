"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Submit a request to become an organizer. Inserts a pending
 * organizer_requests row owned by the signed-in user. Blocks duplicates while
 * one is already pending. Admin reviews it in /admin.
 */
export async function submitOrganizerRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/become-organizer");

  const businessName = String(formData.get("business_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!businessName) {
    redirect("/account/become-organizer?error=missing");
  }

  // Don't allow a second open request.
  const { data: existing } = await supabase
    .from("organizer_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    redirect("/account/become-organizer?status=pending");
  }

  const { error } = await supabase.from("organizer_requests").insert({
    user_id: user.id,
    business_name: businessName,
    phone,
    description,
  });

  if (error) {
    console.error("[submitOrganizerRequest]", error);
    redirect("/account/become-organizer?error=save");
  }

  revalidatePath("/account/become-organizer");
  revalidatePath("/account");
  redirect("/account/become-organizer?status=pending");
}
