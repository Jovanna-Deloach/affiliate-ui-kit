"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ArrowDownRight, ArrowUpRight, Minus, Scale, Trash2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatDate, formatPrice, formatScore } from "@/lib/format";
import { cheapestOffer } from "@/lib/offers";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AwardBadge } from "@/primitives/award-badge";
import { Button } from "@/primitives/button";
import { GuideIndexCard } from "@/primitives/guide-index-card";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { SurfaceCard, SurfaceCardFooter, SurfaceCardMedia } from "@/primitives/surface-card";
import type { SavedGuide, SavedProduct } from "@/types/account";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * <SavedDossierGrid />
 * ---------------------------------------------------------------------------
 * The member's saved products and guides, with live price-delta tracking.
 *
 *   Saved products (8) │ Saved guides (4)          ← tab bar, ink rule
 *   ─────────────────────────────────────────────
 *   ┌───────────┐ ┌───────────┐ ┌───────────┐
 *   │ media     │ │           │ │           │
 *   │ BRAND     │ │           │ │           │
 *   │ Name  9.2 │ │           │ │           │
 *   ├ recessed ─┤ ├───────────┤ ├───────────┤
 *   │ Saved Oct 12 at $210 → Now $189 (−10%) │   price-history banner
 *   ├ action bar┤                               │   positive ink on a drop
 *   │ [View deal] [Compare] [⌫]                  │
 *   └───────────┘
 *
 *   --surface-recessed / --inset-bar-*    banner + action bar
 *   --status-positive-ink / -caution-ink  drop / rise
 *   --gap-grid                            card grid
 *
 * Mobbin anatomy (Trip.com Price Alerts / Saved tabs, Thrive Market −21%
 * delta chips, Klarna saved sheet): a quiet tab strip, the delta as the
 * card's loudest line. Radix Tabs with an ink rule; the guides tab reuses
 * <GuideIndexCard /> with a Remove control on its footer bar.
 */

export interface SavedDossierGridProps {
  savedProducts: SavedProduct[];
  savedGuides: SavedGuide[];
  defaultTab?: "products" | "guides";
  attribution?: AffiliateAttribution;
  placement?: string;
  onRemove?: (kind: "product" | "guide", id: string) => void;
  onCompare?: (productId: string) => void;
  className?: string;
}

const tabClass = cn(
  "focus-ring relative -mb-[var(--border-width)] inline-flex h-control cursor-pointer items-center gap-cluster rounded-control px-cluster",
  "text-body-sm font-medium text-ink-secondary transition-colors duration-interactive ease-standard hover:text-ink",
  "border-b-emphasis border-transparent data-[state=active]:border-ink data-[state=active]:text-ink",
);

