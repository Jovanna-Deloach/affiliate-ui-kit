import Image from "next/image";

import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

/**
 * A person’s portrait, or their initials on a paper disc (legible on paper,
 * well and ground) when there is no photograph. Decorative: the name is
 * always written beside it.
 *
 *   sm  36px  quotes and bylines inside cards
 *   md  44px  the article byline
 */
export interface AvatarProps {
  person: { name: string; avatar?: { src: string; alt: string } };
  size?: "sm" | "md";
  className?: string;
}

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
