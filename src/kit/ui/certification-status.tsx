import { CircleDashed, FlaskConical, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react";

import type { Certification } from "@/kit/types";
import { cn } from "@/lib/cn";

const monthYear = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const STATUS: Record<Certification["status"], { icon: LucideIcon; tone: string; words: (date?: string) => string }> = {
  certified: { icon: ShieldCheck, tone: "text-pass", words: (date) => (date ? `Certified until ${monthYear(date)}` : "Certified") },
  expired: { icon: ShieldAlert, tone: "text-warn", words: (date) => (date ? `Certification expired ${monthYear(date)}` : "Certification expired") },
  upcoming: { icon: FlaskConical, tone: "text-fg-muted", words: (date) => (date ? `In testing, results by ${monthYear(date)}` : "In testing") },
  untested: { icon: CircleDashed, tone: "text-fg-muted", words: () => "Not tested yet" },
};

export interface CertificationStatusProps {
  /** The status and its date: certified until, expired on, results due by. */
  certification: Certification;
  /** `sm` rows and cards (default) · `md` a product’s header. */
  size?: "sm" | "md";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Where a product stands in the testing program, as an icon and words with
 * the date that goes with it: Certified until Apr 2027 (green), Certification
 * expired Mar 2026 (amber), In testing, results by Dec 2026, or Not tested
 * yet. The words always carry the status; the color only backs them up.
 *
 * **Use it for** a product in a ranking row, a card or its header, and a
 * brand’s products. **Not for** a single test’s result (`ResultMark`), a
 * safety warning, or a grade (`GradeBadge`).
 *
 * @summary Certified, expired, in testing or not tested, with its date.
 * @import import { CertificationStatus } from "@/kit/ui";
 */
export function CertificationStatus({ certification, size = "sm", className }: CertificationStatusProps) {
  const { icon: Icon, tone, words } = STATUS[certification.status];
  return (
    <span className={cn("inline-flex items-center gap-1.5", size === "sm" ? "t-small" : "t-ui", tone, className)}>
      <Icon aria-hidden="true" size={size === "sm" ? 16 : 18} strokeWidth={1.75} className="shrink-0" />
      <span>{words(certification.date)}</span>
    </span>
  );
}
