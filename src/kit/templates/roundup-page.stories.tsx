import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { RoundupPage } from "./roundup-page";

/**
 * The roundup archetype on two publications. Every story runs the kit page
 * checks (play): column alignment, voids, touch targets, numerals, merchant
 * order, unique specimens, repeated text and axe-core WCAG 2.2 AA.
 */
const meta = {
  title: "Kit/Templates/Roundup page",
  component: RoundupPage,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof RoundupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Atelier: a watch magazine. */
export const Caliber: Story = {
  parameters: { theme: "atelier" },
  args: { site: caliberSite, guide: watchesGuide, attribution: { source: "caliber", medium: "affiliate", campaign: watchesGuide.id } },
};

/** Assay: a lab publication, supplements section (category colour: cobalt). */
export const ProvingGround: Story = {
  name: "Proving Ground: supplements",
  parameters: { theme: "assay" },
  args: { site: provingGroundSite, guide: creatineGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: creatineGuide.id } },
};

/** The same publication, running section: only --accent-category changes. Tempo Pro proves lowest-price-first ($149 Verra above the $160 partner). */
export const ProvingGroundRunning: Story = {
  name: "Proving Ground: running",
  parameters: { theme: "assay" },
  args: { site: provingGroundSite, guide: runningGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: runningGuide.id } },
};
