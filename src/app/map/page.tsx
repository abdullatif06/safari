"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PageShell from "@/components/PageShell";
import { EVENTS } from "@/lib/events";
import { Category, CATEGORY_META } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const EventsMap = dynamic(() => import("@/components/EventsMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[70vh] place-items-center rounded-3xl border border-line bg-sand-100 text-ink-faint">
      Loading map…
    </div>
  ),
});

const CATEGORIES: Category[] = ["music", "cultural", "sports", "food"];

export default function MapPage() {
  const { lang, t } = useI18n();
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? EVENTS
        : EVENTS.filter((e) => e.category === active),
    [active],
  );

  return (
    <PageShell>
      <section className="w-full px-5 py-10 sm:px-8 lg:px-12">
        <span className="eyebrow mb-3">{t("seeOnMapSub")}</span>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("mapTitle")}
          </h1>
          <div className="flex flex-wrap gap-2">
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
                  {lang === "ar"
                    ? CATEGORY_META[c].labelAr
                    : CATEGORY_META[c].label}
                </button>
              );
            })}
          </div>
        </div>
        <EventsMap events={filtered} className="h-[70vh]" zoom={7} />
      </section>
    </PageShell>
  );
}
