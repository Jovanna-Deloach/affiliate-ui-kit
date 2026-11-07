import { SearchX } from "lucide-react";

import { PeopleAlsoLookedAt, SiteFooter, SiteHeader } from "@/kit/blocks";
import { SearchResult } from "@/kit/components";
import { SEARCH_KINDS } from "@/kit/lib/discovery";
import { typesetDeep } from "@/kit/lib/typeset";
import type { Category, ProductSummary, SearchHit, SearchKind, SiteChrome } from "@/kit/types";
import { Button, EmptyState, SearchField } from "@/kit/ui";

const GROUP: Record<SearchKind, string> = { product: "Products", brand: "Brands", ingredient: "Ingredients", guide: "Guides", category: "Categories" };

export interface SearchPageProps {
  /** The publication: masthead and footer. */
  site: SiteChrome;
  /** What the reader searched for. */
  query: string;
  /** What it found, best first: the page groups them by kind. */
  hits: SearchHit[];
  /** The results page itself, where the field sends a new search (`?q=`); default `/search`. */
  resultsPath?: string;
  /** Searches to try when nothing matches. */
  suggestions?: string[];
  /** Products to show when nothing matches. */
  popular?: ProductSummary[];
  /** The section the masthead marks, when the search began in one. */
  category?: Category;
}

/**
 * The full search results page: the query as the heading, its own search
 * field to search again, then the results grouped (products, brands,
 * ingredients, guides, categories), every one, with the words in bold. With
 * nothing found, it says so, offers searches to try and popular products.
 * The template typesets the results.
 * Rendered on the server from the `?q=` query; the masthead’s `SiteSearch`
 * sends readers here.
 *
 * **Use it for** the results page (`/search?q=`). **Not for** the quick
 * results under the masthead (`SiteSearch`), or filtering one list
 * (`ReviewFilters`).
 *
 * @summary The search results page: grouped results, search again, or what to try.
 * @import import { SearchPage } from "@/kit/templates";
 */
export function SearchPage({ site, query, hits: rawHits, resultsPath = "/search", suggestions = [], popular: rawPopular = [], category }: SearchPageProps) {
  const hits = typesetDeep(rawHits);
  const popular = typesetDeep(rawPopular);
  const groups = SEARCH_KINDS.map((kind) => ({ kind, items: hits.filter((hit) => hit.kind === kind) })).filter((group) => group.items.length);
  return (
    <div data-category={category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={category} />
      <main className="kit-well pt-8 pb-16 md:pt-12">
        <div className="grid max-w-3xl gap-6">
          <h1 className="m-0 t-headline text-fg">
            {hits.length ? `${hits.length} ${hits.length === 1 ? "result" : "results"} for “${query}”` : `Nothing found for “${query}”`}
          </h1>
          <form role="search" action={resultsPath} method="get" className="flex flex-wrap items-center gap-3">
            <SearchField label="Search the site" name="q" defaultValue={query} className="min-w-0 flex-1 basis-64" />
            <Button type="submit">Search</Button>
          </form>
        </div>
        {groups.length ? (
          <div className="mt-12 grid max-w-3xl gap-12">
            {groups.map((group) => (
              <section key={group.kind} aria-labelledby={`results-${group.kind}`} className="grid gap-3">
                <h2 id={`results-${group.kind}`} className="m-0 flex items-baseline gap-2 t-title text-fg">
                  {GROUP[group.kind]}
                  <span data-numeric className="t-small text-fg-muted">
                    {group.items.length}
                  </span>
                </h2>
                <ul className="m-0 grid list-none border-t border-line p-0">
                  {group.items.map((hit) => (
                    <li key={`${hit.kind}-${hit.href}`} className="border-b border-line">
                      <SearchResult hit={hit} query={query} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-chapter">
            <EmptyState title="No products, brands or guides match" icon={SearchX} className="max-w-3xl border-t border-line">
              <p>Check the spelling, or search for fewer words.</p>
              {suggestions.length ? (
                <p>
                  Try{" "}
                  {suggestions.map((s, i) => (
                    <span key={s}>
                      {i ? (i === suggestions.length - 1 ? " or " : ", ") : null}
                      <a href={`${resultsPath}?q=${encodeURIComponent(s)}`} className="kit-focus kit-link rounded-ctl">
                        {s}
                      </a>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </EmptyState>
            {popular.length ? <PeopleAlsoLookedAt products={popular} heading="What readers are looking at" /> : null}
          </div>
        )}
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
