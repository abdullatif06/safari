"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useActivity } from "@/lib/activity";
import { useI18n } from "@/lib/i18n";

/**
 * Save (♥) toggle. `icon` variant is the floating heart on event cards;
 * `full` variant is the wide button in the detail sidebar.
 * Logged-out users are sent to /login.
 */
export default function SaveButton({
  eventId,
  variant = "full",
}: {
  eventId: string;
  variant?: "icon" | "full";
}) {
  const { isLoggedIn, savedIds, toggleSave } = useActivity();
  const { t } = useI18n();
  const router = useRouter();
  const isSaved = savedIds.has(eventId);

  function handleClick(e: React.MouseEvent) {
    // On cards the button sits inside a <Link>; don't navigate.
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    toggleSave(eventId);
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label={isSaved ? t("saved") : t("save")}
        aria-pressed={isSaved}
        className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition-transform hover:scale-110 active:scale-95"
      >
        <Heart
          size={18}
          className={isSaved ? "fill-terracotta text-terracotta" : "text-ink"}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={isSaved}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition-colors ${
        isSaved
          ? "border-terracotta/40 bg-terracotta/10 text-terracotta"
          : "border-line bg-white text-ink hover:bg-sand-100"
      }`}
    >
      <Heart size={17} className={isSaved ? "fill-terracotta" : ""} />
      {isSaved ? t("saved") : t("save")}
    </button>
  );
}
