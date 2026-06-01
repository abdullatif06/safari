"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SunMark } from "./Logo";

export default function WaterWordmark() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1 water level
  const [sunIn, setSunIn] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress: 0 when section top hits viewport top,
        // 1 when section bottom reaches viewport bottom.
        const scrollable = rect.height - vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
        const p = scrollable > 0 ? scrolled / scrollable : 0;
        setProgress(p);
        if (p > 0.15) setSunIn(true);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Water rises to ~92% of the stage at full progress.
  const waterPct = progress * 92;
  // White text is revealed from the bottom up to the waterline.
  const submergedClip = `inset(${100 - waterPct}% 0 0 0)`;

  return (
    <section ref={trackRef} className="relative h-[220vh] bg-sand-100">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Rising water */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{ height: `${waterPct}%` }}
        >
          {/* Animated wave surface sitting on top of the water body */}
          <div className="absolute -top-[34px] left-0 h-9 w-[200%] wave-drift">
            <svg
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z"
                fill="#1E8C7A"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          {/* Water body — teal → deeper teal gradient */}
          <div className="h-full w-full bg-gradient-to-b from-teal to-[#136b5e]" />
          {/* Soft shimmer line at the surface */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
        </div>

        {/* Wordmark + tagline */}
        <div className="relative z-10 px-4 text-center">
          <div
            className={`sun-pop mx-auto mb-3 w-16 sm:w-20 ${sunIn ? "in" : ""}`}
          >
            <SunMark className="h-full w-full" />
          </div>

          {/* Base (colored) wordmark */}
          <div className="relative">
            <h2 className="bg-gradient-to-r from-terracotta via-clay to-terracotta bg-clip-text text-[20vw] font-heavy uppercase leading-[0.9] tracking-tight text-transparent drop-shadow-sm sm:text-[16vw]">
              Saifi
            </h2>
            {/* White copy, revealed only where submerged */}
            <h2
              aria-hidden="true"
              className="absolute inset-0 text-[20vw] font-heavy uppercase leading-[0.9] tracking-tight text-white sm:text-[16vw]"
              style={{ clipPath: submergedClip }}
            >
              Saifi
            </h2>
          </div>

          {/* Arabic — base + submerged white copy */}
          <div className="relative mt-1">
            <p className="font-arabic text-4xl font-bold text-ink sm:text-6xl">
              صيفي
            </p>
            <p
              aria-hidden="true"
              className="absolute inset-0 font-arabic text-4xl font-bold text-white sm:text-6xl"
              style={{ clipPath: submergedClip }}
            >
              صيفي
            </p>
          </div>

          <div className="relative mx-auto mt-4 max-w-md">
            <p className="text-sm text-ink-soft">{t("footerNote")}</p>
            <p
              aria-hidden="true"
              className="absolute inset-0 text-sm text-white/90"
              style={{ clipPath: submergedClip }}
            >
              {t("footerNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
