"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LayoutDashboard, ShieldCheck, LogOut, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import { signOut } from "@/app/auth/actions";
import Avatar from "./account/Avatar";
import Logo from "./Logo";

export default function Navbar() {
  const { lang, toggle, setLang, t } = useI18n();
  const pathname = usePathname();
  const user = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0];
  const isBusiness = user?.role === "business" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  // Sync saved language preference on sign-in.
  useEffect(() => {
    if (user?.lang && user.lang !== lang) setLang(user.lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.lang]);

  // Admin pending-review badge.
  useEffect(() => {
    if (!isAdmin) { setPendingCount(0); return; }
    let active = true;
    fetch("/api/admin/pending-count")
      .then((r) => r.json())
      .then((d) => { if (active) setPendingCount(d.total ?? 0); })
      .catch(() => {});
    return () => { active = false; };
  }, [isAdmin]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Close dropdown on navigation.
  useEffect(() => { setDropdownOpen(false); setMenuOpen(false); }, [pathname]);

  const links = [
    { href: "/places", label: t("navPlaces") },
    { href: "/events", label: t("navEvents") },
    { href: "/map", label: t("navMap") },
    { href: "/cities", label: t("navCities") },
    { href: "/guide", label: t("navGuide") },
    { href: "/about", label: t("navAbout") },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-sand-50/80 backdrop-blur-xl">
      <nav className="flex h-16 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                isActive(l.href) ? "text-terracotta" : "text-ink-soft hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            /* Avatar dropdown */
            <div ref={dropdownRef} className="relative hidden sm:block">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Account menu"
                className="flex items-center rounded-full ring-2 ring-transparent transition-all hover:ring-terracotta/40 focus-visible:outline-none focus-visible:ring-terracotta/60"
              >
                <Avatar src={user.avatarUrl} name={firstName ?? "?"} size={34} />
              </button>

              {dropdownOpen && (
                <div className="absolute end-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                  {/* User info header */}
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{firstName}</p>
                    <p className="truncate text-xs text-ink-faint">{user.email}</p>
                  </div>

                  <div className="p-1.5">
                    <DropdownLink href="/account" icon={<User size={15} />} label={t("myAccount")} />
                    {isBusiness && (
                      <DropdownLink href="/dashboard" icon={<LayoutDashboard size={15} />} label={t("navDashboard")} />
                    )}
                    {isAdmin && (
                      <DropdownLink
                        href="/admin"
                        icon={<ShieldCheck size={15} />}
                        label={t("navAdmin")}
                        badge={pendingCount > 0 ? pendingCount : undefined}
                      />
                    )}
                  </div>

                  {/* Language toggle */}
                  <div className="border-t border-line p-1.5">
                    <button
                      onClick={toggle}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sand-100 hover:text-ink"
                    >
                      <Languages size={15} />
                      {lang === "en" ? "العربية" : "English"}
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-line p-1.5">
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                      >
                        <LogOut size={15} />
                        {t("signOut")}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:inline-flex sm:items-center"
            >
              {t("signIn")}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-sand-50 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(l.href)
                    ? "bg-sand-100 text-terracotta"
                    : "text-ink-soft hover:bg-sand-100"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-1 border-t border-line" />

            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sand-100"
                >
                  <User size={16} /> {t("myAccount")}
                </Link>
                {isBusiness && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sand-100"
                  >
                    <LayoutDashboard size={16} /> {t("navDashboard")}
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sand-100"
                  >
                    <ShieldCheck size={16} /> {t("navAdmin")}
                    {pendingCount > 0 && (
                      <span className="ms-auto grid h-4 min-w-4 place-items-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-ink-soft hover:bg-sand-100"
                >
                  <Languages size={16} /> {lang === "en" ? "العربية" : "English"}
                </button>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-ink-soft hover:bg-sand-100"
                  >
                    <LogOut size={16} /> {t("signOut")}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-ink-soft hover:bg-sand-100"
                >
                  <Languages size={16} /> {lang === "en" ? "العربية" : "English"}
                </button>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sand-100"
                >
                  {t("signIn")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sand-100 hover:text-ink"
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className="ms-auto grid h-4 min-w-4 place-items-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
