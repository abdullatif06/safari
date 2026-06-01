"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Save the signed-in user's profile fields. The avatar itself is uploaded
 * client-side straight to the public `avatars` bucket (scoped to the user's
 * folder by RLS); only the resulting public URL is submitted here.
 *
 * Writes go through the user's own session client, so the "users update own
 * profile" RLS policy on `profiles` applies — a user can only edit their row.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/edit");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      phone: phone || null,
      city: city || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[updateProfile]", error);
    redirect("/account/edit?error=save");
  }

  // Keep auth metadata in sync so the navbar (which reads user_metadata)
  // reflects the new name immediately.
  await supabase.auth.updateUser({ data: { full_name: fullName || null } });

  revalidatePath("/account", "layout");
  redirect("/account?saved=1");
}
