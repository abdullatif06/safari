"use client";

import PageShell from "@/components/PageShell";

/** Instant skeleton shown while any /account/* page is loading its data. */
export default function AccountSkeleton() {
  return (
    <PageShell>
      <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-4xl animate-pulse">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-sand-200" />
            <div className="space-y-2">
              <div className="h-6 w-40 rounded-xl bg-sand-200" />
              <div className="h-4 w-28 rounded-xl bg-sand-200" />
            </div>
          </div>
          {/* Tab bar */}
          <div className="mt-8 flex gap-6 border-b border-line pb-3">
            {[80, 72, 96, 72, 64].map((w, i) => (
              <div key={i} className="h-4 rounded-lg bg-sand-200" style={{ width: w }} />
            ))}
          </div>
          {/* Content */}
          <div className="mt-8 space-y-4">
            <div className="h-28 rounded-2xl bg-sand-200" />
            <div className="h-28 rounded-2xl bg-sand-200" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
