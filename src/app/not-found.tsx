"use client";

import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { SunMark } from "@/components/Logo";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <PageShell>
      <section className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <div className="relative mx-auto mb-6 w-fit">
            <SunMark className="float-slow mx-auto h-20 w-20" />
          </div>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-terracotta">
            404
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t("notFoundTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            {t("notFoundBody")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-primary">
              <Home size={18} /> {t("backHome")}
            </Link>
            <Link href="/events" className="btn-ghost">
              <Compass size={18} /> {t("browseEvents")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
