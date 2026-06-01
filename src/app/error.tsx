"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCw } from "lucide-react";
import { SunMark } from "@/components/Logo";
import PageShell from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Surface the error in the console / monitoring for debugging.
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <section className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <SunMark className="mx-auto mb-6 h-20 w-20 opacity-80" />
          <p className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-terracotta">
            Error
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t("errorTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            {t("errorBody")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => reset()} className="btn-primary">
              <RotateCw size={18} /> {t("tryAgain")}
            </button>
            <Link href="/" className="btn-ghost">
              <Home size={18} /> {t("backHome")}
            </Link>
          </div>
          {error.digest && (
            <p className="mt-6 font-mono text-xs text-ink-faint">
              Ref: {error.digest}
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
