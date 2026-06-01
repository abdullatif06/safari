"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Ticket as TicketIcon,
  QrCode,
} from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import { eventImage } from "@/lib/types";
import type { Ticket } from "@/lib/account-db";

export default function TicketsView({
  user,
  tickets,
}: {
  user: AccountUser;
  tickets: Ticket[];
}) {
  const { t, lang } = useI18n();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = tickets.filter((tk) => tk.event.date >= today);
  const past = tickets.filter((tk) => tk.event.date < today);

  return (
    <AccountShell user={user}>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
        {t("myTickets")}
      </h2>

      {tickets.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-16 text-center">
          <TicketIcon size={32} className="text-ink-faint" />
          <p className="text-ink-soft">{t("noTickets")}</p>
          <Link href="/events" className="btn-primary !px-5 !py-2 text-sm">
            {t("browseEvents")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {upcoming.length > 0 && (
            <TicketGroup title={t("upcoming")} tickets={upcoming} />
          )}
          {past.length > 0 && (
            <TicketGroup title={t("past")} tickets={past} dimmed />
          )}
        </div>
      )}
    </AccountShell>
  );

  function TicketGroup({
    title,
    tickets,
    dimmed = false,
  }: {
    title: string;
    tickets: Ticket[];
    dimmed?: boolean;
  }) {
    return (
      <div>
        <h3 className="mb-4 font-display text-xl font-semibold text-ink">
          {title}
        </h3>
        <div className={`space-y-4 ${dimmed ? "opacity-70" : ""}`}>
          {tickets.map((tk) => {
            const e = tk.event;
            return (
              <Link
                key={tk.rsvpId}
                href={`/account/tickets/${tk.rsvpId}`}
                className="card card-hover flex items-center gap-4 overflow-hidden p-3"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={e.imageUrl ?? eventImage(e.id)}
                    unoptimized={!!e.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-display text-base font-semibold text-ink">
                    {lang === "ar" ? e.titleAr : e.title}
                  </h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                    <Calendar size={14} className="text-ink-faint" />
                    {formatDate(e.date, lang)} · {formatTime(e.time, lang)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
                    <MapPin size={14} className="text-ink-faint" />
                    {lang === "ar" ? e.cityAr : e.city}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-ink">
                  <QrCode size={14} /> {t("viewTicket")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
