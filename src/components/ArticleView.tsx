"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageShell from "./PageShell";
import { GuideArticle } from "@/lib/guide";
import { useI18n } from "@/lib/i18n";

export default function ArticleView({ article }: { article: GuideArticle }) {
  const { lang, t } = useI18n();
  const body = lang === "ar" ? article.bodyAr : article.body;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <Link
          href="/guide"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <Back size={16} /> {t("guideTitle")}
        </Link>

        <span className="font-mono text-xs text-ink-faint">
          {article.readMins} min · {t("navGuide")}
        </span>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {lang === "ar" ? article.titleAr : article.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
          <Image
            src={article.image}
            alt={lang === "ar" ? article.titleAr : article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-6">
          {body.map((p, i) => (
            <p
              key={i}
              className={`text-lg leading-relaxed text-ink/90 ${
                i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-terracotta" : ""
              }`}
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-sand-100 p-8 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            {t("ctaTitle")}
          </p>
          <Link href="/events" className="btn-primary mt-4">
            {t("exploreEvents")}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
