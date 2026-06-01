"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PageShell, { PageHeader } from "@/components/PageShell";
import { GUIDE } from "@/lib/guide";
import { useI18n } from "@/lib/i18n";

export default function GuidePage() {
  const { lang, t } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <PageHeader
          eyebrow={t("navGuide")}
          title={t("guideTitle")}
          lead={t("guideIntro")}
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {GUIDE.map((a) => (
            <Link
              key={a.slug}
              href={`/guide/${a.slug}`}
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={a.image}
                  alt={lang === "ar" ? a.titleAr : a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-xs text-ink-faint">
                  {a.readMins} min
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-ink">
                  {lang === "ar" ? a.titleAr : a.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                  {lang === "ar" ? a.excerptAr : a.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
                  {t("readMore")} <Arrow size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
