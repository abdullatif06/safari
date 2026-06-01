"use client";

import { Suspense } from "react";
import PageShell, { PageHeader } from "@/components/PageShell";
import EventsList from "@/components/EventsList";
import { useI18n } from "@/lib/i18n";
import type { EventItem } from "@/lib/types";

/** Client wrapper for the events page — handles i18n strings + the filterable list. */
export default function EventsPageClient({ events }: { events: EventItem[] }) {
  const { t } = useI18n();
  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <PageHeader
          eyebrow="Summer 2026"
          title={t("allEvents")}
          lead={t("eventsIntro")}
        />
        <div className="mt-12">
          <Suspense
            fallback={<div className="py-16 text-center text-ink-faint">…</div>}
          >
            <EventsList events={events} />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
