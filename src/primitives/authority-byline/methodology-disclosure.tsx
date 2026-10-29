import type { ReactNode } from "react";

import { ProgressiveCollapse } from "@/primitives/progressive-collapse";

/**
 * "How we tested" disclosure — a thin alias over <ProgressiveCollapse />
 * (minimal-underline trigger). Kept as a named export so bylines read
 * clearly and the mechanic has a single owner.
 */
export function MethodologyDisclosure({
  trigger,
  children,
  defaultOpen = false,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <ProgressiveCollapse
      data-slot="methodology-disclosure"
      title={trigger}
      triggerStyle="minimal-underline"
      defaultOpen={defaultOpen}
      className={className}
    >
      {children}
    </ProgressiveCollapse>
  );
}
