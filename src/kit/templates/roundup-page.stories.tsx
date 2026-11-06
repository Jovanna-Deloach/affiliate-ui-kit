import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { RoundupPage } from "./roundup-page";

// The roundup archetype on two publications. Every story runs the kit page
// checks (play): column alignment, voids, touch targets, numerals, merchant
// order, one photograph per product, repeated text and axe-core WCAG 2.2 AA.
// (A line comment, not JSDoc: JSDoc on `meta` would replace RoundupPage’s
// own description in what agents read.)
const meta = {
  title: "Templates/Roundup page",
  component: RoundupPage,
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta<typeof RoundupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A watch magazine’s roundup: the reference composition, in the Atelier
 * theme. Copy this page’s order of blocks for any ranked guide.
 * @summary A roundup of five watches on a watch magazine (Atelier).
 */
export const Caliber: Story = {
  parameters: { theme: "atelier" },
  args: { site: caliberSite, guide: watchesGuide, attribution: { source: "caliber", medium: "affiliate", campaign: watchesGuide.id } },
};

/**
 * The same template on a lab publication’s supplements section: a different
 * theme and category accent, the same blocks in the same order.
 * @summary A lab-tested supplement roundup (Assay, supplements).
 */
export const ProvingGround: Story = {
  name: "Proving Ground: supplements",
  parameters: { theme: "assay" },
  args: { site: provingGroundSite, guide: creatineGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: creatineGuide.id } },
};

/**
 * The same publication’s running section: only the category accent
 * changes. The Tempo Pro’s buy box proves lowest price first: $149 at Verra
 * above the $160 partner.
 * @summary A running-shoe roundup on the same publication (Assay, running).
 */
export const ProvingGroundRunning: Story = {
  name: "Proving Ground: running",
  parameters: { theme: "assay" },
  args: { site: provingGroundSite, guide: runningGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: runningGuide.id } },
};
