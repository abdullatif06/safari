import { requireAdmin } from "@/lib/auth-guards";
import { getPendingEvents, getPendingOrganizerRequests } from "@/lib/admin-db";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [events, organizers] = await Promise.all([
    getPendingEvents(),
    getPendingOrganizerRequests(),
  ]);

  return <AdminPanel events={events} organizers={organizers} />;
}
