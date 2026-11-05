import type { Pick } from "@/kit/types";
import { AssayGraphic, ProductImage, TechnicalSpecimen, type Detail } from "@/kit/ui";

export function reviewId(pick: Pick) {
  return `review-${pick.product.slug}`;
}

export const pickName = (pick: Pick) => `${pick.product.brand} ${pick.product.name}`;

/** A long, low object (a shoe in profile) gets a 3:2 frame in the deep dive instead of 4:3. */
const isWide = (image: { width?: number; height?: number }) => !!image.width && !!image.height && image.width / image.height >= 1.5;

/**
 * What stands for the product: studio photography when the site has it;
 * otherwise a drafting plate (watches) or the certificate of analysis
 * (supplements). Never a drawing of the object.
 *
 *   full  — the deep dive's media, at its own ratio
 *   card  — fills the box it is given (verdict-card wells): give it a
 *           positioned parent with a size, e.g. `absolute inset-0`
 *   thumb — a small square (tables, rows)
 */
export function PickMedia({ pick, detail, ratio, sizes, className }: { pick: Pick; detail: Detail; ratio?: "square" | "landscape"; sizes?: string; className?: string }) {
  const name = pickName(pick);
  if (pick.product.image)
    return (
      <ProductImage
        image={pick.product.image}
        productId={pick.product.id}
        ratio={detail === "card" ? "fill" : (ratio ?? (detail === "full" ? (isWide(pick.product.image) ? "wide" : "landscape") : "square"))}
        pad={detail === "full" ? "lg" : detail === "card" ? "fit" : "sm"}
        sizes={sizes}
        className={className}
      />
    );
  if (pick.specimen) return <TechnicalSpecimen specimen={pick.specimen} productId={pick.product.id} name={name} detail={detail} className={className} />;
  // The certificate is a document, not a picture: it keeps its own height (no media cap).
  if (pick.measurements.kind === "assay") return <AssayGraphic measurements={pick.measurements} productId={pick.product.id} name={name} detail={detail} className={detail === "full" ? undefined : className} />;
  return null;
}
