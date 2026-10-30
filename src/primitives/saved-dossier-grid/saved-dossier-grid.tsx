"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight, Ellipsis, Scale, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import { cheapestOffer } from "@/lib/offers";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { Button } from "@/primitives/button";
import { GuideIndexCard } from "@/primitives/guide-index-card";
import { Select } from "@/primitives/select";
import { Sparkline } from "@/primitives/sparkline";
import { Switch } from "@/primitives/switch";
import type { SavedGuide, SavedProduct } from "@/types/account";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * <SavedDossierGrid />
 * ---------------------------------------------------------------------------
 * The member's saved products as a price LEDGER — finance-watchlist grammar
 * (Perplexity Finance, Uniswap, Copilot Money, Monarch) applied to products:
 * the movement since saving is the product, not a footnote.
 *
 *   Saved products [8] │ Saved guides [4]              Sort: Biggest drop ▾
 *   ┌ recessed strip ───────────────────────────────────────────────────────┐
 *   │ 8 SAVED │ 4 DROPPED SINCE SAVED │ 1 RISEN │ $71 YOU'D SAVE TODAY      │
 *   └───────────────────────────────────────────────────────────────────────┘
 *   ┌ mover ──────────┐ ┌ mover ──────────┐ ┌ mover ──────────┐   top three
 *   │ [▣] Strata  −21% │ │ [▣] Creatine −12%│ │ [▣] Aerolite −10%│   drops
 *   │ ▁▂▂▃▅▇ $189→$149 │ │ …               │ │ …               │
 *   └─────────────────┘ └─────────────────┘ └─────────────────┘
 *   PRODUCT              SAVED → NOW       Δ      30 DAYS   WATCH
 *   ─ Dropped since saved · 4 ──────────────────────────────────── band
 *   [▣] Veloce Strata    $189 → $149     −21%   ▅▄▃▂▁    (●)  [View deal] ⋯
 *       Northlane · saved Oct 25
 *   ─ Unchanged · 3 ─────────────────────────────────────────────
 *   ─ Risen · 1 ─────────────────────────────────────────────────
 *
 *   --keyline-thumbnail / --keyline-figure / --keyline-status   the tracks
 *   --size-sparkline × --size-sparkline-h                       the glyph
 *   --status-positive-* / --status-caution-*                    drop · rise
 *   --surface-recessed                                          strip + bands
 *
 * Grouping is by movement (dropped / unchanged / risen); the sort reorders
 * within groups. Below a 48rem container the figures drop under the title
 * and the actions to a third line — the thumbnail keyline holds. The
 * guides tab reuses <GuideIndexCard /> with a Remove control on its footer.
 */

export type DossierSort = "biggest-drop" | "recent" | "name";

export interface SavedDossierGridProps {
  savedProducts: SavedProduct[];
  savedGuides: SavedGuide[];
  defaultTab?: "products" | "guides";
  defaultSort?: DossierSort;
  attribution?: AffiliateAttribution;
  placement?: string;
  onRemove?: (kind: "product" | "guide", id: string) => void;
  onCompare?: (productId: string) => void;
  onWatchChange?: (productId: string, watching: boolean) => void;
  className?: string;
}

type Tone = "drop" | "rise" | "flat";

interface Row {
  saved: SavedProduct;
  now?: number;
  currency: string;
  delta: number;
  pct: number;
  tone: Tone;
  merchant?: string;
  offerId?: string;
  affiliateUrl?: string;
}

const SORT_OPTIONS = [
  { value: "biggest-drop", label: "Biggest drop" },
  { value: "recent", label: "Most recently saved" },
  { value: "name", label: "Name" },
];

const GROUPS: { tone: Tone; label: string }[] = [
  { tone: "drop", label: "Dropped since saved" },
  { tone: "flat", label: "Unchanged" },
  { tone: "rise", label: "Risen" },
];

