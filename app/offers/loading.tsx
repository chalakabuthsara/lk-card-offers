import { Skeleton } from "@/components/ui/skeleton";
import { OfferCardSkeleton } from "@/components/site/offer-card-skeleton";

export default function OffersLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <Skeleton className="h-8 w-40 rounded-xl" />
        </div>
        <div className="shrink-0 text-right">
          <Skeleton className="h-6 w-16 rounded-md mb-1 inline-block" />
          <Skeleton className="h-3 w-10 rounded-sm ml-auto block" />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block space-y-6">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </aside>
        
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <OfferCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
