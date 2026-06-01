import { Lang } from "./i18n";

/** Format an ISO date like "2026-07-22" into a localized readable date. */
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Format "18:00" into a localized time label. */
export function formatTime(time: string, lang: Lang): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString(lang === "ar" ? "ar-JO" : "en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
