import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, initials } from "@/lib/format";

import { MethodologyDisclosure } from "./methodology-disclosure";

/**
 * <AuthorityByline />
 * ---------------------------------------------------------------------------
 * E-E-A-T proof: who tested it, what qualifies them, when it was last
 * verified, and how — with the methodology kept in the DOM for crawlers.
 *
 *   --size-avatar / --radius-avatar   portrait (square editorial · circle lab)
 *   --space-cluster-gap / --space-row-pad   lockup rhythm
 *   --color-positive                  verified mark
 *   type-eyebrow / type-label-mono / type-display-sm   voices
 *
 * Mobbin anatomy (NYT author header, GetYourGuide verified writer card,
 * Obvious inline byline, Curater "last updated" strip):
 *   inline-header   one line at 375 — avatar · "By Name" · role · date
 *   dossier-box     bordered card: portrait, name in the display voice,
 *                   credential chips, bio, methodology disclosure
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
  /** Trigger label, default "How we tested". */
  title?: ReactNode;
  summary: ReactNode;
  defaultOpen?: boolean;
}

const bylineVariants = cva("min-w-0", {
  variants: {
    variant: {
      "inline-header": "flex flex-wrap items-center gap-x-cluster-gap gap-y-[0.35em]",
      "dossier-box": [
        "flex flex-col gap-row-pad rounded-surface border-surface-w border-border bg-surface p-card-pad shadow-surface",
        "@container",
      ],
      "verified-strip": [
        "flex flex-wrap items-center gap-x-row-pad gap-y-[0.5em] border-y-[length:var(--border-width-surface)] border-border py-[calc(var(--space-row-pad)*0.75)]",
      ],
    },
  },
  defaultVariants: { variant: "inline-header" },
});

export interface AuthorityBylineProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof bylineVariants> {
  author: Author;
  /** Optional second reviewer (fact-check / clinical review). */
  reviewedBy?: Author;
  /** ISO timestamp — rendered as "Verified Oct 27, 2026". */
  verifiedAt?: string;
  /** ISO timestamp — rendered as "Updated …" when it differs from verifiedAt. */
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

  if (variant === "dossier-box") {
    return (
      <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
        <div className="flex flex-col gap-row-pad @sm:flex-row @sm:items-start">
          <Avatar author={author} size="lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-[0.35em]">
            <span className="type-eyebrow text-muted">Reviewed by</span>
            <AuthorName author={author} className="type-display-sm" />
            {author.role && <span className="text-sm text-muted">{author.role}</span>}
            {author.credentials && author.credentials.length > 0 && (
              <ul className="mt-[0.35em] flex flex-wrap gap-[0.4em]">
                {author.credentials.map((c) => (
                  <li
                    key={c}
                    className="type-label-mono rounded-badge border-interactive-w border-border px-[0.6em] py-[0.35em] text-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
            {author.bio && <p className="mt-[0.5em] text-sm leading-relaxed text-muted">{author.bio}</p>}
          </div>
        </div>
        <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} />
        {methodology && (
          <MethodologyDisclosure
            trigger={methodology.title ?? "How we tested"}
            defaultOpen={methodology.defaultOpen}
          >
            {methodology.summary}
          </MethodologyDisclosure>
        )}
      </div>
    );
  }

  if (variant === "verified-strip") {
    return (
      <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
        <span className="flex min-w-0 items-center gap-[0.5em]">
          <BadgeCheck size="1.25em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-positive" />
          <span className="type-eyebrow truncate">
            Verified by <AuthorName author={author} />
            {author.role && <span className="text-muted"> · {author.role}</span>}
          </span>
        </span>
        <VerificationLine verifiedAt={verifiedAt} updatedAt={updatedAt} compact mark={false} />
        {methodology && (
          <MethodologyDisclosure
            trigger={methodology.title ?? "How we tested"}
            className="basis-full"
          >
            {methodology.summary}
          </MethodologyDisclosure>
        )}
      </div>
    );
  }

  return (
    <div data-slot="authority-byline" data-variant={variant} className={base} {...props}>
      <Avatar author={author} size="sm" />
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.5em] text-sm">
        <span className="text-muted">By</span>
        <AuthorName author={author} className="font-medium" />
        {author.role && <span className="text-muted">· {author.role}</span>}
      </span>
      <VerificationLine author={reviewedBy} verifiedAt={verifiedAt} updatedAt={updatedAt} compact />
      {methodology && (
        <MethodologyDisclosure
          trigger={methodology.title ?? "How we tested"}
          className="basis-full"
        >
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
    <a href={author.href} rel="author" className="focus-ring hover:underline underline-offset-[0.25em]">
      {name}
    </a>
  ) : (
    name
  );
}

function Avatar({ author, size }: { author: Author; size: "sm" | "lg" }) {
  const dim = size === "lg" ? "size-[calc(var(--size-avatar)*1.6)]" : "size-[calc(var(--size-avatar)*0.75)]";
  return (
    <span
      data-slot="byline-avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-avatar bg-surface-pedestal text-muted",
        "border-surface-w border-border",
        dim,
      )}
    >
      {author.avatar ? (
        <Image src={author.avatar.src} alt={author.avatar.alt} fill sizes="96px" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="font-display text-[0.9em] leading-none">
          {initials(author.name)}
        </span>
      )}
    </span>
  );
}

function VerificationLine({
  author,
  verifiedAt,
  updatedAt,
  compact = false,
  mark = true,
}: {
  author?: Author;
  verifiedAt?: string;
  updatedAt?: string;
  compact?: boolean;
  /** Render the ✓ mark (off when the parent already shows one). */
  mark?: boolean;
}) {
  if (!verifiedAt && !updatedAt && !author) return null;
  const parts: ReactNode[] = [];
  if (author) {
    parts.push(
      <span key="reviewer">
        Reviewed by <AuthorName author={author} />
        {author.role && <span className="text-muted"> · {author.role}</span>}
      </span>,
    );
  }
  if (verifiedAt) parts.push(<span key="verified">Verified {formatDate(verifiedAt)}</span>);
  if (updatedAt && updatedAt !== verifiedAt) parts.push(<span key="updated">Updated {formatDate(updatedAt)}</span>);

  return (
    <span
      data-slot="verification-line"
      className={cn(
        "type-label-mono flex min-w-0 flex-wrap items-center gap-x-[0.6em] gap-y-[0.3em] text-muted",
        !compact && "border-t-surface-w border-border pt-row-pad",
      )}
    >
      {mark && !author && verifiedAt && (
        <BadgeCheck size="1.3em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-positive" />
      )}
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-[0.6em]">
          {i > 0 && <span aria-hidden="true">·</span>}
          {p}
        </span>
      ))}
    </span>
  );
}

export { bylineVariants as authorityBylineVariants };
