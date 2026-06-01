import { notFound } from "next/navigation";
import { getPlaceById } from "@/lib/places";
import PlaceDetail from "@/components/PlaceDetail";

// Mock data for now; swapped for getApprovedPlace(id) from Supabase next phase.
export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) notFound();
  return <PlaceDetail place={place} />;
}
