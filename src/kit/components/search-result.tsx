import { BookOpen, Building2, FlaskConical, LayoutGrid, Package, type LucideIcon } from "lucide-react";
import Image from "next/image";
import type { KeyboardEventHandler, MouseEventHandler } from "react";

import { markWords } from "@/kit/lib/discovery";
import type { SearchHit, SearchKind } from "@/kit/types";
import { Sep } from "@/kit/ui";
import { cn } from "@/lib/cn";

/** What each kind of result is called, in a result and as a group’s heading. */
export const SEARCH_KIND_LABEL: Record<SearchKind, { one: string; many: string; icon: LucideIcon }> = {
  product: { one: "Product", many: "Products", icon: Package },
  brand: { one: "Brand", many: "Brands", icon: Building2 },
  ingredient: { one: "Ingredient", many: "Ingredients", icon: FlaskConical },
  guide: { one: "Guide", many: "Guides", icon: BookOpen },
  category: { one: "Category", many: "Categories", icon: LayoutGrid },
};

function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {markWords(text, query).map((part, i) =>
        part.match ? (
          <mark key={i} className="bg-transparent font-semibold text-fg">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export interface SearchResultProps {
  /** What was found: its kind, title, address, a line of context, a photograph or logo, and one short fact. */
  hit: SearchHit;
  /** Called when the reader opens the result (`SiteSearch` remembers the search). */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Called on a key press on the result (`SiteSearch` moves through results with the arrow keys). */
  onKeyDown?: KeyboardEventHandler<HTMLAnchorElement>;
  /** The words searched for: set in bold where they appear in the title and the line of context. */
  query?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * One search result as a link: a product’s photograph or a brand’s logo (an
 * icon for its kind otherwise), the title, a line of context, and its kind
 * with one short fact (“Product · Grade A+”). The words searched for are set
 * in bold, never highlighted in color.
 *
 * **Use it for** results in `SiteSearch` and on a search results page.
 * **Not for** a product in a grid (`ProductCard`) or a suggestion chip
 * (`Chip`).
 *
 * @summary One search result: picture or icon, title and context with the words in bold.
 * @import import { SearchResult } from "@/kit/components";
 */
export function SearchResult({ hit, query = "", onKeyDown, onClick, className }: SearchResultProps) {
  const kind = SEARCH_KIND_LABEL[hit.kind];
  const Icon = kind.icon;
  return (
    <a
      href={hit.href}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={cn("kit-focus grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3 rounded-ctl p-2 text-fg no-underline transition-colors duration-(--dur) ease-(--ease) hover:bg-well", className)}
    >
      <span aria-hidden="true" className="relative grid size-11 place-items-center overflow-hidden rounded-ctl border border-line bg-paper text-fg-muted">
        {hit.image ? <Image src={hit.image.src} alt="" fill sizes="2.75rem" className="object-contain p-1" /> : <Icon size={18} strokeWidth={1.75} />}
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="t-ui text-fg">
          <Marked text={hit.title} query={query} />
        </span>
        {hit.snippet ? (
          <span className="line-clamp-2 t-small text-fg-muted">
            <Marked text={hit.snippet} query={query} />
          </span>
        ) : null}
        <span className="t-caption text-fg-muted">
          {kind.one}
          {hit.meta ? (
            <>
              <Sep />
              {hit.meta}
            </>
          ) : null}
        </span>
      </span>
    </a>
  );
}
