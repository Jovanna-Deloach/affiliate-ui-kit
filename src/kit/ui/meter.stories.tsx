import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { Meter } from "./meter";

const meta = {
  title: "Kit/Primitives/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { value: 0.6 },
} satisfies Meta<typeof Meter>;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "A 6px meter beside a printed figure: continuous with an optional reference tick, or split into segments for the composite score.";

/** A meter with its label and figure, the way the scorecard sets one. */
function Row({ label, figure, children }: { label: string; figure: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)_3.5rem] items-center gap-x-4">
      <span className="t-small text-fg-muted">{label}</span>
      {children}
      <span data-numeric className="text-right t-small t-figure text-fg">
        {figure}
      </span>
    </div>
  );
}

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Meter" description={DESCRIPTION}>
      <State label="Segmented: the composite score">
        <div className="flex flex-col gap-5">
          <Row label="Exceptional" figure="9.2">
            <Meter value={9.2} max={10} segments={10} />
          </Row>
          <Row label="Very good" figure="8.1">
            <Meter value={8.1} max={10} segments={10} />
          </Row>
          <Row label="Perfect" figure="10.0">
            <Meter value={10} max={10} segments={10} />
          </Row>
          <Row label="Not scored" figure="0.0">
            <Meter value={0} max={10} segments={10} />
          </Row>
        </div>
      </State>
      <State label="Continuous: sub-scores">
        <div className="flex flex-col gap-3">
          <Row label="Accuracy" figure="9.6">
            <Meter value={9.6} max={10} />
          </Row>
          <Row label="Legibility" figure="7.4">
            <Meter value={7.4} max={10} />
          </Row>
          <Row label="Value" figure="4.0">
            <Meter value={4} max={10} />
          </Row>
        </div>
      </State>
      <State label="Tones">
        <div className="flex flex-col gap-3">
          <Row label="Meter" figure="72%">
            <Meter value={72} max={100} tone="meter" />
          </Row>
          <Row label="Telemetry" figure="72%">
            <Meter value={72} max={100} tone="telemetry" />
          </Row>
          <Row label="Warning" figure="58%">
            <Meter value={58} max={100} tone="warn" />
          </Row>
          <Row label="Fail" figure="140%">
            <Meter value={140} max={100} tone="fail" />
          </Row>
          <Row label="Muted" figure="31%">
            <Meter value={31} max={100} tone="muted" />
          </Row>
        </div>
      </State>
      <State label="Edges">
        <div className="flex flex-col gap-3">
          <Row label="Sliver (1%)" figure="1%">
            <Meter value={1} max={100} tone="telemetry" />
          </Row>
          <Row label="Empty" figure="0%">
            <Meter value={0} max={100} tone="telemetry" />
          </Row>
          <Row label="Full" figure="100%">
            <Meter value={100} max={100} tone="telemetry" />
          </Row>
        </div>
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  name: "Assay, running (with reference ticks)",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Primitive" title="Meter" description={DESCRIPTION} category="running">
      <State label="Against the test average">
        <div className="flex flex-col gap-3">
          <Row label="Energy return" figure="71%">
            <Meter value={71} max={100} mark={64} tone="telemetry" />
          </Row>
          <Row label="Below average" figure="58%">
            <Meter value={58} max={100} mark={64} tone="muted" />
          </Row>
          <Row label="Weight" figure={"8.4\u00A0oz"}>
            <Meter value={8.4} max={13} mark={9.6} tone="telemetry" />
          </Row>
        </div>
      </State>
      <State label="Segmented">
        <div className="flex flex-col gap-5">
          <Row label="Exceptional" figure="9.0">
            <Meter value={9} max={10} segments={10} />
          </Row>
          <Row label="Excellent" figure="8.5">
            <Meter value={8.5} max={10} segments={10} />
          </Row>
        </div>
      </State>
    </Specimen>
  ),
};
