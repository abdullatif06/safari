"use client";

import Image from "next/image";

/** Deterministic warm-tone background from a name, so initials avatars are
 *  stable and on-brand rather than random. */
const TONES = [
  "bg-terracotta/15 text-terracotta",
  "bg-gold/20 text-[#9A6A12]",
  "bg-teal/15 text-teal",
  "bg-sky/20 text-[#3D6E8C]",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toneFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return TONES[sum % TONES.length];
}

/**
 * Round avatar. Shows the uploaded photo when `src` is set, otherwise a
 * colored circle with the user's initials. `size` is the diameter in px.
 */
export default function Avatar({
  src,
  name,
  size = 56,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      <span
        className={`relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-line ${className}`}
        style={{ width: size, height: size }}
      >
        {/* unoptimized: avatars come from Supabase Storage (an external host)
            and are already small + sized, so we skip next/image optimization
            rather than whitelist the host globally. */}
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          unoptimized
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-display font-semibold ${toneFor(
        name,
      )} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
