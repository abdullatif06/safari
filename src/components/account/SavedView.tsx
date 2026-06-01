"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import EventCard from "@/components/EventCard";
import { useI18n } from "@/lib/i18n";
import type { EventItem } from "@/lib/types";

export default function SavedView({
  user,
  events,
}: {
  user: AccountUser;
  events: EventItem[];
}) {
  const { t } = useI18n();

  return (
    <AccountShell user={user}>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
        {t("savedEvents")}
      </h2>

      {events.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-16 text-center">
          <Heart size={32} className="text-ink-faint" />
          <p className="text-ink-soft">{t("noSaved")}</p>
          <Link href="/events" className="btn-primary !px-5 !py-2 text-sm">
            {t("browseEvents")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
