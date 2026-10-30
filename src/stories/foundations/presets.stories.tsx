import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award } from "lucide-react";

import { bestPrice, productShoe01 } from "@/fixtures/products";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AwardBadge } from "@/primitives/award-badge";
import { PromoCodeChip } from "@/primitives/promo-code-chip";
import { StatusPill } from "@/primitives/status-pill";
import { SurfaceCard, SurfaceCardFooter } from "@/primitives/surface-card";

const SHAPES = ["architectural", "soft", "pill"] as const;
const ELEVATIONS = ["flat", "soft", "tactile"] as const;
const SHAPE_NAMES = { architectural: "Architectural · 6 / 4 / 3", soft: "Soft · 10 / 8 / 6", pill: "Pill · capsule controls" } as const;
const ELEVATION_NAMES = { flat: "Flat · hairlines only", soft: "Soft · resting lift", tactile: "Tactile · key + ambient" } as const;

const best = productShoe01.offers[0]!;

/** The same composition under every preset — one geometry and one elevation language per page, never per component. */
function Swatch() {
  return (
    <SurfaceCard as="article">
      <div className="flex flex-wrap items-center gap-cluster">
        <AwardBadge badge={productShoe01.awardBadge} icon={Award} />
        <StatusPill tone="positive">Best price</StatusPill>
        <StatusPill kind="technical">ISO 17025</StatusPill>
      </div>
      <div className="flex flex-col gap-hairline">
        <h3 className="type-title m-0">
          {productShoe01.brand} {productShoe01.name}
        </h3>
        <p className="m-0 text-body-sm text-ink-secondary">{productShoe01.eyebrow}</p>
      </div>
      <div className="flex flex-wrap items-center gap-cluster">
        <AffiliateAction href={best.affiliateUrl} size="sm">
          View deal
        </AffiliateAction>
        <AffiliateAction href={best.affiliateUrl} intent="outline" size="sm">
          Compare
        </AffiliateAction>
        <PromoCodeChip code={best.promoCode!} size="sm" chroming="recessed" />
      </div>
      <SurfaceCardFooter variant="action-bar">
        <span className="type-metric text-body text-ink">{bestPrice(productShoe01)}</span>
        <AffiliateAction href={best.affiliateUrl} intent="inline" className="text-body-sm">
          Compare 4 retailers
        </AffiliateAction>
      </SurfaceCardFooter>
    </SurfaceCard>
  );
}

const meta = {
  title: "Foundations/Presets",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShapeByElevation: Story = {
  name: "Shape × elevation — system presets, not component props",
  render: () => (
    <div className="flex flex-col gap-section">
      {SHAPES.map((shape) => (
        <section key={shape} className="flex flex-col gap-cluster">
          <h2 className="type-eyebrow m-0 text-ink-tertiary">{SHAPE_NAMES[shape]}</h2>
          <div className="grid items-start gap-grid md:grid-cols-3">
            {ELEVATIONS.map((elevation) => (
              <figure key={elevation} className="m-0 flex min-w-0 flex-col gap-cluster">
                <figcaption className="text-caption text-ink-tertiary">{ELEVATION_NAMES[elevation]}</figcaption>
                <div data-shape={shape === "architectural" ? undefined : shape} data-elevation={elevation === "flat" ? undefined : elevation}>
                  <Swatch />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
