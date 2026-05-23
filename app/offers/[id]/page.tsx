import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfferById } from "@/lib/queries-server/offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Disclaimer } from "@/components/site/disclaimer";
import { JsonLd } from "@/components/site/json-ld";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export const revalidate = 300;

function siteUrl() {
  return (
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) return { title: "Offer not found" };

  const todayStr = new Date().toISOString().slice(0, 10);
  if (offer.status !== "published" || offer.endDate < todayStr) {
    return { title: "Offer not found" };
  }

  const description = offer.description.slice(0, 200).replace(/\s+/g, " ");
  const title = `${offer.title} · ${offer.merchant?.name ?? "LK Card Offers"}`;
  const ogImage = offer.imageUrl
    ? offer.imageUrl.startsWith("http")
      ? offer.imageUrl
      : `${siteUrl()}${offer.imageUrl}`
    : `${siteUrl()}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl()}/offers/${offer.id}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteUrl()}/offers/${offer.id}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function daysLeft(end: string) {
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();

  const todayStr = new Date().toISOString().slice(0, 10);
  if (offer.status !== "published" || offer.endDate < todayStr) notFound();

  const remaining = daysLeft(offer.endDate);
  const base = siteUrl();
  const offerUrl = `${base}/offers/${offer.id}`;
  const offerImage = offer.imageUrl
    ? offer.imageUrl.startsWith("http")
      ? offer.imageUrl
      : `${base}${offer.imageUrl}`
    : `${base}/og-default.png`;

  // Article fits better than schema.org Offer here — `Offer` requires
  // price/priceCurrency/availability, but these are merchant promotions
  // (discounts, BOGO, etc.) attached to existing cards, not products for
  // sale. Article still earns rich-result eligibility and lets Google
  // surface the byline + image. `temporalCoverage` carries the
  // promotion's validity window in ISO 8601 interval form.
  //
  // `datePublished`/`dateModified` are intentionally omitted: the
  // `getOfferById` query doesn't select offer timestamps and adding them
  // would expand the public type used elsewhere. The schema is still
  // valid without them.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: offer.title,
    description: offer.description.slice(0, 500).replace(/\s+/g, " "),
    image: [offerImage],
    author: { "@type": "Organization", name: "LK Card Offers" },
    publisher: {
      "@type": "Organization",
      name: "LK Card Offers",
      logo: { "@type": "ImageObject", url: `${base}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": offerUrl },
    about: offer.merchant?.name,
    articleSection: offer.category?.name,
    temporalCoverage: `${offer.startDate}/${offer.endDate}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${base}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Offers",
        item: `${base}/offers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: offer.merchant?.name ?? offer.title,
        item: offerUrl,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-5xl space-y-8">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-4">
        <Link
          href="/offers"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to offers
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Main Content: Left Column (spans 7 or 8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {offer.category && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary text-secondary-foreground">
                  {offer.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl lg:text-4xl">
              {offer.title}
            </h1>

            {offer.merchant && (
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {offer.merchant.name.substring(0, 1)}
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Merchant</div>
                  <div className="font-semibold text-base text-foreground">
                    {offer.merchant.name}
                  </div>
                </div>
              </div>
            )}
          </header>

          {offer.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="aspect-video w-full rounded-3xl object-cover bg-muted"
              loading="lazy"
            />
          )}

          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold tracking-tight">About this offer</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {offer.description}
            </p>
          </section>
        </div>

        {/* Sidebar: Right Column (spans 4 or 5 columns) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-card border border-border rounded-3xl p-6 space-y-6">
            
            {/* Urgency & Validity */}
            <div className="space-y-2">
              {remaining > 0 ? (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Ends in {remaining} days
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-sm font-semibold">
                  Expired
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground pt-2">
                Valid {formatDate(offer.startDate)} – {formatDate(offer.endDate)}
              </p>
            </div>

            <Separator />

            {/* Eligibility Hub */}
            <section className="space-y-4">
              <h3 className="font-semibold text-foreground">Eligibility</h3>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Banks</div>
                {offer.banks.length ? (
                  <ul className="space-y-2">
                    {offer.banks.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-2 text-sm text-foreground font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                        <span>{b.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-sm font-medium text-muted-foreground">Card types</div>
                {offer.cardTypes.length ? (
                  <div className="flex flex-wrap gap-2">
                    {offer.cardTypes.map((c) => (
                      <Badge
                        key={c.id}
                        variant="outline"
                        className="rounded-lg font-medium bg-background"
                      >
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </section>

            {/* CTA */}
            <div className="pt-4">
              <a href={offer.sourceUrl} target="_blank" rel="noreferrer" className="block w-full">
                <Button className="w-full rounded-full h-12 text-base font-semibold gap-2">
                  View official source
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={2.5} />
                </Button>
              </a>
            </div>

          </div>
        </aside>
      </div>

      <div className="pt-8 border-t border-border mt-12">
        <Disclaimer />
      </div>
    </article>
  );
}
