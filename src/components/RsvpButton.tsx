"use client";

import { useRouter } from "next/navigation";
import { Check, CalendarPlus } from "lucide-react";
import { useActivity } from "@/lib/activity";
import { useI18n } from "@/lib/i18n";

/**
 * "I'm going" RSVP toggle for the event detail page. Creates/removes the
 * user's RSVP (which becomes their ticket). Logged-out users go to /login.
 */
export default function RsvpButton({
  eventId,
  eventTitle,
  eventDate,
}: {
  eventId: string;
  eventTitle?: string;
  eventDate?: string;
}) {
  const { isLoggedIn, goingIds, toggleRsvp } = useActivity();
  const { t } = useI18n();
  const router = useRouter();
  const isGoing = goingIds.has(eventId);

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    toggleRsvp(eventId, { title: eventTitle, date: eventDate });
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={isGoing}
      className={
        isGoing
          ? "flex w-full items-center justify-center gap-2 rounded-xl border border-teal/40 bg-teal/10 px-4 py-2.5 font-semibold text-teal transition-colors hover:bg-teal/20"
          : "btn-primary w-full"
      }
    >
      {isGoing ? (
        <>
          <Check size={18} /> {t("going")}
        </>
      ) : (
        <>
          <CalendarPlus size={18} /> {t("imGoing")}
        </>
      )}
    </button>
  );
}
