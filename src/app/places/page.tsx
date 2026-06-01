import type { Metadata } from "next";
import PlacesPageClient from "@/components/PlacesPageClient";
import { PLACES } from "@/lib/places";

// Mock data for now; swapped for getApprovedPlaces() from Supabase next phase.
export const metadata: Metadata = {
  title: "Places to go in Amman",
  description:
    "Cafés, rooftops, malls, parks and viewpoints across Amman — plus this summer's events. Discover where to go next.",
};

export default function PlacesPage() {
  return <PlacesPageClient places={PLACES} />;
}
