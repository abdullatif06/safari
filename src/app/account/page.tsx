import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth-guards";
import { getSavedEvents, getTickets, getMyReviews } from "@/lib/account-db";
import AccountDashboard from "@/components/account/AccountDashboard";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const me = await getSessionProfile();
  if (!me) redirect("/login?next=/account");

  const [saved, tickets, reviews, { saved: savedParam }] = await Promise.all([
    getSavedEvents(),
    getTickets(),
    getMyReviews(),
    searchParams,
  ]);

  const name = me.fullName ?? me.email.split("@")[0] ?? "there";

  const today = new Date().toISOString().slice(0, 10);
  // Sort upcoming tickets by event date ascending so the soonest is first.
  const upcomingTickets = tickets
    .filter((tk) => tk.event.date >= today)
    .sort((a, b) => a.event.date.localeCompare(b.event.date));

  return (
    <AccountDashboard
      user={{
        id: me.id,
        name,
        email: me.email,
        role: me.role,
        avatarUrl: me.avatarUrl,
      }}
      isBusiness={me.role === "business" || me.role === "admin"}
      counts={{
        saved: saved.length,
        tickets: tickets.length,
        reviews: reviews.length,
      }}
      nextTicket={upcomingTickets[0] ?? null}
      recentSaved={saved.slice(0, 3)}
      showSavedBanner={savedParam === "1"}
    />
  );
}
