"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, X, Heart } from "lucide-react";
import { EVENTS } from "@/lib/events";
import { CITIES } from "@/lib/cities";
import { Category, CATEGORY_META, type EventItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import EventCard from "./EventCard";

const CATEGORIES: Category[] = ["music", "cultural", "sports", "food"];

export default function EventsList({
  initialCity = "all",
  showCityFilter = true,
  events = EVENTS,
}: {
  /** city name (matches EventItem.city), or "all" */
  initialCity?: string;
  showCityFilter?: boolean;
  /** Event source; defaults to the static array for callers that don't pass it */
  events?: EventItem[];
}) {
  const { lang, t } = useI18n();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat") as Category | null;
  const initialCat: Category | "all" = CATEGORIES.includes(catParam as Category)
    ? (catParam as Category)
    : "all";
  const [active, setActive] = useState<Category | "all">(initialCat);
  const [city, setCity] = useState<string>(initialCity);
  const [freeOnly, setFreeOnly] = useState(false);
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (active !== "all" && e.category !== active) return false;
      if (city !== "all" && e.city !== city) return false;
      if (freeOnly && e.cost === "paid") return false;
      if (q) {
        const haystack = [
          e.title,
          e.titleAr,
          e.city,
          e.cityAr,
          e.venue,
          e.venueAr,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [events, active, city, freeOnly, query]);

  const hasFilters =
    active !== "all" || freeOnly || city !== initialCity || query !== "";

  return (
    <>
      {/* Search field */}
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-full border border-line bg-white px-4 py-2 shadow-soft">
        <Search size={18} className="text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            lang === "ar" ? "ابحث عن فعالية أو مدينة…" : "Search events or cities…"
          }
          className="flex-1 bg-transparent py-1 text-ink outline-none placeholder:text-ink-faint"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-ink-faint hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setActive("all")}
          className={`chip ${active === "all" ? "chip-active" : "chip-idle"}`}
        >
          {t("allCategories")}
        </button>
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_META[c].icon;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "chip-active" : "chip-idle"}`}
            >
              <Icon size={15} />
              {lang === "ar" ? CATEGORY_META[c].labelAr : CATEGORY_META[c].label}
            </button>
          );
        })}

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />

        {showCityFilter && (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="chip chip-idle appearance-none pr-8"
          >
            <option value="all">{t("allCities")}</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {lang === "ar" ? c.nameAr : c.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => setFreeOnly((v) => !v)}
          className={`chip ${freeOnly ? "chip-active" : "chip-idle"}`}
        >
          <Heart size={15} /> {t("freeOnly")}
        </button>

        {hasFilters && (
          <button
            onClick={() => {
              setActive("all");
              setCity(initialCity);
              setFreeOnly(false);
              setQuery("");
            }}
            className="text-sm text-ink-faint underline-offset-4 hover:text-ink hover:underline"
          >
            {t("clearFilters")}
          </button>
        )}

        <span className="ms-auto text-sm text-ink-soft">
          {filtered.length} {t("eventsFound")}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => (
            <EventCard key={e.id} event={e} featured={i === 0 && filtered.length > 3} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-16 text-center">
          <Image
            src="/images/empty-state.jpg"
            alt=""
            width={120}
            height={120}
            className="rounded-2xl opacity-90"
          />
          <p className="text-ink-soft">{t("noResults")}</p>
        </div>
      )}
    </>
  );
}
