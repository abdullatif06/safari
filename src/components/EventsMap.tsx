"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { EventItem, CATEGORY_META } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";

// Colorful per-category teardrop pin with a white Lucide icon inside.
function pinIcon(color: string, Icon: LucideIcon) {
  const iconSvg = renderToStaticMarkup(
    createElement(Icon, { size: 18, color: "#fff", strokeWidth: 2.4 }),
  );
  return L.divIcon({
    className: "saifi-pin",
    html: `
      <div style="
        width:38px;height:38px;border-radius:50% 50% 50% 0;
        background:${color};transform:rotate(-45deg);
        display:grid;place-items:center;
        box-shadow:0 4px 14px ${color}99, 0 0 0 3px rgba(255,255,255,0.6);
      ">
        <span style="transform:rotate(45deg);display:grid;place-items:center;">${iconSvg}</span>
      </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36],
  });
}

export default function EventsMap({
  events,
  className = "h-[480px]",
  zoom = 7,
}: {
  events: EventItem[];
  className?: string;
  zoom?: number;
}) {
  const { lang } = useI18n();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border border-line ${className}`}
    >
      <MapContainer
        center={[31.4, 36.0]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Colorful illustrated-style tiles (CARTO Voyager) */}
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {events.map((e) => {
          const cat = CATEGORY_META[e.category];
          return (
            <Marker
              key={e.id}
              position={[e.lat, e.lng]}
              icon={pinIcon(cat.color, cat.icon)}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <p className="font-display text-sm font-semibold text-ink">
                    {lang === "ar" ? e.titleAr : e.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {lang === "ar" ? e.cityAr : e.city} ·{" "}
                    {formatDate(e.date, lang)}
                  </p>
                  <Link
                    href={`/events/${e.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline"
                  >
                    {lang === "ar" ? "عرض التفاصيل" : "View details"}
                    <Arrow size={13} />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
