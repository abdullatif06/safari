export type Category = "music" | "cultural" | "sports" | "food";

export type Cost = "free" | "donation" | "paid";

export interface EventItem {
  id: string;
  title: string;
  titleAr: string;
  category: Category;
  cost: Cost;
  /** Price label shown when cost is "paid" (in JOD) */
  price?: number;
  description: string;
  descriptionAr: string;
  city: string;
  cityAr: string;
  venue: string;
  venueAr: string;
  /** ISO date string */
  date: string;
  /** e.g. "18:00" */
  time: string;
  lat: number;
  lng: number;
  organizer: string;
  /** Accessibility flags */
  accessibility: {
    wheelchair: boolean;
    familyFriendly: boolean;
    signLanguage: boolean;
  };
  /** Emoji used as a small accent (kept for chips/fallbacks) */
  cover: string;
  /** External ticketing / registration link (payment happens off-site) */
  externalTicketUrl?: string;
  /** Uploaded cover image URL (Supabase Storage); falls back to eventImage(id) */
  imageUrl?: string;
  /** Google Maps URL for directions */
  locationUrl?: string;
}

/** Photo path for an event cover, derived from its id. */
export function eventImage(id: string): string {
  return `/images/event-${id}.jpg`;
}

/** A Jordanian city/area featured on the site. */
export interface City {
  slug: string;
  name: string;
  nameAr: string;
  blurb: string;
  blurbAr: string;
  image: string;
}

import type { LucideIcon } from "lucide-react";
import { Music, Drama, Trophy, UtensilsCrossed } from "lucide-react";

export const CATEGORY_META: Record<
  Category,
  { label: string; labelAr: string; icon: LucideIcon; color: string; image: string }
> = {
  music: {
    label: "Music",
    labelAr: "موسيقى",
    icon: Music,
    color: "#1E8C7A",
    image: "/images/cat-music.jpg",
  },
  cultural: {
    label: "Cultural",
    labelAr: "ثقافي",
    icon: Drama,
    color: "#6FA8C7",
    image: "/images/cat-cultural.jpg",
  },
  sports: {
    label: "Sports",
    labelAr: "رياضة",
    icon: Trophy,
    color: "#D2603A",
    image: "/images/cat-sports.jpg",
  },
  food: {
    label: "Food",
    labelAr: "طعام",
    icon: UtensilsCrossed,
    color: "#E0A23B",
    image: "/images/cat-food.jpg",
  },
};

export const COST_META: Record<
  Cost,
  { label: string; labelAr: string }
> = {
  free: { label: "Free", labelAr: "مجاني" },
  donation: { label: "Donation", labelAr: "تبرع" },
  paid: { label: "Paid", labelAr: "مدفوع" },
};
