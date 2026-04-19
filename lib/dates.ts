/** Parse `YYYY-MM-DD` as UTC midnight (calendar day). */
export function parseUtcDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}
