"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LucideIcon } from "lucide-react";
import { type Place, PLACE_CATEGORY_META } from "@/lib/places-types";
import { useI18n } from "@/lib/i18n";

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

export default function PlaceMap({
  places,
  className = "h-[360px]",
  zoom = 13,
}: {
  places: Place[];
  className?: string;
  zoom?: number;
}) {
  const { lang } = useI18n();
  const center: [number, number] =
    places.length > 0 ? [places[0].lat, places[0].lng] : [31.95, 35.92];

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border border-line ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {places.map((p) => {
          const cat = PLACE_CATEGORY_META[p.category];
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={pinIcon(cat.color, cat.icon)}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <p className="font-display text-sm font-semibold text-ink">
                    {lang === "ar" ? p.nameAr : p.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {lang === "ar" ? p.areaAr : p.area}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
