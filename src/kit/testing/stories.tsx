import type { Decorator } from "@storybook/nextjs-vite";

/** Story frame for a single kit block: the page well, page padding, the guide’s category. */
export function inWell(category?: string): Decorator {
  function InWell(Story: Parameters<Decorator>[0]) {
    return (
      <div data-category={category} className="kit-well py-12">
        <Story />
      </div>
    );
  }
  return InWell;
}

/** A narrow parent, to show a block’s container-query layout without changing the viewport. */
export function inNarrowColumn(category?: string): Decorator {
  function InNarrowColumn(Story: Parameters<Decorator>[0]) {
    return (
      <div data-category={category} className="kit-well py-12">
        <div className="max-w-sm">
          <Story />
        </div>
      </div>
    );
  }
  return InNarrowColumn;
}
