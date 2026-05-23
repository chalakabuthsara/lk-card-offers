import { Skeleton } from "@/components/ui/skeleton";

export function OfferCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <Skeleton className="h-4 w-3/5 mt-1" />
    </div>
  );
}