const tabClass = cn(
  "focus-ring relative -mb-[var(--border-width)] inline-flex h-control cursor-pointer items-center gap-cluster rounded-control px-cluster",
  "text-body-sm font-medium text-ink-secondary transition-colors duration-interactive ease-standard hover:text-ink",
  "border-b-emphasis border-transparent data-[state=active]:border-ink data-[state=active]:text-ink",
);

/**
 * The ledger owns the tracks and every row is a subgrid, so the figure, Δ,
 * sparkline and action columns share one axis across all rows (a per-row
 * grid would size its `max-content` / `auto` tracks independently). The
 * first and last tracks are zero-width gutters: with the column gap they
 * inset every row by one gap, so rows need no horizontal padding (a
 * subgrid's padding would be carved out of the thumbnail track).
 */
const MOBILE_TRACKS = "grid-cols-[0_var(--keyline-thumbnail)_minmax(0,1fr)_auto_0]";
const DESKTOP_TRACKS =
  "@3xl:grid-cols-[0_var(--keyline-thumbnail)_minmax(180px,1.5fr)_minmax(var(--keyline-figure),max-content)_var(--keyline-status)_var(--size-sparkline)_auto_auto_0]";
const ROW = "col-span-full grid grid-cols-subgrid items-center gap-y-cluster";

function toRow(saved: SavedProduct): Row {
  const offer = cheapestOffer(saved.product);
  const currency = saved.currency ?? offer?.currency ?? "USD";
  const now = offer?.price;
  const delta = now !== undefined ? now - saved.savedPrice : 0;
  const pct = saved.savedPrice > 0 ? Math.round((delta / saved.savedPrice) * 100) : 0;
  const tone: Tone = delta < 0 ? "drop" : delta > 0 ? "rise" : "flat";
  return { saved, now, currency, delta, pct, tone, merchant: offer?.merchantName, offerId: offer?.id, affiliateUrl: offer?.affiliateUrl };
}

