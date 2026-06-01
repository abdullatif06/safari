import { NextRequest, NextResponse } from "next/server";
import { sendEventSubmission, type EventSubmission } from "@/lib/email";

/**
 * Public "Submit an event" endpoint. Validates the payload and emails the admin
 * for review (via Resend). No filesystem writes — works on serverless/Vercel.
 */

const REQUIRED = ["title", "category", "city", "date", "organizer", "email"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const missing = REQUIRED.filter(
    (k) => !body[k] || String(body[k]).trim() === "",
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 422 },
    );
  }

  const email = String(body.email).trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }

  const submission: EventSubmission = {
    title: String(body.title).trim(),
    category: String(body.category ?? "").trim(),
    city: String(body.city ?? "").trim(),
    venue: String(body.venue ?? "").trim() || undefined,
    date: String(body.date ?? "").trim(),
    time: String(body.time ?? "").trim() || undefined,
    cost: String(body.cost ?? "free").trim() || undefined,
    organizer: String(body.organizer).trim(),
    email,
    description: String(body.description ?? "").trim() || undefined,
  };

  try {
    await sendEventSubmission(submission);
  } catch (err) {
    console.error("Failed to send submission email:", err);
    return NextResponse.json({ error: "Notification error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
