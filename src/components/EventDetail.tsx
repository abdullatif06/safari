"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  Ticket,
  ExternalLink,
} from "lucide-react";
import { EventItem, CATEGORY_META, COST_META, eventImage } from "@/lib/types";
import { EVENTS } from "@/lib/events";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import PageShell from "./PageShell";
import EventCard from "./EventCard";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";
import RsvpButton from "./RsvpButton";
import EventReviews from "./EventReviews";

const EventsMap = dynamic(() => import("./EventsMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[360px] place-items-center rounded-3xl border border-line bg-sand-100 text-ink-faint">
      Loading map…
    </div>
  ),
});

function AccessRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        ok ? "text-ink" : "text-ink-faint line-through"
      }`}
    >
      {ok ? (
        <Check size={16} className="text-teal" />
      ) : (
        <X size={16} />
      )}
      {label}
    </div>
  );
}

export default function EventDetail({ event }: { event: EventItem }) {
  const { lang, t } = useI18n();
  const cat = CATEGORY_META[event.category];
  const Icon = cat.icon;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  const isFree = event.cost === "free" || event.cost === "donation";

  const similar = EVENTS.filter(
    (e) => e.category === event.category && e.id !== event.id,
  ).slice(0, 3);

  return (
    <PageShell>
      <article className="w-full px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <Back size={16} /> {t("backToEvents")}
        </Link>

        {/* Photo banner */}
        <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-3xl">
          <Image
            src={event.imageUrl ?? eventImage(event.id)}
            alt={lang === "ar" ? event.titleAr : event.title}
            fill
            priority
            unoptimized={!!event.imageUrl}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
              >
                <Icon size={14} /> {lang === "ar" ? cat.labelAr : cat.label}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isFree ? "bg-teal text-white" : "bg-sand-100 text-ink"
                }`}
              >
                {event.cost === "paid"
                  ? `${event.price} JOD`
                  : COST_META[event.cost][lang === "ar" ? "labelAr" : "label"]}
              </span>
            </div>

            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {lang === "ar" ? event.titleAr : event.title}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              {lang === "ar" ? event.descriptionAr : event.description}
            </p>

            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-semibold">
                {t("mapTitle")}
              </h2>
              <EventsMap events={[event]} className="h-[360px]" zoom={13} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="card p-5">
              <h3 className="eyebrow mb-3">{t("whenWhere")}</h3>
              <div className="space-y-2.5 text-sm text-ink">
                <p className="flex items-start gap-2.5">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-terracotta" />
                  <span>{formatDate(event.date, lang)}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Clock size={16} className="mt-0.5 shrink-0 text-terracotta" />
                  <span>{formatTime(event.time, lang)}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" />
                  <span>
                    {lang === "ar" ? event.venueAr : event.venue}
                    <br />
                    <span className="text-ink-soft">
                      {lang === "ar" ? event.cityAr : event.city}
                    </span>
                    {event.locationUrl && (
                      <a
                        href={event.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-terracotta underline-offset-4 hover:underline"
                      >
                        <ExternalLink size={12} />
                        {lang === "ar" ? "احصل على الاتجاهات" : "Get directions"}
                      </a>
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="eyebrow mb-3">{t("accessibility")}</h3>
              <div className="space-y-2">
                <AccessRow
                  ok={event.accessibility.wheelchair}
                  label={t("wheelchair")}
                />
                <AccessRow
                  ok={event.accessibility.familyFriendly}
                  label={t("family")}
                />
                <AccessRow
                  ok={event.accessibility.signLanguage}
                  label={t("signLang")}
                />
              </div>
            </div>

            <div className="card p-5 text-sm">
              <span className="text-ink-soft">{t("organizedBy")}</span>
              <p className="mt-1 font-semibold text-ink">{event.organizer}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <RsvpButton eventId={event.id} eventTitle={event.title} eventDate={event.date} />
              <SaveButton eventId={event.id} variant="full" />
              {event.externalTicketUrl ? (
                <a
                  href={event.externalTicketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-sand-100"
                >
                  <Ticket size={17} /> {t("getTickets")}
                  <ExternalLink size={14} className="text-ink-faint" />
                </a>
              ) : (
                <p className="pt-1 text-center text-xs text-ink-faint">
                  {t("ticketAtVenue")}
                </p>
              )}
            </div>

            {/* Share — WhatsApp-first, the way Jordan shares */}
            <div className="card p-5">
              <h3 className="eyebrow mb-3">{t("share")}</h3>
              <ShareButton
                url={`/events/${event.id}`}
                title={lang === "ar" ? event.titleAr : event.title}
                variant="full"
              />
            </div>
          </aside>
        </div>

        {/* Reviews */}
        <EventReviews eventId={event.id} />

        {/* Similar events */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-semibold">
              {lang === "ar" ? cat.labelAr : cat.label} ·{" "}
              <span className="text-ink-soft">{t("featuredThisWeek")}</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
