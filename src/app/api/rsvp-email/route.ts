import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRsvpConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId, eventTitle, eventDate } = await req.json();
  if (!eventId || !eventTitle) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Get the user's email via the admin client
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserById(user.id);
  const email = data?.user?.email;

  if (email) {
    await sendRsvpConfirmation(email, eventTitle, eventId, eventDate ?? "");
  }

  return NextResponse.json({ ok: true });
}
