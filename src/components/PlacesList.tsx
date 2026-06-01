"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { PLACES, placeAreas } from "@/lib/places";
import {
  type Place,
  type PlaceCategory,
  PLACE_CATEGORIES,
  PLACE_CATEGORY_META,
} from "@/lib/places-types";
import { useI18n } from "@/lib/i18n";
import PlaceCard from "./PlaceCard";

export default function PlacesList({
  initialArea = "all",
  places = PLACES,
}: {
  /** area name (matches Place.area), or "all" */
  initialArea?: string;
  places?: Place[];
}) {
  const { lang, t } = useI18n();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat") as PlaceCategory | null;
  const initialCat: PlaceCategory | "all" = PLACE_CATEGORIES.includes(
    catParam as PlaceCategory,
  )
    ? (catParam as PlaceCategory)
    : "all";

  const [active, setActive] = useState<PlaceCategory | "all">(initialCat);
  const [area, setArea] = useState<string>(initialArea);
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  const areas = useMemo(() => placeAreas(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places
      .filter((p) => {
        if (active !== "all" && p.category !== active) return false;
        if (area !== "all" && p.area !== area) return false;
        if (q) {
          const haystack = [p.name, p.nameAr, p.area, p.areaAr, p.address, p.addressAr]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [places, active, area, query]);

  const hasFilters = active !== "all" || area !== initialArea || query !== "";

  return (
    <>
      {/* Search field */}
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-full border border-line bg-white px-4 py-2 shadow-soft">
        <Search size={18} className="text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaces")}
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
        {PLACE_CATEGORIES.map((c) => {
          const Icon = PLACE_CATEGORY_META[c].icon;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "chip-active" : "chip-idle"}`}
            >
              <Icon size={15} />
              {lang === "ar"
                ? PLACE_CATEGORY_META[c].labelAr
                : PLACE_CATEGORY_META[c].label}
            </button>
          );
        })}

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="chip chip-idle appearance-none pr-8"
        >
          <option value="all">{t("allAreas")}</option>
          {areas.map((a) => (
            <option key={a.name} value={a.name}>
              {lang === "ar" ? a.nameAr : a.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              setActive("all");
              setArea(initialArea);
              setQuery("");
            }}
            className="text-sm text-ink-faint underline-offset-4 hover:text-ink hover:underline"
          >
            {t("clearFilters")}
          </button>
        )}

        <span className="ms-auto text-sm text-ink-soft">
          {filtered.length} {t("placesFound")}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PlaceCard key={p.id} place={p} />
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
          <p className="text-ink-soft">{t("noPlaces")}</p>
        </div>
      )}
    </>
  );
}
