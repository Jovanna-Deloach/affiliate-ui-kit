/** “Wore it for 64 days” → “wore it for 64 days”, for use after a name and a comma. */
export const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** “the office, the pool…” → “The office, the pool…”, for a cell or a line of its own. */
export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
