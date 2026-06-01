"use client";

import Link from "next/link";
import Image from "next/image";
import { HandHeart, Users, MapPin } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  const values = [
    { Icon: HandHeart, title: t("aboutValue1"), body: t("aboutValue1Body") },
    { Icon: Users, title: t("aboutValue2"), body: t("aboutValue2Body") },
    { Icon: MapPin, title: t("aboutValue3"), body: t("aboutValue3Body") },
  ];

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <span className="eyebrow mb-3">{t("navAbout")}</span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {t("aboutTitle")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {t("aboutLead")}
        </p>

        <div className="relative mt-12 aspect-[16/9] max-h-[520px] overflow-hidden rounded-3xl shadow-soft">
          <Image
            src="/images/lifestyle-2.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {t("aboutWhyTitle")}
          </h2>
          <p className="text-lg leading-relaxed text-ink-soft">
            {t("aboutWhyBody")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
                <v.Icon size={24} />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                {v.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-sand-100 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {t("submitTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            {t("submitIntro")}
          </p>
          <Link href="/submit" className="btn-primary mt-6">
            {t("submitEvent")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
