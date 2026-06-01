"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Star, PartyPopper, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { EVENTS } from "@/lib/events";
import { CITIES } from "@/lib/cities";
import { Category, CATEGORY_META } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import EventCard from "./EventCard";

// Leaflet must not run during SSR.
const EventsMap = dynamic(() => import("./EventsMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-sand-100 text-ink-faint">
      Loading map…
    </div>
  ),
});

const CATEGORIES: Category[] = ["music", "cultural", "sports", "food"];

/** Reveal helper — flips to true the first time the element scrolls into view. */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function SectionHead({
  eyebrow,
  title,
  sub,
  href,
  cta,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  href?: string;
  cta?: string;
}) {
  const { lang } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
        {sub && <p className="mt-3 text-lg leading-relaxed text-ink-soft">{sub}</p>}
      </div>
      {href && cta && (
        <Link
          href={href}
          className="link-underline inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
          {cta} <Arrow size={15} />
        </Link>
      )}
    </div>
  );
}

export function CategoryStrip() {
  const { lang, t } = useI18n();
  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHead eyebrow="Saifi" title={t("browseByCategory")} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const cat = CATEGORY_META[c];
          const Icon = cat.icon;
          return (
            <Link
              key={c}
              href={`/events?cat=${c}`}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft"
            >
              <Image
                src={cat.image}
                alt={lang === "ar" ? cat.labelAr : cat.label}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 flex items-center gap-2 p-4">
                <Icon size={20} className="text-white" />
                <span className="font-display text-xl font-semibold text-white">
                  {lang === "ar" ? cat.labelAr : cat.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * "This Weekend" rail — the section that keeps the homepage feeling alive.
 * Prefers events in the next 7 days; if none fall in that window (e.g. the
 * sample data is seasonal), it gracefully falls back to the soonest upcoming
 * events so the section is never empty.
 */
export function ThisWeekend() {
  const { t } = useI18n();

  const { events, isWeekend } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekOut = new Date(today);
    weekOut.setDate(weekOut.getDate() + 7);

    const upcoming = [...EVENTS]
      .filter((e) => new Date(e.date + "T00:00:00") >= today)
      .sort((a, b) => a.date.localeCompare(b.date));

    const thisWeek = upcoming.filter(
      (e) => new Date(e.date + "T00:00:00") <= weekOut,
    );

    // If the data is seasonal and nothing is truly "this week", fall back to
    // the soonest events so the rail still shows something compelling.
    if (thisWeek.length >= 3) return { events: thisWeek.slice(0, 6), isWeekend: true };
    if (upcoming.length > 0) return { events: upcoming.slice(0, 6), isWeekend: false };
    // Last resort (all events are in the past): show the most recent.
    return {
      events: [...EVENTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
      isWeekend: false,
    };
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="bg-sand-100">
      <div className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHead
          eyebrow={isWeekend ? t("thisWeekendEyebrow") : t("featuredThisWeek")}
          title={isWeekend ? t("thisWeekend") : t("upNext")}
          sub={isWeekend ? t("thisWeekendSub") : t("upNextSub")}
          href="/events"
          cta={t("viewAll")}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <EventCard key={e.id} event={e} featured={i === 0 && events.length > 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedEvents() {
  const { t } = useI18n();
  const featured = useMemo(
    () =>
      [...EVENTS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3),
    [],
  );
  return (
    <section className="bg-sand-100">
      <div className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHead
          eyebrow={t("featuredThisWeek")}
          title={t("featuredThisWeek")}
          sub={t("featuredSub")}
          href="/events"
          cta={t("viewAll")}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CityStrip() {
  const { lang, t } = useI18n();
  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHead
        eyebrow={t("navCities")}
        title={t("browseByCity")}
        sub={t("browseByCitySub")}
        href="/cities"
        cta={t("viewAll")}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/cities/${c.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
          >
            <Image
              src={c.image}
              alt={lang === "ar" ? c.nameAr : c.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <span className="absolute bottom-3 left-4 font-display text-lg font-semibold text-white">
              {lang === "ar" ? c.nameAr : c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  const { ref, inView } = useInView(0.25);
  const steps = [
    { n: "01", Icon: Search, title: t("step1Title"), body: t("step1Body") },
    { n: "02", Icon: Star, title: t("step2Title"), body: t("step2Body") },
    { n: "03", Icon: PartyPopper, title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section className="bg-sand-100">
      <div className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHead eyebrow="Saifi" title={t("howItWorks")} />

        <div ref={ref} className="relative mx-auto max-w-6xl">
          {/* Connecting line — horizontal on desktop */}
          <div className="pointer-events-none absolute inset-x-[16%] top-9 hidden h-0.5 md:block">
            <div className="h-full w-full bg-line" />
            <div
              className={`timeline-line timeline-line-x absolute inset-0 h-full bg-gradient-to-r from-terracotta to-gold ${
                inView ? "in" : ""
              }`}
            />
          </div>
          {/* Connecting line — vertical on mobile */}
          <div className="pointer-events-none absolute bottom-12 left-9 top-12 w-0.5 md:hidden">
            <div className="h-full w-full bg-line" />
            <div
              className={`timeline-line timeline-line-y absolute inset-0 w-full bg-gradient-to-b from-terracotta to-gold ${
                inView ? "in" : ""
              }`}
            />
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <div
                key={s.n}
                style={{ transitionDelay: `${i * 160}ms` }}
                className={`panel-reveal ${inView ? "in" : ""} relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center`}
              >
                {/* Numbered node */}
                <div className="relative z-10 shrink-0">
                  <span className="grid h-[72px] w-[72px] place-items-center rounded-2xl border-4 border-sand-100 bg-terracotta text-white shadow-soft">
                    <s.Icon size={28} />
                  </span>
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>

                <div className="md:mt-5">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MapTeaser() {
  const { lang, t } = useI18n();
  const eventCount = EVENTS.length;
  const cityCount = new Set(EVENTS.map((e) => e.city)).size;

  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-line shadow-soft">
        {/* Live interactive map */}
        <EventsMap
          events={EVENTS}
          className="h-[78vh] min-h-[480px] !rounded-none !border-0"
          zoom={7}
        />

        {/* Floating info panel — pointer-events only on the panel itself */}
        <div
          className={`pointer-events-none absolute inset-0 z-[1000] flex items-end p-4 sm:items-center sm:p-8 lg:p-12 ${
            lang === "ar" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/40 bg-sand-50/85 p-6 shadow-lift backdrop-blur-md sm:p-8">
            <span className="eyebrow mb-3">{t("navMap")}</span>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              {t("seeOnMap")}
            </h2>
            <p className="mt-2 text-ink-soft">{t("seeOnMapSub")}</p>

            {/* Live counts */}
            <div className="mt-5 flex gap-6">
              <div>
                <p className="font-display text-2xl font-semibold text-terracotta">
                  {eventCount}
                </p>
                <p className="text-xs text-ink-soft">{t("eventsFound")}</p>
              </div>
              <div className="border-s border-line ps-6">
                <p className="font-display text-2xl font-semibold text-terracotta">
                  {cityCount}
                </p>
                <p className="text-xs text-ink-soft">{t("navCities")}</p>
              </div>
            </div>

            <Link href="/map" className="btn-primary mt-6 w-fit">
              <MapPin size={17} />
              {t("openMap")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterCTA() {
  const { t } = useI18n();
  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <Image
            src="/images/lifestyle-1.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative px-6 py-14 text-center sm:px-12">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">{t("ctaBody")}</p>
          <form
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="flex-1 rounded-full border border-white/20 bg-white/95 px-5 py-3 text-ink outline-none placeholder:text-ink-faint focus:border-terracotta"
            />
            <button className="btn-primary">{t("subscribe")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
