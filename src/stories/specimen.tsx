import type { ReactNode } from "react";

/**
 * Specimen caption for variant matrices. A quiet caption in the kit's own
 * caption voice — set above the component, never inside it, never a dashed
 * debug banner. Use humanised names ("Hairline divide"), not prop syntax.
 */
export function Specimen({
  caption,
  children,
  className,
}: {
  caption: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={["m-0 flex min-w-0 flex-col gap-cluster", className].filter(Boolean).join(" ")}>
      <figcaption className="text-caption text-ink-tertiary">{caption}</figcaption>
      <div className="min-w-0">{children}</div>
    </figure>
  );
}
