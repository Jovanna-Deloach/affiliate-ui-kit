import type { WatchSpecimen } from "@/kit/types";

import { type Detail, SpecimenFrame } from "./frame";
import { watchDrawing } from "./watch";

export type { Detail } from "./frame";
export { AssayGraphic } from "./assay";

/** Stable short hash of a specimen’s parameters (FNV-1a). Two SKUs never share a drawing. */
export function specimenHash(specimen: WatchSpecimen): string {
  const json = JSON.stringify(specimen, Object.keys(specimen).sort());
  let h = 2166136261;
  for (let i = 0; i < json.length; i++) h = Math.imul(h ^ json.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export interface TechnicalSpecimenProps {
  specimen: WatchSpecimen;
  productId: string;
  /** Product name, used in the drawing’s accessible description. */
  name: string;
  /**
   * full  — dimensioned plate with profile and labels (deep dive, 4:3)
   * card  — the front elevation alone, with clear margins (verdict cards, 1:1)
   * thumb — the same, smaller (tables, rails)
   */
  detail?: Detail;
  className?: string;
}

/**
 * A drafting plate of a watch, generated from its case geometry: 0.75px
 * muted lines, inked dial furniture, at one millimetre scale across SKUs,
 * always with clear margins. Never shared between products: the audit fails
 * a page where two SKUs render the same drawing.
 */
export function TechnicalSpecimen({ specimen, productId, name, detail = "full", className }: TechnicalSpecimenProps) {
  const hash = specimenHash(specimen);
  const drawing = watchDrawing(specimen, detail, name);
  return (
    <SpecimenFrame w={drawing.w} h={drawing.h} detail={detail} hash={hash} productId={productId} label={drawing.label} callouts={drawing.callouts} className={className}>
      {drawing.svg}
    </SpecimenFrame>
  );
}
