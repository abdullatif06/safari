"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type Role = "user" | "business" | "admin";

export interface AppUser {
  id: string;
  email: string | null;
  fullName: string | null;
  role: Role;
  avatarUrl: string | null;
  lang: "en" | "ar" | null;
}

/**
 * Client-side hook exposing the current Supabase user (or null).
 * Subscribes to auth changes so the navbar updates on sign in/out.
 * Also loads the user's role from `profiles` so role-gated nav links show.
 */
export function useUser(): AppUser | null {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      // getUser() makes a network call to verify the session — this catches
      // sessions that were set server-side (e.g. after a password sign-in via
      // server action + redirect) which don't fire onAuthStateChange.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, avatar_url, lang")
          .eq("id", user.id)
          .maybeSingle();
        setUser({
          id: user.id,
          email: user.email ?? null,
          fullName: (user.user_metadata?.full_name as string) ?? null,
          role: (profile?.role as Role) ?? "user",
          avatarUrl: (profile?.avatar_url as string) ?? null,
          lang: (profile?.lang as "en" | "ar" | null) ?? null,
        });
      } else {
        setUser(null);
      }
    }

    load();

    // Also subscribe so client-side auth events (Google OAuth, sign-out)
    // update the navbar immediately without a full reload.
    const { data: sub } = supabase.auth.onAuthStateChange((event: string) => {
      // INITIAL_SESSION fires on mount with whatever the cookie says — we
      // already called load() above, so skip it to avoid a double fetch.
      if (event !== "INITIAL_SESSION") load();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return user;
}
