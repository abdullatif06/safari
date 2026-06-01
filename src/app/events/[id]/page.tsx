import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApprovedEvent } from "@/lib/events-db";
import { eventImage } from "@/lib/types";
import EventDetail from "@/components/EventDetail";

// Cache each event page for 60 s; stale-while-revalidate keeps navigation fast.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getApprovedEvent(id);
  if (!event) return { title: "Event not found" };

  const image = event.imageUrl ?? eventImage(event.id);
  const desc =
    event.description?.slice(0, 160) ||
    `${event.title} in ${event.city}, Jordan — discover it on Saifi.`;

  return {
    title: event.title,
    description: desc,
    openGraph: {
      title: `${event.title} · Saifi`,
      description: desc,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: desc,
      images: [image],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getApprovedEvent(id);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
