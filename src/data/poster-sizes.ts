import type { PosterSize } from "@/types/PosterSize";

export const BUSINESS_NAME_MAX_LENGTH = 32;

export const POSTER_SIZES: PosterSize[] = [
  {
    name: "A5 stall",
    slug: "a5-stall",
    description: "Print on A5 for a stall or counter",
    physicalLabel: "A5 · 148 × 210 mm",
    width: 1165,
    height: 1654,
  },
  {
    name: "A4 shop wall",
    slug: "a4-wall",
    description: "Print on A4 for a wall or window",
    physicalLabel: "A4 · 210 × 297 mm",
    width: 1654,
    height: 2339,
  },
  {
    name: "Helmet / landscape",
    slug: "helmet",
    description: "Boda helmets, carts, and wide displays",
    physicalLabel: "16:9 landscape",
    width: 1600,
    height: 900,
  },
  {
    name: "Square sticker",
    slug: "sticker",
    description: "Stickers and square prints",
    physicalLabel: "1:1 square",
    width: 1080,
    height: 1080,
  },
  {
    name: "WhatsApp story",
    slug: "story",
    description: "Status, Stories, and phone screens",
    physicalLabel: "9:16 story",
    width: 1080,
    height: 1920,
  },
];

export const DEFAULT_POSTER_SIZE = POSTER_SIZES[0];

export function fitAspectRect(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = width / height;
  const boxRatio = maxWidth / maxHeight;
  if (ratio > boxRatio) {
    return { width: maxWidth, height: maxWidth / ratio };
  }
  return { width: maxHeight * ratio, height: maxHeight };
}
