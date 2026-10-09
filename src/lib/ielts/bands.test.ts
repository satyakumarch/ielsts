import { describe, expect, it } from "vitest";
import { ACADEMIC_READING_TABLE, answersNeededFor, overallBand, rawToBand, roundToHalfBand } from "./bands";
import { isCorrect } from "./answers";

describe("band conversion", () => {
  it("30/40 in Academic Reading is band 7.0", () => expect(rawToBand(30, ACADEMIC_READING_TABLE)).toBe(7));
  it("29/40 in Academic Reading is band 6.5", () => expect(rawToBand(29, ACADEMIC_READING_TABLE)).toBe(6.5));
  it("needs 3 more correct from 30 to reach 7.5", () => expect(answersNeededFor(30, 7.5, ACADEMIC_READING_TABLE)).toBe(3));
});

describe("overall rounding", () => {
  it("6.25 rounds up to 6.5", () => expect(roundToHalfBand(6.25)).toBe(6.5));
  it("6.75 rounds up to 7.0", () => expect(roundToHalfBand(6.75)).toBe(7));
  it("6.125 rounds down to 6.0", () => expect(roundToHalfBand(6.125)).toBe(6));
  it("averages four skills", () => expect(overallBand([6.5, 6.5, 5, 7])).toBe(6.5));
});

describe("answer checking", () => {
  it("ignores case and articles", () => expect(isCorrect("The Grass", ["grass"])).toBe(true));
  it("accepts T for TRUE", () => expect(isCorrect("t", ["true"])).toBe(true));
  it("rejects a wrong answer", () => expect(isCorrect("cost", ["untidy"])).toBe(false));
});
