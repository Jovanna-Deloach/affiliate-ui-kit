import { cn } from "@/lib/cn";

/** How the testing worked, on the well tone so it reads as a separate voice. */
export function Methodology({
  heading = "How we tested",
  body,
  facts,
  className,
}: {
  heading?: string;
  body: string[];
  facts: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <section id="how-we-tested" aria-labelledby="how-we-tested-heading" className={cn("bg-well", className)}>
      <div className="kit-well grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <h2 id="how-we-tested-heading" className="m-0 t-headline text-fg lg:col-span-4">
          {heading}
        </h2>
        <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
          {body.map((p, i) => (
            <p key={i} className="m-0 max-w-measure t-body text-fg">
              {p}
            </p>
          ))}
          <dl className="m-0 mt-6 grid gap-8 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-2">
                <dt className="order-2 t-small text-fg-muted">{f.label}</dt>
                <dd className="order-1 m-0 t-figure-xl text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
