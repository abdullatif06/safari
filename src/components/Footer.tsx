"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SunMark } from "./Logo";

export default function Footer() {
  const { t } = useI18n();

  const cols = [
    {
      title: t("navEvents"),
      links: [
        { href: "/events", label: t("allEvents") },
        { href: "/map", label: t("navMap") },
        { href: "/cities", label: t("navCities") },
      ],
    },
    {
      title: "Saifi",
      links: [
        { href: "/about", label: t("navAbout") },
        { href: "/guide", label: t("navGuide") },
        { href: "/submit", label: t("submitEvent") },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-sand-100">
      <div className="grid w-full gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <SunMark className="h-8 w-8" />
            <span className="font-display text-xl font-semibold">
              Saifi <span className="font-arabic text-ink-soft">صيفي</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            {t("footerNote")}
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-terracotta"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="flex w-full items-center gap-1.5 px-5 py-5 text-xs text-ink-faint sm:px-8 lg:px-12">
          © {new Date().getFullYear()} Saifi · Made with
          <Heart size={13} className="fill-terracotta text-terracotta" /> for
          Jordan
        </p>
      </div>
    </footer>
  );
}
