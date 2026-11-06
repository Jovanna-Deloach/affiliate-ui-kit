import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { OnCard, Specimen, State } from "@/kit/testing/specimen";
import type { Measurements, Pick } from "@/kit/types";

import { Scorecard } from "./scorecard";
import { Telemetry } from "./telemetry";

const meta = {
  title: "Kit/Components/Scorecard and telemetry",
  component: Scorecard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof Scorecard>;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "The composite score in the display serif, ten segments and five sub-scores, then what the bench or the lab measured for the category.";

function Card({ pick, id }: { pick: Pick; id: string }) {
  return (
    <OnCard>
      <Scorecard rating={pick.rating} scores={pick.scores} id={id} className="border-t-0 pt-0">
        <Telemetry measurements={pick.measurements} />
      </Scorecard>
    </OnCard>
  );
}

/** The same product with a different lead result (ppb, against a 100 ppb limit) and rating. */
function withLead(pick: Pick, ppb: number, rating: Pick["rating"]): Pick {
  const m = pick.measurements as Extract<Measurements, { kind: "assay" }>;
  return { ...pick, rating, measurements: { ...m, metals: m.metals.map((x) => (x.label === "Lead" ? { ...x, ppb } : x)) } };
}

export const Atelier: Story = {
  name: "Atelier, watches: chronometer strip",
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, , sato] = watchesGuide.picks;
    return (
      <Specimen kind="Component" title="Scorecard and telemetry" description={DESCRIPTION} columns={3}>
        <State label="All six positions inside tolerance">
          <Card pick={meridian!} id="sc-meridian" />
        </State>
        <State label="Every position outside tolerance">
          <Card pick={sato!} id="sc-sato" />
        </State>
        <State label="With its hairline, under a photograph">
          <Scorecard rating={watchesGuide.picks[3]!.rating} scores={watchesGuide.picks[3]!.scores} id="sc-okada">
            <Telemetry measurements={watchesGuide.picks[3]!.measurements} />
          </Scorecard>
        </State>
      </Specimen>
    );
  },
};

export const Supplements: Story = {
  name: "Assay, supplements: heavy metals",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Scorecard and telemetry" description={DESCRIPTION} columns={3} category="supplements">
      <State label="Every metal well under its limit">
        <Card pick={creatineGuide.picks[0]!} id="sc-peak" />
      </State>
      <State label="Near the limit: lead at 62%">
        <Card pick={withLead(creatineGuide.picks[2]!, 62, { score: 7.2, tier: "Near limit", standing: "Lead at 62% of the limit" })} id="sc-near" />
      </State>
      <State label="Failed: lead over its limit">
        <Card pick={withLead(creatineGuide.picks[3]!, 140, { score: 4.1, tier: "Failed", standing: "Lead at 140% of the limit" })} id="sc-failed" />
      </State>
    </Specimen>
  ),
};

export const Running: Story = {
  name: "Assay, running: bench tests",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Scorecard and telemetry" description={DESCRIPTION} columns={3} category="running">
      {runningGuide.picks.map((pick) => (
        <State key={pick.product.id} label={`${pick.rating.tier}, ${pick.rating.standing}`}>
          <Card pick={pick} id={`sc-${pick.product.slug}`} />
        </State>
      ))}
    </Specimen>
  ),
};
