import "server-only";
import { Resend } from "resend";

/**
 * Email notifications via Resend (Phase 3).
 *
 * Called server-side only (admin server actions). If RESEND_API_KEY is unset
 * the helpers no-op and log a warning, so local dev works without email set up.
 *
 * Default RESEND_FROM uses Resend's shared `onboarding@resend.dev` sender,
 * which only delivers to the account owner's address until you verify a domain.
 */

const FROM = process.env.RESEND_FROM || "Saifi <onboarding@resend.dev>";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send.");
    return null;
  }
  return new Resend(key);
}

/** Wrap body copy in a simple, brand-tinted HTML shell. */
function shell(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#FAF6EF;padding:32px 0;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #ECE3D5;border-radius:16px;overflow:hidden;">
      <div style="background:#D2603A;padding:20px 28px;">
        <span style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">Saifi · صيفي</span>
      </div>
      <div style="padding:28px;">
        <h1 style="margin:0 0 16px;font-size:20px;color:#2B2620;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #ECE3D5;color:#9A9082;font-size:12px;">
        Saifi — free summer events across Jordan · صيفي
      </div>
    </div>
  </div>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#D2603A;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px;">${label}</a>`;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function send(to: string, subject: string, html: string) {
  const resend = client();
  if (!resend) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

export interface EventSubmission {
  title: string;
  category: string;
  city: string;
  venue?: string;
  date: string;
  time?: string;
  cost?: string;
  organizer: string;
  email: string;
  description?: string;
}

/** Public "Submit an event" form → notifies the admin to review it. */
export async function sendEventSubmission(sub: EventSubmission) {
  const to = process.env.ADMIN_EMAIL || process.env.RESEND_TO;
  if (!to) {
    console.warn("[email] ADMIN_EMAIL not set — skipping submission notification.");
    return;
  }
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#9A9082;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#2B2620;font-size:14px;">${value}</td></tr>`
      : "";
  const html = shell(
    "New event submission 📬",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       Someone submitted an event through the public form. Review the details below.
     </p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;">
       ${row("Title", sub.title)}
       ${row("Category", sub.category)}
       ${row("City", sub.city)}
       ${row("Venue", sub.venue)}
       ${row("Date", sub.date)}
       ${row("Time", sub.time)}
       ${row("Cost", sub.cost)}
       ${row("Organizer", sub.organizer)}
       ${row("Contact", sub.email)}
       ${row("Details", sub.description)}
     </table>
     <p style="margin:20px 0 8px;">${btn(`${SITE_URL}/dashboard/events/new`, "Create this event")}</p>`,
  );
  await send(to, `New event submission: "${sub.title}"`, html);
}

/** RSVP confirmation → attendee gets a ticket reminder. */
export async function sendRsvpConfirmation(to: string, eventTitle: string, eventId: string, eventDate: string) {
  const html = shell(
    "You're going! 🎟️",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       Your RSVP for <strong>${eventTitle}</strong> is confirmed.
       We'll see you there on <strong>${eventDate}</strong>!
     </p>
     <p style="margin:24px 0 8px;">${btn(`${SITE_URL}/account/tickets`, "View my ticket")}</p>
     <p style="color:#9A9082;font-size:13px;line-height:1.6;margin-top:20px;">
       تم تأكيد حضورك لـ «${eventTitle}». أراك هناك!
     </p>`,
  );
  await send(to, `You're going to "${eventTitle}" 🎟️`, html);
}

/** Event approved → owner can see it live. */
export async function sendEventApproved(to: string, eventTitle: string, eventId: string) {
  const html = shell(
    "Your event is live 🎉",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       Good news — <strong>${eventTitle}</strong> has been approved and is now
       published on Saifi. People can discover it, save it, and RSVP.
     </p>
     <p style="margin:24px 0 8px;">${btn(`${SITE_URL}/events/${eventId}`, "View your event")}</p>
     <p style="color:#9A9082;font-size:13px;line-height:1.6;margin-top:20px;">
       تمت الموافقة على فعاليتك «${eventTitle}» وأصبحت منشورة الآن على صيفي.
     </p>`,
  );
  await send(to, `Your event "${eventTitle}" is now live on Saifi`, html);
}

/** Event rejected → owner sees the reason. */
export async function sendEventRejected(to: string, eventTitle: string, reason: string) {
  const html = shell(
    "Update on your event",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       Thanks for submitting <strong>${eventTitle}</strong>. We weren't able to
       approve it this time.
     </p>
     <div style="background:#FAF6EF;border:1px solid #ECE3D5;border-radius:10px;padding:14px 16px;margin:16px 0;color:#5C5448;font-size:14px;line-height:1.6;">
       <strong style="color:#2B2620;">Reason:</strong><br/>${reason || "No reason provided."}
     </div>
     <p style="color:#5C5448;font-size:15px;line-height:1.6;">
       You can edit it in your dashboard and resubmit.
     </p>
     <p style="margin:24px 0 8px;">${btn(`${SITE_URL}/dashboard`, "Open dashboard")}</p>`,
  );
  await send(to, `Update on your event "${eventTitle}"`, html);
}

/** Organizer request approved → user is now a business. */
export async function sendOrganizerApproved(to: string, businessName: string) {
  const html = shell(
    "Welcome aboard, organizer 🎟️",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       <strong>${businessName}</strong> is approved — your account is now an
       organizer account. You can create and manage events from your dashboard.
     </p>
     <p style="margin:24px 0 8px;">${btn(`${SITE_URL}/dashboard`, "Go to your dashboard")}</p>
     <p style="color:#9A9082;font-size:13px;line-height:1.6;margin-top:20px;">
       تمت الموافقة على «${businessName}». أصبح حسابك الآن حساب منظِّم.
     </p>`,
  );
  await send(to, "You're now an organizer on Saifi", html);
}

/** Organizer request rejected → user sees the reason. */
export async function sendOrganizerRejected(to: string, businessName: string, reason: string) {
  const html = shell(
    "Update on your organizer request",
    `<p style="color:#5C5448;font-size:15px;line-height:1.6;">
       Thanks for your interest in becoming an organizer for
       <strong>${businessName}</strong>. We weren't able to approve the request
       this time.
     </p>
     <div style="background:#FAF6EF;border:1px solid #ECE3D5;border-radius:10px;padding:14px 16px;margin:16px 0;color:#5C5448;font-size:14px;line-height:1.6;">
       <strong style="color:#2B2620;">Reason:</strong><br/>${reason || "No reason provided."}
     </div>`,
  );
  await send(to, "Update on your Saifi organizer request", html);
}
