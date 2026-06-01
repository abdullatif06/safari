import PageShell from "@/components/PageShell";

export default function Loading() {
  return (
    <PageShell>
      <div className="w-full animate-pulse">
        <div className="aspect-[21/9] w-full bg-sand-200" />
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          <div className="h-9 w-3/4 rounded-xl bg-sand-200" />
          <div className="mt-4 flex gap-3">
            <div className="h-6 w-24 rounded-full bg-sand-200" />
            <div className="h-6 w-20 rounded-full bg-sand-200" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded-lg bg-sand-200" />
            <div className="h-4 w-5/6 rounded-lg bg-sand-200" />
            <div className="h-4 w-4/6 rounded-lg bg-sand-200" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
