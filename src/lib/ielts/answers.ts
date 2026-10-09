/** Normalise a free-text answer: case, whitespace, outer punctuation, leading article. */
export function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,;:!?"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(the|a|an) /, "");
}

const TFNG_ALIASES: Record<string, string> = {
  t: "true", true: "true", f: "false", false: "false", ng: "not given", "not given": "not given",
  y: "yes", yes: "yes", n: "no", no: "no", notgiven: "not given",
};

/** Returns true if `given` matches any accepted answer. Accepted lists are verified in the question bank. */
export function isCorrect(given: string | undefined, accepted: string[]): boolean {
  if (!given || !given.trim()) return false;
  let g = normalizeAnswer(given);
  g = TFNG_ALIASES[g.replace(/\s/g, "")] ?? TFNG_ALIASES[g] ?? g;
  return accepted.some((a) => normalizeAnswer(a) === g);
}

export function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}
