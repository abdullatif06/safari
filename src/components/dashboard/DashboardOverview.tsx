"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Heart,
  Ticket as TicketIcon,
  Pencil,
  Calendar,
  CircleDot,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { eventImage } from "@/lib/types";
import type { OwnerEvent } from "@/lib/dashboard-db";

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  approved: { label: "Live", cls: "bg-teal/10 text-teal" },
  pending: { label: "Pending review", cls: "bg-honey/15 text-[#9A6A12]" },
  rejected: { label: "Needs changes", cls: "bg-terracotta/10 text-terracotta" },
};

export default function DashboardOverview({
  businessName,
  events,
}: {
  businessName: string;
  events: OwnerEvent[];
}) {
  const { lang } = useI18n();

  const totalSaves = events.reduce((s, e) => s + e.saves, 0);
  const totalRsvps = events.reduce((s, e) => s + e.rsvps, 0);

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow mb-3">Dashboard</span>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {businessName}
              </h1>
              <p className="mt-3 text-lg text-ink-soft">
                Create events, track demand, and manage your listings.
              </p>
            </div>
            <Link href="/dashboard/events/new" className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} className="me-1.5 inline" /> New event
            </Link>
          </div>

          {/* Aggregate stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat label="Events" value={events.length} icon={<Calendar size={20} className="text-terracotta" />} />
            <Stat label="Total saves" value={totalSaves} icon={<Heart size={20} className="text-terracotta" />} />
            <Stat label="Total RSVPs" value={totalRsvps} icon={<TicketIcon size={20} className="text-terracotta" />} />
          </div>

          {/* Event list */}
          <h2 className="mb-4 mt-12 font-display text-xl font-semibold text-ink">
            Your events
          </h2>

          {events.length === 0 ? (
            <div className="card grid place-items-center gap-3 px-6 py-16 text-center">
              <CircleDot size={36} className="text-ink-faint" />
              <p className="text-ink-soft">You haven&apos;t created any events yet.</p>
              <Link href="/dashboard/events/new" className="btn-primary !px-5 !py-2.5 text-sm">
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((e) => {
                const status = STATUS_STYLE[e.status] ?? STATUS_STYLE.pending;
                return (
                  <div key={e.id} className="card overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-32 w-full shrink-0 sm:h-auto sm:w-44">
                        <Image
                          src={e.imageUrl || eventImage(e.id)}
                          alt=""
                          fill
                          sizes="176px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-semibold text-ink">
                            {lang === "ar" ? e.titleAr : e.title}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                          <Calendar size={14} className="text-ink-faint" />
                          {formatDate(e.eventDate, lang)} · {e.city}
                        </p>

                        {e.status === "rejected" && e.adminNotes && (
                          <p className="mt-2 rounded-lg bg-terracotta/5 px-3 py-2 text-sm text-terracotta">
                            {e.adminNotes}
                          </p>
                        )}

                        <div className="mt-auto flex items-center gap-4 pt-4 text-sm">
                          <span className="flex items-center gap-1.5 text-ink-soft">
                            <Heart size={15} className="text-ink-faint" /> {e.saves}
                          </span>
                          <span className="flex items-center gap-1.5 text-ink-soft">
                            <TicketIcon size={15} className="text-ink-faint" /> {e.rsvps}
                          </span>
                          <Link
                            href={`/dashboard/events/${e.id}/edit`}
                            className="ms-auto inline-flex items-center gap-1.5 font-semibold text-terracotta hover:underline"
                          >
                            <Pencil size={14} /> Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-terracotta/10">
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-ink">{value}</p>
        <p className="text-sm text-ink-soft">{label}</p>
      </div>
    </div>
  );
}
