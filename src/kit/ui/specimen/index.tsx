import type { Specimen } from "@/kit/types";

import { type Detail, SpecimenFrame } from "./frame";
import { shoeDrawing } from "./shoe";
import { supplementDrawing } from "./supplement";
import { watchDrawing } from "./watch";

export type { Detail } from "./frame";

/** Stable short hash of a specimen’s parameters (FNV-1a). Two SKUs never share a drawing. */
export function specimenHash(specimen: Specimen): string {
  const json = JSON.stringify(specimen, Object.keys(specimen).sort());
  let h = 2166136261;
  for (let i = 0; i < json.length; i++) h = Math.imul(h ^ json.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export interface TechnicalSpecimenProps {
  specimen: Specimen;
  productId: string;
  /** Product name, used in the drawing’s accessible description. */
  name: string;
  /**
   * full  — dimensioned drawing with labels (deep dive, 4:3)
   * card  — the object alone, cropped like a studio photograph (verdict, 4:3)
   * thumb — the object alone, square (tables, rails)
   */
  detail?: Detail;
  className?: string;
}

/**
 * A parametric technical drawing of the product, generated from its
 * measurements. It replaces photography when a site has none, and it is
 * never shared between products: the audit fails a page where two SKUs
 * render the same drawing.
 */
export function TechnicalSpecimen({ specimen, productId, name, detail = "full", className }: TechnicalSpecimenProps) {
  const hash = specimenHash(specimen);
  const drawing =
    specimen.kind === "watch"
      ? watchDrawing(specimen, detail, name)
      : specimen.kind === "supplement"
        ? supplementDrawing(specimen, detail, name, `${productId}:${hash}`)
        : shoeDrawing(specimen, detail, name);
  return (
    <SpecimenFrame w={drawing.w} h={drawing.h} detail={detail} hash={hash} productId={productId} label={drawing.label} callouts={drawing.callouts} className={className}>
      {drawing.svg}
    </SpecimenFrame>
  );
}
