import { Skeleton } from "@/components/ui/skeleton";

export default function OfferDetailLoading() {
  return (
    <article className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-700">
      <nav className="mb-4">
        <Skeleton className="h-4 w-24 rounded-md" />
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <Skeleton className="h-6 w-20 rounded-full mb-2" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-3/4 rounded-2xl" />
            
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
            </div>
          </header>

          <Skeleton className="aspect-video w-full rounded-3xl" />

          <section className="space-y-4 pt-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 border border-border rounded-3xl p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>

            <div className="h-px w-full bg-border" />

            <section className="space-y-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>

              <div className="space-y-3 pt-4">
                <Skeleton className="h-4 w-20 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
            </section>

            <div className="pt-4">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
