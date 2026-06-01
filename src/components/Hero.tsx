"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Sparkles, Heart, Map } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  function search(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/events?q=${encodeURIComponent(query)}` : "/events");
  }

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background video (full-bleed), poster fallback to hero.jpg */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/55" />
      </div>

      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[88vh] sm:px-6 sm:py-28">
        <div className="mx-auto w-full max-w-4xl">
          {/* Location chip */}
          <span className="hero-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur sm:mb-6 sm:px-4 sm:text-sm [animation-delay:0ms]">
            <MapPin size={14} className="text-gold" />
            <span>{t("heroLocation")}</span>
          </span>

          <h1 className="font-heavy uppercase leading-[0.98] tracking-tight text-white sm:leading-[0.95]">
            <span className="hero-reveal block text-[2.5rem] sm:text-7xl lg:text-8xl [animation-delay:80ms]">
              {t("heroTitle")}
            </span>
            <span className="hero-reveal block text-[2.5rem] text-terracotta-soft sm:text-7xl lg:text-8xl [animation-delay:200ms]">
              {t("heroTitleAccent")}
            </span>
          </h1>

          <p className="hero-reveal mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-7 sm:text-lg [animation-delay:420ms]">
            {t("heroSubtitle")}
          </p>

          {/* Glassy frosted search — stacks on mobile, inline pill on sm+ */}
          <form
            onSubmit={search}
            className="hero-reveal group mx-auto mt-7 flex w-full max-w-xl flex-col gap-2 rounded-3xl border border-white/20 bg-white/10 p-2 shadow-lift backdrop-blur-md transition-all duration-300 focus-within:border-terracotta-soft focus-within:bg-white/15 focus-within:shadow-[0_0_0_4px_rgba(210,96,58,0.25)] hover:bg-white/15 sm:mt-9 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-1.5 [animation-delay:520ms]"
          >
            <div className="flex flex-1 items-center gap-2">
              <Search size={18} className="ms-3 shrink-0 text-white/70 sm:ms-4" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "ابحث عن فعالية أو مدينة…"
                    : "Search events or cities…"
                }
                className="w-full flex-1 bg-transparent px-1 py-2.5 text-white outline-none placeholder:text-white/55 sm:px-2"
              />
            </div>
            <button type="submit" className="btn-primary justify-center !px-6 !py-2.5">
              {t("exploreEvents")}
            </button>
          </form>

          {/* Trust badges — confident product claims, no fake counts */}
          <div className="hero-reveal mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-11 sm:gap-4 [animation-delay:620ms]">
            <TrustBadge
              icon={<Heart size={16} className="text-terracotta-soft" />}
              title={t("trustFree")}
              sub={t("trustFreeSub")}
            />
            <TrustBadge
              icon={<Map size={16} className="text-teal" />}
              title={t("trustNationwide")}
              sub={t("trustNationwideSub")}
            />
            <TrustBadge
              icon={<Sparkles size={16} className="text-gold" />}
              title={t("trustCurated")}
              sub={t("trustCuratedSub")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
        {icon}
      </span>
      <div className="text-start">
        <p className="text-sm font-semibold leading-tight text-white">{title}</p>
        <p className="text-xs leading-tight text-white/65">{sub}</p>
      </div>
    </div>
  );
}
