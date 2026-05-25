import type { Metadata } from "next";
import Link from "next/link";
import { listOffers } from "@/lib/queries-server/offers";
import { getBankCounts, getCategoryCounts } from "@/lib/queries-server/home";
import { OfferCard } from "@/components/site/offer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Disclaimer } from "@/components/site/disclaimer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "LK Card Offers — Sri Lankan credit & debit card promotions",
  description: "Browse the latest credit and debit card offers from Sri Lankan banks — DFCC, Commercial, HNB, NDB, Nations Trust, People's Bank. Filter by bank, card type, and category.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "LK Card Offers — Sri Lankan credit & debit card promotions",
    description: "Browse the latest credit and debit card offers from Sri Lankan banks.",
  },
};

const SEVEN_DAYS_MS = 7 * 86400000;

export default async function HomePage() {
  const now = new Date();
  const sevenDaysOut = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString().slice(0, 10);

  const [categories, banks, latest, endingSoon] = await Promise.all([
    getCategoryCounts(),
    getBankCounts(),
    listOffers({ pageSize: 12 }),
    listOffers({ pageSize: 4, sort: "ending_soon", endsBefore: sevenDaysOut }),
  ]);

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Hero */}
      <section className="relative text-center space-y-6 pt-16 pb-8">
        {/* Animated Background Graphics */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-chart-1/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob [animation-delay:2s]" />
          <div className="absolute -bottom-8 left-[40%] w-72 h-72 bg-chart-2/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob [animation-delay:4s]" />
        </div>

        <h1 className="relative animate-fade-up text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight text-foreground leading-tight">
          Discover the best <span className="text-muted-foreground">card offers.</span>
        </h1>
        <p className="animate-fade-up [animation-delay:150ms] mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
          A community-curated catalog of credit and debit card promotions from Sri Lankan banks. No scraping, no expired clutter.
        </p>
        <div className="animate-fade-up [animation-delay:300ms]">
          <form action="/offers" className="mx-auto mt-8 flex max-w-md items-center gap-2 bg-card rounded-full p-2 border border-border shadow-sm focus-within:ring-2 focus-within:ring-ring/50 transition-all">
            <div className="pl-4 flex items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.75} />
            </div>
            <Input
              name="q"
              placeholder="Search merchants, banks, or categories…"
              className="border-0 shadow-none focus-visible:ring-0 text-sm px-2 h-12 flex-1 bg-transparent dark:bg-transparent placeholder:text-sm"
            />
          </form>
        </div>
        <div className="animate-fade-up [animation-delay:450ms] pt-6 flex flex-wrap justify-center gap-2">
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/offers?category=${c.id}`}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/offers" className="px-4 py-2 bg-transparent text-sm font-medium rounded-full text-primary hover:bg-muted transition-colors">
            View all categories →
          </Link>
        </div>
      </section>

      {/* Latest Offers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest added</h2>
          <Link href="/offers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        {latest.items.length === 0 ? (
          <div className="bg-muted p-12 text-center rounded-2xl text-muted-foreground">
            No offers yet. Be the first to submit one.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latest.items.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* Ending Soon */}
      {endingSoon.items.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Ending this week</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {endingSoon.items.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Issuers */}
      {banks.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Browse by issuer</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banks.map((b) => (
              <Link
                key={b.id}
                href={`/offers?bank=${b.id}`}
                className="group p-6 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {b.name}
                </span>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                  {b.count} offers
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="grid md:grid-cols-2 gap-6 pt-8">
        <div className="bg-card border border-border p-8 rounded-3xl transition-transform hover:-translate-y-1 hover:shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight mb-2">Spotted a deal we missed?</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Anyone with an account can submit an offer. Our maintainers review and publish promptly.</p>
          <Link href="/submit">
            <Button size="lg" className="rounded-full">Submit an offer</Button>
          </Link>
        </div>
        <div className="bg-card border border-border p-8 rounded-3xl transition-transform hover:-translate-y-1 hover:shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight mb-2">Want to help curate?</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Sign up, then request maintainer access from your account page. Curate, publish, and keep the catalog fresh.</p>
          <Link href="/account">
            <Button variant="outline" size="lg" className="rounded-full">Become a maintainer</Button>
          </Link>
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
