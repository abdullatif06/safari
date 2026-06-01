import Link from "next/link";

/**
 * Saifi wordmark. We typeset the text in the real brand fonts (rather than
 * using the AI logo image) so it stays crisp and the Arabic renders correctly.
 * The sun mark is a small inline SVG.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <SunMark className="h-8 w-8 transition-transform duration-300 group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          Saifi
        </span>
        <span className="font-arabic text-[11px] text-ink-soft">صيفي</span>
      </span>
    </Link>
  );
}

export function SunMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="24" cy="24" r="9" fill="#D2603A" />
      <path
        d="M24 31a7 7 0 0 0 0-14"
        stroke="#E0A23B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        // Round to a fixed precision so the server- and client-rendered SVG
        // strings match exactly (avoids a float-precision hydration mismatch).
        const r = (n: number) => Number(n.toFixed(3));
        const x1 = r(24 + Math.cos(a) * 14);
        const y1 = r(24 + Math.sin(a) * 14);
        const x2 = r(24 + Math.cos(a) * 19);
        const y2 = r(24 + Math.sin(a) * 19);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D2603A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
