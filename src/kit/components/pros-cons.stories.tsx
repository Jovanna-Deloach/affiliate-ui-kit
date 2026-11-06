import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { OnCard, Specimen, State } from "@/kit/testing/specimen";

import { ProsCons } from "./pros-cons";

const meta = {
  title: "Kit/Components/Pros and cons",
  component: ProsCons,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof ProsCons>;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "What we like and what to know: two unboxed lists under micro-caps headings, with pass and warning icons. They stack in a narrow column.";

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato] = watchesGuide.picks;
    return (
      <Specimen kind="Component" title="Pros and cons" description={DESCRIPTION} columns={1}>
        <State label="Two columns">
          <OnCard className="p-8">
            <ProsCons id="pc-meridian" pros={meridian!.likes} cons={meridian!.caveats} />
          </OnCard>
        </State>
        <State label="Only what we like">
          <OnCard className="p-8">
            <ProsCons id="pc-ardent" pros={ardent!.likes} cons={[]} />
          </OnCard>
        </State>
        <State label="Long points, custom headings">
          <OnCard className="p-8">
            <ProsCons
              id="pc-long"
              prosLabel="Why it earned a place"
              consLabel="Before you buy"
              pros={["The bracelet’s micro-adjust sits in the clasp, so it can be loosened by half a link on a hot afternoon without tools", ...sato!.likes.slice(0, 1)]}
              cons={["The bezel turns both ways with a loose action, so a knock can move a dive timing without you noticing", ...sato!.caveats.slice(1)]}
            />
          </OnCard>
        </State>
        <State label="In a narrow column: the lists stack" className="max-w-sm">
          <OnCard>
            <ProsCons id="pc-narrow" pros={watchesGuide.picks[3]!.likes} cons={watchesGuide.picks[3]!.caveats} />
          </OnCard>
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Pros and cons" description={DESCRIPTION} columns={1} category="supplements">
      <State label="Supplements">
        <OnCard className="p-8">
          <ProsCons id="pc-peak" pros={creatineGuide.picks[0]!.likes} cons={creatineGuide.picks[0]!.caveats} />
        </OnCard>
      </State>
      <State label="Running">
        <div data-category="running">
          <OnCard className="p-8">
            <ProsCons id="pc-aerolite" pros={runningGuide.picks[0]!.likes} cons={runningGuide.picks[0]!.caveats} />
          </OnCard>
        </div>
      </State>
    </Specimen>
  ),
};
