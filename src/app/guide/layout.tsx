import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summer guide",
  description:
    "Editorial guides to making the most of summer in Jordan — free things to do in Amman, late-night food, and budget trips to Aqaba.",
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
