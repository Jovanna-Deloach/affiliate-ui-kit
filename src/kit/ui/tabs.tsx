"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { tabListStyles, tabStyles } from "./tab-styles";

export interface TabsProps {
  /** The tab shown first, when the tabs keep their own state. */
  defaultValue?: string;
  /** The tab shown, when the page keeps the state (with `onValueChange`). */
  value?: string;
  /** Called with the tab the reader picks. */
  onValueChange?: (value: string) => void;
  /** A `TabList` of `Tab`s, then one `TabPanel` per tab. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Panels of one page that take turns in one place: the reader picks a tab
 * and its panel replaces the last. Keyboard: arrows move between tabs.
 * Compose it from four parts:
 *
 * ```tsx
 * <Tabs defaultValue="reviews">
 *   <TabList label="About this product">
 *     <Tab value="reviews" count={1284}>Reviews</Tab>
 *     <Tab value="lab">Lab results</Tab>
 *   </TabList>
 *   <TabPanel value="reviews">…</TabPanel>
 *   <TabPanel value="lab">…</TabPanel>
 * </Tabs>
 * ```
 *
 * **Use it for** views a reader switches between without leaving the page:
 * reviews and lab results, a ranking and its report. **Not for** sections
 * that should each have their own address or be read in turn (`TabLinks`,
 * or plain sections with a `TableOfContents`), or for content a reader needs
 * to compare side by side.
 *
 * @summary Panels that take turns in one place, picked from a row of tabs.
 * @import import { Tabs, TabList, Tab, TabPanel } from "@/kit/ui";
 */
export function Tabs({ className, ...props }: TabsProps) {
  return <RadixTabs.Root activationMode="manual" className={cn("flex flex-col gap-6", className)} {...props} />;
}

export interface TabListProps {
  /** What the tabs switch between, for screen readers: “About this product”. */
  label: string;
  /** The `Tab`s. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The row of tabs: a hairline under them, scrolling sideways on a narrow
 * screen rather than wrapping.
 *
 * @summary The row of tabs inside Tabs, labeled for screen readers.
 * @import import { TabList } from "@/kit/ui";
 */
export function TabList({ label, children, className }: TabListProps) {
  return (
    <RadixTabs.List aria-label={label} className={cn(tabListStyles, className)}>
      {children}
    </RadixTabs.List>
  );
}

export interface TabProps {
  /** Which `TabPanel` it shows. */
  value: string;
  /** How many items the panel holds (reviews, studies), set after the label in tabular figures. */
  count?: number;
  /** The label: a noun, sentence case (“Lab results”). */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * One tab: a 44px target, its label in the text face, and a line in the
 * category accent under the tab in view.
 *
 * @summary One tab in a TabList, with an optional count.
 * @import import { Tab } from "@/kit/ui";
 */
export function Tab({ value, count, children, className }: TabProps) {
  return (
    <RadixTabs.Trigger value={value} className={cn(tabStyles, "data-[state=active]:border-accent-category data-[state=active]:text-fg", className)}>
      {children}
      {count !== undefined ? (
        <span data-numeric className="t-caption text-fg-muted">
          {count.toLocaleString("en-US")}
        </span>
      ) : null}
    </RadixTabs.Trigger>
  );
}

export interface TabPanelProps {
  /** The `Tab` that shows it. */
  value: string;
  /** What the panel shows. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What one tab shows. Panels not in view are not rendered.
 *
 * @summary The content of one tab.
 * @import import { TabPanel } from "@/kit/ui";
 */
export function TabPanel({ value, children, className }: TabPanelProps) {
  return (
    <RadixTabs.Content value={value} className={cn("kit-focus", className)}>
      {children}
    </RadixTabs.Content>
  );
}
