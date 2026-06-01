"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PageShell, { PageHeader } from "@/components/PageShell";
import { CITIES } from "@/lib/cities";
import { EVENTS } from "@/lib/events";
import { useI18n } from "@/lib/i18n";

export default function CitiesPage() {
  const { lang, t } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <PageHeader
          eyebrow={t("navCities")}
          title={t("citiesTitle")}
          lead={t("citiesIntro")}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => {
            const count = EVENTS.filter((e) => e.city === c.name).length;
            return (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="card card-hover group overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={lang === "ar" ? c.nameAr : c.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 font-display text-2xl font-semibold text-white">
                    {lang === "ar" ? c.nameAr : c.name}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {lang === "ar" ? c.blurbAr : c.blurb}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-terracotta">
                    {count} {t("eventsFound")} <Arrow size={13} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
