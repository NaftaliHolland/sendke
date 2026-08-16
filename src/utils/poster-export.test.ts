import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canShareFiles,
  getPosterFilename,
  printPosterBlob,
  sharePosterFile,
  triggerDownload,
} from "./poster-export";

describe("getPosterFilename", () => {
  it("builds a stable png name from payment details", () => {
    expect(
      getPosterFilename({
        paymentType: "PAYBILL",
        primaryValue: "123 456",
        templateSlug: "helmet",
      })
    ).toBe("send-ke-paybill-123456-helmet.png");
  });
});

describe("canShareFiles", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is false when the Web Share API is missing", () => {
    vi.stubGlobal("navigator", {});
    const file = new File(["x"], "poster.png", { type: "image/png" });
    expect(canShareFiles(file)).toBe(false);
  });

  it("is true when canShare accepts the file", () => {
    vi.stubGlobal("navigator", {
      share: vi.fn(),
      canShare: vi.fn(() => true),
    });
    const file = new File(["x"], "poster.png", { type: "image/png" });
    expect(canShareFiles(file)).toBe(true);
  });
});

describe("sharePosterFile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("shares the image file when the browser supports it", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      share,
      canShare: vi.fn(() => true),
    });

    const blob = new Blob(["png"], { type: "image/png" });
    const result = await sharePosterFile(blob, "send-ke-poster.png");

    expect(result).toBe("shared");
    expect(share).toHaveBeenCalledTimes(1);
    const payload = share.mock.calls[0]?.[0] as ShareData;
    expect(payload.files).toHaveLength(1);
    expect(payload.files?.[0]?.name).toBe("send-ke-poster.png");
  });

  it("returns cancelled when the user dismisses the share sheet", async () => {
    const abortError = new Error("Share canceled");
    abortError.name = "AbortError";
    vi.stubGlobal("navigator", {
      share: vi.fn().mockRejectedValue(abortError),
      canShare: vi.fn(() => true),
    });

    const blob = new Blob(["png"], { type: "image/png" });
    await expect(sharePosterFile(blob, "send-ke-poster.png")).resolves.toBe(
      "cancelled"
    );
  });

  it("falls back to download when sharing is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:poster"),
      revokeObjectURL: vi.fn(),
    });

    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => {}
    );

    const blob = new Blob(["png"], { type: "image/png" });
    const result = await sharePosterFile(blob, "send-ke-poster.png");

    expect(result).toBe("downloaded");
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });
});

describe("printPosterBlob", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("loads the poster into a hidden iframe and opens print", async () => {
    vi.useFakeTimers();
    const print = vi.fn();
    const iframe = document.createElement("iframe");
    const img = document.createElement("img");
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: 100 });

    const fakeDoc = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
      querySelector: () => img,
    };

    Object.defineProperty(iframe, "contentWindow", {
      configurable: true,
      value: { print, addEventListener: vi.fn(), focus: vi.fn() },
    });
    Object.defineProperty(iframe, "contentDocument", {
      configurable: true,
      value: fakeDoc,
    });

    const nativeCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      ((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === "iframe") return iframe;
        return nativeCreateElement(tagName, options);
      }) as typeof document.createElement
    );

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:poster"),
      revokeObjectURL: vi.fn(),
    });

    await printPosterBlob(new Blob(["png"], { type: "image/png" }));

    expect(fakeDoc.write).toHaveBeenCalled();
    expect(print).toHaveBeenCalled();
    vi.runAllTimers();
    vi.useRealTimers();
  });
});

describe("triggerDownload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("clicks a temporary download link", () => {
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:poster"),
      revokeObjectURL: vi.fn(),
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => {}
    );

    triggerDownload(new Blob(["png"], { type: "image/png" }), "poster.png");

    const link = document.querySelector("a");
    expect(link).toBeNull();
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });
});
