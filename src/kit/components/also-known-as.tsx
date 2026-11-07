import { cn } from "@/lib/cn";

export interface AlsoKnownAsProps {
  /** Other names for the same thing, as labels and papers use them: “Creatine monohydrate”. */
  names: string[];
  /** Things with similar names that are something else, each with a few words on what it is and a link to its page. */
  notConfusedWith?: { name: string; note?: string; href?: string }[];
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The other names a supplement goes by on labels and in papers, and the
 * things it should not be confused with (creatinine is not creatine), each
 * with a few words on what it is and a link. Long chemical names wrap.
 *
 * **Use it for** the top of a supplement’s or ingredient’s page, under its
 * name. **Not for** brand names or products (`ProductCard`), or search
 * synonyms (they belong in the search index).
 *
 * @summary Other names for a supplement, and what not to confuse it with.
 * @import import { AlsoKnownAs } from "@/kit/components";
 */
export function AlsoKnownAs({ names, notConfusedWith, className }: AlsoKnownAsProps) {
  return (
    <dl className={cn("m-0 grid gap-3 break-words", className)}>
      <div className="grid gap-1">
        <dt className="t-micro text-fg-muted">Also known as</dt>
        <dd className="m-0 t-small text-fg-body">{names.join(", ")}</dd>
      </div>
      {notConfusedWith?.length ? (
        <div className="grid gap-1">
          <dt className="t-micro text-fg-muted">Not to be confused with</dt>
          <dd className="m-0">
            <ul className="m-0 grid list-none gap-1 p-0">
              {notConfusedWith.map((item) => (
                <li key={item.name} className="t-small text-fg-body">
                  {item.href ? (
                    <a href={item.href} className="kit-focus kit-link rounded-ctl text-fg">
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-fg">{item.name}</span>
                  )}
                  {item.note ? <span className="text-fg-muted">, {item.note}</span> : null}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
