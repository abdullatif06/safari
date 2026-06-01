"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Set a new password for the signed-in user. */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/settings");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) redirect("/account/settings?pw=short");
  if (password !== confirm) redirect("/account/settings?pw=mismatch");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[updatePassword]", error);
    redirect("/account/settings?pw=error");
  }

  redirect("/account/settings?pw=ok");
}

/** Persist the user's preferred UI language to their profile. */
export async function updateLanguage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/settings");

  const lang = String(formData.get("lang") ?? "");
  if (lang !== "en" && lang !== "ar") redirect("/account/settings?lang=error");

  const { error } = await supabase
    .from("profiles")
    .update({ lang })
    .eq("id", user.id);

  if (error) {
    console.error("[updateLanguage]", error);
    redirect("/account/settings?lang=error");
  }

  revalidatePath("/account", "layout");
  redirect("/account/settings?lang=ok");
}

/**
 * Permanently delete the signed-in user's account. Profile-owned rows (saves,
 * rsvps, reviews, organizer_requests) cascade from the profiles FK, and the
 * profile itself cascades from auth.users. We delete the auth user with the
 * service-role client, then sign the now-orphaned session out.
 */
export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Require an explicit typed confirmation.
  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "DELETE") redirect("/account/settings?del=confirm");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount]", error);
    redirect("/account/settings?del=error");
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?deleted=1");
}
