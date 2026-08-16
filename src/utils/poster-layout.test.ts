import { describe, expect, it } from "vitest";
import {
  getMethodCopy,
  getOrientation,
  getPosterLayout,
  getPosterSheet,
  POSTER_BORDER_SIZE,
} from "./poster-layout";

const helmet = { width: 1600, height: 900 };
const a5 = { width: 1165, height: 1654 };

describe("getOrientation", () => {
  it("treats helmet as landscape and A5 as portrait", () => {
    expect(getOrientation(helmet.width, helmet.height)).toBe("landscape");
    expect(getOrientation(a5.width, a5.height)).toBe("portrait");
    expect(getOrientation(1080, 1080)).toBe("portrait");
  });
});

describe("getMethodCopy", () => {
  it("locks Till to Buy Goods / Till Number", () => {
    expect(getMethodCopy("TILL_NUMBER", false)).toEqual({
      method: "BUY GOODS",
      primaryLabel: "TILL NUMBER",
      methodBarText: "BUY GOODS  ·  TILL NUMBER",
    });
  });

  it("locks Paybill to two official labels", () => {
    expect(getMethodCopy("PAYBILL", false)).toEqual({
      method: "PAY BILL",
      primaryLabel: "PAYBILL NUMBER",
      methodBarText: "PAYBILL NUMBER",
      secondaryLabel: "ACCOUNT NUMBER",
    });
  });

  it("locks Send Money to phone, and name when shown", () => {
    expect(getMethodCopy("SEND_MONEY", false)).toEqual({
      method: "SEND MONEY",
      primaryLabel: "PHONE NUMBER",
      methodBarText: "PHONE NUMBER",
    });
    expect(getMethodCopy("SEND_MONEY", true).secondaryLabel).toBe("NAME");
  });
});

describe("getPosterLayout", () => {
  it("keeps a thin bottom inset when there is no business name", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "TILL_NUMBER",
      showName: false,
    });

    expect(layout.bottomInset).toBeGreaterThanOrEqual(POSTER_BORDER_SIZE * 3);
    expect(layout.hasBusinessName).toBe(false);
    expect(layout.footer).toBeUndefined();
  });

  it("reserves a readable footer band for overlay business names", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "TILL_NUMBER",
      showName: false,
      businessName: "MAMA MBOGA",
    });

    expect(layout.hasBusinessName).toBe(true);
    expect(layout.footer?.height).toBeGreaterThanOrEqual(Math.round(900 * 0.12));
    expect(layout.topInset + layout.contentHeight + layout.bottomInset).toBe(
      900
    );
  });

  it("gives Till a method bar and a number well taller than the header", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "TILL_NUMBER",
      showName: false,
    });

    expect(getPosterSheet("TILL_NUMBER")).toBe("till");
    expect(layout.copy.method).toBe("BUY GOODS");
    expect(layout.copy.primaryLabel).toBe("TILL NUMBER");
    expect(layout.numberRect.height).toBeGreaterThan(layout.header.height);
    expect(layout.hasSecondaryField).toBe(false);
  });

  it("runs the green header and method bar edge to edge", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "SEND_MONEY",
      showName: true,
      showQrCode: true,
    });

    expect(layout.header.width).toBe(layout.contentWidth);
    expect(layout.methodBar.width).toBe(layout.contentWidth);
    expect(layout.copy.methodBarText).toBe("PHONE NUMBER");
  });

  it("places landscape QR beside the number, under the method bar", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "TILL_NUMBER",
      showName: false,
      showQrCode: true,
    });

    expect(layout.qr).toBeDefined();
    expect(layout.qrPanel).toBeDefined();
    expect(layout.qrPanel!.y).toBeGreaterThanOrEqual(
      layout.methodBar.y + layout.methodBar.height
    );
    expect(layout.qr!.x).toBeGreaterThan(
      layout.numberRect.x + layout.numberRect.width
    );
    expect(layout.qr!.x).toBeGreaterThan(layout.sideInset);
    expect(layout.qr!.x + layout.qr!.width).toBeLessThan(1600 - layout.sideInset);
    expect(layout.qr!.y).toBeGreaterThanOrEqual(layout.topInset);
    expect(layout.qr!.y + layout.qr!.height).toBeLessThanOrEqual(
      layout.topInset + layout.contentHeight
    );
  });

  it("stacks portrait QR under the number, not over the colour bands", () => {
    const layout = getPosterLayout({
      ...a5,
      paymentType: "TILL_NUMBER",
      showName: false,
      showQrCode: true,
    });

    expect(layout.orientation).toBe("portrait");
    expect(layout.qr!.y).toBeGreaterThan(
      layout.numberRect.y + layout.numberRect.height
    );
    expect(layout.qr!.x).toBeGreaterThanOrEqual(layout.sideInset);
    expect(layout.qr!.x + layout.qr!.width).toBeLessThanOrEqual(
      1165 - layout.sideInset
    );
  });

  it("keeps Paybill as a two-field official sheet", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "PAYBILL",
      showName: false,
    });

    expect(layout.sheet).toBe("paybill");
    expect(layout.hasSecondaryField).toBe(true);
    expect(layout.secondaryBar).toBeDefined();
    expect(layout.secondaryValue).toBeDefined();
    expect(layout.numberRect.height).toBeGreaterThan(
      layout.secondaryValue!.height
    );
  });

  it("puts the Send Money name inside the number well, not a second colour band", () => {
    const layout = getPosterLayout({
      ...helmet,
      paymentType: "SEND_MONEY",
      showName: true,
    });

    expect(layout.sheet).toBe("send-money");
    expect(layout.hasNameInValue).toBe(true);
    expect(layout.nameRect).toBeDefined();
    expect(layout.hasSecondaryField).toBe(false);
    expect(layout.nameRect!.y).toBeGreaterThan(layout.numberRect.y);
  });
});
