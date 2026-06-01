"use client";

import { createBrowserClient } from "@supabase/ssr";

// Store on globalThis so the instance survives Next.js App Router's
// per-navigation module re-evaluation. A plain module-level variable resets
// on each soft navigation, losing the cached session and causing spurious
// sign-out flashes.
const g = globalThis as typeof globalThis & {
  __supabaseBrowserClient?: ReturnType<typeof createBrowserClient>;
};

/**
 * Supabase client for use in Client Components (browser).
 * Returns a singleton attached to globalThis so every component shares the
 * same auth state across navigations and the session is never lost.
 */
export function createClient() {
  if (!g.__supabaseBrowserClient) {
    g.__supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return g.__supabaseBrowserClient;
}
