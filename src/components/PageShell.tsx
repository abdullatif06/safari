"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}

/** Standard page header with eyebrow + title + optional lead text. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {lead && (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {lead}
        </p>
      )}
    </div>
  );
}
