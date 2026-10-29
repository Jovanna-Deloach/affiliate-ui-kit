/**
 * Registry of vertical TONE profiles defined in `src/styles/tokens.css`.
 * A vertical only changes palette temperature and the display face; every
 * keyline, radius and spacing value is shared. Adding a vertical = adding a
 * `[data-vertical="…"]` tone block there + one entry here.
 */
export const VERTICALS = [
  {
    id: "luxury-editorial",
    label: "Luxury Editorial",
    description: "Warm alabaster canvas · Playfair display",
  },
  {
    id: "clinical-performance",
    label: "Clinical Performance",
    description: "Cool lab canvas · Plus Jakarta display",
  },
] as const;

export type Vertical = (typeof VERTICALS)[number]["id"];

export const DEFAULT_VERTICAL: Vertical = "luxury-editorial";