export function SavedDossierGrid({
  savedProducts,
  savedGuides,
  defaultTab = "products",
  attribution,
  placement = "saved-dossier",
  onRemove,
  onCompare,
  className,
}: SavedDossierGridProps) {
  const [products, setProducts] = useState(savedProducts);
  const [guides, setGuides] = useState(savedGuides);

  const removeProduct = (id: string) => {
    setProducts((list) => list.filter((s) => s.product.id !== id));
    onRemove?.("product", id);
  };
  const removeGuide = (id: string) => {
    setGuides((list) => list.filter((s) => s.guide.id !== id));
    onRemove?.("guide", id);
  };

  return (
    <Tabs.Root defaultValue={defaultTab} data-slot="saved-dossier-grid" className={cn("@container flex w-full min-w-0 flex-col gap-grid", className)}>
      <Tabs.List aria-label="Saved items" className="flex items-end gap-stack border-b border-hairline">
        <Tabs.Trigger value="products" className={tabClass}>
          Saved products
          <Counter value={products.length} />
        </Tabs.Trigger>
        <Tabs.Trigger value="guides" className={tabClass}>
          Saved guides
          <Counter value={guides.length} />
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="products" className="outline-none">
        {products.length === 0 ? (
          <Empty>Nothing saved yet — the bookmark on any scorecard adds it here.</Empty>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 items-start gap-grid p-0 @md:grid-cols-2 @3xl:grid-cols-3">
            {products.map((saved) => (
              <SavedProductCard
                key={saved.product.id}
                saved={saved}
                attribution={attribution}
                placement={placement}
                onRemove={() => removeProduct(saved.product.id)}
                onCompare={onCompare ? () => onCompare(saved.product.id) : undefined}
              />
            ))}
          </ul>
        )}
      </Tabs.Content>

      <Tabs.Content value="guides" className="outline-none">
        {guides.length === 0 ? (
          <Empty>No saved guides — save one from any category hub.</Empty>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 items-start gap-grid p-0 @md:grid-cols-2 @3xl:grid-cols-3">
            {guides.map((saved) => (
              <li key={saved.guide.id} className="min-w-0">
                <GuideIndexCard
                  guide={saved.guide}
                  footerAction={
                    <Button intent="ghost" size="sm" aria-label={`Remove ${saved.guide.title} from your dossier`} onClick={() => removeGuide(saved.guide.id)}>
                      <Trash2 size="1em" strokeWidth={1.5} aria-hidden="true" />
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="type-metric rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y text-caption text-ink-secondary">{value}</span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="m-0 rounded-inner border border-hairline bg-recessed p-well text-body-sm text-ink-secondary">{children}</p>;
}

function SavedProductCard({
  saved,
  attribution,
  placement,
  onRemove,
  onCompare,
}: {
  saved: SavedProduct;
  attribution?: AffiliateAttribution;
  placement: string;
  onRemove: () => void;
  onCompare?: () => void;
}) {
  const { product } = saved;
  const offer = cheapestOffer(product);
  const currency = saved.currency ?? offer?.currency ?? "USD";
  const now = offer?.price;
  const delta = now !== undefined ? now - saved.savedPrice : undefined;
  const pct = delta !== undefined && saved.savedPrice > 0 ? Math.round((delta / saved.savedPrice) * 100) : undefined;
  const tone = delta === undefined || delta === 0 ? "flat" : delta < 0 ? "drop" : "rise";
  const DeltaIcon = tone === "drop" ? ArrowDownRight : tone === "rise" ? ArrowUpRight : Minus;

  return (
    <SurfaceCard as="li" data-slot="saved-product-card" data-delta={tone} className="h-full">
      <SurfaceCardMedia>
        <ProductMediaFrame
          as="div"
          media={product.media}
          treatment="contain"
          hover="none"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          badge={product.awardBadge ? <AwardBadge badge={product.awardBadge} size="sm" /> : undefined}
        />
      </SurfaceCardMedia>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-stack">
        <div className="flex min-w-0 flex-col gap-hairline">
          <span className="type-eyebrow truncate text-ink-tertiary">{product.eyebrow ?? product.brand}</span>
          <span className="truncate text-body font-medium text-ink">
            {product.brand} {product.name}
          </span>
        </div>
        {product.overallScore !== undefined && (
          <span className="type-metric text-body text-ink">
            {formatScore(product.overallScore)}
            <span className="font-normal text-ink-tertiary"> / 10</span>
          </span>
        )}
      </div>

      {/* Price history banner — the card's loudest line; wraps, never clips */}
      <p
        data-slot="price-history"
        className="m-0 -mx-card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-cluster border-y border-hairline bg-recessed px-bar-x py-row-compact text-caption text-ink-secondary"
      >
        <DeltaIcon
          size="1.1em"
          strokeWidth={1.5}
          aria-hidden="true"
          className={cn("mt-[0.15em]", tone === "drop" && "text-positive-ink", tone === "rise" && "text-caution-ink", tone === "flat" && "text-ink-tertiary")}
        />
        <span className="flex min-w-0 flex-wrap gap-x-cluster">
          <span className="whitespace-nowrap">
            Saved {formatDate(saved.savedAt)} at <span className="type-metric text-ink">{formatPrice(saved.savedPrice, currency)}</span>
          </span>
          {now !== undefined && (
            <span className="whitespace-nowrap">
              → Now{" "}
              <span className={cn("type-metric", tone === "drop" ? "text-positive-ink" : tone === "rise" ? "text-caution-ink" : "text-ink")}>
                {formatPrice(now, currency)}
              </span>
              {pct !== undefined && pct !== 0 && (
                <span className={cn("type-metric", tone === "drop" ? "text-positive-ink" : "text-caution-ink")}>
                  {" "}
                  ({pct > 0 ? "+" : "−"}
                  {Math.abs(pct)}%)
                </span>
              )}
            </span>
          )}
        </span>
      </p>

      <SurfaceCardFooter variant="action-bar" className="flex-nowrap">
        {offer ? (
          <AffiliateAction
            href={offer.affiliateUrl}
            attribution={attribution}
            tracking={{ merchant: offer.merchantName, offerId: offer.id, productId: product.id, placement }}
            size="sm"
            className="min-w-0"
          >
            View deal
          </AffiliateAction>
        ) : (
          <span className="text-caption text-ink-tertiary">No live offer</span>
        )}
        <span className="flex shrink-0 items-center gap-hairline">
          {onCompare && (
            <Button intent="ghost" size="sm" onClick={onCompare}>
              <Scale size="1em" strokeWidth={1.5} aria-hidden="true" />
              Compare
            </Button>
          )}
          <Button intent="ghost" size="sm" aria-label={`Remove ${product.brand} ${product.name} from your dossier`} onClick={onRemove}>
            <Trash2 size="1em" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </span>
      </SurfaceCardFooter>
    </SurfaceCard>
  );
}
