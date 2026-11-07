import { citationId, formatAuthors, referenceId } from "@/kit/lib/evidence";
import type { Reference } from "@/kit/types";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

/** Ends a part of the citation with a period, unless it already ends with one (“et al.”) or a question mark. */
const sentence = (text: string) => (/[.?!]$/.test(text) ? text : `${text}.`);

export interface ReferenceListProps {
  /** The sources, in the order the text first cites them: authors, title, journal, year, details, DOI or PubMed id, and when a page was opened. */
  references: Reference[];
  /** The ids of the sources the text cites with `Citation`: each gets a link back to its first citation. */
  cited?: readonly string[];
  /** The heading (default “References”). */
  heading?: string;
  /** The heading’s level: `h2` (default), or `h3` inside a section. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `references`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The numbered sources behind a page: authors (three, then “et al.”), the
 * title, the journal, the year and its volume and pages, then links to the
 * DOI or PubMed, the date a web page was opened, and a link back to where
 * the text cites it. A citation’s jump lands on its source, tinted.
 *
 * **Use it for** the end of any page that cites studies, with `Citation` in
 * the text. **Not for** a study summed up for readers (`StudyCard`), or
 * links to read on (a plain list).
 *
 * @summary Numbered sources: authors, title, journal, year, DOI or PubMed, back links.
 * @import import { ReferenceList } from "@/kit/components";
 */
export function ReferenceList({ references, cited, heading = "References", as: Heading = "h2", id = "references", className }: ReferenceListProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("grid scroll-mt-8 gap-4", className)}>
      <Heading id={`${id}-heading`} className="m-0 t-headline text-fg">
        {heading}
      </Heading>
      <ol className="m-0 grid list-none gap-1 p-0">
        {references.map((ref, i) => (
          <li key={ref.id} id={referenceId(ref.id)} className="-mx-2 grid scroll-mt-24 grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded-box px-2 py-2 target:bg-well">
            <span data-numeric className="t-small text-fg-muted">
              {i + 1}.
            </span>
            <div className="grid min-w-0 gap-1 break-words">
              <p className="m-0 t-small text-fg-body">
                {sentence(formatAuthors(ref.authors))} {sentence(ref.title)} <span className="text-fg">{ref.source}</span>. <span data-numeric>{ref.year}</span>
                {ref.details ? <span data-numeric>;{ref.details}</span> : null}.
              </p>
              <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 t-caption text-fg-muted">
                {ref.doi ? (
                  <a href={`https://doi.org/${ref.doi}`} className="kit-focus kit-link rounded-ctl break-all text-fg">
                    DOI {ref.doi}
                  </a>
                ) : null}
                {ref.pmid ? (
                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`} className="kit-focus kit-link rounded-ctl text-fg">
                    PubMed<span className="sr-only"> entry for reference {i + 1}</span>
                  </a>
                ) : null}
                {ref.url && !ref.doi && !ref.pmid ? (
                  <a href={ref.url} className="kit-focus kit-link rounded-ctl text-fg">
                    Read the source<span className="sr-only"> for reference {i + 1}</span>
                  </a>
                ) : null}
                {ref.accessedAt ? (
                  <span>
                    Opened <time dateTime={ref.accessedAt}>{formatDateLong(ref.accessedAt)}</time>
                  </span>
                ) : null}
                {cited?.includes(ref.id) ? (
                  <a href={`#${citationId(ref.id)}`} className="kit-focus kit-link rounded-ctl">
                    Back to the text<span className="sr-only"> for reference {i + 1}</span>
                  </a>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
