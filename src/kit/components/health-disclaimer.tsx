import { cn } from "@/lib/cn";

export interface HealthDisclaimerProps {
  /** For a page about several products: “These products are not intended…” (default: one product). */
  plural?: boolean;
  /** Include the FDA statement a supplement page carries (default true). */
  fda?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The health disclaimer, visible and in plain words: the page sums up
 * research and lab tests and can’t weigh a reader’s own health, then the
 * FDA’s statement for supplements, word for word. Set small and muted
 * between hairlines, but never hidden, collapsed or in an image.
 *
 * **Use it for** the end of every supplement page, before the footer.
 * **Not for** who should not take a supplement (`SafetyPanel`), how the
 * site makes money (the disclosure notice and `SiteFooter`), or a warning
 * about a product (`ConsumerWarning`).
 *
 * @summary Not medical advice, and the FDA statement, in plain words.
 * @import import { HealthDisclaimer } from "@/kit/components";
 */
export function HealthDisclaimer({ plural = false, fda = true, className }: HealthDisclaimerProps) {
  return (
    <aside aria-label="Health disclaimer" data-slot="health-disclaimer" className={cn("grid max-w-measure gap-2 border-t border-line pt-4 t-small text-fg-muted", className)}>
      <p className="m-0">
        <strong className="font-semibold text-fg">Not medical advice.</strong> This page sums up research and lab tests; it can’t weigh your health, your medicines or a pregnancy. A doctor or pharmacist can.
      </p>
      {fda ? (
        <p className="m-0">
          These statements have not been evaluated by the Food and Drug Administration. {plural ? "These products are" : "This product is"} not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      ) : null}
    </aside>
  );
}
