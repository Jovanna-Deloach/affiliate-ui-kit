import React from "react";
import { addons, types } from "storybook/manager-api";
import { styled } from "storybook/theming";

import { registerPlayground } from "./addons/playground";
import { LegacyTools, ThemeTool } from "./addons/toolbar";
import { kitTheme } from "./theme";

/**
 * The workshop shell (docs/STORYBOOK.md, "The Storybook UI"): the kit's own
 * theme and brand; sections as sidebar roots, the legacy library collapsed at
 * the bottom; a toolbar with only the switches that matter on the page in
 * view; the add-on panel closed until it is asked for, except on the
 * Playground, which opens its own.
 */

const isLegacy = (id?: string) => Boolean(id?.startsWith("legacy-"));
const isKitPart = (id?: string) => /^(primitives|components|blocks|templates)-/.test(id ?? "");
const isPlayground = (id?: string) => Boolean(id?.startsWith("getting-started-playground"));

/** Tags that earn a pill beside a name in the sidebar. */
const STATUS: Record<string, { label: string; tone: "new" | "beta" | "deprecated" }> = {
  new: { label: "New", tone: "new" },
  beta: { label: "Beta", tone: "beta" },
  deprecated: { label: "Deprecated", tone: "deprecated" },
};

const Label = styled.span({ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 });

const Pill = styled.span<{ tone: "new" | "beta" | "deprecated" }>(({ tone }) => ({
  flex: "none",
  padding: "1px 6px",
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.04em",
  lineHeight: "16px",
  textTransform: "uppercase",
  color: tone === "deprecated" ? "#577083" : "#0b5cd5",
  background: tone === "deprecated" ? "#e9eff5" : "#e7f0ff",
  "[data-selected='true'] &": { color: "#ffffff", background: "rgb(255 255 255 / 0.2)" },
}));

addons.setConfig({
  theme: kitTheme,
  // The panel starts closed: pages are read, not configured. The toolbar's
  // panel button opens it; the Playground opens its own.
  layout: { showPanel: false, panelPosition: "bottom" },
  sidebar: {
    showRoots: true,
    collapsedRoots: ["legacy"],
    renderLabel: (item) => {
      const tags = (item as { tags?: string[] }).tags ?? [];
      const status = tags.map((tag) => STATUS[tag]).find(Boolean);
      if (!status || item.type === "root") return undefined;
      return (
        <Label>
          <span>{item.name}</span>
          <Pill tone={status.tone}>{status.label}</Pill>
        </Label>
      );
    },
  },
  toolbar: {
    // Storybook's globals toolbar would show every switch on every page; the
    // tools below show the theme on kit pages and the legacy switches on the
    // legacy library only.
    toolbar: { hidden: true },
    zoom: { hidden: true },
    remount: { hidden: true },
    "open-in-editor": { hidden: true },
    "storybook/measure-addon/tool": { hidden: true },
    "storybook/outline": { hidden: true },
    "storybook/background": { hidden: true },
    "storybook/a11y/panel": { hidden: true },
  },
});

addons.register("kit/toolbar", () => {
  addons.add("kit/toolbar/theme", {
    type: types.TOOL,
    title: "Theme",
    match: ({ storyId, viewMode }) => (viewMode === "story" || viewMode === "docs") && (isKitPart(storyId) || isPlayground(storyId)),
    render: () => <ThemeTool />,
  });
  addons.add("kit/toolbar/legacy", {
    type: types.TOOL,
    title: "Legacy switches",
    match: ({ storyId, viewMode }) => (viewMode === "story" || viewMode === "docs") && isLegacy(storyId),
    render: () => <LegacyTools />,
  });
});

registerPlayground();
