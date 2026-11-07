import { CircleCheck, TriangleAlert } from "lucide-react";

import type { WatchlistIngredient } from "@/kit/types";
import { cn } from "@/lib/cn";

export interface WatchlistIngredientsProps {
  /** The additives worth knowing about, each with why it is flagged; empty when the product has none. */
  items: WatchlistIngredient[];
  /** The heading (default “Watchlist ingredients”). */
  heading?: string;
  /** The site’s page on what it flags and why. */
  href?: string;
  /** The heading’s level: `h2`, or `h3` inside a section (default). */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `watchlist`): `KeyFindings` links its count here. */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Additives worth knowing about, each named with a sentence on why it is
 * flagged (a synthetic dye, a whitener another country stopped allowing),
 * marked with a caution icon. They are legal; the list says so, and leaves
 * the choice to the reader. With none, it says that too.
 *
 * **Use it for** a product’s lab report, after `KeyFindings`, which counts
 * them and links here. **Not for** contaminants over a limit (`AssayTable`),
 * who should avoid the supplement itself (`SafetyPanel`), or a recall
 * (`ConsumerWarning`).
 *
 * @summary Flagged additives, like dyes and whiteners, and why each is flagged.
 * @import import { WatchlistIngredients } from "@/kit/components";
 */
export function WatchlistIngredients({ items, heading = "Watchlist ingredients", href, as: Heading = "h3", id = "watchlist", className }: WatchlistIngredientsProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("grid scroll-mt-8 gap-3", className)}>
      <Heading id={`${id}-heading`} className="m-0 t-name-sm text-fg">
        {heading}
      </Heading>
      {items.length ? (
        <>
          <p className="m-0 max-w-measure t-small text-fg-muted">They are legal at these amounts. Some readers would rather avoid them.</p>
          <ul className="m-0 grid list-none p-0">
            {items.map((item) => (
              <li key={item.name} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 border-t border-line py-3">
                <TriangleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 text-warn" />
                <div className="grid gap-1">
                  <p className="m-0 t-ui font-semibold text-fg">
                    {item.href ? (
                      <a href={item.href} className="kit-focus kit-link rounded-ctl">
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="m-0 max-w-measure t-small text-fg-body">{item.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="m-0 flex items-start gap-2 t-small text-fg-body">
          <CircleCheck aria-hidden="true" size={18} strokeWidth={1.75} className="mt-px shrink-0 text-pass" />
          None: nothing on our watchlist is in it.
        </p>
      )}
      {href ? (
        <a href={href} className="kit-focus kit-link justify-self-start rounded-ctl t-small">
          What’s on our watchlist, and why
        </a>
      ) : null}
    </section>
  );
}
