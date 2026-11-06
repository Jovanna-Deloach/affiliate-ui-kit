"use client";

import { useEffect, useEffectEvent, useSyncExternalStore } from "react";

import type { ReaderItem } from "@/kit/types";

/**
 * DEVICE MEMORY — what a reader without an account has looked at, saved and
 * put in the compare tray, kept in this browser’s localStorage and nowhere
 * else. Every read and write survives storage being blocked (a private
 * window, a full quota): the lists then last for the visit. Tabs stay in step
 * through the `storage` event.
 *
 * Signed-in readers’ lists come from their account instead: the blocks that
 * show these lists take `items` and callbacks for that.
 */

/** The lists a device keeps: recently `viewed` products and guides (12), `saved` items (200), and the `compare` tray (4). */
export type ReaderList = "viewed" | "saved" | "compare";

/** How many items each list keeps; the oldest falls off. */
export const READER_LIMITS: Record<ReaderList, number> = { viewed: 12, saved: 200, compare: 4 };

const PREFIX = "kit.reader.";
const SEARCHES = `${PREFIX}searches`;
const key = (list: ReaderList) => `${PREFIX}${list}`;
const EMPTY: never[] = [];

/* This visit’s writes, so the lists still work when storage is blocked. */
const memory = new Map<string, string>();
/* The parsed value for each raw string, so a snapshot keeps its identity until it changes. */
const parsed = new Map<string, { raw: string | null; value: unknown[] }>();
const listeners = new Set<() => void>();

function getRaw(name: string): string | null {
  if (memory.has(name)) return memory.get(name) ?? null;
  try {
    return window.localStorage.getItem(name);
  } catch {
    return null;
  }
}

function read<T>(name: string): T[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = getRaw(name);
  const cached = parsed.get(name);
  if (cached && cached.raw === raw) return cached.value as T[];
  let value: T[] = EMPTY;
  if (raw) {
    try {
      const data: unknown = JSON.parse(raw);
      if (Array.isArray(data)) value = data as T[];
    } catch {
      value = EMPTY;
    }
  }
  parsed.set(name, { raw, value });
  return value;
}

function write<T>(name: string, value: T[]) {
  const raw = JSON.stringify(value);
  memory.set(name, raw);
  try {
    window.localStorage.setItem(name, raw);
  } catch {
    /* Blocked or full: the list lasts for this visit. */
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && !event.key.startsWith(PREFIX)) return;
    // Another tab wrote: its value wins over this visit’s copy.
    if (event.key === null) memory.clear();
    else memory.delete(event.key);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const same = (a: Pick<ReaderItem, "kind" | "id">, b: Pick<ReaderItem, "kind" | "id">) => a.kind === b.kind && a.id === b.id;

/** A list on this device, newest first (the compare tray in the order things were added). Empty on the server and on first paint. */
export function useReaderList(list: ReaderList): ReaderItem[] {
  return useSyncExternalStore(
    subscribe,
    () => read<ReaderItem>(key(list)),
    () => EMPTY,
  );
}

/** The last few searches on this device, newest first. */
export function useRecentSearches(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => read<string>(SEARCHES),
    () => EMPTY,
  );
}

/**
 * Add an item to a list, or bring it up to date: to the top of `viewed` and
 * `saved`, to the end of the compare tray. A saved note is kept. Returns
 * false, and changes nothing, when the compare tray is already full.
 */
export function remember(list: ReaderList, item: ReaderItem): boolean {
  const items = read<ReaderItem>(key(list));
  const existing = items.find((entry) => same(entry, item));
  if (list === "compare" && !existing && items.length >= READER_LIMITS.compare) return false;
  const next: ReaderItem = { ...existing, ...item, note: item.note ?? existing?.note };
  const rest = items.filter((entry) => !same(entry, item));
  write(key(list), list === "compare" ? (existing ? items.map((entry) => (same(entry, item) ? next : entry)) : [...items, next]) : [next, ...rest].slice(0, READER_LIMITS[list]));
  return true;
}

/** Take an item off a list. */
export function forget(list: ReaderList, item: Pick<ReaderItem, "kind" | "id">) {
  write(
    key(list),
    read<ReaderItem>(key(list)).filter((entry) => !same(entry, item)),
  );
}

/** Empty a list: Clear history, Clear the tray. */
export function clearList(list: ReaderList) {
  write(key(list), []);
}

/** A saved item’s note: the reader’s own words, or "" to remove it. */
export function setNote(item: Pick<ReaderItem, "kind" | "id">, note: string) {
  write(
    key("saved"),
    read<ReaderItem>(key("saved")).map((entry) => (same(entry, item) ? { ...entry, note: note.trim() || undefined } : entry)),
  );
}

/** Keep a search on this device (the last 8, newest first, case ignored for repeats). */
export function rememberSearch(query: string) {
  const text = query.trim();
  if (!text) return;
  write(SEARCHES, [text, ...read<string>(SEARCHES).filter((entry) => entry.toLowerCase() !== text.toLowerCase())].slice(0, 8));
}

/** Forget every search on this device. */
export function clearSearches() {
  write(SEARCHES, []);
}

export interface RememberVisitProps {
  /**
   * The product or guide this page is. A product: `toReaderItem(summary)`
   * from `@/kit/lib/discovery`. A guide: `{ kind: "guide", id, title, href }`.
   */
  item: Omit<ReaderItem, "at" | "progress" | "section" | "note">;
  /** Guides: the headings that mark where the reader is (default `main h2[id]`). */
  sections?: string;
}

/**
 * Remembers this page on the reader’s device, for Pick up where you left off:
 * a product when it is opened; a guide as it is read, with how far the reader
 * got and the section they reached, written at most once a second and when
 * they leave. Renders nothing. Put it once on every product and guide page
 * for readers without an account.
 */
export function RememberVisit({ item, sections = "main h2[id]" }: RememberVisitProps) {
  const visit = useEffectEvent(() => remember("viewed", { ...item, at: new Date().toISOString() }));
  const track = useEffectEvent(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    const reached = Array.from(document.querySelectorAll<HTMLElement>(sections))
      .filter((heading) => heading.getBoundingClientRect().top < window.innerHeight * 0.3)
      .at(-1);
    const section = reached ? { title: (reached.textContent ?? "").trim(), href: `${item.href.split("#")[0]}#${reached.id}` } : undefined;
    remember("viewed", { ...item, progress: Math.round(progress * 100) / 100, section, at: new Date().toISOString() });
  });

  useEffect(() => {
    visit();
    if (item.kind !== "guide") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      timer ??= setTimeout(() => {
        timer = undefined;
        track();
      }, 1000);
    };
    const onLeave = () => {
      if (document.visibilityState === "hidden") track();
    };
    const onHide = () => track();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener("pagehide", onHide);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener("pagehide", onHide);
    };
  }, [item.kind, item.id]);

  return null;
}
