import { requireAccountUser } from "@/lib/auth-guards";
import { getTickets } from "@/lib/account-db";
import TicketsView from "@/components/account/TicketsView";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const { accountUser } = await requireAccountUser("/account/tickets");
  const tickets = await getTickets();
  return <TicketsView user={accountUser} tickets={tickets} />;
}
