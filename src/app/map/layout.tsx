import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events map",
  description:
    "See every summer event across Jordan on an interactive map — from Amman to Aqaba. Find what's happening near you.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
