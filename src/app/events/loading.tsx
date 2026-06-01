import PageShell from "@/components/PageShell";

export default function Loading() {
  return (
    <PageShell>
      <div className="w-full animate-pulse px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-48 rounded-xl bg-sand-200" />
          <div className="mt-3 h-5 w-80 rounded-xl bg-sand-200" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-sand-200">
                <div className="aspect-[4/3]" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded-lg bg-sand-100" />
                  <div className="h-3 w-1/2 rounded-lg bg-sand-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
