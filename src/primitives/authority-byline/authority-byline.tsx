import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, initials } from "@/lib/format";
import { StatusPill } from "@/primitives/status-pill";

import { MethodologyDisclosure, type MethodologyFact } from "./methodology-disclosure";

/**
 * <AuthorityByline />
 * ---------------------------------------------------------------------------
 * E-E-A-T proof: who tested it, what qualifies them, when it was verified,
 * and how — with the methodology kept in the DOM for crawlers.
 *
 * dossier-box = TWO full-width regions in one bordered container
 * (Law of Common Region — no floating avatar column, no L-shaped void):
 *
 *   ┌─ Region 1 · primary · p-card ───────────────────────────────┐
 *   │ [56px portrait]  Name (title voice)                          │
 *   │                  Role · credential chips                     │
 *   │ Bio paragraph, max-w 62ch, spanning the full width           │
 *   ├─ Region 2 · recessed · px-bar-x py-bar-y ────────────────────┤
 *   │ ✓ Verified Oct 29, 2026 · Reviewed by …     How we tested ⌄  │
 *   │ (protocol + 3-column testing facts reveal inside the well)   │
 *   └──────────────────────────────────────────────────────────────┘
 *
 *   --size-portrait / --radius-inner      56px portrait, inset ring
 *   --surface-primary → --surface-recessed  the two planes
 *   --inset-card / --inset-bar-*          region insets
 *   type-mono                             ONLY the timestamp
 *
 * inline-header  one line: portrait · By Name · role · verification
 * verified-strip hairline strip: ✓ Verified by … · date · How we tested
 *
 * Server Component; the only client leaf is the methodology disclosure.
 */

export interface Author {
  name: string;
  role?: string;
  credentials?: string[];
  bio?: ReactNode;
  avatar?: { src: string; alt: string };
  href?: string;
}

export interface Methodology {
  title?: ReactNode;
  summary: ReactNode;
  /** Three testing metrics shown above the protocol ("3 · Retail batches"). */
  facts?: MethodologyFact[];
  defaultOpen?: boolean;
}

const bylineVariants = cva("min-w-0", {
  variants: {
    variant: {
      "inline-header": "flex flex-wrap items-center gap-x-stack gap-y-cluster",
      "dossier-box": "w-full overflow-hidden rounded-container border border-hairline bg-surface",
      "verified-strip": "flex flex-col gap-cluster border-y border-hairline py-row",
    },
  },
  defaultVariants: { variant: "inline-header" },
});

export interface AuthorityBylineProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof bylineVariants> {
  author: Author;
  reviewedBy?: Author;
  /** ISO timestamp → "VERIFIED OCT 27, 2026" (mono metadata). */
  verifiedAt?: string;
  updatedAt?: string;
  methodology?: Methodology;
}

