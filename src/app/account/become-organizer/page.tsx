import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth-guards";
import { createClient } from "@/lib/supabase/server";
import { submitOrganizerRequest } from "./actions";
import BecomeOrganizerView from "@/components/account/BecomeOrganizerView";

export const dynamic = "force-dynamic";

export default async function BecomeOrganizerPage() {
  const me = await getSessionProfile();
  if (!me) redirect("/login?next=/account/become-organizer");

  // Already an organizer/admin → straight to the dashboard.
  if (me.role === "business" || me.role === "admin") redirect("/dashboard");

  // Surface the latest request's state (pending / rejected with note).
  const supabase = await createClient();
  const { data: latest } = await supabase
    .from("organizer_requests")
    .select("status, admin_notes, business_name")
    .eq("user_id", me.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <BecomeOrganizerView
      action={submitOrganizerRequest}
      defaultName={me.fullName ?? ""}
      latest={
        latest
          ? {
              status: latest.status as "pending" | "approved" | "rejected",
              adminNotes: latest.admin_notes,
              businessName: latest.business_name,
            }
          : null
      }
    />
  );
}
