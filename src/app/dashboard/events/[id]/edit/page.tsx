import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireBusiness } from "@/lib/auth-guards";
import { getOwnerEvent } from "@/lib/dashboard-db";
import { updateEvent, deleteEvent } from "@/app/dashboard/actions";
import PageShell from "@/components/PageShell";
import EventForm from "@/components/dashboard/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireBusiness();
  const { id } = await params;
  const event = await getOwnerEvent(me.id, id);
  if (!event) notFound();

  return (
    <PageShell>
      <section className="w-full px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Edit event
          </h1>
          <p className="mt-3 text-ink-soft">
            Changes to a live event stay live — no re-review needed.
          </p>

          <div className="mt-8">
            <EventForm action={updateEvent} event={event} submitLabel="Save changes" />
          </div>

          {/* Danger zone */}
          <div className="mt-12 border-t border-line pt-6">
            <form action={deleteEvent}>
              <input type="hidden" name="eventId" value={event.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-opacity hover:opacity-80"
              >
                <Trash2 size={15} /> Delete this event
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
