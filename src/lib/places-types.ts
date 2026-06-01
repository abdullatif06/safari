import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  UtensilsCrossed,
  Mountain,
  ShoppingBag,
  Trees,
  Sparkles,
  Moon,
  CalendarHeart,
  MapPin,
} from "lucide-react";

/**
 * A "Place to go in Amman" — café, restaurant, viewpoint, mall, park, etc.
 * Mirrors the EventItem shape so it reuses the same UI building blocks
 * (cards, filters, maps, reviews). Events surface as the `event` category.
 */
export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "viewpoint"
  | "mall"
  | "park"
  | "activity"
  | "nightlife"
  | "event"
  | "other";

/** $ / $$ / $$$ — null when price doesn't apply (e.g. a free viewpoint). */
export type PriceLevel = 1 | 2 | 3 | null;

export interface Place {
  id: string;
  name: string;
  nameAr: string;
  category: PlaceCategory;
  priceLevel: PriceLevel;
  description: string;
  descriptionAr: string;
  /** Neighborhood / area, e.g. "Abdoun", "Sweifieh". */
  area: string;
  areaAr: string;
  /** Free-text street address shown on the detail page. */
  address: string;
  addressAr: string;
  lat: number;
  lng: number;
  /** Google Maps URL for directions. */
  locationUrl?: string;
  /** Cover/photo URL; falls back to placeImage(id). */
  imageUrl?: string;
  /** Emoji accent used as a fallback chip. */
  cover: string;
  /** Average rating 0–5 (0 = no reviews yet). */
  rating: number;
  /** Number of reviews behind `rating`. */
  reviewCount: number;
  /** Who submitted it (display only). */
  submittedBy?: string;
}

/** Photo path for a place cover, derived from its id. */
export function placeImage(id: string): string {
  return `/images/place-${id}.jpg`;
}

export const PLACE_CATEGORY_META: Record<
  PlaceCategory,
  { label: string; labelAr: string; icon: LucideIcon; color: string }
> = {
  cafe: { label: "Café", labelAr: "كافيه", icon: Coffee, color: "#B14A2C" },
  restaurant: { label: "Restaurant", labelAr: "مطعم", icon: UtensilsCrossed, color: "#D2603A" },
  viewpoint: { label: "Viewpoint", labelAr: "إطلالة", icon: Mountain, color: "#1E8C7A" },
  mall: { label: "Mall", labelAr: "مول", icon: ShoppingBag, color: "#6FA8C7" },
  park: { label: "Park", labelAr: "حديقة", icon: Trees, color: "#3F8C4F" },
  activity: { label: "Activity", labelAr: "نشاط", icon: Sparkles, color: "#E0A23B" },
  nightlife: { label: "Nightlife", labelAr: "حياة ليلية", icon: Moon, color: "#7A5CC7" },
  event: { label: "Event", labelAr: "فعالية", icon: CalendarHeart, color: "#C7406F" },
  other: { label: "Other", labelAr: "أخرى", icon: MapPin, color: "#6B5F54" },
};

/** All categories in display order (chips, dropdowns). */
export const PLACE_CATEGORIES: PlaceCategory[] = [
  "cafe",
  "restaurant",
  "viewpoint",
  "mall",
  "park",
  "activity",
  "nightlife",
  "event",
  "other",
];

/** Price-level label helper. */
export function priceLabel(level: PriceLevel): string {
  if (level === 1) return "$";
  if (level === 2) return "$$";
  if (level === 3) return "$$$";
  return "";
}
