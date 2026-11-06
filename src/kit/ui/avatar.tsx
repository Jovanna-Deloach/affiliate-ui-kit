import Image from "next/image";

import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

export interface AvatarProps {
  /** The person: their name (for the initials) and, when there is one, their portrait. */
  person: { name: string; avatar?: { src: string; alt: string } };
  /** `md` 44px, the article byline (default) · `sm` 36px, inside cards (quotes, card bylines). */
  size?: "sm" | "md";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A person’s portrait, or their initials on a paper disc (legible on paper,
 * well and ground) when there is no photograph. Decorative: the person’s
 * name is always written beside it, so the image has no alt text of its own.
 *
 * **Use it for** a byline and for the person behind a quote. **Not for** a
 * merchant: a retailer gets a `Monogram`.
 *
 * @summary A person’s portrait or initials, always beside their written name (bylines, quotes).
 * @import import { Avatar } from "@/kit/ui";
 */
export function Avatar({ person, size = "md", className }: AvatarProps) {
  const box = size === "sm" ? "size-9" : "size-11";
  if (person.avatar)
    return (
      <span className={cn("relative shrink-0 overflow-hidden rounded-full bg-well", box, className)}>
        <Image src={person.avatar.src} alt="" fill sizes="88px" className="object-cover" />
      </span>
    );
  return (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-full border border-line bg-paper t-caption font-medium text-fg-muted", box, className)}>
      {initials(person.name)}
    </span>
  );
}
