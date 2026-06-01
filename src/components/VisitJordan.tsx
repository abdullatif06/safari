"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function VisitJordan() {
  const { lang, t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // How far the section has travelled through the viewport (-1 → 1).
        const ratio = (rect.top + rect.height / 2 - vh / 2) / vh;
        setOffset(ratio);
        if (rect.top < vh * 0.75) setInView(true);
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

  const reveal = (delay: string) =>
    `panel-reveal ${inView ? "in" : ""} [transition-delay:${delay}]`;

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[90vh] items-center overflow-hidden"
    >
      {/* Parallax background — taller than the section so it can shift */}
      <div
        className="absolute inset-x-0 -top-[15%] -z-10 h-[130%] will-change-transform"
        style={{ transform: `translateY(${offset * 12}%)` }}
      >
        <Image
          src="/images/petra-hero.jpg"
          alt="The Treasury at Petra, Jordan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Warm legibility overlay — stronger on the text side */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />

      <div className="w-full px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <span className={`eyebrow mb-5 text-gold ${reveal("0ms")}`}>
            {t("visitEyebrow")}
          </span>

          <h2 className="font-heavy uppercase leading-[0.98] tracking-tight text-white">
            <span className={`block text-4xl sm:text-6xl lg:text-7xl ${reveal("100ms")}`}>
              {t("visitTitle")}
            </span>
            <span
              className={`block bg-gradient-to-r from-gold to-terracotta-soft bg-clip-text text-4xl text-transparent sm:text-6xl lg:text-7xl ${reveal(
                "220ms",
              )}`}
            >
              {t("visitTitleAccent")}
            </span>
          </h2>

          <p
            dir="rtl"
            className={`mt-4 font-arabic text-2xl font-bold text-gold sm:text-3xl ${reveal(
              "320ms",
            )}`}
          >
            {t("visitArabicLine")}
          </p>

          <p className={`mt-6 max-w-xl text-lg leading-relaxed text-white/85 ${reveal("420ms")}`}>
            {t("visitSub")}
          </p>

          <div className={`mt-9 ${reveal("540ms")}`}>
            <Link href="/events" className="btn-primary">
              {t("exploreEvents")}
              <Arrow size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <ChevronDown
          size={28}
          className="animate-bounce text-white/70"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
