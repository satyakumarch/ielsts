/**
 * Raw-score → band conversion tables (estimates only).
 * Based on commonly published IELTS guidance for Academic Reading and Listening.
 * Exact conversions vary slightly between official test versions.
 * Each row: minimum correct answers (out of 40) needed for that band.
 */
export type ConversionRow = { min: number; band: number };

export const ACADEMIC_READING_TABLE: ConversionRow[] = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 2, band: 2 },
  { min: 1, band: 1 },
  { min: 0, band: 0 },
];

export const LISTENING_TABLE: ConversionRow[] = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 2, band: 2 },
  { min: 1, band: 1 },
  { min: 0, band: 0 },
];

export function rawToBand(correct: number, table: ConversionRow[]): number {
  const c = Math.max(0, Math.min(40, Math.floor(correct)));
  return table.find((r) => c >= r.min)?.band ?? 0;
}

/** Correct answers still needed to reach `targetBand` (0 if already reached, null if unreachable). */
export function answersNeededFor(correct: number, targetBand: number, table: ConversionRow[]): number | null {
  const rows = table.filter((r) => r.band >= targetBand);
  if (!rows.length) return null;
  const min = Math.min(...rows.map((r) => r.min));
  return Math.max(0, min - correct);
}

/** IELTS overall rounding: .25 rounds up to .5, .75 rounds up to the next whole band. */
export function roundToHalfBand(value: number): number {
  const whole = Math.floor(value);
  const frac = Number((value - whole).toFixed(4));
  if (frac < 0.25) return whole;
  if (frac < 0.75) return whole + 0.5;
  return whole + 1;
}

export function overallBand(scores: number[]): number {
  if (!scores.length) return 0;
  return roundToHalfBand(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export const BAND_OPTIONS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export function formatBand(b: number | null | undefined) {
  return b == null ? "—" : Number(b).toFixed(1);
}
