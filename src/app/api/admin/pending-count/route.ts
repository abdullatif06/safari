import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth-guards";
import { getPendingCounts } from "@/lib/admin-db";

/**
 * Returns the number of items awaiting admin review, for the nav badge.
 * Admin-only — returns 0 for everyone else (never leaks the count).
 */
export async function GET() {
  const me = await getSessionProfile();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ total: 0 });
  }
  const { events, organizers } = await getPendingCounts();
  return NextResponse.json({ events, organizers, total: events + organizers });
}
