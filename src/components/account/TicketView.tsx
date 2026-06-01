"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Ticket as TicketIcon,
  ExternalLink,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import type { Ticket } from "@/lib/account-db";

export default function TicketView({
  ticket,
  qrDataUrl,
  userEmail,
}: {
  ticket: Ticket;
  qrDataUrl: string;
  userEmail: string;
}) {
  const { t, lang } = useI18n();
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  const e = ticket.event;

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-md">
          <Link
            href="/account/tickets"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <Back size={16} /> {t("myTickets")}
          </Link>

          {/* Ticket card */}
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
            {/* Event banner */}
            <div className="relative aspect-[16/8]">
              <Image
                src={`/images/event-${e.id}.jpg`}
                alt=""
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                  <TicketIcon size={13} /> {t("ticketTitle")}
                </span>
                <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
                  {lang === "ar" ? e.titleAr : e.title}
                </h1>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 px-6 py-5 text-sm text-ink">
              <p className="flex items-center gap-2.5">
                <Calendar size={16} className="text-terracotta" />
                {formatDate(e.date, lang)}
              </p>
              <p className="flex items-center gap-2.5">
                <Clock size={16} className="text-terracotta" />
                {formatTime(e.time, lang)}
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 text-terracotta" />
                <span>
                  {lang === "ar" ? e.venueAr : e.venue}
                  <br />
                  <span className="text-ink-soft">
                    {lang === "ar" ? e.cityAr : e.city}
                  </span>
                </span>
              </p>
            </div>

            {/* Perforation */}
            <div className="relative">
              <div className="border-t-2 border-dashed border-line" />
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-sand-50" />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-sand-50" />
            </div>

            {/* QR */}
            <div className="flex flex-col items-center px-6 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Ticket QR code"
                width={220}
                height={220}
                className="rounded-xl"
              />
              <p className="mt-3 text-center text-sm font-medium text-ink">
                {t("showAtEntrance")}
              </p>
              {userEmail && (
                <p className="mt-1 text-xs text-ink-faint">{userEmail}</p>
              )}
              <p className="mt-2 font-mono text-[11px] text-ink-faint">
                #{ticket.rsvpId.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* External tickets (payment off-site) */}
            {e.externalTicketUrl && (
              <a
                href={e.externalTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-line bg-sand-50 px-6 py-4 text-sm font-semibold text-terracotta hover:bg-sand-100"
              >
                {t("getTickets")} <ExternalLink size={14} />
              </a>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-ink-faint">
            {t("ticketAtVenue")}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
