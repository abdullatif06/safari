import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "user" | "business" | "admin";

export interface SessionProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  businessName: string | null;
  phone: string | null;
  city: string | null;
  lang: "en" | "ar" | null;
  avatarUrl: string | null;
}

/**
 * Loads the signed-in user + their profile, or null if signed out.
 * Page-level helper so we don't re-implement the join everywhere.
 */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, business_name, phone, city, lang, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? null,
    role: (profile?.role as Role) ?? "user",
    businessName: profile?.business_name ?? null,
    phone: profile?.phone ?? null,
    city: profile?.city ?? null,
    lang: (profile?.lang as "en" | "ar" | null) ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
}

/**
 * Loads the session profile and maps it to the shape the account header
 * (AccountShell) needs. Redirects to login when signed out. `next` is where
 * to return after login.
 */
export async function requireAccountUser(next: string): Promise<{
  me: SessionProfile;
  accountUser: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl: string | null;
  };
}> {
  const me = await getSessionProfile();
  if (!me) redirect(`/login?next=${encodeURIComponent(next)}`);
  return {
    me,
    accountUser: {
      id: me.id,
      name: me.fullName ?? me.email.split("@")[0] ?? "there",
      email: me.email,
      role: me.role,
      avatarUrl: me.avatarUrl,
    },
  };
}

/** Require business OR admin; redirect otherwise. Returns the profile. */
export async function requireBusiness(next = "/dashboard"): Promise<SessionProfile> {
  const me = await getSessionProfile();
  if (!me) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (me.role !== "business" && me.role !== "admin") redirect("/");
  return me;
}

/** Require admin; redirect otherwise. Returns the profile. */
export async function requireAdmin(next = "/admin"): Promise<SessionProfile> {
  const me = await getSessionProfile();
  if (!me) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (me.role !== "admin") redirect("/");
  return me;
}
