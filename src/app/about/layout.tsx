import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Saifi is a free guide to summer events and places across Jordan — built so everyone can find something to do, no fees, no barriers.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
