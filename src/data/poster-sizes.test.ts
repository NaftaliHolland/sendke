import { describe, expect, it } from "vitest";
import {
  DEFAULT_POSTER_SIZE,
  fitAspectRect,
  POSTER_SIZES,
} from "./poster-sizes";

describe("POSTER_SIZES", () => {
  it("is the five physical print sizes", () => {
    expect(POSTER_SIZES.map((size) => size.slug)).toEqual([
      "a5-stall",
      "a4-wall",
      "helmet",
      "sticker",
      "story",
    ]);
  });

  it("gives each size a distinct aspect ratio", () => {
    const ratios = POSTER_SIZES.map(
      (size) => Math.round((size.width / size.height) * 1000) / 1000
    );
    expect(new Set(ratios).size).toBe(POSTER_SIZES.length);
  });

  it("defaults to A5 for print", () => {
    expect(DEFAULT_POSTER_SIZE.slug).toBe("a5-stall");
  });
});

describe("fitAspectRect", () => {
  it("fits a landscape ratio into the box without cropping", () => {
    expect(fitAspectRect(16, 9, 56, 40)).toEqual({ width: 56, height: 31.5 });
  });

  it("fits a portrait ratio into the box without cropping", () => {
    expect(fitAspectRect(9, 16, 56, 40)).toEqual({ width: 22.5, height: 40 });
  });
});
