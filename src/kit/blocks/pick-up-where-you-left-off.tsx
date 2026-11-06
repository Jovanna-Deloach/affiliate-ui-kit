"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { ContinueCard } from "@/kit/components";
import { clearList, forget, useReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";
import { Button, GradeBadge, Price } from "@/kit/ui";
import { cn } from "@/lib/cn";

/* A guide counts as finished once the reader is past 95% of it. */
const FINISHED = 0.95;

function RemoveButton({ item, onRemove }: { item: ReaderItem; onRemove: (item: ReaderItem) => void }) {
  return (
    <button
      type="button"
      aria-label={`Remove ${[item.brand, item.title].filter(Boolean).join(" ")} from history`}
      onClick={() => onRemove(item)}
      className="kit-focus grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:bg-well hover:text-fg"
    >
      <X aria-hidden="true" size={16} strokeWidth={2} />
    </button>
  );
}

function ViewedTile({ item, onRemove }: { item: ReaderItem; onRemove: (item: ReaderItem) => void }) {
  return (
    <article className="kit-card relative grid grid-cols-[4rem_minmax(0,1fr)_auto] items-start gap-3 p-2 pr-1">
      <span className="relative size-16 overflow-hidden rounded-media kit-studio">
        {item.image ? <Image src={item.image.src} alt="" fill sizes="4rem" className="object-contain p-1.5" /> : null}
      </span>
      <div className="grid min-w-0 content-start gap-0.5 py-1">
        {item.brand ? <p className="m-0 truncate t-micro text-fg-muted">{item.brand}</p> : null}
        <a href={item.href} data-name className="kit-focus rounded-ctl t-ui font-semibold text-fg no-underline after:absolute after:inset-0 after:rounded-box hover:underline">
          {item.title}
        </a>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {item.grade ? <GradeBadge grade={item.grade} size="sm" /> : null}
          {item.price ? <Price amount={item.price.amount} currency={item.price.currency} size="xs" note="when you looked" /> : null}
        </div>
      </div>
      <div className="relative z-10">
        <RemoveButton item={item} onRemove={onRemove} />
      </div>
    </article>
  );
}

export interface PickUpWhereYouLeftOffProps {
  /** The reader’s history from their account, newest first. Leave out to show what this device remembers (`RememberVisit` records it). */
  items?: ReaderItem[];
  /** Clears an account’s history (a Server Action). On the device the section clears it itself. */
  onClear?: () => void;
  /** Takes one item off an account’s history. On the device the section does it itself. */
  onRemove?: (item: Pick<ReaderItem, "kind" | "id">) => void;
  /** The heading (default “Pick up where you left off”). */
  heading?: string;
  /** The reader’s full history page, linked beside Clear history. */
  historyHref?: string;
  /** The moment “read 2 days ago” counts from; pin it in stories and tests (default: now). */
  now?: string;
  /** The section’s id, for links to it (default `pick-up`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What the reader was doing last time: guides they started, with how far
 * they got and a link back to the section they stopped at (up to three),
 * then the products they looked at (up to eight), each removable. Clear
 * history is always in view. Without an account it reads the reader’s
 * device and says so; it shows nothing until there is something to show,
 * so it appears after the page loads.
 *
 * **Use it for** the home page and a category page, where it does not push
 * the first screen down (below the lead, or in its own column). **Not for**
 * what other readers looked at (`PeopleAlsoLookedAt`) or things the reader
 * chose to keep (`SavedItems`).
 *
 * @summary Pick up where you left off: unfinished guides and recently viewed products.
 * @import import { PickUpWhereYouLeftOff } from "@/kit/blocks";
 */
export function PickUpWhereYouLeftOff({ items: account, onClear, onRemove, heading = "Pick up where you left off", historyHref, now, id = "pick-up", className }: PickUpWhereYouLeftOffProps) {
  const device = useReaderList("viewed");
  const items = account ?? device;
  const guides = items.filter((item) => item.kind === "guide" && (item.progress ?? 0) < FINISHED).slice(0, 3);
  const products = items.filter((item) => item.kind === "product").slice(0, 8);
  if (!guides.length && !products.length) return null;

  const remove = (item: ReaderItem) => (account ? onRemove?.(item) : forget("viewed", item));
  const clear = () => (account ? onClear?.() : clearList("viewed"));
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid gap-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 id={`${id}-heading`} className="m-0 t-title text-fg">
          {heading}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {account ? null : <p className="m-0 t-caption text-fg-muted">Kept on this device only.</p>}
          {historyHref ? (
            <a href={historyHref} className="kit-focus kit-link rounded-ctl t-small text-fg">
              All history
            </a>
          ) : null}
          {account && !onClear ? null : (
            <Button emphasis="quiet" onClick={clear} className="t-small">
              Clear history
            </Button>
          )}
        </div>
      </div>
      {guides.length ? (
        <ul aria-label="Guides you started" className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4 p-0">
          {guides.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="grid">
              <ContinueCard item={item} now={now} action={<RemoveButton item={item} onRemove={remove} />} />
            </li>
          ))}
        </ul>
      ) : null}
      {products.length ? (
        <div className="grid gap-3">
          <h3 className="m-0 t-ui font-semibold text-fg">Recently viewed</h3>
          <ul className="m-0 grid list-none gap-3 p-0 @2xl:grid-cols-2 @5xl:grid-cols-4">
            {products.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="grid">
                <ViewedTile item={item} onRemove={remove} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
