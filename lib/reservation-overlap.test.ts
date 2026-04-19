import { describe, it, expect } from "vitest";
import { reservationRangesOverlap } from "./reservation-overlap";

describe("reservationRangesOverlap", () => {
  it("returns false when ranges are adjacent (no overlap)", () => {
    const a0 = new Date(Date.UTC(2025, 0, 1));
    const a1 = new Date(Date.UTC(2025, 0, 5));
    const b0 = new Date(Date.UTC(2025, 0, 5));
    const b1 = new Date(Date.UTC(2025, 0, 10));
    expect(reservationRangesOverlap(a0, a1, b0, b1)).toBe(false);
  });

  it("returns true when ranges overlap", () => {
    const a0 = new Date(Date.UTC(2025, 0, 1));
    const a1 = new Date(Date.UTC(2025, 0, 6));
    const b0 = new Date(Date.UTC(2025, 0, 4));
    const b1 = new Date(Date.UTC(2025, 0, 10));
    expect(reservationRangesOverlap(a0, a1, b0, b1)).toBe(true);
  });

  it("returns true when one range is contained in the other", () => {
    const outer0 = new Date(Date.UTC(2025, 0, 1));
    const outer1 = new Date(Date.UTC(2025, 0, 20));
    const inner0 = new Date(Date.UTC(2025, 0, 5));
    const inner1 = new Date(Date.UTC(2025, 0, 8));
    expect(reservationRangesOverlap(outer0, outer1, inner0, inner1)).toBe(true);
  });
});
