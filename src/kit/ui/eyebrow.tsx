import { Fragment, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Sep } from "./marks";

/**
 * The micro-caps voice as a component: mono, 11px, +0.08em, 600, capitals
 * set by CSS (write the words in sentence case). For a label above or
 * inside something — a descriptor, a section label, a verification stamp,
 * a data heading — never for a sentence.
 *
 *   items  several parts joined by a decorative middle dot (hidden from
 *          screen readers): “Heavy metals · ppb”
 *   icon   a leading icon, for stamps: ✓ “Updated October 28, 2026”
 *   tone   muted (default), default (ink), category (the section’s accent)
 *   size   md (11px) or sm (10px, for pills on photographs)
 *   as     the element: p (default), span, div, h2, h3, h4
 */
export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "h2" | "h3" | "h4";
  items?: ReactNode[];
  icon?: ReactNode;
  tone?: "muted" | "default" | "category";
  size?: "md" | "sm";
}

const TONE = { muted: "text-fg-muted", default: "text-fg", category: "text-accent-category-ink" } as const;

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

/**
 * Where the page sits, as the article’s eyebrow: “Watches · Buying guides”.
 * The section (the first crumb) is set in ink, the rest muted; every crumb
 * is a link with the kit focus ring.
 */
export interface BreadcrumbProps {
  items: { label: string; href: string }[];
  label?: string;
  className?: string;
}

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
