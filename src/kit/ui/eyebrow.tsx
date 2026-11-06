import { Fragment, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Sep } from "./marks";

export interface EyebrowProps extends Omit<HTMLAttributes<HTMLElement>, "tw"> {
  /** The element: `p` (default), `span`, `div`, or `h2`–`h4` when the label heads a section. */
  as?: "p" | "span" | "div" | "h2" | "h3" | "h4";
  /** Several parts joined by a decorative middle dot (hidden from screen readers): `["Heavy metals", "ppb"]`. Use instead of `children`. */
  items?: ReactNode[];
  /** A leading icon, for stamps: a check before “Updated October 28, 2026”. */
  icon?: ReactNode;
  /** `muted` (default) · `default` ink · `category` the section’s accent, text-safe. */
  tone?: "muted" | "default" | "category";
  /** `md` 11px (default) · `sm` 10px, for pills on photographs and table rows. */
  size?: "md" | "sm";
  /** The words, in sentence case: CSS sets the capitals. */
  children?: ReactNode;
  /** An id, for a label that names something else (`aria-labelledby`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const TONE = { muted: "text-fg-muted", default: "text-fg", category: "text-accent-category-ink" } as const;

/**
 * The micro-caps voice as a component: mono, 11px, +0.08em, 600, capitals
 * set by CSS (write the words in sentence case). A label above or inside
 * something, one short phrase at a time.
 *
 * **Use it for** a descriptor over a product name, a section label, a
 * verification stamp, a data heading, the award in a table row. **Not for**
 * a sentence, a heading that says something (use the display serif:
 * `t-headline`, `t-title`), or capitals typed in the source.
 *
 * @summary The micro-caps label voice: descriptors, data headings, stamps. Never a sentence.
 * @import import { Eyebrow } from "@/kit/ui";
 */
export function Eyebrow({ as: Tag = "p", items, icon, tone = "muted", size = "md", className, children, ...props }: EyebrowProps) {
  const row = !!items || !!icon;
  return (
    <Tag className={cn("m-0", size === "sm" ? "t-micro-sm" : "t-micro", TONE[tone], row && "flex flex-wrap items-center", className)} {...props}>
      {icon && (
        <span aria-hidden="true" className="mr-1.5 inline-flex shrink-0">
          {icon}
        </span>
      )}
      {items
        ? items.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <Sep />}
              <span>{item}</span>
            </Fragment>
          ))
        : row
          ? <span>{children}</span>
          : children}
    </Tag>
  );
}

export interface BreadcrumbProps {
  /** The path to the page, section first: `[{ label: "Watches", href: "/watches" }, { label: "Buying guides", href: "/watches/guides" }]`. */
  items: { label: string; href: string }[];
  /** The navigation landmark’s label. Default “Breadcrumb”. */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Where the page sits, as the article’s eyebrow: “Watches · Buying guides”
 * in micro-caps. The section (the first crumb) is set in ink, the rest
 * muted; every crumb is a link with the kit focus ring.
 *
 * **Use it for** the top of an article header. **Not for** a label that is
 * not a path (`Eyebrow`).
 *
 * @summary The article’s eyebrow as a path of links: “Watches · Buying guides”.
 * @import import { Breadcrumb } from "@/kit/ui";
 */
export function Breadcrumb({ items, label = "Breadcrumb", className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="m-0 flex list-none flex-wrap items-center p-0 t-micro text-fg-muted">
        {items.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center">
            {i > 0 && <Sep />}
            <a href={crumb.href} className={cn("kit-focus inline-flex min-h-6 items-center rounded-ctl hover:text-fg", i === 0 && "text-fg")}>
              {crumb.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
