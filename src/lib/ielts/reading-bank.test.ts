import { describe, expect, it } from "vitest";
import { READING_TESTS, allQuestions } from "./reading-bank";

describe("verified reading bank", () => {
  it("full test has exactly 40 questions numbered 1-40", () => {
    const qs = allQuestions(READING_TESTS[0]!);
    expect(qs.map((q) => q.n)).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });
  it("every option-based answer exists among its options", () => {
    for (const q of allQuestions(READING_TESTS[0]!)) {
      if (q.options) expect(q.options.map((o) => o.value)).toContain(q.answers[0]);
    }
  });
});
