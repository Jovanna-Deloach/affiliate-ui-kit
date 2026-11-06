import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const TONES: Record<"info" | "success" | "warning" | "danger", { icon: LucideIcon; bar: string; ink: string }> = {
  info: { icon: Info, bar: "before:bg-accent-category", ink: "text-accent-category-ink" },
  success: { icon: CircleCheck, bar: "before:bg-pass", ink: "text-pass" },
  warning: { icon: TriangleAlert, bar: "before:bg-warn", ink: "text-warn" },
  danger: { icon: CircleAlert, bar: "before:bg-fail", ink: "text-fail" },
};

export interface AlertProps {
  /** `info` context (default) · `success` something worked · `warning` read before relying on it · `danger` a problem the reader must know about. */
  tone?: keyof typeof TONES;
  /** The point, in a few words: “Certification expired”. */
  title?: ReactNode;
  /** A sentence or two: what it means and where to learn more. */
  children?: ReactNode;
  /** One follow-up under the text: a `Button` or a link. */
  action?: ReactNode;
  /** Announce it when it appears after load (a form result); leave off for notices that are part of the page. */
  live?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A notice inside the page: white, with a bar and an icon in its tone, so the
 * word carries the meaning and color only confirms it. Four tones: info,
 * success, warning and danger.
 *
 * **Use it for** facts a reader should weigh: “We don’t fact-check reviews”,
 * “This brand hasn’t asked for reviews recently”, “This product’s
 * certification is expired”, a form that could not be sent. **Not for** a
 * recall or safety warning on a product (that replaces the buy box), a
 * confirmation that leaves on its own (`Toast`), or a field’s error (put it
 * on the field).
 *
 * @summary A notice in the page, white with a tone bar and icon: info to danger.
 * @import import { Alert } from "@/kit/ui";
 */
export function Alert({ tone = "info", title, children, action, live, className }: AlertProps) {
  const { icon: Icon, bar, ink } = TONES[tone];
  return (
    <div
      role={live ? (tone === "danger" ? "alert" : "status") : undefined}
      className={cn(
        "relative flex gap-3 overflow-hidden rounded-box border border-line bg-paper py-3.5 pr-4 pl-5 before:absolute before:inset-y-0 before:left-0 before:w-1",
        bar,
        className,
      )}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={2} className={cn("mt-0.5 shrink-0", ink)} />
      <div className="grid min-w-0 gap-1">
        {title ? <p className="m-0 t-ui font-semibold text-fg">{title}</p> : null}
        {children ? <div className="t-small text-fg-body [&_a]:kit-link [&_p]:m-0">{children}</div> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  );
}
