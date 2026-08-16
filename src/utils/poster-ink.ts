const FRAME_INK = "#1A2335";
const PAPER = "#FFFFFF";

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Navy on sun-yellow / light greens; paper on dark brand colors. */
export function inkOn(backgroundHex: string) {
  return relativeLuminance(backgroundHex) > 0.42 ? FRAME_INK : PAPER;
}

export const POSTER_INK = {
  frame: FRAME_INK,
  paper: PAPER,
  qrDark: "#1A2335",
  qrLight: "#FFFFFF",
} as const;
