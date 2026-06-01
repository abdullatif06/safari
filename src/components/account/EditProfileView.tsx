"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2, Upload, X } from "lucide-react";
import AccountShell, { type AccountUser } from "@/components/account/AccountShell";
import Avatar from "@/components/account/Avatar";
import { useI18n } from "@/lib/i18n";

interface Initial {
  fullName: string;
  phone: string;
  city: string;
  avatarUrl: string | null;
}

export default function EditProfileView({
  user,
  action,
  initial,
  saveError,
}: {
  user: AccountUser;
  action: (formData: FormData) => void;
  initial: Initial;
  saveError?: boolean;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(initial.fullName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewName = name.trim() || user.name;

  // Derive a live AccountUser that reflects the uploaded avatar so the shell
  // header updates immediately without a full page reload.
  const liveUser: AccountUser = { ...user, avatarUrl, name: previewName };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/avatar", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) {
        setUploadError(`Upload failed: ${json.error ?? res.statusText}`);
        return;
      }

      // Cache-bust so a replaced avatar shows immediately without a reload.
      setAvatarUrl(`${json.url}?v=${Date.now()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(`Error: ${msg}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <AccountShell user={liveUser}>
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {t("editProfileTitle")}
        </h2>
        <p className="mt-2 text-ink-soft">{t("editProfileIntro")}</p>

        <form action={action} className="card mt-8 space-y-6 p-6 sm:p-8">
          {saveError && (
            <p className="flex items-center gap-2 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm font-medium text-terracotta">
              {t("somethingWrong")}
            </p>
          )}
          {/* Avatar */}
          <div>
            <span className="mb-2 block text-sm font-medium text-ink">
              {t("profilePhoto")}
            </span>
            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={previewName} size={72} />
              <div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-sand-100 disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                    {uploading ? t("saving") : t("changePhoto")}
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
                    >
                      <X size={14} /> {t("removePhoto")}
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-ink-faint">JPG or PNG, up to 5 MB.</p>
                {uploadError && (
                  <p className="mt-1 text-xs text-terracotta">{uploadError}</p>
                )}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />
          </div>

          <Field label={t("fName")}>
            <input
              name="full_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fName")}
              className={input}
            />
          </Field>

          <Field label={t("fPhone")}>
            <input
              name="phone"
              type="tel"
              defaultValue={initial.phone}
              placeholder="+962 7…"
              className={input}
            />
          </Field>

          <Field label={t("fCityHome")}>
            <input
              name="city"
              defaultValue={initial.city}
              placeholder="Amman"
              className={input}
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <Submit label={t("saveChanges")} pendingLabel={t("saving")} disabled={uploading} />
            <Link
              href="/account"
              className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              {t("cancel")}
            </Link>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}

const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function Submit({
  label,
  pendingLabel,
  disabled,
}: {
  label: string;
  pendingLabel: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-primary !px-6 !py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
