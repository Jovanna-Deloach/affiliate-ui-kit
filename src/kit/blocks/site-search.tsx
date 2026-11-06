"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { History, Search } from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { SEARCH_KIND_LABEL, SearchResult } from "@/kit/components";
import { SEARCH_KINDS, searchIndex } from "@/kit/lib/discovery";
import { clearSearches, rememberSearch, useRecentSearches } from "@/kit/lib/reader";
import { useThemeRoot } from "@/kit/lib/theme-root";
import type { SearchHit } from "@/kit/types";
import { Button, Chip, SearchField } from "@/kit/ui";
import { cn } from "@/lib/cn";

const PER_GROUP = 4;
const noop = () => () => {};
/* “⌘K” on Apple devices, “Ctrl K” elsewhere; the server says ⌘K and the client corrects it after hydration. */
const useShortcut = () =>
  useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );

export interface SiteSearchProps {
  /** A small index searched in the browser, up to a few thousand entries: products, brands, ingredients, guides, categories. */
  index?: SearchHit[];
  /** The site’s own search, as a Server Action: called with the words after a short pause, returns the hits. Use instead of `index`. */
  search?: (query: string) => Promise<SearchHit[]>;
  /** The full results page; the words go in its `q` parameter (`/search?q=creatine`). Enter goes there, and works with no script. */
  resultsPath?: string;
  /** Searches to suggest before the reader types: “creatine”, “magnesium glycinate”. */
  suggestions?: string[];
  /** The field’s words, and the dialog’s name (default “Search products, brands and ingredients”). */
  placeholder?: string;
  /** Open on load, for stories and tests. */
  defaultOpen?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Search for the whole site: a field-shaped button in the masthead (an icon
 * on phones) that opens a search panel, also on ⌘K or Ctrl K and on “/”.
 * Results come grouped (products, brands, ingredients, guides, categories),
 * four of each, with the words in bold; the arrow keys move through them,
 * Enter opens one or, from the field, the full results page. Before the
 * reader types it shows their recent searches, kept on the device with
 * Clear, and suggestions.
 *
 * **Use it for** the masthead’s `search` slot, once. **Not for** searching
 * within one list (`SearchField`, as in `ReviewFilters`) or a results page’s
 * own field.
 *
 * @summary Site search on ⌘K: grouped results with the words in bold, recent searches.
 * @import import { SiteSearch } from "@/kit/blocks";
 */
export function SiteSearch({ index, search, resultsPath, suggestions = [], placeholder = "Search products, brands and ingredients", defaultOpen = false, className }: SiteSearchProps) {
  const [anchor, container] = useThemeRoot();
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<{ query: string; hits: SearchHit[] }>({ query: "", hits: [] });
  const recent = useRecentSearches();
  const shortcut = useShortcut();
  const listRef = useRef<HTMLDivElement>(null);
  const words = query.trim();

  const hits = useMemo(() => (search ? (remote.query === words ? remote.hits : []) : index ? searchIndex(index, words) : []), [search, remote, index, words]);
  const groups = SEARCH_KINDS.map((kind) => ({ kind, hits: hits.filter((hit) => hit.kind === kind) })).filter((group) => group.hits.length);
  const busy = Boolean(search && words && remote.query !== words);

  // The site’s own search: after a short pause in typing; a slower answer to older words is dropped.
  const ask = useEffectEvent(async (text: string) => {
    const found = await search?.(text);
    if (found) setRemote((current) => (text === query.trim() ? { query: text, hits: found } : current));
  });
  useEffect(() => {
    if (!search || !words) return;
    const timer = setTimeout(() => void ask(words), 200);
    return () => clearTimeout(timer);
  }, [search, words]);

  // ⌘K, Ctrl K and “/” open it from anywhere on the page, except while typing in a field.
  const onKey = useEffectEvent((event: globalThis.KeyboardEvent) => {
    const typing = event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName));
    if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !typing)) {
      event.preventDefault();
      setOpen(true);
    }
  });
  useEffect(() => {
    const listener = (event: globalThis.KeyboardEvent) => onKey(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  /* Arrow keys walk the results; up from the first goes back to the field. */
  const results = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-search-result] :is(a, button)") ?? []);
  const walk = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = results();
    if (!links.length) return;
    event.preventDefault();
    const at = links.indexOf(document.activeElement as HTMLElement);
    const next = event.key === "ArrowDown" ? at + 1 : at - 1;
    if (next < 0) document.getElementById("site-search-field")?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  };

  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <RadixDialog.Trigger
        className={cn(
          "kit-focus inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:text-fg md:w-72 md:justify-start md:border md:border-line md:bg-paper md:px-3",
          className,
        )}
      >
        <Search aria-hidden="true" size={18} strokeWidth={1.75} className="shrink-0" />
        <span className="sr-only md:not-sr-only md:min-w-0 md:flex-1 md:truncate md:text-left md:t-small">{placeholder}</span>
        <kbd aria-hidden="true" className="hidden shrink-0 rounded-ctl border border-line px-1.5 py-0.5 font-sans t-caption whitespace-nowrap text-fg-muted md:inline">
          {shortcut}
        </kbd>
      </RadixDialog.Trigger>
      {anchor}
      <RadixDialog.Portal container={container}>
        <RadixDialog.Overlay className="kit-scrim fixed inset-0 z-50 grid items-start overflow-y-auto p-3 sm:px-4 sm:pt-16">
          <RadixDialog.Content aria-describedby={undefined} className="kit-pop kit-card-feature mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col focus:outline-none sm:max-h-[calc(100dvh-8rem)]">
            <RadixDialog.Title className="sr-only">{placeholder}</RadixDialog.Title>
            <form
              role="search"
              action={resultsPath}
              method="get"
              onSubmit={(event) => {
                if (!words) event.preventDefault();
                else rememberSearch(words);
                if (!resultsPath) event.preventDefault();
              }}
              className="flex items-center gap-2 border-b border-line p-3"
            >
              <SearchField
                id="site-search-field"
                name="q"
                label={placeholder}
                value={query}
                onValueChange={setQuery}
                onKeyDown={walk}
                autoComplete="off"
                className="flex-1"
              />
              <RadixDialog.Close asChild>
                <Button emphasis="quiet" className="shrink-0 px-2">
                  Close
                </Button>
              </RadixDialog.Close>
            </form>
            <div ref={listRef} aria-busy={busy} onKeyDown={walk} className="min-h-0 overflow-y-auto p-2">
              <p role="status" className="sr-only">
                {words ? (busy ? "Searching" : `${hits.length} ${hits.length === 1 ? "result" : "results"}`) : ""}
              </p>
              {words ? (
                groups.length ? (
                  groups.map((group) => (
                    <section key={group.kind} aria-label={SEARCH_KIND_LABEL[group.kind].many} className="grid gap-0.5 py-1">
                      <h2 aria-hidden="true" className="m-0 px-2 pt-2 pb-1 t-micro text-fg-muted">
                        {SEARCH_KIND_LABEL[group.kind].many}
                      </h2>
                      <ul className="m-0 grid list-none gap-0.5 p-0">
                        {group.hits.slice(0, PER_GROUP).map((hit) => (
                          <li key={`${hit.kind}-${hit.id}`} data-search-result>
                            <SearchResult hit={hit} query={words} onClick={() => rememberSearch(words)} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))
                ) : busy ? null : (
                  <div className="grid gap-1 px-2 py-6">
                    <p className="m-0 t-ui text-fg">Nothing found for “{words}”</p>
                    <p className="m-0 t-small text-fg-muted">Try fewer words, or the name of an ingredient.</p>
                  </div>
                )
              ) : (
                <div className="grid gap-5 p-2">
                  {recent.length ? (
                    <section aria-labelledby="site-search-recent" className="grid gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <h2 id="site-search-recent" className="m-0 t-micro text-fg-muted">
                          Recent searches
                        </h2>
                        <Button emphasis="quiet" onClick={clearSearches} className="t-small">
                          Clear
                        </Button>
                      </div>
                      <ul className="m-0 grid list-none p-0">
                        {recent.map((text) => (
                          <li key={text} data-search-result>
                            <button
                              type="button"
                              onClick={() => {
                                setQuery(text);
                                document.getElementById("site-search-field")?.focus();
                              }}
                              className="kit-focus flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-ctl px-2 text-left t-ui text-fg hover:bg-well"
                            >
                              <History aria-hidden="true" size={16} strokeWidth={1.75} className="text-fg-muted" />
                              {text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {suggestions.length ? (
                    <section aria-labelledby="site-search-try" className="grid gap-2">
                      <h2 id="site-search-try" className="m-0 t-micro text-fg-muted">
                        Try
                      </h2>
                      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {suggestions.map((text) => (
                          <li key={text}>
                            <Chip
                              label={text}
                              onClick={() => {
                                setQuery(text);
                                document.getElementById("site-search-field")?.focus();
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              )}
            </div>
            {words && resultsPath ? (
              <a
                href={`${resultsPath}?q=${encodeURIComponent(words)}`}
                onClick={() => rememberSearch(words)}
                className="kit-focus flex min-h-12 items-center gap-2 border-t border-line px-5 t-small text-fg no-underline hover:bg-well"
              >
                <Search aria-hidden="true" size={16} strokeWidth={1.75} className="text-fg-muted" />
                See every result for “{words}”
              </a>
            ) : null}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
