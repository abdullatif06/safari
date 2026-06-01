"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/** WhatsApp brand glyph (lucide has no WhatsApp icon). */
function WhatsappIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

interface ShareButtonProps {
  /** Path or absolute URL to share, e.g. "/events/jerash-festival". */
  url: string;
  /** Event title used in the share message. */
  title: string;
  /** "full" = labelled buttons (detail page); "icon" = compact circle (cards). */
  variant?: "full" | "icon";
}

/**
 * Share controls tuned for how Jordan actually shares — WhatsApp first,
 * with a copy-link fallback and the native share sheet on mobile.
 */
export default function ShareButton({ url, title, variant = "full" }: ShareButtonProps) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);

  // Build an absolute URL on the client; fall back to the raw path on SSR.
  const fullUrl =
    typeof window !== "undefined" && url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;

  const message = `${t("shareMessage")}: ${title}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${message}\n${fullUrl}`)}`;

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — silently ignore.
    }
  }

  async function nativeShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: fullUrl });
      } catch {
        // User dismissed the share sheet — no-op.
      }
    } else {
      copyLink(e);
    }
  }

  if (variant === "icon") {
    // Compact share button for event cards. Stops the parent <Link> nav.
    return (
      <button
        onClick={nativeShare}
        aria-label={t("share")}
        className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition-colors hover:bg-white"
      >
        <Share2 size={16} />
      </button>
    );
  }

  return (
    <div className="space-y-2.5">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
      >
        <WhatsappIcon size={18} />
        {t("shareWhatsapp")}
      </a>
      <button
        onClick={copyLink}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-sand-100"
      >
        {copied ? (
          <>
            <Check size={17} className="text-teal" />
            {t("linkCopied")}
          </>
        ) : (
          <>
            <Link2 size={17} />
            {t("copyLink")}
          </>
        )}
      </button>
    </div>
  );
}
