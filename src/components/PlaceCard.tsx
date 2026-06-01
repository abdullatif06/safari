"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import {
  type Place,
  PLACE_CATEGORY_META,
  placeImage,
  priceLabel,
} from "@/lib/places-types";
import { useI18n } from "@/lib/i18n";
import ShareButton from "./ShareButton";

export default function PlaceCard({ place }: { place: Place }) {
  const { lang, t } = useI18n();
  const cat = PLACE_CATEGORY_META[place.category];
  const Icon = cat.icon;
  const price = priceLabel(place.priceLevel);
  const shareSide = lang === "ar" ? "left-3" : "right-3";

  return (
    <Link
      href={`/places/${place.id}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      {/* Cover photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={place.imageUrl ?? placeImage(place.id)}
          alt={lang === "ar" ? place.nameAr : place.name}
          unoptimized={!!place.imageUrl}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {price && (
          <span className="absolute top-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
            {price}
          </span>
        )}
        <div className={`absolute top-3 ${shareSide}`}>
          <ShareButton
            url={`/places/${place.id}`}
            title={lang === "ar" ? place.nameAr : place.name}
            variant="icon"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
          >
            <Icon size={13} /> {lang === "ar" ? cat.labelAr : cat.label}
          </span>
          {place.reviewCount > 0 ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-ink">
              <Star size={13} className="fill-gold text-gold" />
              {place.rating.toFixed(1)}
              <span className="font-normal text-ink-faint">({place.reviewCount})</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-ink-faint">{t("noRatingYet")}</span>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {lang === "ar" ? place.nameAr : place.name}
        </h3>

        <span className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
          <MapPin size={15} className="text-ink-faint" />
          {lang === "ar" ? place.areaAr : place.area}
        </span>
      </div>
    </Link>
  );
}
