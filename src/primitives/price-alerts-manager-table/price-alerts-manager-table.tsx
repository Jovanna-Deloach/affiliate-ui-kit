"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { Button } from "@/primitives/button";
import { NumberStepper } from "@/primitives/number-stepper";
import { StatusPill } from "@/primitives/status-pill";
import { Switch } from "@/primitives/switch";
import type { PriceAlert } from "@/types/account";

/**
 * <PriceAlertsManagerTable />
 * ---------------------------------------------------------------------------
 * The member's price-drop and restock watches on five strict keylines:
 *
 *   ┌ 48px ┬ minmax(180px,1.5fr) ──┬ 120px ─────┬ 120px ──┬ 88px ───┐
 *   │ PRODUCT                      │ TARGET     │ CURRENT │ ACTIVE  │  header
 *   │ [▣]  │ Meridian Aerolite 3   │ [−] $170 [+]│ $189    │ (●) ⌫   │
 *   │      │ Northlane · in stock  │            │ $19 over│         │
 *   │ [▣]  │ Peak Supply creatine  │ RESTOCK    │ $21     │ (●) ⌫   │
 *   └──────┴───────────────────────┴────────────┴─────────┴─────────┘
 *
 *   --keyline-thumbnail / --keyline-figure / --keyline-switch   the tracks
 *   --row-y / --inset-cell-x                                   row rhythm
 *   type-metric                                                every figure
 *
 * Mobbin anatomy (Copilot tracked prices, Booking saved alerts, Klarna
 * target-price sheet): thumb · title + merchant · the figure · a toggle
 * and a trash. Below a 48rem container the figures drop to a second row
 * under the title; the switch column holds. Controlled through `alerts` +
 * `onChange` / `onDelete`, or self-managed from `defaultAlerts`.
 */

export interface PriceAlertsManagerTableProps {
  alerts?: PriceAlert[];
  defaultAlerts?: PriceAlert[];
  onChange?: (alert: PriceAlert) => void;
  onDelete?: (id: string) => void;
  /** Stepper increment for the target price (default 5). */
  step?: number;
  className?: string;
}

const TRACKS = "@3xl:grid-cols-[var(--keyline-thumbnail)_minmax(180px,1.5fr)_var(--keyline-figure)_var(--keyline-figure)_var(--keyline-switch)]";

