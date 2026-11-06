"use client";

import { BookOpen, Bookmark, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { forget, setNote, useReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";
import { Button, EmptyState, GradeBadge, Price, RelativeTime, SegmentedControl, Sep, TextArea } from "@/kit/ui";
import { cn } from "@/lib/cn";

type Show = "all" | "product" | "guide";

function SavedRow({ item, now, onRemove, onNote }: { item: ReaderItem; now?: string; onRemove: (item: ReaderItem) => void; onNote: (item: ReaderItem, note: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.note ?? "");
  const name = [item.brand, item.title].filter(Boolean).join(" ");
  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 border-t border-line py-4">
      <span aria-hidden="true" className="relative grid size-14 place-items-center overflow-hidden rounded-media kit-studio text-fg-muted">
        {item.image ? <Image src={item.image.src} alt="" fill sizes="3.5rem" className="object-contain p-1.5" /> : <BookOpen size={20} strokeWidth={1.75} />}
      </span>
      <div className="grid min-w-0 content-start gap-1">
        {item.brand ? <p className="m-0 t-micro text-fg-muted">{item.brand}</p> : <p className="m-0 t-micro text-fg-muted">Guide</p>}
        <a href={item.href} data-name className="kit-focus justify-self-start rounded-ctl t-ui font-semibold text-fg no-underline hover:underline">
          {item.title}
        </a>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 t-caption text-fg-muted">
          <span>
            Saved <RelativeTime date={item.at} now={now} />
          </span>
          {item.price ? (
            <>
              <Sep />
              <Price amount={item.price.amount} currency={item.price.currency} size="xs" className="text-fg" />
              <span>when saved</span>
            </>
          ) : null}
          {item.grade ? (
            <>
              <Sep />
              <GradeBadge grade={item.grade} size="sm" />
            </>
          ) : null}
        </p>
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onNote(item, draft);
              setEditing(false);
            }}
            className="mt-2 grid gap-2"
          >
            <TextArea label={`Note on ${name}`} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={280} rows={3} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Save note</Button>
              <Button
                emphasis="quiet"
                onClick={() => {
                  setDraft(item.note ?? "");
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid justify-items-start gap-0.5">
            {item.note ? <p className="m-0 border-l-2 border-line-strong pl-3 t-small text-fg-body">{item.note}</p> : null}
            <Button emphasis="quiet" onClick={() => setEditing(true)} className="t-small">
              {item.note ? "Edit note" : "Add a note"}
              <span className="sr-only"> on {name}</span>
            </Button>
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label={`Remove ${name} from saved`}
        onClick={() => onRemove(item)}
        className="kit-focus -mt-2 grid size-11 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:bg-well hover:text-fg"
      >
        <X aria-hidden="true" size={16} strokeWidth={2} />
      </button>
    </li>
  );
}

export interface SavedItemsProps {
  /** The reader’s saved items from their account, newest first. Leave out to show what this device keeps (`SaveButton` adds to it). */
  items?: ReaderItem[];
  /** Takes an item off an account’s list (a Server Action). On the device the list does it itself. */
  onRemove?: (item: Pick<ReaderItem, "kind" | "id">) => void;
  /** Saves a note on an account’s item; "" removes it. On the device the list does it itself. */
  onNote?: (item: Pick<ReaderItem, "kind" | "id">, note: string) => void;
  /** Where to sign in, offered to readers without an account so their list follows them. */
  signInHref?: string;
  /** The heading (default “Saved”). */
  heading?: string;
  /** The moment “saved 3 days ago” counts from; pin it in stories and tests (default: now). */
  now?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Everything the reader saved, newest first: each product or guide with
 * when it was saved, the price then, its grade, and the reader’s own note,
 * which they can add, edit or clear in place. Products and guides can be
 * shown apart. Without an account it reads the device, says so, and offers
 * Sign in; with nothing saved, it says how to save.
 *
 * **Use it for** the Saved page, from the account menu. **Not for** what
 * the reader merely looked at (`PickUpWhereYouLeftOff`) or a compare list
 * (`CompareTray`).
 *
 * @summary The reader’s saved products and guides, with notes, on the device or in an account.
 * @import import { SavedItems } from "@/kit/blocks";
 */
export function SavedItems({ items: account, onRemove, onNote, signInHref, heading = "Saved", now, className }: SavedItemsProps) {
  const device = useReaderList("saved");
  const items = account ?? device;
  const [show, setShow] = useState<Show>("all");
  const both = items.some((item) => item.kind === "product") && items.some((item) => item.kind === "guide");
  const shown = both && show !== "all" ? items.filter((item) => item.kind === show) : items;

  const remove = (item: ReaderItem) => (account ? onRemove?.(item) : forget("saved", item));
  const note = (item: ReaderItem, text: string) => (account ? onNote?.(item, text) : setNote(item, text));
  return (
    <section aria-labelledby="saved-heading" className={cn("grid gap-6", className)}>
      <div className="grid gap-2">
        <h2 id="saved-heading" className="m-0 t-headline text-fg">
          {heading}
        </h2>
        {account ? null : (
          <p className="m-0 t-small text-fg-muted">
            Kept on this device only.
            {signInHref ? (
              <>
                {" "}
                <a href={signInHref} className="kit-focus kit-link rounded-ctl text-fg">
                  Sign in
                </a>{" "}
                to keep them on every device.
              </>
            ) : null}
          </p>
        )}
      </div>
      {items.length ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" data-numeric className="m-0 t-ui text-fg">
              {shown.length} {shown.length === 1 ? "item" : "items"}
            </p>
            {both ? (
              <SegmentedControl
                legend="Show"
                options={[
                  { value: "all", label: "All" },
                  { value: "product", label: "Products" },
                  { value: "guide", label: "Guides" },
                ]}
                value={show}
                onValueChange={(value) => setShow(value as Show)}
              />
            ) : null}
          </div>
          <ul className="m-0 grid list-none border-b border-line p-0">
            {shown.map((item) => (
              <SavedRow key={`${item.kind}-${item.id}`} item={item} now={now} onRemove={remove} onNote={note} />
            ))}
          </ul>
        </>
      ) : (
        <EmptyState title="Nothing saved yet" icon={Bookmark} className="border-t border-line">
          <p>Use Save on a product or a guide to keep it here.</p>
        </EmptyState>
      )}
    </section>
  );
}
