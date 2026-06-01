"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Lock, Languages, Trash2, AlertTriangle } from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import { useI18n, type Lang } from "@/lib/i18n";

interface Status {
  pw?: string;
  lang?: string;
  del?: string;
}

export default function SettingsView({
  user,
  currentLang,
  status,
  passwordAction,
  languageAction,
  deleteAction,
}: {
  user: AccountUser;
  currentLang: Lang | null;
  status: Status;
  passwordAction: (formData: FormData) => void;
  languageAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}) {
  const { t, lang, setLang } = useI18n();
  const [confirmText, setConfirmText] = useState("");

  // The radio reflects the saved preference if there is one, else the live UI
  // language. Selecting one applies it immediately (setLang) and the form
  // persists it to the profile on submit.
  const [picked, setPicked] = useState<Lang>(currentLang ?? lang);

  const pwMsg =
    status.pw === "ok"
      ? { ok: true, text: t("passwordUpdated") }
      : status.pw === "mismatch"
        ? { ok: false, text: t("passwordMismatch") }
        : status.pw === "short"
          ? { ok: false, text: t("passwordTooShort") }
          : status.pw === "error"
            ? { ok: false, text: t("somethingWrong") }
            : null;

  return (
    <AccountShell user={user}>
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {t("settingsTitle")}
          </h2>
          <p className="mt-2 text-ink-soft">{t("settingsIntro")}</p>
        </div>

        {/* Change password */}
        <div className="card p-6 sm:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-terracotta/10">
              <Lock size={17} className="text-terracotta" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {t("changePassword")}
            </h3>
          </div>
          <form action={passwordAction} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {t("newPassword")}
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className={input}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {t("confirmPassword")}
              </span>
              <input
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                className={input}
              />
            </label>
            {pwMsg && (
              <p
                className={`flex items-center gap-1.5 text-sm ${
                  pwMsg.ok ? "text-teal" : "text-terracotta"
                }`}
              >
                {pwMsg.ok && <Check size={14} />}
                {pwMsg.text}
              </p>
            )}
            <Submit label={t("updatePassword")} pendingLabel={t("saving")} />
          </form>
        </div>

        {/* Language preference */}
        <div className="card p-6 sm:p-7">
          <div className="mb-1 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-terracotta/10">
              <Languages size={17} className="text-terracotta" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {t("languagePref")}
            </h3>
          </div>
          <p className="mb-4 text-sm text-ink-soft">{t("languagePrefSub")}</p>
          <form action={languageAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {(["en", "ar"] as const).map((code) => (
                <label
                  key={code}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    picked === code
                      ? "border-terracotta bg-terracotta/5 text-ink"
                      : "border-line text-ink-soft hover:border-terracotta/40"
                  }`}
                >
                  <span>{code === "en" ? "English" : "العربية"}</span>
                  <input
                    type="radio"
                    name="lang"
                    value={code}
                    checked={picked === code}
                    onChange={() => {
                      setPicked(code);
                      setLang(code); // apply immediately
                    }}
                    className="sr-only"
                  />
                  {picked === code && <Check size={16} className="text-terracotta" />}
                </label>
              ))}
            </div>
            {status.lang === "ok" && (
              <p className="flex items-center gap-1.5 text-sm text-teal">
                <Check size={14} /> {t("langSaved")}
              </p>
            )}
            <Submit label={t("saveChanges")} pendingLabel={t("saving")} />
          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 sm:p-7">
          <div className="mb-1 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-terracotta/15">
              <AlertTriangle size={17} className="text-terracotta" />
            </div>
            <h3 className="font-display text-lg font-semibold text-terracotta">
              {t("dangerZone")}
            </h3>
          </div>
          <p className="mb-4 text-sm text-ink-soft">{t("deleteAccountSub")}</p>
          <form action={deleteAction} className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {t("deleteConfirmLabel")}
              </span>
              <input
                name="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className={input}
              />
            </label>
            {status.del === "confirm" && (
              <p className="text-sm text-terracotta">{t("deleteConfirmError")}</p>
            )}
            {status.del === "error" && (
              <p className="text-sm text-terracotta">{t("somethingWrong")}</p>
            )}
            <DeleteButton
              label={t("deleteAccountConfirm")}
              disabled={confirmText.trim() !== "DELETE"}
            />
          </form>
        </div>
      </div>
    </AccountShell>
  );
}

const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none";

function Submit({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function DeleteButton({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={15} />
      {label}
    </button>
  );
}
