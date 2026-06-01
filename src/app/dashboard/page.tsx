import { requireBusiness } from "@/lib/auth-guards";
import { getOwnerEvents } from "@/lib/dashboard-db";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await requireBusiness();
  const events = await getOwnerEvents(me.id);

  return (
    <DashboardOverview
      businessName={me.businessName ?? me.fullName ?? "Organizer"}
      events={events}
    />
  );
}
