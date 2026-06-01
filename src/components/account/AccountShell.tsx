"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pencil,
  Ticket as TicketIcon,
  Heart,
  Star,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import Avatar from "@/components/account/Avatar";
import { useI18n } from "@/lib/i18n";
import type { Role } from "@/lib/auth-guards";

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
}

const ROLE_LABEL: Record<Role, "roleUser" | "roleBusiness" | "roleAdmin"> = {
  user: "roleUser",
  business: "roleBusiness",
  admin: "roleAdmin",
};

/**
 * Shared chrome for every /account/* page: a profile header (avatar, name,
 * email, role badge, edit button) plus a horizontal tab bar. Pages pass their
 * own content as children and the active tab is derived from the pathname.
 */
export default function AccountShell({
  user,
  children,
}: {
  user: AccountUser;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();

  const tabs = [
    { href: "/account", label: t("tabOverview"), icon: LayoutDashboard },
    { href: "/account/tickets", label: t("myTickets"), icon: TicketIcon },
    { href: "/account/saved", label: t("savedEvents"), icon: Heart },
    { href: "/account/reviews", label: t("myReviews"), icon: Star },
    { href: "/account/settings", label: t("tabSettings"), icon: Settings },
  ];

  // Exact match for Overview; prefix match for the deeper sections.
  const isActive = (href: string) =>
    href === "/account" ? pathname === href : pathname.startsWith(href);

  return (
    <PageShell>
      <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Profile header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={user.avatarUrl} name={user.name} size={64} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {user.name}
                  </h1>
                  <span className="shrink-0 rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                    {t(ROLE_LABEL[user.role])}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-soft">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/account/edit"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-terracotta/40 hover:text-ink"
            >
              <Pencil size={14} /> {t("editProfile")}
            </Link>
          </div>

          {/* Tab bar */}
          <div className="mt-8 -mx-5 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0">
            <nav className="flex min-w-max gap-1">
              {tabs.map((tab) => {
                const active = isActive(tab.href);
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "text-terracotta"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {active && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-terracotta" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Page content */}
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </PageShell>
  );
}
