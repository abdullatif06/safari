"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Ticket as TicketIcon,
  Heart,
  Star,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import { signOut } from "@/app/auth/actions";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import { eventImage } from "@/lib/types";
import type { Ticket } from "@/lib/account-db";

export default function AccountDashboard({
  user,
  isBusiness,
  counts,
  nextTicket,
  recentSaved,
  showSavedBanner,
}: {
  user: AccountUser;
  isBusiness: boolean;
  counts: { saved: number; tickets: number; reviews: number };
  nextTicket: Ticket | null;
  recentSaved: import("@/lib/types").EventItem[];
  showSavedBanner?: boolean;
}) {
  const { t, lang } = useI18n();

  return (
    <AccountShell user={user}>
      {/* Profile saved banner */}
      {showSavedBanner && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-medium text-teal">
          <CheckCircle2 size={17} className="shrink-0" />
          {t("profileSaved")}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          href="/account/tickets"
          icon={<TicketIcon size={22} className="text-terracotta" />}
          label={t("myTickets")}
          count={counts.tickets}
        />
        <StatCard
          href="/account/saved"
          icon={<Heart size={22} className="text-terracotta" />}
          label={t("savedEvents")}
          count={counts.saved}
        />
        <StatCard
          href="/account/reviews"
          icon={<Star size={22} className="text-terracotta" />}
          label={t("myReviews")}
          count={counts.reviews}
        />
      </div>

      {/* Next ticket */}
      {nextTicket && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            {t("upcoming")}
          </h2>
          <Link
            href={`/account/tickets/${nextTicket.rsvpId}`}
            className="card card-hover flex items-center gap-4 overflow-hidden p-3"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={nextTicket.event.imageUrl ?? eventImage(nextTicket.event.id)}
                unoptimized={!!nextTicket.event.imageUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-base font-semibold text-ink">
                {lang === "ar"
                  ? nextTicket.event.titleAr
                  : nextTicket.event.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                <Calendar size={14} className="text-ink-faint" />
                {formatDate(nextTicket.event.date, lang)} ·{" "}
                {formatTime(nextTicket.event.time, lang)}
              </p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </Link>
        </div>
      )}

      {/* Recently saved */}
      {recentSaved.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">
              {t("savedEvents")}
            </h2>
            <Link
              href="/account/saved"
              className="text-sm font-medium text-terracotta underline-offset-4 hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {recentSaved.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="card card-hover flex items-center gap-3 p-3"
              >
                <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={e.imageUrl ?? eventImage(e.id)}
                    unoptimized={!!e.imageUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <span className="truncate font-medium text-ink">
                  {lang === "ar" ? e.titleAr : e.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Become an organizer (plain users only) */}
      {user.role === "user" && (
        <Link
          href="/account/become-organizer"
          className="card card-hover mt-10 flex items-center gap-4 p-5"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-terracotta/10">
            <Sparkles size={22} className="text-terracotta" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-semibold text-ink">
              {t("becomeOrganizer")}
            </h3>
            <p className="text-sm text-ink-soft">{t("becomeOrganizerSub")}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-ink-faint" />
        </Link>
      )}

      {/* Footer actions */}
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link href="/events" className="btn-primary !px-5 !py-2 text-sm">
          {t("browseEvents")}
        </Link>
        {isBusiness && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <LayoutDashboard size={16} /> {t("businessDashboard")}
          </Link>
        )}
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ShieldCheck size={16} /> {t("adminPanel")}
          </Link>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            {t("signOut")}
          </button>
        </form>
      </div>
    </AccountShell>
  );
}

function StatCard({
  href,
  icon,
  label,
  count,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <Link href={href} className="card card-hover flex items-center gap-4 p-5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-terracotta/10">
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-ink">{count}</p>
        <p className="text-sm text-ink-soft">{label}</p>
      </div>
    </Link>
  );
}
