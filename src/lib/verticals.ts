/**
 * Registry of vertical token profiles defined in `src/styles/tokens.css`.
 * Adding a vertical = adding a `[data-vertical="…"]` block there + one entry here.
 */
export const VERTICALS = [
  {
    id: "luxury-editorial",
    label: "Luxury Editorial",
    description:
      "Sharp, architectural, serif display, tracked eyebrows, slow motion.",
  },
  {
    id: "clinical-performance",
    label: "Clinical Performance",
    description:
      "Crisp utility, tabular metrics, pills, tactile elevation, quick motion.",
  },
] as const;

export type Vertical = (typeof VERTICALS)[number]["id"];

export const DEFAULT_VERTICAL: Vertical = "luxury-editorial";
