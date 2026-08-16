import { describe, expect, it } from "vitest";
import { FORM_DEFAULT_VALUES, formSchema } from "./form";

describe("formSchema paybill accounts", () => {
  it("accepts alphanumeric account numbers", () => {
    const result = formSchema.safeParse({
      ...FORM_DEFAULT_VALUES,
      paymentType: "PAYBILL",
      paybillNumber: "123456",
      accountNumber: "SHOP 01",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty account number", () => {
    const result = formSchema.safeParse({
      ...FORM_DEFAULT_VALUES,
      paymentType: "PAYBILL",
      paybillNumber: "123456",
      accountNumber: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an optional business name overlay", () => {
    const result = formSchema.safeParse({
      ...FORM_DEFAULT_VALUES,
      paymentType: "TILL_NUMBER",
      tillNumber: "123456",
      businessName: "MAMA MBOGA",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a business name longer than the overlay limit", () => {
    const result = formSchema.safeParse({
      ...FORM_DEFAULT_VALUES,
      paymentType: "TILL_NUMBER",
      tillNumber: "123456",
      businessName: "THIS NAME IS FAR TOO LONG FOR THE POSTER OVERLAY",
    });

    expect(result.success).toBe(false);
  });
});
