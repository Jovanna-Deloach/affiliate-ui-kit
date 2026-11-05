import Image from "next/image";

import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import type { Person } from "@/kit/types";

/** A person’s portrait, or their initials on the well when there is no photograph. */
export function Avatar({ person, size = "md", className }: { person: Person; size?: "sm" | "md"; className?: string }) {
  const box = size === "sm" ? "size-9" : "size-11";
  if (person.avatar)
    return (
      <span className={cn("relative shrink-0 overflow-hidden rounded-full bg-well", box, className)}>
        <Image src={person.avatar.src} alt="" fill sizes="88px" className="object-cover" />
      </span>
    );
  return (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-full bg-well t-caption font-medium text-fg-muted", box, className)}>
      {initials(person.name)}
    </span>
  );
}

/** “Wore it for 64 days” → “wore it for 64 days”, for use after a name and a comma. */
export const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
