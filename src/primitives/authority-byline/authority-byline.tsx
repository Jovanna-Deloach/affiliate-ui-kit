import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, initials } from "@/lib/format";
import { StatusPill } from "@/primitives/status-pill";

import { MethodologyDisclosure } from "./methodology-disclosure";

/**
 * <AuthorityByline />
 * ---------------------------------------------------------------------------
 * E-E-A-T proof: who tested it, what qualifies them, when it was last
 * verified, and how — with the methodology kept in the DOM for crawlers.
 *
 *   --size-avatar / --radius-avatar / --color-ring-inner   portrait + inner ring
 *   --color-surface / --surface-recessed (Law 2)            card plane / lab-note well
 *   --space-row-pad / --space-cluster-gap                   lockup rhythm
 *   type-label-mono (Law 1)                                 ONLY the timestamp
 *
 * Mobbin anatomy (NYT author header, GetYourGuide verified writer card,
 * Obvious inline byline, Curater "last updated" strip):
 *   inline-header   one line at 375 — portrait · "By Name" · role · date
 *   dossier-box     surface card: portrait in column 1; header, credential
 *                   pills, bio, verification line and the methodology well
 *                   ALL in column 2 → one left-hand axis
 *   verified-strip  full-width hairline strip: ✓ Verified by … · date · trigger
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
  defaultOpen?: boolean;
}

const bylineVariants = cva("min-w-0", {
  variants: {
    variant: {
      "inline-header": "flex flex-wrap items-center gap-x-cluster-gap gap-y-[0.35em]",
      "dossier-box": [
        "@container w-full rounded-surface border-surface-w border-border bg-surface p-card-pad shadow-surface",
      ],
      "verified-strip": [
        "flex flex-wrap items-center gap-x-row-pad gap-y-[0.5em] border-y-[length:var(--border-width-surface)] border-border-soft py-[calc(var(--space-row-pad)*0.75)]",
      ],
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
        {/* Column 1: portrait · Column 2: everything else, one left axis. */}
        <div className="grid grid-cols-1 gap-row-pad @sm:grid-cols-[auto_minmax(0,1fr)] @sm:gap-x-row-pad">
          <Avatar author={author} size="lg" />
          <div className="flex min-w-0 flex-col gap-row-pad">
            <div className="flex min-w-0 flex-col gap-[0.35em]">
              <span className="type-eyebrow text-muted">Reviewed by</span>
              <AuthorName author={author} className="type-display-sm" />
              {author.role && <span className="text-sm text-muted">{author.role}</span>}
            </div>
            {author.credentials && author.credentials.length > 0 && (
              <ul className="flex flex-wrap gap-[0.4em]">
                {author.credentials.map((c) => (
                  <li key={c} className="contents">
                    <StatusPill tone="neutral">{c}</StatusPill>
                  </li>
                ))}
              </ul>
            )}
            {author.bio && <p className="m-0 text-sm leading-relaxed text-muted">{author.bio}</p>}
            <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} divided />
            {methodology && (
              <div
                data-slot="methodology-well"
                className="rounded-interactive border-surface-w border-border-soft bg-surface-recessed px-row-pad py-[calc(var(--space-row-pad)*0.75)]"
              >
                <MethodologyDisclosure trigger={methodologyTitle} defaultOpen={methodology.defaultOpen}>
                  {methodology.summary}
                </MethodologyDisclosure>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "verified-strip") {
    return (
      <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
        <span className="flex min-w-0 items-center gap-[0.5em] text-sm">
          <BadgeCheck size="1.25em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-positive" />
          <span className="min-w-0 truncate">
            <span className="text-muted">Verified by </span>
            <AuthorName author={author} className="font-medium" />
            {author.role && <span className="text-muted"> · {author.role}</span>}
          </span>
        </span>
        <VerificationLine verifiedAt={verifiedAt} updatedAt={updatedAt} mark={false} />
        {methodology && (
          <MethodologyDisclosure trigger={methodologyTitle} className="basis-full">
            {methodology.summary}
          </MethodologyDisclosure>
        )}
      </div>
    );
  }

  return (
    <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
      {/* Portrait + name travel together; the role wraps beside the portrait, never under it. */}
      <span className="flex min-w-0 items-center gap-cluster-gap">
        <Avatar author={author} size="sm" />
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.4em] text-sm">
          <span className="text-muted">By</span>
          <AuthorName author={author} className="font-medium" />
          {author.role && <span className="text-muted">· {author.role}</span>}
        </span>
      </span>
      <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} />
      {methodology && (
        <MethodologyDisclosure trigger={methodologyTitle} className="basis-full">
          {methodology.summary}
        </MethodologyDisclosure>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function AuthorName({ author, className }: { author: Author; className?: string }) {
  const name = <span className={cn("text-foreground", className)}>{author.name}</span>;
  return author.href ? (
    <a href={author.href} rel="author" className="focus-ring underline-offset-[0.25em] hover:underline">
      {name}
    </a>
  ) : (
    name
  );
}

function Avatar({ author, size }: { author: Author; size: "sm" | "lg" }) {
  const dim = size === "lg" ? "size-[calc(var(--size-avatar)*1.75)]" : "size-[calc(var(--size-avatar)*0.75)]";
  return (
    <span
      data-slot="byline-avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-avatar bg-surface-recessed text-muted",
        "ring-1 ring-ring-inner ring-inset",
        dim,
      )}
    >
      {author.avatar ? (
        <Image src={author.avatar.src} alt={author.avatar.alt} fill sizes="128px" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="text-xs font-semibold tracking-metric">
          {initials(author.name)}
        </span>
      )}
    </span>
  );
}

/**
 * "Reviewed by Tomás Ferreira · Fact-check  ·  VERIFIED OCT 27, 2026"
 * Prose in sans; only the timestamp is mono (Law 1).
 */
function VerificationLine({
  author,
  verifiedAt,
  updatedAt,
  mark = true,
  divided = false,
}: {
  author?: Author;
  verifiedAt?: string;
  updatedAt?: string;
  mark?: boolean;
  divided?: boolean;
}) {
  if (!verifiedAt && !updatedAt && !author) return null;
  return (
    <span
      data-slot="verification-line"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-[0.6em] gap-y-[0.3em] text-xs text-muted",
        divided && "border-t-surface-w border-border-soft pt-row-pad",
      )}
    >
      {/* The check travels with the first segment so it never wraps onto a line of its own. */}
      {author ? (
        <span className="flex items-center gap-[0.4em]">
          {mark && verifiedAt && <VerifiedMark />}
          <span>
            Reviewed by <AuthorName author={author} className="font-medium" />
            {author.role && <span> · {author.role}</span>}
          </span>
        </span>
      ) : null}
      {author && (verifiedAt || updatedAt) && <span aria-hidden="true">·</span>}
      {verifiedAt && (
        <span className="flex items-center gap-[0.4em]">
          {mark && !author && <VerifiedMark />}
          <span className="type-label-mono whitespace-nowrap">Verified {formatDate(verifiedAt)}</span>
        </span>
      )}
      {updatedAt && updatedAt !== verifiedAt && (
        <>
          <span aria-hidden="true">·</span>
          <span className="type-label-mono whitespace-nowrap">Updated {formatDate(updatedAt)}</span>
        </>
      )}
    </span>
  );
}

function VerifiedMark() {
  return <BadgeCheck size="1.3em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-positive" />;
}

export { bylineVariants as authorityBylineVariants };
