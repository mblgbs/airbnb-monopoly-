/**
 * Half-open interval overlap: [start, end) vs [otherStart, otherEnd).
 * Dates should represent calendar days at UTC midnight.
 */
export function reservationRangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}
