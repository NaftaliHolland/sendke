import { describe, expect, it } from "vitest";
import { inkOn, relativeLuminance } from "./poster-ink";

describe("inkOn", () => {
  it("uses paper-coloured type on M-PESA green", () => {
    expect(inkOn("#16a34a")).toBe("#FFFFFF");
  });

  it("uses navy type on yellow so the slogan stays readable outdoors", () => {
    expect(inkOn("#F7C50C")).toBe("#1A2335");
    expect(relativeLuminance("#F7C50C")).toBeGreaterThan(0.42);
  });
});
