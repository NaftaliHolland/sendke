import type { PaymentType } from "@/types/PaymentForm";

export type ShareResult = "shared" | "cancelled" | "downloaded";

export function getPosterFilename({
  paymentType,
  primaryValue,
  templateSlug,
}: {
  paymentType: PaymentType;
  primaryValue: string;
  templateSlug: string;
}) {
  const filenameValue = primaryValue.replace(/\s/g, "");
  return `send-ke-${paymentType.toLowerCase()}-${filenameValue}-${templateSlug}.png`;
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/png");
  });

  if (blob) return blob;

  const dataUrl = canvas.toDataURL("image/png", 1.0);
  const response = await fetch(dataUrl);
  return response.blob();
}

export function canShareFiles(file: File): boolean {
  try {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function sharePosterFile(
  blob: Blob,
  filename: string,
  title = "Payment poster from send.ke"
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });

  if (canShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        title,
        text: title,
      });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  triggerDownload(blob, filename);
  return "downloaded";
}

export async function printPosterBlob(blob: Blob, title = "Payment poster") {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!frameWindow || !doc) {
    iframe.remove();
    URL.revokeObjectURL(url);
    throw new Error("Unable to open print preview");
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style>
      @page { margin: 12mm; }
      html, body {
        margin: 0;
        padding: 0;
        background: white;
      }
      img {
        display: block;
        max-width: 100%;
        max-height: 100vh;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <img src="${url}" alt="${title}" />
  </body>
</html>`);
  doc.close();

  const img = doc.querySelector("img");
  if (!img) {
    iframe.remove();
    URL.revokeObjectURL(url);
    throw new Error("Print image missing");
  }

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Print image failed to load"));
    if (img.complete && img.naturalWidth > 0) resolve();
  });

  const cleanup = () => {
    URL.revokeObjectURL(url);
    iframe.remove();
  };

  frameWindow.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(cleanup, 60_000);
  frameWindow.focus();
  frameWindow.print();
}
