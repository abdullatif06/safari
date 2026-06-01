"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { EventItem, CATEGORY_META, COST_META, eventImage } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";

export default function EventCard({
  event,
  featured = false,
}: {
  event: EventItem;
  featured?: boolean;
}) {
  const { lang, t } = useI18n();
  const cat = CATEGORY_META[event.category];
  const Icon = cat.icon;
  const isFree = event.cost === "free" || event.cost === "donation";
  const side = lang === "ar" ? "left-3" : "right-3";
  const saveSide = lang === "ar" ? "right-3" : "left-3";

  const costBadge = (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        isFree ? "bg-teal text-white" : "bg-white/90 text-ink backdrop-blur"
      }`}
    >
      {event.cost === "paid"
        ? `${event.price} JOD`
        : COST_META[event.cost][lang === "ar" ? "labelAr" : "label"]}
    </span>
  );

  const categoryChip = (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
    >
      <Icon size={13} /> {lang === "ar" ? cat.labelAr : cat.label}
    </span>
  );

  // ── Featured layout — spans the full grid row, magazine hero style ─────────
  if (featured) {
    const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
    return (
      <Link
        href={`/events/${event.id}`}
        className="card card-hover group relative col-span-full grid overflow-hidden sm:grid-cols-2 lg:col-span-2"
      >
        {/* Cover photo */}
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[320px]">
          <Image
            src={event.imageUrl ?? eventImage(event.id)}
            alt={lang === "ar" ? event.titleAr : event.title}
            unoptimized={!!event.imageUrl}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent sm:bg-gradient-to-r" />
          <span className={`absolute top-4 ${side}`}>{costBadge}</span>
          <div className={`absolute top-4 ${saveSide} flex flex-col gap-2`}>
            <SaveButton eventId={event.id} variant="icon" />
            <ShareButton
              url={`/events/${event.id}`}
              title={lang === "ar" ? event.titleAr : event.title}
              variant="icon"
            />
          </div>
        </div>

        {/* Text body */}
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            {categoryChip}
            <span className="eyebrow !text-ink-faint">{t("featuredEvent")}</span>
          </div>

          <h3 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {lang === "ar" ? event.titleAr : event.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft sm:text-base">
            {lang === "ar" ? event.descriptionAr : event.description}
          </p>

          <div className="mt-1 flex flex-col gap-2 text-sm text-ink-soft">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-terracotta" />
              {formatDate(event.date, lang)} · {formatTime(event.time, lang)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-terracotta" />
              {lang === "ar" ? event.venueAr : event.venue},{" "}
              {lang === "ar" ? event.cityAr : event.city}
            </span>
          </div>

          <span className="link-underline mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-terracotta">
            {t("viewDetails")} <Arrow size={15} />
          </span>
        </div>
      </Link>
    );
  }

  // ── Standard card ──────────────────────────────────────────────────────────
  return (
    <Link
      href={`/events/${event.id}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      {/* Cover photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.imageUrl ?? eventImage(event.id)}
          alt={lang === "ar" ? event.titleAr : event.title}
          unoptimized={!!event.imageUrl}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className={`absolute top-3 ${side}`}>{costBadge}</span>
        <div className={`absolute top-3 ${saveSide} flex flex-col gap-2`}>
          <SaveButton eventId={event.id} variant="icon" />
          <ShareButton
            url={`/events/${event.id}`}
            title={lang === "ar" ? event.titleAr : event.title}
            variant="icon"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2">{categoryChip}</span>

        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {lang === "ar" ? event.titleAr : event.title}
        </h3>

        <div className="mt-3 flex flex-col gap-1.5 text-sm text-ink-soft">
          <span className="flex items-center gap-2">
            <Calendar size={15} className="text-ink-faint" />
            {formatDate(event.date, lang)} · {formatTime(event.time, lang)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-ink-faint" />
            {lang === "ar" ? event.cityAr : event.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
