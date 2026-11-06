import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { OnCard, Specimen, State } from "@/kit/testing/specimen";

import { PullQuote } from "./pull-quote";

const meta = {
  title: "Kit/Components/Pull-quote",
  component: PullQuote,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof PullQuote>;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "A tester’s words on a 2px rule in the action colour, in the display serif italic, then who said it and the proof they earned the right to.";

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato] = watchesGuide.picks;
    return (
      <Specimen kind="Component" title="Pull-quote" description={DESCRIPTION}>
        <State label="With a portrait">
          <OnCard className="p-8">
            <PullQuote {...meridian!.quote} />
          </OnCard>
        </State>
        <State label="Initials when there is no portrait">
          <OnCard className="p-8">
            <PullQuote {...ardent!.quote} />
          </OnCard>
        </State>
        <State label="No role, no proof">
          <OnCard className="p-8">
            <PullQuote text="It is the first watch in years I have not wanted to swap the strap on." person={{ name: "Jonas Weber" }} />
          </OnCard>
        </State>
        <State label="A long quote in a narrow column" className="max-w-sm">
          <OnCard>
            <PullQuote {...sato!.quote} text="Thirty days in, it had gained less than five minutes, survived a week of sea swims and still looked right with a jacket. At this price that is the whole argument." />
          </OnCard>
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Pull-quote" description={DESCRIPTION} category="supplements">
      <State label="Supplements: the chemist">
        <OnCard className="p-8">
          <PullQuote {...creatineGuide.picks[0]!.quote} />
        </OnCard>
      </State>
      <State label="Running: the tester">
        <OnCard className="p-8">
          <PullQuote {...runningGuide.picks[0]!.quote} />
        </OnCard>
      </State>
    </Specimen>
  ),
};
