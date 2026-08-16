import { describe, expect, it } from "vitest";
import { formatAccountNumber } from "./helpers";

describe("formatAccountNumber", () => {
  it("groups digits in fours", () => {
    expect(formatAccountNumber("123456")).toBe("1234 56");
    expect(formatAccountNumber("12345678")).toBe("1234 5678");
  });

  it("keeps letters and uppercases them", () => {
    expect(formatAccountNumber("acc001")).toBe("ACC0 01");
    expect(formatAccountNumber("SHOP01")).toBe("SHOP 01");
  });

  it("allows mixed letters and numbers", () => {
    expect(formatAccountNumber("ab12cd34")).toBe("AB12 CD34");
  });

  it("strips spaces, hyphens, and other punctuation", () => {
    expect(formatAccountNumber("acc-001")).toBe("ACC0 01");
    expect(formatAccountNumber("INV 2048")).toBe("INV2 048");
  });

  it("returns an empty string when nothing alphanumeric remains", () => {
    expect(formatAccountNumber("")).toBe("");
    expect(formatAccountNumber("---")).toBe("");
  });
});
