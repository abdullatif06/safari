"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ArrowLeft, Clock, Sparkles, Store } from "lucide-react";
import PageShell from "@/components/PageShell";

interface Latest {
  status: "pending" | "approved" | "rejected";
  adminNotes: string | null;
  businessName: string;
}

export default function BecomeOrganizerView({
  action,
  defaultName,
  latest,
}: {
  action: (formData: FormData) => void;
  defaultName: string;
  latest: Latest | null;
}) {
  const pendingState = latest?.status === "pending";

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to account
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
            <Sparkles size={13} /> Become an organizer
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            List your own events
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Get a free organizer account to create events, upload covers, set your
            ticket link, and see how many people save and RSVP.
          </p>

          {pendingState ? (
            <div className="card mt-10 flex items-start gap-4 p-6">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-honey/15 text-[#9A6A12]">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Your request is under review
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Thanks! We&apos;re reviewing your request for{" "}
                  <strong>{latest?.businessName}</strong>. You&apos;ll get an email
                  as soon as it&apos;s approved.
                </p>
              </div>
            </div>
          ) : (
            <>
              {latest?.status === "rejected" && (
                <div className="card mt-8 border-terracotta/30 bg-terracotta/5 p-5">
                  <p className="text-sm font-semibold text-terracotta">
                    Your previous request wasn&apos;t approved.
                  </p>
                  {latest.adminNotes && (
                    <p className="mt-1 text-sm text-ink-soft">{latest.adminNotes}</p>
                  )}
                  <p className="mt-2 text-sm text-ink-soft">
                    You&apos;re welcome to submit again below.
                  </p>
                </div>
              )}

              <form action={action} className="card mt-10 space-y-5 p-6 sm:p-8">
                <Field label="Business / organizer name" required>
                  <input
                    name="business_name"
                    defaultValue={latest?.businessName ?? defaultName}
                    required
                    placeholder="e.g. Amman Culture Collective"
                    className={input}
                  />
                </Field>
                <Field label="Contact phone">
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+962 7…"
                    className={input}
                  />
                </Field>
                <Field label="Tell us about your business">
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="What kind of events do you run? Where are you based?"
                    className={input}
                  />
                </Field>
                <div className="flex items-center gap-3 pt-1">
                  <Submit />
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink-faint">
                    <Store size={14} /> Reviewed by our team
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !px-6 !py-2.5 text-sm disabled:opacity-60">
      {pending ? "Submitting…" : "Submit request"}
    </button>
  );
}
