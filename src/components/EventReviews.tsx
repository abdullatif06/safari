"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/useUser";
import { useI18n } from "@/lib/i18n";

interface ReviewRow {
  id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

/** Reviews block on the event detail page: average, list, and the user's own review form. */
export default function EventReviews({ eventId }: { eventId: string }) {
  const user = useUser();
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id,user_id,rating,body,created_at,profiles(full_name)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setReviews((data as unknown as ReviewRow[]) ?? []);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

  // Prefill the form when editing an existing review.
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setBody(myReview.body);
    }
  }, [myReview]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("reviews").upsert(
      { user_id: user.id, event_id: eventId, rating, body: body.trim() },
      { onConflict: "user_id,event_id" },
    );
    setSaving(false);
    await load();
  }

  async function remove() {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);
    setBody("");
    setRating(5);
    await load();
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-display text-2xl font-semibold">{t("reviewsTitle")}</h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-1 text-ink-soft">
            <Star size={18} className="fill-gold text-gold" />
            <span className="font-semibold text-ink">{avg.toFixed(1)}</span>
            <span className="text-sm">({reviews.length})</span>
          </span>
        )}
      </div>

      {/* Your review form */}
      {user ? (
        <form
          onSubmit={submit}
          className="mb-8 rounded-2xl border border-line bg-white p-5 shadow-soft"
        >
          <h3 className="mb-3 font-display text-lg font-semibold">
            {myReview ? t("editReview") : t("writeReview")}
          </h3>
          <div className="mb-3">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              {t("yourRating")}
            </span>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={t("reviewPlaceholder")}
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-terracotta"
          />
          <div className="mt-3 flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2 text-sm">
              {t("postReview")}
            </button>
            {myReview && (
              <button
                type="button"
                onClick={remove}
                className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-terracotta"
              >
                <Trash2 size={15} /> {t("deleteReview")}
              </button>
            )}
          </div>
        </form>
      ) : (
        <Link
          href={`/login?next=/events/${eventId}`}
          className="mb-8 inline-block text-sm font-semibold text-terracotta underline-offset-4 hover:underline"
        >
          {t("signInToReview")}
        </Link>
      )}

      {/* Review list */}
      {loading ? (
        <p className="text-ink-faint">…</p>
      ) : reviews.length === 0 ? (
        <p className="text-ink-soft">{t("noReviewsYet")}</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-semibold text-ink">
                  {r.profiles?.full_name ?? "Saifi user"}
                </span>
                <Stars value={r.rating} />
              </div>
              {r.body && <p className="text-sm text-ink-soft">{r.body}</p>}
              <p className="mt-2 text-xs text-ink-faint">
                {new Date(r.created_at).toLocaleDateString(
                  lang === "ar" ? "ar-JO" : "en-GB",
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
        >
          <Star
            size={26}
            className={
              n <= value
                ? "fill-gold text-gold"
                : "text-line transition-colors hover:text-gold/50"
            }
          />
        </button>
      ))}
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          className={n <= value ? "fill-gold text-gold" : "text-line"}
        />
      ))}
    </div>
  );
}
