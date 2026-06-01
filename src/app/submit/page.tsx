"use client";

import { useState } from "react";
import Image from "next/image";
import { PartyPopper } from "lucide-react";
import PageShell from "@/components/PageShell";
import { CITIES } from "@/lib/cities";
import { CATEGORY_META, COST_META, Category, Cost } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const CATEGORIES: Category[] = ["music", "cultural", "sports", "food"];
const COSTS: Cost[] = ["free", "donation", "paid"];

type Status = "idle" | "submitting" | "done" | "error";

export default function SubmitPage() {
  const { lang, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
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
            <span className="eyebrow mb-3">{t("submitEvent")}</span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {t("submitTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t("submitIntro")}
            </p>

            {status === "done" ? (
              <div className="mt-8 rounded-3xl border border-teal/30 bg-teal/10 p-8 text-center">
                <PartyPopper size={40} className="mx-auto text-teal" />
                <p className="mt-3 font-display text-xl font-semibold text-ink">
                  {t("submitThanks")}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-ghost mt-6"
                >
                  {t("submitEvent")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className={labelCls}>{t("fTitle")} *</label>
                  <input name="title" required className={fieldCls} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{t("fCategory")} *</label>
                    <select name="category" required className={fieldCls}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {lang === "ar"
                            ? CATEGORY_META[c].labelAr
                            : CATEGORY_META[c].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t("fCity")} *</label>
                    <select name="city" required className={fieldCls}>
                      {CITIES.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {lang === "ar" ? c.nameAr : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("fVenue")}</label>
                  <input name="venue" className={fieldCls} />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>{t("fDate")} *</label>
                    <input name="date" type="date" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("fTime")}</label>
                    <input name="time" type="time" className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("fCost")}</label>
                    <select name="cost" className={fieldCls}>
                      {COSTS.map((c) => (
                        <option key={c} value={c}>
                          {lang === "ar"
                            ? COST_META[c].labelAr
                            : COST_META[c].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{t("fOrganizer")} *</label>
                    <input name="organizer" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("fEmail")} *</label>
                    <input name="email" type="email" required className={fieldCls} />
                  </div>
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
                  {t("freeForever")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t("aboutWhyBody")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
