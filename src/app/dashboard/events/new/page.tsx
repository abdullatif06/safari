import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireBusiness } from "@/lib/auth-guards";
import { createEvent } from "@/app/dashboard/actions";
import PageShell from "@/components/PageShell";
import EventForm from "@/components/dashboard/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  await requireBusiness();

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
            New event
          </h1>
          <p className="mt-3 text-ink-soft">
            Fill in the details below. Your event goes live after a quick review.
          </p>
          <div className="mt-8">
            <EventForm action={createEvent} submitLabel="Submit for review" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
