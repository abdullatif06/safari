import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse by city",
  description:
    "Explore summer events city by city across Jordan — Amman, Aqaba, Jerash, Irbid, Wadi Rum, and As-Salt.",
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
