import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Eyebrow } from "@/kit/ui";

/**
 * Story layout for the kit’s own pages (Kit / Primitives, Kit / Components):
 * a header naming the part, then every state in a labelled grid. Stories
 * render on the theme’s ground, inside the page well, so a part is judged
 * where it will live.
 */
export function Specimen({
  kind,
  title,
  description,
  category,
  columns = 2,
  children,
}: {
  kind: "Primitive" | "Component";
  title: string;
  description: string;
  /** The section, for the category accent (Assay: supplements, running). */
  category?: string;
  columns?: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <div data-category={category} className="kit-well py-12">
      <header className="max-w-measure">
        <Eyebrow>{kind}</Eyebrow>
        <h1 className="m-0 mt-2 t-headline text-fg">{title}</h1>
        <p className="m-0 mt-3 t-body text-fg-body">{description}</p>
      </header>
      <div className={cn("mt-10 grid items-start gap-x-8 gap-y-12", columns === 2 && "md:grid-cols-2", columns === 3 && "md:grid-cols-2 xl:grid-cols-3")}>{children}</div>
    </div>
  );
}

/** One state of a part, under a micro-caps label. `wide` spans the whole grid. */
export function State({ label, wide = false, className, children }: { label: string; wide?: boolean; className?: string; children: ReactNode }) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4", wide && "md:col-span-full", className)}>
      <Eyebrow as="h2" className="border-b border-line pb-2">
        {label}
      </Eyebrow>
      {children}
    </section>
  );
}

/** A paper surface for parts that live inside a card. */
export function OnCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("@container kit-card p-5", className)}>{children}</div>;
}
