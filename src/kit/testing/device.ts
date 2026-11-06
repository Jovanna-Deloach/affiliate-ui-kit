import { clearList, clearSearches, remember, rememberSearch, type ReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";

/**
 * Story setup for parts that read the reader’s device: fills a list the way
 * the kit itself would (`remember`), and returns the cleanup Storybook runs
 * after the story, so no story leaks its history into the next.
 *
 *   beforeEach: () => seedDevice("viewed", viewedItems)
 */
export function seedDevice(list: ReaderList, items: readonly ReaderItem[]): () => void {
  clearList(list);
  // `remember` puts each new item on top (the compare tray at the end), so a newest-first list goes in oldest first.
  const order = list === "compare" ? items : [...items].reverse();
  for (const item of order) remember(list, item);
  return () => clearList(list);
}

/** The same for recent searches, newest first. */
export function seedSearches(queries: readonly string[]): () => void {
  clearSearches();
  for (const query of [...queries].reverse()) rememberSearch(query);
  return () => clearSearches();
}
