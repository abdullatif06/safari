"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import WaterWordmark from "./WaterWordmark";

// Curated scenic mix from the generated set.
const LEFT = [
  "/images/event-wadi-rum-stargazing.jpg",
  "/images/event-jerash-festival.jpg",
  "/images/event-aqaba-beach-concert.jpg",
  "/images/event-amman-citadel-evenings.jpg",
  "/images/event-salt-heritage-walk.jpg",
];
const MIDDLE = [
  "/images/city-wadi-rum.jpg",
  "/images/city-jerash.jpg",
  "/images/city-aqaba.jpg",
];
const RIGHT = [
  "/images/event-madaba-mosaic-fair.jpg",
  "/images/event-amman-jazz-roof.jpg",
  "/images/event-irbid-food-fest.jpg",
  "/images/event-amman-night-cycle.jpg",
  "/images/city-amman.jpg",
];

// Thrown poster cards — positioned around the heading, fly in from off-screen.
// `show` controls responsive visibility (3 on mobile, all 6 on desktop).
const CARDS = [
  {
    src: "/images/cards/card-1.jpg",
    pos: "left-[4%] top-[16%]",
    w: "clamp(96px, 13vw, 200px)",
    tx: "-60vw",
    ty: "-30vh",
    rot: "-35deg",
    rotEnd: "-9deg",
    show: "",
  },
  {
    src: "/images/cards/card-2.jpg",
    pos: "right-[5%] top-[12%]",
    w: "clamp(96px, 13vw, 200px)",
    tx: "60vw",
    ty: "-30vh",
    rot: "32deg",
    rotEnd: "8deg",
    show: "",
  },
  {
    src: "/images/cards/card-3.jpg",
    pos: "left-[8%] bottom-[12%]",
    w: "clamp(90px, 12vw, 190px)",
    tx: "-55vw",
    ty: "35vh",
    rot: "28deg",
    rotEnd: "7deg",
    show: "hidden sm:block",
  },
  {
    src: "/images/cards/card-4.jpg",
    pos: "right-[7%] bottom-[14%]",
    w: "clamp(90px, 12vw, 190px)",
    tx: "55vw",
    ty: "35vh",
    rot: "-30deg",
    rotEnd: "-8deg",
    show: "hidden sm:block",
  },
  {
    src: "/images/cards/card-5.jpg",
    pos: "left-[16%] top-[40%]",
    w: "clamp(80px, 10vw, 160px)",
    tx: "-50vw",
    ty: "10vh",
    rot: "18deg",
    rotEnd: "-5deg",
    show: "hidden lg:block",
  },
  {
    src: "/images/cards/card-6.jpg",
    pos: "right-[16%] top-[44%]",
    w: "clamp(80px, 10vw, 160px)",
    tx: "50vw",
    ty: "10vh",
    rot: "-18deg",
    rotEnd: "6deg",
    show: "hidden lg:block",
  },
];

function Photo({ src, className }: { src: string; className: string }) {
  return (
    <figure className={`relative overflow-hidden rounded-2xl shadow-soft ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
    </figure>
  );
}

/** Reveals an element's children once it scrolls into view. */
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

export default function StickyGallery() {
  const { t } = useI18n();
  const { ref: panelRef, inView: panelIn } = useInView(0.35);
  const reveal = (delay: string) =>
    `panel-reveal ${panelIn ? "in" : ""} [transition-delay:${delay}]`;

  return (
    <section className="bg-sand-100">
      {/* Intro panel — sticky full-screen heading with thrown event cards */}
      <div className="wrapper">
        <div
          ref={panelRef}
          className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden bg-sand-100"
        >
          {/* Petra Treasury silhouette — faint, centered behind text */}
          <div className="float-slower pointer-events-none absolute left-1/2 top-1/2 h-[88%] w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
            <Image
              src="/images/jordan/petra-backdrop.png"
              alt=""
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>

          {/* Thrown event cards — fly in from off-screen and settle around the text */}
          {CARDS.map((c, i) => (
            <div
              key={c.src}
              className={`throw-card pointer-events-none absolute ${c.pos} ${c.show} ${
                panelIn ? "in" : ""
              }`}
              style={
                {
                  width: c.w,
                  transitionDelay: `${250 + i * 110}ms`,
                  "--tx": c.tx,
                  "--ty": c.ty,
                  "--rot": c.rot,
                  "--rot-end": c.rotEnd,
                } as React.CSSProperties
              }
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/5">
                <Image
                  src={c.src}
                  alt=""
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          {/* Heading — large, fills the panel, fades/rises in */}
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className={`eyebrow mb-5 justify-center ${reveal("0ms")}`}>
              {t("galleryEyebrow")}
            </span>

            <h2 className="font-heavy uppercase leading-[0.98] tracking-tight text-ink">
              <span className={`block text-5xl sm:text-7xl lg:text-8xl ${reveal("100ms")}`}>
                {t("galleryTitle")}
              </span>
              <span
                className={`block bg-gradient-to-r from-terracotta to-gold bg-clip-text text-5xl text-transparent sm:text-7xl lg:text-8xl ${reveal(
                  "220ms",
                )}`}
              >
                {t("galleryTitleAccent")}
              </span>
            </h2>

            {/* Terracotta line divider */}
            <span
              className={`mx-auto mt-7 block h-[3px] w-20 rounded-full bg-terracotta ${reveal(
                "340ms",
              )}`}
            />

            {/* Arabic line */}
            <p
              dir="rtl"
              className={`mt-5 font-arabic text-2xl font-bold text-ink-soft sm:text-3xl ${reveal(
                "440ms",
              )}`}
            >
              {t("galleryArabicLine")}
            </p>

            <p className={`mx-auto mt-6 max-w-md text-ink-soft ${reveal("560ms")}`}>
              {t("gallerySub")} 👇
            </p>
          </div>
        </div>
      </div>

      {/* Sticky-scroll gallery — 2 columns (sticky) on mobile, 3 on desktop */}
      <div className="w-full px-4 pb-4 sm:px-6">
        <div className="grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-4">
          {/* Left column — scrolls */}
          <div className="grid gap-3 md:col-span-4 md:gap-4">
            {LEFT.map((src) => (
              <Photo key={src} src={src} className="h-64 w-full sm:h-96" />
            ))}
          </div>

          {/* Middle column — sticky on ALL sizes */}
          <div className="sticky top-2 grid h-[calc(100vh-1rem)] grid-rows-3 gap-3 md:top-0 md:col-span-4 md:h-screen md:gap-4 md:py-4">
            {MIDDLE.map((src) => (
              <Photo key={src} src={src} className="h-full w-full" />
            ))}
          </div>

          {/* Right column — scrolls. Spans full width below on mobile. */}
          <div className="col-span-2 grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-1 md:gap-4">
            {RIGHT.map((src) => (
              <Photo key={src} src={src} className="h-64 w-full sm:h-96" />
            ))}
          </div>
        </div>
      </div>

      {/* Water-fill wordmark section */}
      <WaterWordmark />
    </section>
  );
}
