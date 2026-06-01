"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell, { PageHeader } from "@/components/PageShell";
import PlacesList from "@/components/PlacesList";
import { useI18n } from "@/lib/i18n";
import type { Place } from "@/lib/places-types";

/** Client wrapper for the places page — i18n strings + the filterable list. */
export default function PlacesPageClient({ places }: { places: Place[] }) {
  const { t } = useI18n();
  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <PageHeader
          eyebrow={t("placesHeroEyebrow")}
          title={t("placesTitle")}
          lead={t("placesIntro")}
        />

        <div className="mt-8 flex justify-center">
          <Link
            href="/places/submit"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-clay"
          >
            <Plus size={17} /> {t("submitPlace")}
          </Link>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={<div className="py-16 text-center text-ink-faint">…</div>}
          >
            <PlacesList places={places} />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