export function AuthorityByline({
  author,
  reviewedBy,
  verifiedAt,
  updatedAt,
  methodology,
  variant = "inline-header",
  className,
  ...props
}: AuthorityBylineProps) {
  const base = cn(bylineVariants({ variant }), className);
  const methodologyTitle = methodology?.title ?? "How we tested";

  if (variant === "dossier-box") {
    return (
      <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
        {/* Region 1 — primary bio header */}
        <div data-slot="byline-header" className="grid grid-cols-[var(--size-portrait)_minmax(0,1fr)] gap-x-stack gap-y-stack p-card">
          <Avatar author={author} size="lg" />
          <div className="flex min-w-0 flex-col gap-cluster self-center">
            <div className="flex min-w-0 flex-col gap-hairline">
              <AuthorName author={author} className="type-title" />
              {author.role && <span className="text-body-sm text-ink-secondary">{author.role}</span>}
            </div>
            {author.credentials && author.credentials.length > 0 && (
              <ul className="flex flex-wrap gap-cluster">
                {author.credentials.map((c) => (
                  <li key={c} className="contents">
                    <StatusPill kind="technical">{c}</StatusPill>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {author.bio && (
            <p className="col-span-2 m-0 max-w-prose text-body leading-body text-ink-secondary">{author.bio}</p>
          )}
        </div>

        {/* Region 2 — recessed verification & methodology footer */}
        <div data-slot="byline-footer" className="border-t border-hairline bg-recessed px-bar-x py-bar-y">
          {methodology ? (
            <MethodologyDisclosure
              leading={<VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} />}
              trigger={methodologyTitle}
              facts={methodology.facts}
              defaultOpen={methodology.defaultOpen}
            >
              {methodology.summary}
            </MethodologyDisclosure>
          ) : (
            <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} />
          )}
        </div>
      </div>
    );
  }

  if (variant === "verified-strip") {
    const leading = (
      <span className="flex min-w-0 flex-wrap items-center gap-x-cluster gap-y-hairline text-body-sm">
        <span className="flex min-w-0 items-center gap-[0.45em]">
          <VerifiedMark />
          <span className="min-w-0 truncate">
            <span className="text-ink-secondary">Verified by </span>
            <AuthorName author={author} className="font-medium" />
            {author.role && <span className="text-ink-secondary"> · {author.role}</span>}
          </span>
        </span>
        <VerificationLine verifiedAt={verifiedAt} updatedAt={updatedAt} mark={false} />
      </span>
    );
    return (
      <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
        {methodology ? (
          <MethodologyDisclosure leading={leading} trigger={methodologyTitle} facts={methodology.facts} defaultOpen={methodology.defaultOpen}>
            {methodology.summary}
          </MethodologyDisclosure>
        ) : (
          leading
        )}
      </div>
    );
  }

  return (
    <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
      {/* Portrait + name travel together; the role wraps beside the portrait, never under it. */}
      <span className="flex min-w-0 items-center gap-cluster">
        <Avatar author={author} size="sm" />
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.4em] text-body-sm">
          <span className="text-ink-secondary">By</span>
          <AuthorName author={author} className="font-medium" />
          {author.role && <span className="text-ink-secondary">· {author.role}</span>}
        </span>
      </span>
      <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} />
      {methodology && (
        <MethodologyDisclosure trigger={methodologyTitle} facts={methodology.facts} defaultOpen={methodology.defaultOpen} className="basis-full">
          {methodology.summary}
        </MethodologyDisclosure>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function AuthorName({ author, className }: { author: Author; className?: string }) {
  const name = <span className={cn("text-ink", className)}>{author.name}</span>;
  return author.href ? (
    <a href={author.href} rel="author" className="focus-ring rounded-tag underline-offset-[0.25em] hover:underline">
      {name}
    </a>
  ) : (
    name
  );
}

function Avatar({ author, size }: { author: Author; size: "sm" | "lg" }) {
  return (
    <span
      data-slot="byline-avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-inner bg-recessed text-ink-secondary",
        "ring-1 ring-inset ring-strong",
        size === "lg" ? "size-portrait" : "size-portrait-sm",
      )}
    >
      {author.avatar ? (
        <Image src={author.avatar.src} alt={author.avatar.alt} fill sizes="112px" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="text-caption font-semibold tracking-metric">
          {initials(author.name)}
        </span>
      )}
    </span>
  );
}

function VerifiedMark() {
  return <BadgeCheck size="1.25em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-positive" />;
}

/**
 * "✓ VERIFIED OCT 29, 2026 · Reviewed by Tomás Ferreira · Fact-check"
 * Prose in sans; only the timestamp is mono (Law 1).
 */
function VerificationLine({
  author,
  verifiedAt,
  updatedAt,
  mark = true,
}: {
  author?: Author;
  verifiedAt?: string;
  updatedAt?: string;
  mark?: boolean;
}) {
  if (!verifiedAt && !updatedAt && !author) return null;
  return (
    <span
      data-slot="verification-line"
      className="flex min-w-0 flex-wrap items-center gap-x-cluster gap-y-hairline text-caption text-ink-secondary"
    >
      {verifiedAt && (
        <span className="flex items-center gap-[0.45em]">
          {mark && <VerifiedMark />}
          <span className="type-mono whitespace-nowrap text-ink">Verified {formatDate(verifiedAt)}</span>
        </span>
      )}
      {updatedAt && updatedAt !== verifiedAt && (
        <span className="type-mono whitespace-nowrap">Updated {formatDate(updatedAt)}</span>
      )}
      {author && (
        <span className="min-w-0 truncate">
          Reviewed by <AuthorName author={author} className="font-medium" />
          {author.role && <span> · {author.role}</span>}
        </span>
      )}
    </span>
  );
}

export { bylineVariants as authorityBylineVariants };
