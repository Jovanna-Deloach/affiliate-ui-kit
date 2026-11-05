import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";

import { RoundupPage } from "./roundup-page";

const meta = {
  title: "Kit/Templates/Roundup page",
  component: RoundupPage,
  parameters: { layout: "fullscreen", kit: true },
} satisfies Meta<typeof RoundupPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Atelier theme, object-led: a watch magazine. */
export const Caliber: Story = {
  name: "Caliber · Atelier · object-led",
  parameters: { theme: "atelier" },
  args: { site: caliberSite, guide: watchesGuide, lead: "pick", attribution: { source: "caliber", medium: "affiliate", campaign: watchesGuide.id } },
};

/** Assay theme, results-led: a lab publication. */
export const ProvingGround: Story = {
  name: "Proving Ground · Assay · results-led",
  parameters: { theme: "assay" },
  args: { site: provingGroundSite, guide: creatineGuide, lead: "results", attribution: { source: "proving-ground", medium: "affiliate", campaign: creatineGuide.id } },
};
