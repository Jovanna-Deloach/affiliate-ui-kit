"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { clearList, forget, READER_LIMITS, useReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";
import { Button, Dialog, GradeBadge, Price } from "@/kit/ui";
import { cn } from "@/lib/cn";

const fullName = (item: ReaderItem) => [item.brand, item.title].filter(Boolean).join(" ");

function Thumb({ item, size }: { item: ReaderItem; size: "sm" | "lg" }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-media kit-studio", size === "sm" ? "size-12" : "aspect-square w-full")}>
      {item.image ? <Image src={item.image.src} alt="" fill sizes={size === "sm" ? "3rem" : "12rem"} className="object-contain p-2" /> : null}
    </span>
  );
}

export interface CompareTrayProps {
  /** A full comparison page; the products’ ids go in its `ids` parameter (`/compare?ids=a,b`). Linked from the side-by-side view. */
  compareHref?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The products a reader collected with `CompareButton`, up to four, in a
 * bar along the bottom of the window: a thumbnail each with a way to take it
 * out, empty places for the rest, Compare once there are two, and Clear.
 * Compare opens them side by side: photographs, names, grades and the price
 * when each was added, with a link to the full comparison. Kept on the
 * device; hidden while empty.
 *
 * **Use it for** ranking, category and search pages, once, at the end of
 * the page. **Not for** a product page (its bottom edge belongs to the
 * `StickyBuyBar`) or a guide’s own comparison (`ComparisonMatrix`).
 *
 * @summary A bottom bar of up to four products to compare side by side.
 * @import import { CompareTray } from "@/kit/blocks";
 */
export function CompareTray({ compareHref, className }: CompareTrayProps) {
  const items = useReaderList("compare");
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  const empty = READER_LIMITS.compare - items.length;
  return (
    <aside aria-label="Compare" className={cn("fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper", className)}>
      <div className="kit-well flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
        <ul className="m-0 flex list-none gap-2 p-0">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <Thumb item={item} size="sm" />
              <button
                type="button"
                aria-label={`Take ${fullName(item)} out of the comparison`}
                onClick={() => forget("compare", item)}
                className="kit-focus absolute -top-2 -right-2 grid size-6 cursor-pointer place-items-center rounded-full bg-fg text-paper before:absolute before:-inset-2.5 before:content-['']"
              >
                <X aria-hidden="true" size={12} strokeWidth={2.5} />
              </button>
            </li>
          ))}
          {Array.from({ length: empty }, (_, i) => (
            <li key={`empty-${i}`} aria-hidden="true" className="hidden size-12 rounded-media border border-dashed border-line-strong sm:block" />
          ))}
        </ul>
        <p data-numeric className="m-0 flex-1 t-small text-fg-muted">
          {items.length < 2 ? "Choose one more to compare" : `${items.length} of ${READER_LIMITS.compare} chosen`}
        </p>
        <div className="ml-auto flex items-center gap-3">
          <Button emphasis="quiet" onClick={() => clearList("compare")}>
            Clear
          </Button>
          {items.length >= 2 ? <Button onClick={() => setOpen(true)}>Compare {items.length}</Button> : null}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen} title={`Compare ${items.length} products`} size="lg">
        <div className="grid grid-flow-col auto-cols-[minmax(9rem,1fr)] gap-4 overflow-x-auto pb-2">
          {items.map((item) => (
            <div key={item.id} className="grid content-start gap-3">
              <Thumb item={item} size="lg" />
              <div className="grid gap-0.5">
                {item.brand ? <p className="m-0 t-micro text-fg-muted">{item.brand}</p> : null}
                <a href={item.href} data-name className="kit-focus justify-self-start rounded-ctl t-ui font-semibold text-fg no-underline hover:underline">
                  {item.title}
                </a>
              </div>
              <dl className="m-0 grid gap-2 border-t border-line pt-3">
                <div className="flex items-center justify-between gap-2">
                  <dt className="t-small text-fg-muted">Grade</dt>
                  <dd className="m-0">{item.grade ? <GradeBadge grade={item.grade} size="sm" /> : <span className="t-small text-fg-muted">Not graded</span>}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="t-small text-fg-muted">Price when added</dt>
                  <dd className="m-0">{item.price ? <Price amount={item.price.amount} currency={item.price.currency} size="sm" /> : <span className="t-small text-fg-muted">Unknown</span>}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        {compareHref ? (
          <p className="m-0 mt-4 border-t border-line pt-4 t-small">
            <a href={`${compareHref}?ids=${items.map((item) => encodeURIComponent(item.id)).join(",")}`} className="kit-focus kit-link rounded-ctl text-fg">
              Open the full comparison: lab results, cost per serving and every retailer
            </a>
          </p>
        ) : null}
      </Dialog>
    </aside>
  );
}
