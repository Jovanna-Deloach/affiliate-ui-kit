import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";
import type { Pick } from "@/kit/types";

import { VerdictCard } from "./verdict-card";

const meta = {
  title: "Kit/Components/Verdict card",
  component: VerdictCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof VerdictCard>;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "A pick answered above the fold. Feature: the lead pick, on a lifted surface with the page’s one filled button. Compact: who it is for, outlined.";

const soldOut = (pick: Pick): Pick => ({ ...pick, product: { ...pick.product, offers: pick.product.offers.map((o) => ({ ...o, inStock: false })) } });

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato, okada, brennan] = watchesGuide.picks;
    const jump = watchesGuide.jumpLabel;
    return (
      <Specimen kind="Component" title="Verdict card" description={DESCRIPTION}>
        <State label="Feature, beside two compact cards" wide>
          <div className="@container">
            <VerdictCard pick={meridian!} jumpLabel={jump} className="@4xl:max-w-[44rem]" />
          </div>
        </State>
        <State label="Compact">
          <VerdictCard variant="compact" pick={ardent!} jumpLabel={jump} />
        </State>
        <State label="Compact, photograph on top">
          <VerdictCard variant="compact" pick={sato!} jumpLabel={jump} stacked />
        </State>
        <State label="Feature, wide (a single-pick page)" wide>
          <VerdictCard pick={okada!} jumpLabel={jump} wide />
        </State>
        <State label="Sold out everywhere">
          <VerdictCard variant="compact" pick={soldOut(brennan!)} jumpLabel={jump} />
        </State>
        <State label="Compact on a phone" className="max-w-sm">
          <VerdictCard variant="compact" pick={okada!} jumpLabel={jump} />
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => {
    const [aerolite, tempo, cumulus] = runningGuide.picks;
    const jump = runningGuide.jumpLabel;
    return (
      <Specimen kind="Component" title="Verdict card" description={DESCRIPTION} category="running">
        <State label="Feature, discounted (list price struck)" wide>
          <div className="@container">
            <VerdictCard pick={aerolite!} jumpLabel={jump} className="@4xl:max-w-[44rem]" />
          </div>
        </State>
        <State label="Compact">
          <VerdictCard variant="compact" pick={tempo!} jumpLabel={jump} />
        </State>
        <State label="Compact, discounted">
          <VerdictCard variant="compact" pick={cumulus!} jumpLabel={jump} />
        </State>
        <State label="Supplements, feature, wide" wide>
          <div data-category="supplements">
            <VerdictCard pick={creatineGuide.picks[0]!} jumpLabel={creatineGuide.jumpLabel} wide />
          </div>
        </State>
      </Specimen>
    );
  },
};
