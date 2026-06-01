"use client";

import { useState } from "react";
import Image from "next/image";
import { PartyPopper } from "lucide-react";
import PageShell from "@/components/PageShell";
import {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_META,
  type PlaceCategory,
} from "@/lib/places-types";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "submitting" | "done" | "error";

const PRICE_LEVELS: { value: string; label: string }[] = [
  { value: "", label: "—" },
  { value: "1", label: "$" },
  { value: "2", label: "$$" },
  { value: "3", label: "$$$" },
];

export default function SubmitPlacePage() {
  const { lang, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  // Backend (server action + places table) lands next phase. For now this
  // validates and shows the success state locally so the flow can be felt.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Simulate the round-trip; replaced by a real POST next phase.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
    e.currentTarget.reset();
  }

  const labelCls = "mb-1.5 block text-sm font-medium text-ink";
  const fieldCls =
    "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-terracotta";

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Form */}
          <div>
            <span className="eyebrow mb-3">{t("submitPlace")}</span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {t("submitPlaceTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t("submitPlaceIntro")}
            </p>

            {status === "done" ? (
              <div className="mt-8 rounded-3xl border border-teal/30 bg-teal/10 p-8 text-center">
                <PartyPopper size={40} className="mx-auto text-teal" />
                <p className="mt-3 font-display text-xl font-semibold text-ink">
                  {t("submitThanks")}
                </p>
                <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
                  {t("submitPlace")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className={labelCls}>{t("fPlaceName")} *</label>
                  <input name="name" required className={fieldCls} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{t("fCategory")} *</label>
                    <select name="category" required className={fieldCls}>
                      {PLACE_CATEGORIES.filter(
                        (c): c is PlaceCategory => c !== "event",
                      ).map((c) => (
                        <option key={c} value={c}>
                          {lang === "ar"
                            ? PLACE_CATEGORY_META[c].labelAr
                            : PLACE_CATEGORY_META[c].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t("fArea")} *</label>
                    <input
                      name="area"
                      required
                      placeholder={lang === "ar" ? "عبدون، اللويبدة…" : "Abdoun, Weibdeh…"}
                      className={fieldCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("fAddress")}</label>
                  <input name="address" className={fieldCls} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{t("fMapLink")}</label>
                    <input
                      name="locationUrl"
                      type="url"
                      placeholder="https://maps.google.com/…"
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("fPriceLevel")}</label>
                    <select name="priceLevel" className={fieldCls}>
                      {PRICE_LEVELS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("fPhoto")}</label>
                  <input name="photo" type="file" accept="image/*" className={fieldCls} />
                </div>

                <div>
                  <label className={labelCls}>{t("fDescription")}</label>
                  <textarea name="description" rows={4} className={fieldCls} />
                </div>

                {status === "error" && (
                  <p className="text-sm text-clay">{t("submitError")}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === "submitting" ? t("submitting") : t("submitBtn")}
                </button>
              </form>
            )}
          </div>

          {/* Side panel */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/lifestyle-3.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-sand-100 p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {t("submitPlace")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t("submitPlaceIntro")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
