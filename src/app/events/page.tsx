import type { Metadata } from "next";
import EventsPageClient from "@/components/EventsPageClient";
import { getApprovedEvents } from "@/lib/events-db";

export const metadata: Metadata = {
  title: "All events",
  description:
    "Browse free and low-cost summer events across Jordan — concerts, festivals, heritage walks, and food markets. Filter by city, category, and cost.",
};

// Re-fetch from Supabase at most once per minute; stale-while-revalidate
// means navigating to this page is instant from cache while a background
// refresh keeps content up to date.
export const revalidate = 60;

export default async function EventsPage() {
  const events = await getApprovedEvents();
  return <EventsPageClient events={events} />;
}
