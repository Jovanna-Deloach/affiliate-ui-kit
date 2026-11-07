import { AlertsManager, PickUpWhereYouLeftOff, SavedItems, SiteFooter, SiteHeader } from "@/kit/blocks";
import { AccountMenu } from "@/kit/components";
import type { PriceAlert, ReaderItem, SiteChrome } from "@/kit/types";
import { TabLinks } from "@/kit/ui";

export interface AccountPageProps {
  /** The publication: masthead and footer. */
  site: SiteChrome;
  /** The signed-in reader. */
  reader: { name: string; avatar?: { src: string; alt: string } };
  /** Which list the page shows: `saved`, `alerts` (price alerts) or `history` (recently viewed). */
  view: "saved" | "alerts" | "history";
  /** Each list’s own address: the tabs link to them. */
  hrefs: { saved: string; alerts: string; history: string };
  /** The reader’s saved products and guides, newest first. */
  saved?: ReaderItem[];
  /** The reader’s price alerts, newest first. */
  alerts?: PriceAlert[];
  /** What the reader looked at, newest first. */
  history?: ReaderItem[];
  /** Removes an item from a list (a Server Action). */
  onRemove?: (item: Pick<ReaderItem, "kind" | "id">) => void;
  /** Saves a note on a saved item (a Server Action). */
  onNote?: (item: Pick<ReaderItem, "kind" | "id">, note: string) => void;
  /** Pauses or resumes a price alert (a Server Action). */
  onPause?: (id: string, paused: boolean) => void;
  /** Deletes a price alert (a Server Action). */
  onDelete?: (id: string) => void;
  /** Clears the history (a Server Action). */
  onClear?: () => void;
  /** The moment relative dates count from (“2 days ago”); pin it in stories and tests (default: now). */
  now?: string;
}

/**
 * A signed-in reader’s account: the masthead with their menu, a heading,
 * tabs for Saved, Price alerts and History (each its own address, with
 * counts), and the list the page is for, with its actions: notes on saved
 * items, pause and delete on alerts, remove and Clear history on history.
 *
 * **Use it for** the account’s Saved, Price alerts and History pages, one
 * `view` each. **Not for** a reader without an account (their saved items
 * and history live on the device: put `SavedItems` or
 * `PickUpWhereYouLeftOff` on an ordinary page, without `items`).
 *
 * @summary A reader’s account: Saved, Price alerts and History, as tabs.
 * @import import { AccountPage } from "@/kit/templates";
 */
export function AccountPage({ site, reader, view, hrefs, saved = [], alerts = [], history = [], onRemove, onNote, onPause, onDelete, onClear, now }: AccountPageProps) {
  const tabs = [
    { href: hrefs.saved, label: "Saved", count: saved.length, current: view === "saved" },
    { href: hrefs.alerts, label: "Price alerts", count: alerts.filter((a) => a.status !== "met").length, current: view === "alerts" },
    { href: hrefs.history, label: "History", current: view === "history" },
  ];
  return (
    <div className="min-h-dvh bg-ground text-fg">
      <SiteHeader
        site={site}
        account={<AccountMenu person={reader} links={{ saved: hrefs.saved, history: hrefs.history, alerts: hrefs.alerts }} counts={{ saved: saved.length, alerts: tabs[1]!.count }} />}
      />
      <main className="kit-well pt-8 pb-16 md:pt-12">
        <h1 className="m-0 t-headline text-fg">Your account</h1>
        <TabLinks label="Your lists" items={tabs} className="mt-6" />
        <div className="mt-10 max-w-4xl">
          {view === "saved" ? (
            <SavedItems items={saved} onRemove={onRemove} onNote={onNote} now={now} />
          ) : view === "alerts" ? (
            <AlertsManager alerts={alerts} onPause={onPause} onDelete={onDelete} now={now} />
          ) : (
            <PickUpWhereYouLeftOff items={history} heading="Recently viewed" onRemove={onRemove} onClear={onClear} now={now} />
          )}
        </div>
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
