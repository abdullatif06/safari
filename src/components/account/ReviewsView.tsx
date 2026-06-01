"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import { useI18n } from "@/lib/i18n";
import type { MyReview } from "@/lib/account-db";

export default function ReviewsView({
  user,
  reviews,
}: {
  user: AccountUser;
  reviews: MyReview[];
}) {
  const { t, lang } = useI18n();

  return (
    <AccountShell user={user}>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
        {t("myReviews")}
      </h2>

      {reviews.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-16 text-center">
          <Star size={32} className="text-ink-faint" />
          <p className="text-ink-soft">{t("noReviews")}</p>
          <Link href="/events" className="btn-primary !px-5 !py-2 text-sm">
            {t("browseEvents")}
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <Link
                  href={`/events/${r.event.id}`}
                  className="font-display text-lg font-semibold text-ink underline-offset-4 hover:underline"
                >
                  {lang === "ar" ? r.event.titleAr : r.event.title}
                </Link>
                <div className="flex shrink-0 gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={15}
                      className={
                        n <= r.rating ? "fill-gold text-gold" : "text-line"
                      }
                    />
                  ))}
                </div>
              </div>
              {r.body && <p className="text-sm text-ink-soft">{r.body}</p>}
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
