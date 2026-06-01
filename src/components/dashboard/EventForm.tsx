"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import type { OwnerEvent } from "@/lib/dashboard-db";

const CATEGORIES = ["music", "cultural", "sports", "food"] as const;
const COSTS = ["free", "donation", "paid"] as const;

/**
 * Shared create/edit form. Image upload goes straight to the public
 * `event-covers` Storage bucket from the browser; the resulting public URL is
 * carried in a hidden `image_url` field submitted with the server action.
 */
/** Extract a human-readable place name from a full Google Maps URL.
 *  Works for URLs like:
 *    https://www.google.com/maps/place/Place+Name/@lat,lng,...
 *    https://maps.google.com/maps?q=Place+Name
 */
function placeNameFromMapsUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // /maps/place/<Name>/@ pattern
    const placeMatch = u.pathname.match(/\/maps\/place\/([^/@]+)/);
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }
    // ?q=<Name> pattern
    const q = u.searchParams.get("q");
    if (q) return decodeURIComponent(q.replace(/\+/g, " "));
  } catch {
    // not a valid URL
  }
  return null;
}

export default function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  event?: OwnerEvent;
  submitLabel: string;
}) {
  const [cost, setCost] = useState<string>(event?.cost ?? "free");
  const [imageUrl, setImageUrl] = useState<string>(event?.imageUrl ?? "");
  const [locationUrl, setLocationUrl] = useState<string>(event?.locationUrl ?? "");
  const [venueEn, setVenueEn] = useState<string>(event?.venue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLocationUrl(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocationUrl(val);
    const name = placeNameFromMapsUrl(val);
    if (name && !venueEn) setVenueEn(name);
  }

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

      const res = await fetch("/api/event-cover", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) {
        setUploadError(`Upload failed: ${json.error ?? res.statusText}`);
        return;
      }

      setImageUrl(json.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(`Error: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-7">
      {event && <input type="hidden" name="eventId" value={event.id} />}
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="location_url" value={locationUrl} />

      {/* Cover image */}
      <Field label="Cover image">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-line bg-sand-100">
            {imageUrl ? (
              <Image src={imageUrl} alt="" fill sizes="128px" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-ink-faint">
                <ImagePlus size={22} />
              </div>
            )}
          </div>
          <div>
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
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <p className="mt-1.5 text-xs text-ink-faint">JPG or PNG, up to 5 MB.</p>
            {uploadError && (
              <p className="mt-1 text-xs text-terracotta">{uploadError}</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </Field>

      {/* Titles */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title (English)" required>
          <input name="title" defaultValue={event?.title} required className={input} />
        </Field>
        <Field label="العنوان (بالعربية)" required>
          <input
            name="title_ar"
            defaultValue={event?.titleAr}
            dir="rtl"
            className={input}
          />
        </Field>
      </div>

      {/* Descriptions */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Description (English)">
          <textarea
            name="description"
            defaultValue={event?.description}
            rows={4}
            className={input}
          />
        </Field>
        <Field label="الوصف (بالعربية)">
          <textarea
            name="description_ar"
            defaultValue={event?.descriptionAr}
            rows={4}
            dir="rtl"
            className={input}
          />
        </Field>
      </div>

      {/* Category + cost */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Category" required>
          <select name="category" defaultValue={event?.category ?? "cultural"} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cost" required>
          <select
            name="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={input}
          >
            {COSTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (JOD)">
          <input
            name="price"
            type="number"
            min="0"
            step="0.5"
            defaultValue={event?.price ?? ""}
            disabled={cost !== "paid"}
            className={`${input} disabled:opacity-50`}
          />
        </Field>
      </div>

      {/* Location */}
      <Field label="Google Maps URL">
        <input
          type="url"
          value={locationUrl}
          onChange={handleLocationUrl}
          placeholder="https://www.google.com/maps/place/…"
          className={input}
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          Paste a Google Maps link — the venue name will auto-fill below.
        </p>
      </Field>

      {/* City + venue */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City (English)" required>
          <input name="city" defaultValue={event?.city} required className={input} />
        </Field>
        <Field label="المدينة (بالعربية)">
          <input name="city_ar" defaultValue={event?.cityAr} dir="rtl" className={input} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Venue (English)">
          <input
            name="venue"
            value={venueEn}
            onChange={(e) => setVenueEn(e.target.value)}
            className={input}
          />
        </Field>
        <Field label="المكان (بالعربية)">
          <input name="venue_ar" defaultValue={event?.venueAr} dir="rtl" className={input} />
        </Field>
      </div>

      {/* Date + time */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date" required>
          <input
            name="event_date"
            type="date"
            defaultValue={event?.eventDate}
            required
            className={input}
          />
        </Field>
        <Field label="Time">
          <input
            name="event_time"
            type="time"
            defaultValue={event?.eventTime}
            className={input}
          />
        </Field>
      </div>

      {/* Organizer + emoji */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organizer name">
          <input name="organizer" defaultValue={event?.organizer} className={input} />
        </Field>
        <Field label="Cover emoji">
          <input
            name="cover"
            defaultValue={event?.cover ?? "🎉"}
            maxLength={4}
            className={input}
          />
        </Field>
      </div>
      <Field label="External ticket / registration link">
        <input
          name="external_ticket_url"
          type="url"
          defaultValue={event?.externalTicketUrl ?? ""}
          placeholder="https://…"
          className={input}
        />
      </Field>

      {/* Accessibility */}
      <Field label="Accessibility">
        <div className="flex flex-wrap gap-5">
          <Check
            name="wheelchair"
            label="Wheelchair accessible"
            defaultChecked={event?.wheelchair}
          />
          <Check
            name="family_friendly"
            label="Family friendly"
            defaultChecked={event?.familyFriendly}
          />
          <Check
            name="sign_language"
            label="Sign language"
            defaultChecked={event?.signLanguage}
          />
        </div>
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <Submit label={submitLabel} disabled={uploading} />
        {!event && (
          <p className="text-sm text-ink-faint">
            New events are reviewed before going live.
          </p>
        )}
      </div>
    </form>
  );
}

const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Check({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line text-terracotta focus:ring-terracotta"
      />
      {label}
    </label>
  );
}

function Submit({ label, disabled }: { label: string; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-primary !px-6 !py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
