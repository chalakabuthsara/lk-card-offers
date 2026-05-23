import { Skeleton } from "@/components/ui/skeleton";
import { OfferCardSkeleton } from "@/components/site/offer-card-skeleton";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Loading() {
  return (
    <div className="space-y-16 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Hero Skeleton */}
      <section className="text-center space-y-6 pt-16 pb-8">
        <Skeleton className="h-[60px] md:h-[80px] w-4/5 lg:w-2/3 mx-auto rounded-3xl" />
        <Skeleton className="h-6 w-3/4 md:w-1/2 mx-auto rounded-xl mt-6" />
        
        <div className="mx-auto mt-8 flex max-w-md items-center gap-2 bg-card rounded-full p-2 border border-border shadow-sm">
          <div className="pl-4 flex items-center justify-center text-muted-foreground/50">
            <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.75} />
          </div>
          <Skeleton className="h-10 w-full bg-transparent mx-2" />
        </div>
        
        <div className="pt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </section>

      {/* Latest Offers Skeleton */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