export function SavedDossierGrid({
  savedProducts,
  savedGuides,
  defaultTab = "products",
  defaultSort = "biggest-drop",
  attribution,
  placement = "saved-dossier",
  onRemove,
  onCompare,
  onWatchChange,
  className,
}: SavedDossierGridProps) {
  const [products, setProducts] = useState(savedProducts);
  const [guides, setGuides] = useState(savedGuides);
  const [sort, setSort] = useState<DossierSort>(defaultSort);

  const rows = useMemo(() => {
    const list = products.map(toRow);
    const by: Record<DossierSort, (a: Row, b: Row) => number> = {
      "biggest-drop": (a, b) => a.pct - b.pct,
      recent: (a, b) => b.saved.savedAt.localeCompare(a.saved.savedAt),
      name: (a, b) => `${a.saved.product.brand} ${a.saved.product.name}`.localeCompare(`${b.saved.product.brand} ${b.saved.product.name}`),
    };
    return list.sort(by[sort]);
  }, [products, sort]);

  const dropped = rows.filter((r) => r.tone === "drop");
  const risen = rows.filter((r) => r.tone === "rise");
  const savings = dropped.reduce((sum, r) => sum + Math.abs(r.delta), 0);
  const currency = rows[0]?.currency ?? "USD";
  // Movers are always the three biggest drops, whatever the ledger's sort.
  const movers = [...dropped].sort((a, b) => a.pct - b.pct).slice(0, 3);

  const removeProduct = (id: string) => {
    setProducts((list) => list.filter((s) => s.product.id !== id));
    onRemove?.("product", id);
  };
  const removeGuide = (id: string) => {
    setGuides((list) => list.filter((s) => s.guide.id !== id));
    onRemove?.("guide", id);
  };
  const setWatching = (id: string, watching: boolean) => {
    setProducts((list) => list.map((s) => (s.product.id === id ? { ...s, watching } : s)));
    onWatchChange?.(id, watching);
  };

  return (
    <Tabs.Root defaultValue={defaultTab} data-slot="saved-dossier-grid" className={cn("@container flex w-full min-w-0 flex-col gap-grid", className)}>
      {/* Toolbar: tabs on the left keyline, sort on the right */}
      <div className="grid grid-cols-1 items-end gap-x-stack gap-y-cluster border-b border-hairline @xl:grid-cols-[minmax(0,1fr)_auto]">
        <Tabs.List aria-label="Saved items" className="flex items-end gap-stack">
          <Tabs.Trigger value="products" className={tabClass}>
            Saved products
            <Counter value={products.length} />
          </Tabs.Trigger>
          <Tabs.Trigger value="guides" className={tabClass}>
            Saved guides
            <Counter value={guides.length} />
          </Tabs.Trigger>
        </Tabs.List>
        <div className="pb-cluster @xl:justify-self-end">
          <Select label="Sort saved products" prefix="Sort" size="sm" options={SORT_OPTIONS} value={sort} onValueChange={(v) => setSort(v as DossierSort)} />
        </div>
      </div>

      <Tabs.Content value="products" className="flex flex-col gap-grid outline-none">
        {products.length === 0 ? (
          <Empty>Nothing saved yet — the bookmark on any scorecard adds it here.</Empty>
        ) : (
          <>
            {/* Summary strip — Plane 2 */}
            <dl
              data-slot="dossier-summary"
              className="m-0 grid grid-cols-2 gap-y-stack rounded-inner border border-hairline bg-recessed px-cell-x py-compact @xl:grid-cols-4 @xl:divide-x @xl:divide-hairline"
            >
              <Stat value={products.length} label="Saved" />
              <Stat value={dropped.length} label="Dropped since saved" tone={dropped.length ? "positive" : undefined} />
              <Stat value={risen.length} label="Risen" tone={risen.length ? "caution" : undefined} />
              <Stat value={formatPrice(savings, currency)} label="You'd save today" tone={savings > 0 ? "positive" : undefined} />
            </dl>

            {/* Movers — the three biggest drops */}
            {movers.length > 0 && (
              <ul data-slot="dossier-movers" aria-label="Biggest drops" className="m-0 grid list-none grid-cols-1 gap-grid p-0 @xl:grid-cols-3">
                {movers.map((row) => (
                  <MoverTile key={row.saved.product.id} row={row} />
                ))}
              </ul>
            )}

            {/* Ledger — one grid, subgrid rows */}
            <div
              data-slot="dossier-ledger"
              role="table"
              aria-label="Saved products"
              className={cn("grid w-full min-w-0 gap-x-stack overflow-hidden rounded-container border border-hairline bg-surface", MOBILE_TRACKS, DESKTOP_TRACKS)}
            >
              <div role="row" className={cn(ROW, "hidden py-row-compact @3xl:grid")}>
                <span role="columnheader" className="col-start-2">
                  <span className="sr-only">Thumbnail</span>
                </span>
                <Header className="col-start-3">Product</Header>
                <Header className="col-start-4">Saved → now</Header>
                <Header className="col-start-5">Change</Header>
                <Header className="col-start-6">30 days</Header>
                <Header className="col-start-7">Watch</Header>
                <span role="columnheader" className="col-start-8">
                  <span className="sr-only">Actions</span>
                </span>
              </div>
              {GROUPS.map((group) => {
                const members = rows.filter((r) => r.tone === group.tone);
                if (members.length === 0) return null;
                return (
                  <div key={group.tone} role="rowgroup" data-group={group.tone} className="contents">
                    <div role="row" className="col-span-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack bg-recessed px-cell-x py-row-compact">
                      <span role="rowheader" className="type-eyebrow text-ink-secondary">
                        {group.label}
                      </span>
                      <span className="type-metric text-caption text-ink-tertiary">{members.length}</span>
                    </div>
                    {members.map((row) => (
                      <LedgerRow
                        key={row.saved.product.id}
                        row={row}
                        attribution={attribution}
                        placement={placement}
                        onRemove={() => removeProduct(row.saved.product.id)}
                        onCompare={onCompare ? () => onCompare(row.saved.product.id) : undefined}
                        onWatch={(watching) => setWatching(row.saved.product.id, watching)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </>
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

/* ------------------------------------------------------------------------ */

function Counter({ value }: { value: number }) {
  return <span className="type-metric rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y text-caption text-ink-secondary">{value}</span>;
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="m-0 rounded-inner border border-hairline bg-recessed p-well text-body-sm text-ink-secondary">{children}</p>;
}

function Header({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span role="columnheader" className={cn("type-eyebrow text-ink-tertiary", className)}>
      {children}
    </span>
  );
}

function Stat({ value, label, tone }: { value: ReactNode; label: string; tone?: "positive" | "caution" }) {
  return (
    <div className="flex min-w-0 flex-col gap-hairline @xl:px-stack @xl:first:pl-0">
      <dt className="type-eyebrow order-2 text-ink-tertiary">{label}</dt>
      <dd className={cn("type-metric order-1 m-0 text-title", tone === "positive" ? "text-positive-ink" : tone === "caution" ? "text-caution-ink" : "text-ink")}>{value}</dd>
    </div>
  );
}

function DeltaChip({ row, size = "sm" }: { row: Row; size?: "sm" | "md" }) {
  const sign = row.tone === "drop" ? "−" : row.tone === "rise" ? "+" : "";
  return (
    <span
      data-slot="delta-chip"
      data-tone={row.tone}
      className={cn(
        "type-metric inline-flex items-center justify-center whitespace-nowrap rounded-tag px-tag-x py-tag-y",
        size === "md" ? "text-body-sm" : "text-caption",
        row.tone === "drop" && "bg-positive-soft text-positive-ink",
        row.tone === "rise" && "bg-caution-soft text-caution-ink",
        row.tone === "flat" && "bg-recessed text-ink-tertiary",
      )}
    >
      {row.tone === "flat" ? "—" : `${sign}${Math.abs(row.pct)}%`}
    </span>
  );
}

function Thumb({ saved, size }: { saved: SavedProduct; size: "thumbnail" | "thumb" }) {
  const image = saved.product.media.primaryImage;
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-inner border border-hairline bg-surface", size === "thumbnail" ? "size-thumbnail" : "size-thumb")}
      style={{ backgroundColor: image.backdrop }}
    >
      <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
    </span>
  );
}

function Figures({ row, className }: { row: Row; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-hairline whitespace-nowrap text-body-sm", className)}>
      <span className="type-metric text-ink-tertiary">{formatPrice(row.saved.savedPrice, row.currency)}</span>
      <ArrowRight size="0.9em" strokeWidth={1.5} aria-hidden="true" className="self-center text-ink-tertiary" />
      <span className="sr-only">to</span>
      {row.now !== undefined ? (
        <span className={cn("type-metric", row.tone === "drop" ? "text-positive-ink" : row.tone === "rise" ? "text-caution-ink" : "text-ink")}>
          {formatPrice(row.now, row.currency)}
        </span>
      ) : (
        <span className="text-caption text-ink-tertiary">no live offer</span>
      )}
    </span>
  );
}

function MoverTile({ row }: { row: Row }) {
  const { product } = row.saved;
  return (
    <li
      data-slot="mover-tile"
      className="grid min-w-0 grid-cols-[var(--size-thumb)_minmax(0,1fr)_auto] items-center gap-x-inline gap-y-cluster rounded-container border border-hairline bg-surface p-card-compact shadow-surface"
    >
      <Thumb saved={row.saved} size="thumb" />
      <span className="flex min-w-0 flex-col gap-hairline">
        <span className="truncate text-body-sm font-medium text-ink">
          {product.brand} {product.name}
        </span>
        <Figures row={row} className="text-caption" />
      </span>
      <DeltaChip row={row} size="md" />
      <Sparkline values={row.saved.priceHistory ?? [row.saved.savedPrice, row.now ?? row.saved.savedPrice]} className="col-span-3 w-full" />
    </li>
  );
}

function LedgerRow({
  row,
  attribution,
  placement,
  onRemove,
  onCompare,
  onWatch,
}: {
  row: Row;
  attribution?: AffiliateAttribution;
  placement: string;
  onRemove: () => void;
  onCompare?: () => void;
  onWatch: (watching: boolean) => void;
}) {
  const { saved } = row;
  const { product } = saved;
  const name = `${product.brand} ${product.name}`;
  const history = saved.priceHistory ?? [saved.savedPrice, row.now ?? saved.savedPrice];
  return (
    <div role="row" data-slot="ledger-row" data-tone={row.tone} className={cn(ROW, "border-t border-hairline py-row")}>
      <span role="cell" className="col-start-2">
        <Thumb saved={saved} size="thumbnail" />
      </span>
      <div role="cell" className="col-start-3 flex min-w-0 flex-col gap-hairline">
        <span className="truncate text-body-sm font-medium text-ink">{name}</span>
        <span className="truncate text-caption text-ink-tertiary">
          {row.merchant ?? "No merchant"} · saved {formatDate(saved.savedAt)}
        </span>
      </div>

      {/* Figures · Δ · sparkline — one line under the title on phones, three keylines on desktop */}
      <div role="cell" className="col-start-3 flex flex-wrap items-center gap-x-stack gap-y-cluster @3xl:col-start-4 @3xl:block">
        <Figures row={row} />
        <span className="@3xl:hidden">
          <DeltaChip row={row} />
        </span>
        <Sparkline values={history} label={`30-day price trend for ${name}`} className="@3xl:hidden" />
      </div>
      <span role="cell" className="hidden @3xl:col-start-5 @3xl:block">
        <DeltaChip row={row} />
      </span>
      <span role="cell" className="hidden @3xl:col-start-6 @3xl:block">
        <Sparkline values={history} label={`30-day price trend for ${name}`} />
      </span>

      {/* Watch + actions */}
      <span role="cell" className="col-start-4 row-start-1 flex items-center justify-end @3xl:col-start-7 @3xl:row-auto @3xl:justify-start">
        <Switch size="sm" checked={saved.watching ?? false} onCheckedChange={onWatch} aria-label={`${saved.watching ? "Stop watching" : "Watch"} the price of ${name}`} />
      </span>
      <span role="cell" className="col-start-3 flex items-center gap-cluster @3xl:col-start-8 @3xl:justify-end">
        {row.affiliateUrl ? (
          <AffiliateAction
            href={row.affiliateUrl}
            attribution={attribution}
            tracking={{ merchant: row.merchant, offerId: row.offerId, productId: product.id, placement }}
            size="sm"
          >
            View deal
          </AffiliateAction>
        ) : (
          <span className="text-caption text-ink-tertiary">No live offer</span>
        )}
        <RowMenu name={name} onRemove={onRemove} onCompare={onCompare} />
      </span>
    </div>
  );
}

function RowMenu({ name, onRemove, onCompare }: { name: string; onRemove: () => void; onCompare?: () => void }) {
  const itemClass = cn(
    "grid h-control cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-cluster px-cell-x text-body-sm text-ink outline-none",
    "transition-colors duration-interactive ease-standard data-highlighted:bg-recessed",
  );
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button intent="ghost" size="sm" aria-label={`More actions for ${name}`} className="px-cluster">
          <Ellipsis size="1em" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="menu-panel z-50 min-w-[calc(var(--size-popover)*0.6)] overflow-hidden rounded-container border border-hairline bg-surface py-hairline text-ink shadow-overlay"
        >
          {onCompare && (
            <DropdownMenu.Item onSelect={onCompare} className={itemClass}>
              <Scale size="1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-secondary" />
              Compare
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item onSelect={onRemove} className={cn(itemClass, "text-negative-ink data-highlighted:text-negative-ink")}>
            <Trash2 size="1em" strokeWidth={1.5} aria-hidden="true" />
            Remove from dossier
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
