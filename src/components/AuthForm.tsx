"use client";

import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithGoogle,
} from "@/app/auth/actions";

/** Login / signup card. Uses server actions for both email and Google flows. */
export default function AuthForm({
  mode,
  hasError = false,
  checkEmail = false,
}: {
  mode: "login" | "signup";
  hasError?: boolean;
  checkEmail?: boolean;
}) {
  const { t, lang } = useI18n();
  const isSignup = mode === "signup";

  const labelCls = "mb-1.5 block text-sm font-medium text-ink";
  const fieldCls =
    "w-full rounded-xl border border-line bg-white ps-10 pe-4 py-2.5 text-ink outline-none transition-colors focus:border-terracotta";

  return (
    <section className="w-full px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow mb-3">
            {isSignup ? t("signUp") : t("signIn")}
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {isSignup ? t("signupTitle") : t("loginTitle")}
          </h1>
          <p className="mt-3 text-ink-soft">
            {isSignup ? t("signupIntro") : t("loginIntro")}
          </p>
        </div>

        {checkEmail && (
          <div className="mt-6 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-center text-sm text-ink">
            {t("signupCheckEmail")}
          </div>
        )}
        {hasError && (
          <div className="mt-6 rounded-2xl border border-terracotta/30 bg-terracotta/10 p-4 text-center text-sm text-terracotta">
            {t("authError")}
          </div>
        )}

        {/* Google */}
        <form action={signInWithGoogle} className="mt-8">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3 font-medium text-ink shadow-soft transition-colors hover:bg-sand-100"
          >
            <GoogleIcon />
            {t("continueWithGoogle")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-wide text-ink-faint">
            {t("orWithEmail")}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* Email + password */}
        <form
          action={isSignup ? signUpWithPassword : signInWithPassword}
          className="flex flex-col gap-4"
        >
          {isSignup && (
            <div>
              <label htmlFor="full_name" className={labelCls}>
                {t("fName")}
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  className={fieldCls}
                  placeholder={lang === "ar" ? "اسمك" : "Your name"}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelCls}>
              {t("fEmail")}
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={fieldCls}
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelCls}>
              {t("fPassword")}
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={6}
                className={fieldCls}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary mt-2">
            {isSignup ? t("signUp") : t("signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          {isSignup ? t("haveAccount") : t("noAccount")}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-terracotta underline-offset-4 hover:underline"
          >
            {isSignup ? t("signIn") : t("signUp")}
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
