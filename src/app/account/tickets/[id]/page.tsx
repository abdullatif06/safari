import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { getCurrentUser, getTicket } from "@/lib/account-db";
import TicketView from "@/components/account/TicketView";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/account/tickets/${id}`);

  const ticket = await getTicket(id);
  if (!ticket) notFound();

  // Encode a verification payload the organizer can scan at the entrance.
  const payload = JSON.stringify({
    t: "saifi-ticket",
    rsvp: ticket.rsvpId,
    event: ticket.event.id,
    user: user.id,
  });
  const qrDataUrl = await QRCode.toDataURL(payload, {
    margin: 1,
    width: 320,
    color: { dark: "#211B17", light: "#FFFFFF" },
  });

  return <TicketView ticket={ticket} qrDataUrl={qrDataUrl} userEmail={user.email ?? ""} />;
}
