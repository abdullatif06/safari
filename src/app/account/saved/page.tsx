import { requireAccountUser } from "@/lib/auth-guards";
import { getSavedEvents } from "@/lib/account-db";
import SavedView from "@/components/account/SavedView";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const { accountUser } = await requireAccountUser("/account/saved");
  const events = await getSavedEvents();
  return <SavedView user={accountUser} events={events} />;
}
