import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PublicOfferListItem } from "@/lib/queries-server/offers";

function daysLeft(end: string) {
  const ms = new Date(end).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  return days;
}

export function OfferCard({ offer }: { offer: PublicOfferListItem }) {
  const remaining = daysLeft(offer.endDate);

  return (
    <article className="group flex flex-col gap-3">
      <Link href={`/offers/${offer.id}`} className="block relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted w-full">
        {offer.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground transition-transform duration-300 group-hover:scale-105">
            {offer.merchant?.name ?? "Offer"}
          </div>
        )}
        {remaining <= 7 && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="bg-destructive/90 text-white backdrop-blur shadow-sm rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider">
              {remaining === 0 ? "Ends today" : `Ends in ${remaining}d`}
            </Badge>
          </div>
        )}
      </Link>
      
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/offers/${offer.id}`} className="inline-block">
            <h3 className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {offer.title}
            </h3>
          </Link>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          {offer.merchant && (
            <span className="font-medium">{offer.merchant.name}</span>
          )}
          {offer.merchant && <span className="opacity-50">•</span>}
          <span className="truncate">{offer.banks?.[0]?.name}</span>
        </div>
      </div>
    </article>
  );
}