export function PriceAlertsManagerTable({ alerts, defaultAlerts = [], onChange, onDelete, step = 5, className }: PriceAlertsManagerTableProps) {
  const [internal, setInternal] = useState(defaultAlerts);
  const rows = alerts ?? internal;

  const update = (next: PriceAlert) => {
    if (alerts === undefined) setInternal((list) => list.map((a) => (a.id === next.id ? next : a)));
    onChange?.(next);
  };
  const remove = (id: string) => {
    if (alerts === undefined) setInternal((list) => list.filter((a) => a.id !== id));
    onDelete?.(id);
  };

  return (
    <div data-slot="price-alerts-manager-table" className={cn("@container w-full min-w-0", className)}>
      <div role="table" aria-label="Price alerts" className="w-full min-w-0 rounded-container border border-hairline bg-surface">
        <div role="row" className={cn("hidden items-center gap-x-stack border-b border-hairline bg-recessed px-cell-x py-row-compact @3xl:grid", TRACKS)}>
          {/* Occupies the thumbnail track (an sr-only span would leave the grid) */}
          <span role="columnheader">
            <span className="sr-only">Thumbnail</span>
          </span>
          <span role="columnheader" className="type-eyebrow text-ink-tertiary">
            Product
          </span>
          <span role="columnheader" className="type-eyebrow text-ink-tertiary">
            Target
          </span>
          <span role="columnheader" className="type-eyebrow text-right text-ink-tertiary">
            Current best
          </span>
          <span role="columnheader" className="type-eyebrow text-right text-ink-tertiary">
            Active
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="m-0 p-well text-body-sm text-ink-secondary">No alerts yet — set a target price on any scorecard.</p>
        ) : (
          <ul role="rowgroup" className="m-0 list-none divide-y divide-hairline p-0">
            {rows.map((alert) => (
              <AlertRow key={alert.id} alert={alert} step={step} onChange={update} onDelete={() => remove(alert.id)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AlertRow({ alert, step, onChange, onDelete }: { alert: PriceAlert; step: number; onChange: (a: PriceAlert) => void; onDelete: () => void }) {
  const { product } = alert;
  const image = product.media.primaryImage;
  const currency = product.offers[0]?.currency ?? "USD";
  const gap = alert.targetPrice !== undefined ? alert.currentPrice - alert.targetPrice : undefined;
  const hit = alert.kind === "restock" ? alert.inStock : gap !== undefined && gap <= 0;

  return (
    <li
      role="row"
      data-slot="alert-row"
      data-active={alert.active}
      className={cn(
        "grid grid-cols-[var(--keyline-thumbnail)_minmax(0,1fr)_var(--keyline-switch)] items-center gap-x-stack gap-y-cluster px-cell-x py-row",
        "transition-opacity duration-interactive ease-standard",
        TRACKS,
        !alert.active && "[&_[data-slot=alert-figure]]:opacity-55 [&_[data-slot=alert-identity]]:opacity-55",
      )}
    >
      <span
        role="cell"
        className="relative block size-thumbnail overflow-hidden rounded-inner border border-hairline bg-surface"
        style={{ backgroundColor: image.backdrop }}
      >
        <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
      </span>

      <div role="cell" data-slot="alert-identity" className="flex min-w-0 flex-col gap-hairline">
        <span className="truncate text-body-sm font-medium text-ink">
          {product.brand} {product.name}
        </span>
        <span className="truncate text-caption text-ink-tertiary">
          {alert.merchantName} · {alert.inStock ? "in stock" : "out of stock"}
        </span>
      </div>

      {/* Target */}
      <div role="cell" data-slot="alert-figure" className="col-start-2 @3xl:col-start-3">
        {alert.kind === "price-drop" ? (
          <NumberStepper
            label={`Target price for ${product.brand} ${product.name}`}
            value={alert.targetPrice ?? 0}
            step={step}
            min={0}
            prefix="$"
            onValueChange={(targetPrice) => onChange({ ...alert, targetPrice })}
            disabled={!alert.active}
          />
        ) : (
          <StatusPill kind="technical" size="sm">
            Restock
          </StatusPill>
        )}
      </div>

      {/* Current best */}
      <div role="cell" data-slot="alert-figure" className="col-start-2 flex min-w-0 flex-col gap-hairline @3xl:col-start-4 @3xl:items-end @3xl:text-right">
        <span className={cn("type-metric text-body text-ink", hit && "text-positive-ink")}>{formatPrice(alert.currentPrice, currency)}</span>
        <span className="text-caption text-ink-tertiary">
          {alert.kind === "restock"
            ? alert.inStock
              ? "Back in stock"
              : "Waiting for stock"
            : gap === undefined
              ? ""
              : gap <= 0
                ? "At or below target"
                : `${formatPrice(gap, currency)} above target`}
        </span>
      </div>

      {/* Active + delete */}
      <div role="cell" className="col-start-3 row-start-1 flex items-center justify-end gap-hairline @3xl:col-start-5 @3xl:row-auto">
        <Switch
          size="sm"
          checked={alert.active}
          onCheckedChange={(active) => onChange({ ...alert, active })}
          aria-label={`${alert.active ? "Pause" : "Resume"} alert for ${product.brand} ${product.name}`}
        />
        <Button intent="ghost" size="sm" aria-label={`Delete alert for ${product.brand} ${product.name}`} onClick={onDelete} className="px-cluster">
          <Trash2 size="1em" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
