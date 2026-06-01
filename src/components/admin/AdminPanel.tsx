"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Inbox,
  Phone,
  Mail,
  User,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import { eventImage } from "@/lib/types";
import type { PendingEvent, OrganizerRequest } from "@/lib/admin-db";
import {
  approveEvent,
  rejectEvent,
  approveOrganizer,
  rejectOrganizer,
} from "@/app/admin/actions";

type Tab = "events" | "organizers";

export default function AdminPanel({
  events,
  organizers,
}: {
  events: PendingEvent[];
  organizers: OrganizerRequest[];
}) {
  const { lang } = useI18n();
  const [tab, setTab] = useState<Tab>("events");

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow mb-3">Admin</span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Review queue
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Approve or reject events and organizer requests submitted by the
            community.
          </p>

          {/* Tabs */}
          <div className="mt-10 flex gap-2 border-b border-line">
            <TabButton
              active={tab === "events"}
              onClick={() => setTab("events")}
              label="Pending events"
              count={events.length}
            />
            <TabButton
              active={tab === "organizers"}
              onClick={() => setTab("organizers")}
              label="Organizer requests"
              count={organizers.length}
            />
          </div>

          <div className="mt-8 space-y-5">
            {tab === "events" &&
              (events.length === 0 ? (
                <EmptyState label="No events waiting for review." />
              ) : (
                events.map((e) => (
                  <EventCardAdmin key={e.id} event={e} lang={lang} />
                ))
              ))}

            {tab === "organizers" &&
              (organizers.length === 0 ? (
                <EmptyState label="No organizer requests waiting." />
              ) : (
                organizers.map((r) => (
                  <OrganizerCard key={r.id} request={r} />
                ))
              ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "border-terracotta text-terracotta"
          : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {label}
      {count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1.5 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="card grid place-items-center gap-3 px-6 py-16 text-center">
      <Inbox size={40} className="text-ink-faint" />
      <p className="text-ink-soft">{label}</p>
    </div>
  );
}

function EventCardAdmin({
  event,
  lang,
}: {
  event: PendingEvent;
  lang: "en" | "ar";
}) {
  const [rejecting, setRejecting] = useState(false);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
          <Image
            src={event.imageUrl || eventImage(event.id)}
            alt=""
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-sand-100 px-2.5 py-1 font-semibold capitalize text-ink">
              {event.category}
            </span>
            <span className="rounded-full bg-sand-100 px-2.5 py-1 font-semibold text-ink">
              {event.cost === "paid" ? `${event.price} JOD` : event.cost}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold text-ink">
            {lang === "ar" ? event.titleAr : event.title}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-ink-soft">
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-ink-faint" />
              {formatDate(event.eventDate, lang)}
              <Clock size={14} className="ms-2 text-ink-faint" />
              {formatTime(event.eventTime, lang)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-ink-faint" />
              {event.venue}, {event.city}
            </p>
            <p className="flex items-center gap-2">
              <User size={14} className="text-ink-faint" />
              {event.ownerName ?? "—"}
              {event.ownerEmail && (
                <span className="text-ink-faint">· {event.ownerEmail}</span>
              )}
            </p>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
            {event.description}
          </p>

          {!rejecting ? (
            <div className="mt-4 flex gap-2">
              <form action={approveEvent}>
                <input type="hidden" name="eventId" value={event.id} />
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  <CheckCircle2 size={16} /> Approve
                </button>
              </form>
              <button
                onClick={() => setRejecting(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand-100"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          ) : (
            <form action={rejectEvent} className="mt-4 space-y-2">
              <input type="hidden" name="eventId" value={event.id} />
              <textarea
                name="reason"
                required
                rows={2}
                placeholder="Reason for rejection (shown to the organizer)…"
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
              />
              <div className="flex gap-2">
                <button className="rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  Confirm rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-sand-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function OrganizerCard({ request }: { request: OrganizerRequest }) {
  const [rejecting, setRejecting] = useState(false);

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg font-semibold text-ink">
        {request.businessName}
      </h3>

      <div className="mt-2 space-y-1 text-sm text-ink-soft">
        <p className="flex items-center gap-2">
          <User size={14} className="text-ink-faint" />
          {request.requesterName ?? "—"}
        </p>
        {request.requesterEmail && (
          <p className="flex items-center gap-2">
            <Mail size={14} className="text-ink-faint" />
            {request.requesterEmail}
          </p>
        )}
        {request.phone && (
          <p className="flex items-center gap-2">
            <Phone size={14} className="text-ink-faint" />
            {request.phone}
          </p>
        )}
      </div>

      {request.description && (
        <p className="mt-3 rounded-xl bg-sand-100 px-3 py-2.5 text-sm text-ink-soft">
          {request.description}
        </p>
      )}

      {!rejecting ? (
        <div className="mt-4 flex gap-2">
          <form action={approveOrganizer}>
            <input type="hidden" name="requestId" value={request.id} />
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <CheckCircle2 size={16} /> Approve & make organizer
            </button>
          </form>
          <button
            onClick={() => setRejecting(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand-100"
          >
            <XCircle size={16} /> Reject
          </button>
        </div>
      ) : (
        <form action={rejectOrganizer} className="mt-4 space-y-2">
          <input type="hidden" name="requestId" value={request.id} />
          <textarea
            name="reason"
            required
            rows={2}
            placeholder="Reason for rejection (shown to the requester)…"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
          />
          <div className="flex gap-2">
            <button className="rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Confirm rejection
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-sand-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
