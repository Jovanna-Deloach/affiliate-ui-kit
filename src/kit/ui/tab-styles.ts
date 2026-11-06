/**
 * The tab row and each tab, shared by `Tabs` (client) and `TabLinks`
 * (server) so both read as one control. Kept out of the client module: a
 * server component cannot read values from a "use client" file.
 */
export const tabListStyles = "flex gap-6 overflow-x-auto border-b border-line [scrollbar-width:none]";
export const tabStyles =
  "kit-focus -mb-px inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 border-transparent t-ui text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:text-fg";
export const tabActiveStyles = "border-accent-category text-fg";
