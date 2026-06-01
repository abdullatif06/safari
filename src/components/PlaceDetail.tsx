"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  ExternalLink,
  Tag,
} from "lucide-react";
import {
  type Place,
  PLACE_CATEGORY_META,
  placeImage,
  priceLabel,
} from "@/lib/places-types";
import { PLACES } from "@/lib/places";
import { useI18n } from "@/lib/i18n";
import PageShell from "./PageShell";
import PlaceCard from "./PlaceCard";
import ShareButton from "./ShareButton";

const PlaceMap = dynamic(() => import("./PlaceMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[360px] place-items-center rounded-3xl border border-line bg-sand-100 text-ink-faint">
      Loading map…
    </div>
  ),
});

/** Read-only star row, 0–5 with halves rounded to nearest. */
function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={n <= rounded ? "fill-gold text-gold" : "text-ink-faint"}
        />
      ))}
    </span>
  );
}

export default function PlaceDetail({ place }: { place: Place }) {
  const { lang, t } = useI18n();
  const cat = PLACE_CATEGORY_META[place.category];
  const Icon = cat.icon;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  const price = priceLabel(place.priceLevel);

  const similar = PLACES.filter(
    (p) => p.category === place.category && p.id !== place.id,
  ).slice(0, 3);

  return (
    <PageShell>
      <article className="w-full px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/places"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <Back size={16} /> {t("backToPlaces")}
        </Link>

        {/* Photo banner */}
        <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-3xl">
          <Image
            src={place.imageUrl ?? placeImage(place.id)}
            alt={lang === "ar" ? place.nameAr : place.name}
            fill
            priority
            unoptimized={!!place.imageUrl}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
              >
                <Icon size={14} /> {lang === "ar" ? cat.labelAr : cat.label}
              </span>
              {price && (
                <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-bold text-ink">
                  {price}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {lang === "ar" ? place.nameAr : place.name}
            </h1>

            {/* Rating summary */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Stars rating={place.rating} />
              {place.reviewCount > 0 ? (
                <span className="font-semibold text-ink">
                  {place.rating.toFixed(1)}
                  <span className="ms-1 font-normal text-ink-soft">
                    · {place.reviewCount} {t("reviewsTitle")}
                  </span>
                </span>
              ) : (
                <span className="text-ink-soft">{t("noReviewsYet")}</span>
              )}
            </div>

            <h2 className="mt-8 mb-2 font-display text-lg font-semibold">
              {t("aboutThisPlace")}
            </h2>
            <p className="text-base leading-relaxed text-ink-soft">
              {lang === "ar" ? place.descriptionAr : place.description}
            </p>

            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-semibold">
                {t("whereToFind")}
              </h2>
              <PlaceMap places={[place]} className="h-[360px]" zoom={14} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="card p-5">
              <h3 className="eyebrow mb-3">{t("whereToFind")}</h3>
              <div className="space-y-2.5 text-sm text-ink">
                <p className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" />
                  <span>
                    {lang === "ar" ? place.areaAr : place.area}
                    <br />
                    <span className="text-ink-soft">
                      {lang === "ar" ? place.addressAr : place.address}
                    </span>
                    {place.locationUrl && (
                      <a
                        href={place.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-terracotta underline-offset-4 hover:underline"
                      >
                        <ExternalLink size={12} />
                        {t("getDirections")}
                      </a>
                    )}
                  </span>
                </p>
                {price && (
                  <p className="flex items-center gap-2.5">
                    <Tag size={16} className="shrink-0 text-terracotta" />
                    <span>
                      {t("priceLevelLabel")}: <span className="font-semibold">{price}</span>
                    </span>
                  </p>
                )}
              </div>
            </div>

            {place.submittedBy && (
              <div className="card p-5 text-sm">
                <span className="text-ink-soft">{t("addedBy")}</span>
                <p className="mt-1 font-semibold text-ink">{place.submittedBy}</p>
              </div>
            )}

            {/* Share */}
            <div className="card p-5">
              <h3 className="eyebrow mb-3">{t("share")}</h3>
              <ShareButton
                url={`/places/${place.id}`}
                title={lang === "ar" ? place.nameAr : place.name}
                variant="full"
              />
            </div>
          </aside>
        </div>

        {/* Reviews — wired to the place_reviews table next phase. */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold">
            {t("reviewsTitle")}
          </h2>
          <div className="rounded-3xl border border-dashed border-line bg-sand-100/60 p-8 text-center text-ink-soft">
            {t("noReviewsYet")}
          </div>
        </section>

        {/* Similar places */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-semibold">
              {lang === "ar" ? cat.labelAr : cat.label} ·{" "}
              <span className="text-ink-soft">{t("similarPlaces")}</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
