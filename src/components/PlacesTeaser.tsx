"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PLACES } from "@/lib/places";
import { PLACE_CATEGORIES, PLACE_CATEGORY_META } from "@/lib/places-types";
import { useI18n } from "@/lib/i18n";
import PlaceCard from "./PlaceCard";

/**
 * Home-page band that reframes the site around "Places to go in Amman".
 * Shows the top-rated places + category quick-links into /places.
 */
export default function PlacesTeaser() {
  const { lang, t } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const top = [...PLACES].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow mb-3">{t("placesHeroEyebrow")}</span>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t("placesTitle")}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">
            {t("placesIntro")}
          </p>
        </div>
        <Link
          href="/places"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta underline-offset-4 hover:underline"
        >
          {t("viewAll")} <Arrow size={15} />
        </Link>
      </div>

      {/* Category quick-links */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        {PLACE_CATEGORIES.slice(0, 7).map((c) => {
          const Icon = PLACE_CATEGORY_META[c].icon;
          return (
            <Link
              key={c}
              href={`/places?cat=${c}`}
              className="chip chip-idle"
            >
              <Icon size={15} />
              {lang === "ar"
                ? PLACE_CATEGORY_META[c].labelAr
                : PLACE_CATEGORY_META[c].label}
            </Link>
          );
        })}
      </div>

      {/* Top-rated places */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}
