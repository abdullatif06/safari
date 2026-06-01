import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an event",
  description:
    "Organizing something this summer? Add your event to Saifi for free and reach people across Jordan.",
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
