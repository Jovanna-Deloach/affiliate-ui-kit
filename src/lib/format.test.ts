import { describe, expect, test } from "bun:test";

import { formatDate, formatPrice, formatPriceDelta, formatScore, initials } from "./format";

describe("formatScore", () => {
  test("always carries one decimal (Law 1: 9.0, never 9)", () => {
    expect(formatScore(9)).toBe("9.0");
    expect(formatScore(9.25)).toBe("9.3");
    expect(formatScore(87, 0)).toBe("87");
  });
});

describe("formatPrice / formatPriceDelta", () => {
  test("whole amounts drop cents, fractional amounts keep two", () => {
    expect(formatPrice(189)).toBe("$189");
    expect(formatPrice(0.21)).toBe("$0.21");
    expect(formatPrice(4850, "EUR")).toBe("€4,850");
  });
  test("delta is signed with a true minus and empty when equal", () => {
    expect(formatPriceDelta(210, 189)).toBe("+$21");
    expect(formatPriceDelta(180, 189)).toBe("−$9");
    expect(formatPriceDelta(189, 189)).toBe("");
  });
});

describe("formatDate", () => {
  test("renders in UTC so SSR and hydration agree", () => {
    expect(formatDate("2026-10-27T23:30:00Z")).toBe("Oct 27, 2026");
    expect(formatDate("not a date")).toBe("not a date");
  });
});

describe("initials", () => {
  test("skips honorifics and non-letter tokens", () => {
    expect(initials("Dr. Priya Raman")).toBe("PR");
    expect(initials("Haus & Field")).toBe("HF");
    expect(initials("Northlane")).toBe("N");
    expect(initials("Celeste Marchetti")).toBe("CM");
  });
});
