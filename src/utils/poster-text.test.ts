import { describe, expect, it } from "vitest";
import { fitFontSize, wrapWords } from "./poster-text";

describe("wrapWords", () => {
  it("keeps a short name on one line", () => {
    expect(wrapWords("NDOGO", 200, (value) => value.length * 10, 2)).toEqual([
      "NDOGO",
    ]);
  });

  it("wraps long business names instead of shrinking to 10px", () => {
    const lines = wrapWords(
      "MAMA MBOGA KIAMAIKO STAGE",
      80,
      (value) => value.length * 8,
      2
    );
    expect(lines.length).toBe(2);
    expect(lines.join(" ").includes("…") || lines[0].includes("MAMA")).toBe(
      true
    );
  });

  it("ellipsizes when the last line still overflows", () => {
    const lines = wrapWords("SUPERCALIFRAGILISTIC", 40, (value) => value.length * 10, 1);
    expect(lines).toHaveLength(1);
    expect(lines[0].endsWith("…")).toBe(true);
  });
});

describe("fitFontSize", () => {
  it("stops at minSize instead of collapsing to 10px", () => {
    const size = fitFontSize(
      "VERY LONG TITLE TEXT",
      20,
      80,
      24,
      (_size, value) => value.length * 12
    );
    expect(size).toBe(24);
  });
});
