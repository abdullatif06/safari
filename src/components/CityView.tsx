"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageShell from "./PageShell";
import EventsList from "./EventsList";
import { EVENTS } from "@/lib/events";
import { City } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function CityView({ city }: { city: City }) {
  const { lang, t } = useI18n();
  const count = EVENTS.filter((e) => e.city === city.name).length;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <PageShell>
      {/* Hero banner */}
      <section className="relative">
        <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden">
          <Image
            src={city.image}
            alt={lang === "ar" ? city.nameAr : city.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 w-full">
            <div className="w-full px-5 pb-8 sm:px-8 lg:px-12">
              <Link
                href="/cities"
                className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
              >
                <Back size={16} /> {t("citiesTitle")}
              </Link>
              <h1 className="font-display text-4xl font-semibold text-white sm:text-6xl">
                {lang === "ar" ? city.nameAr : city.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-5 py-12 sm:px-8 lg:px-12">
        <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
          {lang === "ar" ? city.blurbAr : city.blurb}
        </p>

        <h2 className="mb-8 mt-12 font-display text-2xl font-semibold sm:text-3xl">
          {t("eventsIn")} {lang === "ar" ? city.nameAr : city.name}
        </h2>

        {count > 0 ? (
          <Suspense fallback={<div className="py-16 text-center text-ink-faint">…</div>}>
            <EventsList initialCity={city.name} showCityFilter={false} />
          </Suspense>
        ) : (
          <p className="rounded-3xl border border-dashed border-line py-16 text-center text-ink-soft">
            {t("noCityEvents")}
          </p>
        )}
      </section>
    </PageShell>
  );
}
