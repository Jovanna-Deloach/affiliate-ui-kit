import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Tab, TabList, TabPanel, Tabs } from "./tabs";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { children: null },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product’s evidence in one place: the reader switches between what
 * readers say and what the lab found without leaving the page. Counts sit
 * after the labels.
 * @summary Reviews, lab results and dosage for one product, with counts.
 */
export const ProductEvidence: Story = {
  render: () => (
    <Tabs defaultValue="reviews">
      <TabList label="About Peak Supply Creatine Monohydrate">
        <Tab value="reviews" count={1284}>
          Reviews
        </Tab>
        <Tab value="lab" count={16}>
          Lab results
        </Tab>
        <Tab value="dosage">Dosage</Tab>
      </TabList>
      <TabPanel value="reviews">
        <p className="m-0 t-body text-fg-body">4.6 out of 5 from 1,284 readers; 71% of them bought it at retail.</p>
      </TabPanel>
      <TabPanel value="lab">
        <p className="m-0 t-body text-fg-body">16 tests on batch 2214: 99.6% of the creatine on the label, no heavy metals above a limit.</p>
      </TabPanel>
      <TabPanel value="dosage">
        <p className="m-0 t-body text-fg-body">3 to 5 g a day with water, any time of day; no loading phase needed.</p>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * Two views of one category: the ranking and the report on the category as
 * a whole, kept in step by the page (`value` and `onValueChange`).
 * @summary A category’s ranking and its report, as two tabs.
 */
export const RankingAndReport: Story = {
  render: () => (
    <Tabs defaultValue="ranking">
      <TabList label="Creatine">
        <Tab value="ranking" count={18}>
          Ranking
        </Tab>
        <Tab value="report">Report</Tab>
      </TabList>
      <TabPanel value="ranking">
        <p className="m-0 t-body text-fg-body">18 creatine supplements, ranked by what the lab found.</p>
      </TabPanel>
      <TabPanel value="report">
        <p className="m-0 t-body text-fg-body">Across the category, 14 of 18 failed at least one test.</p>
      </TabPanel>
    </Tabs>
  ),
};
